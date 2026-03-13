"""
Parfum gorsellerini Fragrantica'dan ceker ve perfumes.json'a image_url ekler.
urls.txt'deki URL'lerden ID cikarir, eslesen parfumlere gorsel atar.
"""

import json
import re
from pathlib import Path


def extract_id_from_url(url: str) -> str | None:
    """Fragrantica URL'den ID cikar: .../Sauvage-31861.html -> 31861"""
    m = re.search(r"-(\d+)\.html$", url.strip())
    return m.group(1) if m else None


def normalize(s: str) -> str:
    """Karsilastirma icin normalize: kucuk harf, noktalama kaldir."""
    s = (s or "").lower().strip()
    s = re.sub(r"[^\w\s]", " ", s)
    s = re.sub(r"\s+", " ", s)
    return s


def build_url_mapping(urls_path: Path) -> dict[tuple[str, str], str]:
    """urls.txt'den (brand, name) -> fragrantica_id mapping olustur."""
    mapping = {}
    for line in urls_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or not line.startswith("http"):
            continue
        fid = extract_id_from_url(line)
        if not fid:
            continue
        # URL: .../perfume/Brand/Name-12345.html
        try:
            parts = line.rstrip("/").split("/")
            if len(parts) >= 5:
                brand = parts[-2].replace("-", " ").strip()
                name_part = parts[-1].replace(".html", "")
                name = re.sub(r"-\d+$", "", name_part).replace("-", " ").strip()
                key = (normalize(brand), normalize(name))
                mapping[key] = fid
        except Exception:
            pass
    return mapping


def match_perfume(perfume: dict, mapping: dict) -> str | None:
    """Parfumu mapping ile esle, varsa fragrantica_id dondur."""
    brand = normalize(perfume.get("brand", ""))
    name = normalize(perfume.get("name", ""))
    if not brand or not name:
        return None
    # Tam eslesme
    key = (brand, name)
    if key in mapping:
        return mapping[key]
    # Brand eslesmesi + name iceriyor (ornegin "Bleu de Chanel" vs "Bleu-de-Chanel")
    for (mb, mn), fid in mapping.items():
        if mb == brand and mn in name or name in mn:
            return fid
        if mb in brand and mn in name:
            return fid
    return None


def main():
    base = Path(__file__).parent.parent
    urls_path = base / "scraper" / "urls.txt"
    data_path = base / "data" / "perfumes.json"

    if not urls_path.exists():
        print("urls.txt bulunamadi:", urls_path)
        return

    mapping = build_url_mapping(urls_path)
    print(f"urls.txt: {len(mapping)} Fragrantica URL yuklendi")

    with open(data_path, "r", encoding="utf-8") as f:
        perfumes = json.load(f)

    PLACEHOLDER = "https://images.unsplash.com/photo-1541643600914-78b084683601?w=375&h=500&fit=crop"  # parfum sisesi

    added = 0
    for p in perfumes:
        fid = match_perfume(p, mapping)
        if fid:
            p["image_url"] = f"https://fimgs.net/mdimg/perfume-thumbs/375x500.{fid}.jpg"
            added += 1
        elif not p.get("image_url") or p.get("image_url") == PLACEHOLDER:
            # Sadece placeholder olanlara placeholder ata; mevcut fimgs koru
            p["image_url"] = PLACEHOLDER

    with open(data_path, "w", encoding="utf-8") as f:
        json.dump(perfumes, f, indent=2, ensure_ascii=False)

    print(f"OK - {added} Fragrantica gorseli, {len(perfumes) - added} placeholder")
    print(f"    Tum {len(perfumes)} parfumde image_url mevcut")


if __name__ == "__main__":
    main()
