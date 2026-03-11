"""
SentenceTransformers tabanlı embedding API (lokal ve ücretsiz).

Amaç:
- Backend'deki /ai-search endpoint'inin, OpenAI yerine
  lokal SentenceTransformers modeliyle query embedding üretmesini sağlamak.

Kullanım (lokalde):
  1) Sanal ortamı aktif et (daha önce yaptığın .venv'i kullanabilirsin):

       cd /Users/arincakyildiz/Desktop/Projects/perfiai
       source .venv/bin/activate

  2) Gerekli paketleri kur:

       pip install fastapi uvicorn sentence-transformers

  3) Sunucuyu başlat:

       uvicorn scripts.embedding_server:app --reload --port 8001

  4) Backend için ortam değişkenleri (backend terminalinde):

       export USE_ST_EMBEDDING=1
       export SENTENCE_EMBEDDING_URL="http://localhost:8001/embed"

  5) Ardından backend'i çalıştır:

       cd backend
       npm start

Production notu:
- Vercel üzerinde bu Python servisi koşamazsın; bunun için ayrı bir
  backend host'u (VPS, Railway, vb.) gerekir. Kod tarafı bu senaryoya hazır.
"""

from __future__ import annotations

from typing import List

from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer


MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

print(f"[embedding_server] Model yükleniyor: {MODEL_NAME}")
_model = SentenceTransformer(MODEL_NAME)
print("[embedding_server] Model hazır.")

app = FastAPI(title="Perfiai SentenceTransformers Embedding API")


class EmbedRequest(BaseModel):
  text: str


class EmbedResponse(BaseModel):
  embedding: List[float]


@app.get("/health")
def health() -> dict:
  return {"status": "ok", "model": MODEL_NAME}


@app.post("/embed", response_model=EmbedResponse)
def embed(req: EmbedRequest) -> EmbedResponse:
  text = req.text.strip()
  if not text:
    return EmbedResponse(embedding=[])

  emb = _model.encode([text], normalize_embeddings=True)[0]
  return EmbedResponse(embedding=emb.tolist())

