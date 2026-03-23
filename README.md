# Perfiai — AI-Powered Perfume Recommendation System

Users describe the perfume they want in natural language, and the AI engine (heuristic or embedding-based) returns the best matches. Both Turkish and English are supported.

## 🎯 Scope (MVP)

- **3592 perfumes** in the catalog (`data/perfumes.json`)
- **AI search** with natural language query, filters (`gender`, `season`), score + explanation (`reason`) + tags (`tags`)
- **Two search modes:** heuristic (free, works everywhere) or SentenceTransformers embeddings (local Python service)
- Web app includes sign-up/sign-in (code-based), email verification, ratings, comments, and favorites

---

## 📁 Project Structure

```text
perfiai/
├── backend/                    # Node + Express API
│   ├── server.js               # /perfumes, /ai-search, /perfumes/:id, /stats
│   ├── test/api.test.js        # API tests
│   └── package.json
├── data/
│   ├── perfumes.json           # 3592 perfumes
│   └── perfume_embeddings_st.json  # ST-generated vectors (embedding mode)
├── scripts/
│   ├── generate_sentence_embeddings.py  # Builds perfume embeddings
│   ├── embedding_server.py              # FastAPI: query -> embedding (ST)
│   ├── expand_database.py
│   ├── generate_perfumes.py
│   ├── use_scraped_data.py
│   └── ...
├── scraper/
│   ├── scrape_fragrantica.py
│   ├── urls.txt
│   └── requirements.txt
├── .env.example                # Environment template
├── render.yaml                 # Render deployment
├── railway.toml                # Railway deployment
├── Dockerfile                  # Docker deployment
└── README.md
```

---

## 🛍️ Add / Update Perfumes from Sephora

Sephora US **listing API** is used (product-detail API is heavy/restricted; note pyramid and accords are not fully available there, so some fields may be blank or heuristic-filled initially).

- **Primary source:** `Fragrance` showcase (`cat160006`, ~1827 rows)
- **Gender mapping:** via women/men/unisex category `productId` matching; unmatched defaults to `unisex`
- **Image:** `image_url` from Sephora CDN (`productimages/sku/...`, `imwidth=497`)
- **Extra fields:** `sephoraProductId`, `sephoraSkuId`, `sephoraReviewCount`, `sephoraListPrice`, `source: "sephora"`
- Gift sets / samples / home-scent products are filtered by default; use `--include-gift-sets` to include

```bash
node scripts/import_sephora_perfumes.mjs --dry-run
node scripts/import_sephora_perfumes.mjs
node scripts/import_sephora_perfumes.mjs --include-gift-sets

# Refresh SKU / reviews / images by matching current Sephora listings
node scripts/enrich_sephora_listing.mjs --dry-run
node scripts/enrich_sephora_listing.mjs
```

If your dataset grows and you use embedding mode, regenerate `perfume_embeddings_st.json`.

### Fill Sephora Rows from Fragrantica (notes / accords / year / description)

For fields missing from Sephora listings, the script matches Fragrantica brand/perfume pages (`cloudscraper` recommended).

```bash
pip install cloudscraper beautifulsoup4
python -u scripts/enrich_sephora_from_fragrantica.py --dry-run --limit 10
python -u scripts/enrich_sephora_from_fragrantica.py --resume
# Process only rows still missing year:
python -u scripts/enrich_sephora_from_fragrantica.py --resume --only-missing-year
```

- Each successful row is written into `data/perfumes.json` with `fragranticaUrl`
- Fragrantica may return **429** often; script retries with backoff
- If IP is temporarily blocked, wait **30-60 min** and continue with `--resume`
- Optional initial wait: `--start-sleep 120`
- **Year without Fragrantica:** for Sephora rows with empty `year`, parse 4-digit years from text:
  `node scripts/fill_sephora_missing_year_from_text.mjs`
- If no Fragrantica page/name match exists, script falls back to **heuristic** enrichment (`enrichmentSource`: `fragrantica` | `heuristic`)
- Heuristic-only mode (no HTTP):
  `python -u scripts/enrich_sephora_from_fragrantica.py --heuristic-only`

**Manual verified notes** (brand/retailer/public pyramids): add entries into `data/sephora_manual_overrides.json` keyed by `sephoraProductId`, then run:

```bash
node scripts/merge_sephora_overrides.mjs
```

If full pyramid + `short_description` exists, `enrichmentSource` becomes `manual` and `short_description_tr` is regenerated.  
If you only provide a year payload like `{ "year": 2024 }`, only `year` is updated and existing descriptions/source stay unchanged.

**Remaining `year: 2026` placeholders:** if a 4-digit year (1980-2025) appears in name/description, it is used; otherwise `year` is removed to avoid showing incorrect info.

```bash
node scripts/fix_sephora_placeholder_years.mjs --dry-run
node scripts/fix_sephora_placeholder_years.mjs
```

Run `merge_sephora_overrides` first so manually entered years are preserved.

`sephora_manual_overrides.json` is also respected by the Fragrantica script; on rows with no Fragrantica URL, overrides win over keyword heuristics.

### Sephora Heuristic -> Real Pyramid (Brand Catalog, ~400+ scents)

`data/sephora_brand_pyramids.json` is generated from public/brand pyramids via `scripts/sephora_catalog_fragments.py` + `scripts/emit_sephora_brand_pyramids.py`.
When `enrichmentSource === "heuristic"` and `fragranticaUrl` is missing, rows are matched by brand + product name; successful matches become `enrichmentSource: "catalog"`.

```bash
python scripts/emit_sephora_brand_pyramids.py
node scripts/enrich_sephora_from_brand_catalog.mjs --dry-run
node scripts/enrich_sephora_from_brand_catalog.mjs
```

To add new scents, edit `_MORE` / `_MORE3` blocks in `scripts/sephora_catalog_fragments.py`, then run the commands above.

---

## 🚀 Quick Start (Backend only, free mode)

```bash
cd backend
npm install
npm start
```

- API: `http://localhost:3001`
- `POST /ai-search` runs in **heuristic** mode if OpenAI/ST is not configured

### Email (login code / verification)

1. Create `.env` from `.env.example` at project root (`perfiai/.env`)
2. Fill `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (for Gmail: use an **App Password**, not your normal password)
3. Restart backend; startup log should show `E-posta: SMTP etkin`
4. If emails still fail, set `SMTP_DEBUG=1` and inspect SMTP error logs
5. If you see **self-signed certificate** / TLS chain errors (often antivirus or corporate proxy), for local testing only set `SMTP_TLS_REJECT_UNAUTHORIZED=0` and restart backend (**do not use this in production**)
6. If UI shows *"Account created but verification email could not be sent"*, use the dev verification link shown in the modal/server logs and retry after SMTP is fixed

**SMTP diagnostics:** from `backend`, run:

```bash
npm run smtp-check
# optional target address:
npm run smtp-check -- someone@example.com
```

**TTLs:** login code and verification link are both **3 minutes** in production.  
For tests, `api.test` can use `TEST_EMAIL_VERIFICATION_TOKEN_TTL_MS` to shorten TTL.

**Example request:**

```bash
curl -X POST http://localhost:3001/ai-search \
  -H "Content-Type: application/json" \
  -d '{"query":"fresh citrus scent for summer office use","gender":"male","season":"summer","limit":5}'
```

---

## 🔥 Backend API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/perfumes` | List with `q`, `gender`, `season`, `page`, `limit`, `sort`, `order` |
| GET | `/perfumes/:id` | Perfume detail |
| GET | `/stats` | Total count and gender distribution |
| POST | `/ai-search` | Natural language search. Body: `query`, `gender?`, `season?`, `limit?` |

**Response shape (example):** `total`, `query`, `lang`, `mode` (`"heuristic"` | `"embedding"`), and `data[]` with `score`, `similarityScore`, `popularityScore`, `tags`, `reason`.

---

## 🧠 Embedding Search (SentenceTransformers, free)

To rank perfumes by cosine similarity over vector embeddings:

### 1) Generate perfume embeddings (one-time)

```bash
cd /path/to/perfiai
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r scripts/requirements-embeddings.txt
python3 scripts/generate_sentence_embeddings.py
```

Output: `data/perfume_embeddings_st.json` (same ordering/length as `perfumes.json`, includes `short_description_tr` in text pipeline).

### 2) Run embedding API (query -> vector)

```bash
source .venv/bin/activate
pip install fastapi uvicorn sentence-transformers
uvicorn scripts.embedding_server:app --reload --port 8001
```

### 3) Start backend in embedding mode

```bash
export USE_ST_EMBEDDING=1
export SENTENCE_EMBEDDING_URL="http://localhost:8001/embed"
cd backend
npm start
```

With this setup, `POST /ai-search` returns `mode: "embedding"`.  
If embedding service is unavailable or env is missing, backend falls back to **heuristic** mode automatically.

---

## 📋 Perfume Data Schema

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

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill required values:

```bash
cp .env.example .env
```

See inline comments in `.env.example` for details.

---

## 🧪 Tests

```bash
cd backend
npm test
```

The test runner starts/stops the server automatically and checks core endpoints.

---

## 🚢 Deploy

| Platform | File | Notes |
|----------|------|-------|
| **Render** | `render.yaml` | Connect repo, auto-detected |
| **Railway** | `railway.toml` | Deploy via `railway up` |
| **Docker** | `Dockerfile` | `docker build -t perfiai . && docker run -p 3001:3001 perfiai` |

SentenceTransformers embedding service should run separately; it does not run on Vercel serverless.

---

## 📅 Status

| Feature | Status |
|--------|--------|
| Data catalog (3592 perfumes) | ✅ |
| Backend API (list/detail/stats) | ✅ |
| AI search (heuristic) | ✅ |
| AI search (embedding via ST) | ✅ |
| TR/EN language, tags, explanations | ✅ |
| Env template, deploy configs, tests | ✅ |
| Frontend | ✅ |

---

## 📄 License

MIT
