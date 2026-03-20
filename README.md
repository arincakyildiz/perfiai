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

## 🛍️ Sephora’dan eksik parfüm ekleme

Sephora US’nin herkese açık katalog API’si ile **kadın / erkek / unisex** parfüm listeleri çekilir; `data/perfumes.json` içinde **marka + isim** ile zaten olanlar atlanır (hediye seti / numune gibi isimler filtrelenir).

```bash
node scripts/import_sephora_perfumes.mjs --dry-run   # sadece özet
node scripts/import_sephora_perfumes.mjs             # perfumes.json’a yazar
```

Yeni kayıtlarda `image_url` Sephora CDN’den gelir; `sephoraProductId` ve `source: "sephora"` alanları eklenir. **Embedding** modu kullanıyorsan parfüm listesi büyüdükçe `perfume_embeddings_st.json` dosyasını yeniden üretmen gerekir.

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
pip install sentence-transformers
python3 scripts/generate_sentence_embeddings.py
```

Çıktı: `data/perfume_embeddings_st.json` (884 vektör).

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
