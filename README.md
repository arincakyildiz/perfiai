# Perfiai — AI Destekli Parfüm Öneri Sistemi

Kullanıcı doğal dil ile parfüm isteği yazar; AI (heuristic veya embedding tabanlı) en uygun önerileri verir. Türkçe ve İngilizce desteklenir.

## 🎯 Scope (MVP)

- **880+ parfüm** veritabanı (`data/perfumes.json`)
- **AI arama** — doğal dil sorgusu, filtre (gender, season), skor + açıklama (`reason`) + etiketler (`tags`)
- **İki mod:** heuristic (parasız, her yerde) veya SentenceTransformers embedding (lokal Python servisi ile)
- Detay sayfası, login, ödeme, affiliate **yok** (başlangıçta)

---

## 📁 Proje Yapısı

```
perfiai/
├── backend/                    # Node + Express API
│   ├── server.js               # /perfumes, /ai-search, /perfumes/:id, /stats
│   ├── test/api.test.js        # API testleri
│   └── package.json
├── data/
│   ├── perfumes.json           # 880+ parfüm
│   └── perfume_embeddings_st.json  # ST ile üretilmiş vektörler (embedding modu için)
├── scripts/
│   ├── generate_sentence_embeddings.py  # Parfüm embedding'lerini üretir
│   ├── embedding_server.py              # FastAPI: query → embedding (ST)
│   ├── expand_database.py
│   ├── generate_perfumes.py
│   ├── use_scraped_data.py
│   └── ...
├── scraper/
│   ├── scrape_fragrantica.py
│   ├── urls.txt
│   └── requirements.txt
├── .env.example                # Ortam değişkenleri şablonu
├── render.yaml                 # Render.com deploy
├── railway.toml                # Railway deploy
├── Dockerfile                  # Docker deploy
└── README.md
```

---

## 🛍️ Sephora’dan parfüm ekleme / güncelleme

Sephora US **liste API**’si kullanılır (ürün sayfası API’si ağır / kısıtlı olduğu için nota piramidi ve accord’lar listede yok; bu alanlar şimdilik şablonda boş veya genel değerlerle doldurulur).

- **Ana kaynak:** `Fragrance` vitrini (`cat160006`, ~1827 satır) — vitrinde görünen her ürün satırı işlenir.
- **Cinsiyet:** Kadın / erkek / unisex alt kategorilerinden `productId` eşlemesi; eşleşmeyenler `unisex`.
- **Görsel:** `image_url` Sephora CDN (`productimages/sku/...`, `imwidth=497`).
- **Ek alanlar:** `sephoraProductId`, `sephoraSkuId`, `sephoraReviewCount`, `sephoraListPrice`, `source: "sephora"`.
- Varsayılan olarak **hediye seti / numune / mum-ev kokusu** isimleri filtrelenir; setleri de almak için `--include-gift-sets`.

```bash
node scripts/import_sephora_perfumes.mjs --dry-run
node scripts/import_sephora_perfumes.mjs
node scripts/import_sephora_perfumes.mjs --include-gift-sets   # setler dahil

# Mevcut Sephora kayıtlarını vitrin listesiyle eşleştirip SKU / yorum / görsel güncelle
node scripts/enrich_sephora_listing.mjs --dry-run
node scripts/enrich_sephora_listing.mjs
```

**Embedding** modunda liste büyüdükçe `perfume_embeddings_st.json` dosyasını yeniden üretmen gerekir.

### Sephora satırlarını Fragrantica ile doldurma (nota / accord / yıl / açıklama)

Liste API’sinde olmayan alanlar için **Fragrantica** üzerinden marka sayfası + parfüm sayfası eşleştirilir (`cloudscraper` önerilir).

```bash
pip install cloudscraper beautifulsoup4
python -u scripts/enrich_sephora_from_fragrantica.py --dry-run --limit 10
python -u scripts/enrich_sephora_from_fragrantica.py --resume   # kesintiden sonra
# Sadece year alanı boş Sephora satırları (placeholder temizliğinden sonra):
python -u scripts/enrich_sephora_from_fragrantica.py --resume --only-missing-year
```

- Her başarılı kayıt `data/perfumes.json` dosyasına yazılır; `fragranticaUrl` eklenir.
- Fragrantica sık **429 (rate limit)** verebilir; script bekleyip tekrar dener. IP geçici bloklanırsa **30–60 dk** bekleyip `python -u scripts/enrich_sephora_from_fragrantica.py --resume …` ile devam edin veya ilk istekten önce bekleme: `--start-sleep 120`.
- **Fragrantica olmadan yıl:** `year` alanı boş Sephora satırlarında metinde 4 haneli yıl varsa: `node scripts/fill_sephora_missing_year_from_text.mjs`
- Sephora’da olup Fragrantica’da sayfası olmayan / isim eşleşmeyen ürünler için script sonunda **heuristic** mod devreye girer: ürün adındaki kelimelerden accord + üst nota satırları üretir (`enrichmentSource`: `fragrantica` | `heuristic`).
- Sadece sezgisel doldurma (HTTP yok):  
  `python -u scripts/enrich_sephora_from_fragrantica.py --heuristic-only`

**Elle doğrulanmış notalar (marka / perakende / kamuya açık piramit):** `data/sephora_manual_overrides.json` içine `sephoraProductId` anahtarıyla kayıt ekle; sonra:

```bash
node scripts/merge_sephora_overrides.mjs
```

Tam piramit + `short_description` verdiğinde `enrichmentSource` → `manual` olur ve `short_description_tr` yeniden üretilir. **Sadece `{ "year": 2024 }` gibi yıl** verirsen sadece `year` güncellenir; mevcut `enrichmentSource` / açıklamalar korunur.

**Sephora’da kalan `year: 2026` placeholder:** İsim / kısa açıklamada geçen 4 haneli yıl (1980–2025) varsa `year` buna çekilir; metinde yıl yoksa `year` alanı kaldırılır (detay sayfasında yanlış yıl gösterilmez).

```bash
node scripts/fix_sephora_placeholder_years.mjs --dry-run
node scripts/fix_sephora_placeholder_years.mjs
```

Önce `merge_sephora_overrides` çalıştırıp SKU’lara elle girilen `year` değerlerini yazdırın; sonra bu script’i kullanın.

`sephora_manual_overrides.json` dosyasını Fragrantica script’i de okur: Fragrantica URL’si olmayan satırlarda `--heuristic-only` çalıştırınca bu kayıtlar keyword tahmininin önüne geçer. Yılı hâlâ boş kalan Sephora satırları için `--resume --only-missing-year` ile sadece o kuyruk işlenir (yıl metinde yoksa Fragrantica’dan gelir).

### Sephora heuristic → gerçek piramit (marka kataloğu, ~400+ koku)

Kamuya açık / marka piramitlerinden derlenen **`data/sephora_brand_pyramids.json`** dosyası `scripts/sephora_catalog_fragments.py` + `scripts/emit_sephora_brand_pyramids.py` ile üretilir. Sephora satırında `enrichmentSource === "heuristic"` ve `fragranticaUrl` yokken marka + ürün adı eşleştirilir; eşleşirse `enrichmentSource` → **`catalog`** olur.

```bash
python scripts/emit_sephora_brand_pyramids.py   # JSON’u yenile
node scripts/enrich_sephora_from_brand_catalog.mjs --dry-run
node scripts/enrich_sephora_from_brand_catalog.mjs
```

Yeni koku eklemek için `scripts/sephora_catalog_fragments.py` içindeki `_MORE` / `_MORE3` bloklarına marka altında anahtar ekleyip yukarıdaki komutları çalıştır. `data/sephora_heuristic_targets.json` (sadece liste) gerekirse `data/perfumes.json` üzerinden yeniden üretilebilir.

---

## 🚀 Hızlı Başlangıç (sadece backend, parasız)

```bash
cd backend
npm install
npm start
```

- API: `http://localhost:3001`
- `POST /ai-search` bu haliyle **heuristic** modda çalışır (OpenAI/ST yok); sonuçlar `tags` ve `reason` ile döner.

**Örnek istek:**

```bash
curl -X POST http://localhost:3001/ai-search \
  -H "Content-Type: application/json" \
  -d '{"query":"yaz için ferah narenciye kokusu, ofiste kullanırım","gender":"male","season":"summer","limit":5}'
```

---

## 🔥 Backend API

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/` | API bilgisi |
| GET | `/perfumes` | Liste: `q`, `gender`, `season`, `page`, `limit`, `sort`, `order` |
| GET | `/perfumes/:id` | Tek parfüm detayı |
| GET | `/stats` | Toplam ve gender dağılımı |
| POST | `/ai-search` | Doğal dil arama. Body: `query`, `gender?`, `season?`, `limit?` |

**Cevap (örnek):** `total`, `query`, `lang`, `mode` (`"heuristic"` | `"embedding"`), `data[]` içinde her parfüm için `score`, `similarityScore`, `popularityScore`, `tags`, `reason`.

---

## 🧠 Embedding arama (SentenceTransformers, ücretsiz)

Query ve parfüm metinlerini vektöre çevirip cosine similarity ile sıralamak için:

### 1. Parfüm embedding’lerini üret (bir kere)

```bash
cd /path/to/perfiai
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r scripts/requirements-embeddings.txt
python3 scripts/generate_sentence_embeddings.py
```

Çıktı: `data/perfume_embeddings_st.json` (`perfumes.json` ile aynı kayıt sırası ve uzunlukta vektör listesi; metne `short_description_tr` da dahildir).

### 2. Embedding API’yi çalıştır (sorgu → vektör)

```bash
source .venv/bin/activate
pip install fastapi uvicorn sentence-transformers
uvicorn scripts.embedding_server:app --reload --port 8001
```

### 3. Backend’i embedding modunda başlat

Yeni terminalde:

```bash
export USE_ST_EMBEDDING=1
export SENTENCE_EMBEDDING_URL="http://localhost:8001/embed"
cd backend
npm start
```

Bu ayarlarla `POST /ai-search` cevabında `mode: "embedding"` gelir.  
Embedding servisi yoksa veya `USE_ST_EMBEDDING` set değilse backend otomatik **heuristic** moda döner.

---

## 📋 Veri şeması (parfüm)

```json
{
  "id": "1",
  "brand": "Dior",
  "name": "Sauvage",
  "notes": { "top": [], "middle": [], "base": [] },
  "accords": ["fresh spicy", "citrus", "aromatic"],
  "longevity": "long",
  "sillage": "moderate",
  "season": ["spring", "summer", "fall", "winter"],
  "gender": "male",
  "rating": 3.86,
  "short_description": "...",
  "year": 2015,
  "image_url": "https://..."
}
```

---

## ⚙️ Ortam Değişkenleri

`.env.example` dosyasını `.env` olarak kopyalayıp değerleri doldurun:

```bash
cp .env.example .env
```

Detaylar için `.env.example` içindeki yorumlara bakın.

---

## 🧪 Testler

```bash
cd backend
npm test
```

Sunucu otomatik başlatılır, 5 endpoint test edilir ve kapatılır.

---

## 🚢 Deploy

| Platform | Dosya | Not |
|----------|-------|-----|
| **Render** | `render.yaml` | Repo bağla, otomatik algılanır |
| **Railway** | `railway.toml` | `railway up` ile deploy |
| **Docker** | `Dockerfile` | `docker build -t perfiai . && docker run -p 3001:3001 perfiai` |

Embedding servisi (SentenceTransformers) ayrı host gerektirir; Vercel'de çalışmaz.

---

## 📅 Durum

| Özellik | Durum |
|--------|--------|
| Veri (880+ parfüm) | ✅ |
| Backend API (liste, detay, stats) | ✅ |
| AI arama (heuristic) | ✅ |
| AI arama (embedding, ST) | ✅ (lokal Python servisi ile) |
| TR/EN dil, tags, reason | ✅ |
| .env.example, deploy config, testler | ✅ |
| Frontend | Planlı |

---

## 📄 Lisans

MIT
