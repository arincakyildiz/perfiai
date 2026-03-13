"""
Perfume embedding üretimi (SentenceTransformers, local / ücretsiz).

Kullanım:
  1) Python ortamında gerekli paketi kur:
       pip install sentence-transformers
  2) Proje kökünden çalıştır:
       python scripts/generate_sentence_embeddings.py
  3) Çıktı:
       data/perfume_embeddings_st.json

Bu dosya production'a da commit edilebilir; runtime'da sadece okunur.
"""

from __future__ import annotations

import json
from pathlib import Path

from sentence_transformers import SentenceTransformer


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "perfumes.json"
OUT_PATH = ROOT / "data" / "perfume_embeddings_st.json"


def load_perfumes() -> list[dict]:
  if not DATA_PATH.exists():
    raise FileNotFoundError(f"Perfume JSON bulunamadı: {DATA_PATH}")
  data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
  if not isinstance(data, list):
    raise ValueError("perfumes.json beklenen formatta değil (list bekleniyordu).")
  return data


def perfume_to_text(p: dict) -> str:
  parts: list[str] = []

  brand = p.get("brand")
  name = p.get("name")
  gender = p.get("gender")
  accords = p.get("accords") or []
  season = p.get("season") or []
  notes = p.get("notes") or {}
  short_desc = p.get("short_description") or ""

  if brand:
    parts.append(str(brand))
  if name:
    parts.append(str(name))
  if gender:
    parts.append(f"gender: {gender}")

  if accords:
    parts.append("accords: " + ", ".join(map(str, accords)))

  top = notes.get("top") or []
  middle = notes.get("middle") or []
  base = notes.get("base") or []

  if top:
    parts.append("top notes: " + ", ".join(map(str, top)))
  if middle:
    parts.append("middle notes: " + ", ".join(map(str, middle)))
  if base:
    parts.append("base notes: " + ", ".join(map(str, base)))

  if season:
    parts.append("season: " + ", ".join(map(str, season)))

  if short_desc:
    parts.append(str(short_desc))

  return " | ".join(parts)


def main() -> None:
  perfumes = load_perfumes()
  print(f"Toplam parfum: {len(perfumes)}")

  # Çok dilli, hafif ve ücretsiz model
  model_name = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
  print(f"Model yükleniyor: {model_name}")
  model = SentenceTransformer(model_name)

  texts = [perfume_to_text(p) for p in perfumes]
  print("Embedding hesaplanıyor...")

  embeddings = model.encode(
    texts,
    batch_size=64,
    show_progress_bar=True,
    convert_to_numpy=True,
    normalize_embeddings=True,
  )

  # JSON'a yazmak için listeye çevir
  embeddings_list = embeddings.tolist()

  OUT_PATH.write_text(json.dumps(embeddings_list), encoding="utf-8")
  print(f"Embedding dosyası yazıldı: {OUT_PATH} (vektör sayısı: {len(embeddings_list)})")


if __name__ == "__main__":
  main()

