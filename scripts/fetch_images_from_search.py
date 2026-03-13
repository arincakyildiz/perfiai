"""
Placeholder gorseli olan parfumler icin Fragrantica marka sayfasindan gercek gorsel URL'si bulur.
Strateji: designers/Brand.html sayfasindan parfum listesini cek, isimle eslestir, ID al.

Kullanim:
  python scripts/fetch_images_from_search.py           # tum placeholder'lari dene
  python scripts/fetch_images_from_search.py --limit 50   # ilk 50 parfum
  python scripts/fetch_images_from_search.py --dry-run     # kaydetmeden test
"""

import argparse
import json
import re
import sys
import time
from pathlib import Path
from urllib.parse import quote_plus

sys.path.insert(0, str(Path(__file__).parent.parent / "scraper"))
try:
    import cloudscraper
    from bs4 import BeautifulSoup
except ImportError:
    print("cloudscraper ve beautifulsoup4 gerekli: pip install cloudscraper beautifulsoup4")
    sys.exit(1)

PLACEHOLDER = "https://images.unsplash.com/photo-1541643600914-78b084683601?w=375&h=500&fit=crop"
DELAY = 2.0  # Fragrantica rate limit

# Marka adi -> Fragrantica URL slug (ozel karakterler)
BRAND_SLUG_OVERRIDE = {
    "lancôme": "Lancome",
    "hermès": "Hermes",
    "ysl": "Yves-Saint-Laurent",
    "yves saint laurent": "Yves-Saint-Laurent",
    "dolce & gabbana": "Dolce-Gabbana",
    "dolce and gabbana": "Dolce-Gabbana",
    "jean paul gaultier": "Jean-Paul-Gaultier",
    "tom ford": "Tom-Ford",
    "giorgio armani": "Giorgio-Armani",
    "versace": "Versace",
    "jo malone": "Jo-Malone-London",
    "maison francis kurkdjian": "Maison-Francis-Kurkdjian",
    "creed": "Creed",
    "bvlgari": "Bvlgari",
    "prada": "Prada",
    "gucci": "Gucci",
    "calvin klein": "Calvin-Klein",
    "hugo boss": "Hugo-Boss",
    "paco rabanne": "Paco-Rabanne",
    "armaf": "Armaf",
    "montblanc": "Montblanc",
    "azzaro": "Azzaro",
    "dunhill": "Dunhill",
    "vera wang": "Vera-Wang",
    "rihanna": "Rihanna",
    "hollister": "Hollister",
    "abercrombie & fitch": "Abercrombie-and-Fitch",
    "paris corner": "Paris-Corner",
    "maison alhambra": "Maison-Alhambra",
    "acqua dell'elba": "Acqua-dell-Elba",
    "parfums de marly": "Parfums-de-Marly",
    "frederic malle": "Frederic-Malle",
    "penhaligon's": "Penhaligons",
    "bond no 9": "Bond-No-9",
    "chloé": "Chloe",
    "chloe": "Chloe",
    "estée lauder": "Estee-Lauder",
    "estee lauder": "Estee-Lauder",
    "beyoncé": "Beyonce",
    "beyonce": "Beyonce",
    "clean": "Clean",
    "clean reserve": "Clean",  # Clean Reserve, Clean markasinin alt serisi
    "cartier": "Cartier",
    "van cleef & arpels": "Van-Cleef-Arpels",
    "elizabeth arden": "Elizabeth-Arden",
    "oriflame": "Oriflame",
    "avon": "Avon",
    "nautica": "Nautica",
    "adidas": "Adidas",
    "carolina herrera": "Carolina-Herrera",
    "montblanc": "Montblanc",
    "lancôme": "Lancome",
    "lancome": "Lancome",
    "detour noir": "Detour-Noir",  # clone marka, Fragrantica'da olmayabilir
    "guess": "Guess",
    "massimo dutti": "Massimo-Dutti",
}


def get_session():
    try:
        return cloudscraper.CloudScraper(
            browser={"browser": "chrome", "platform": "windows", "desktop": True}
        )
    except Exception:
        import requests
        return requests.Session()


def brand_to_slug(brand: str) -> str:
    """Marka adini Fragrantica designers URL slug'una cevir."""
    b = (brand or "").strip()
    if not b:
        return ""
    key = b.lower()
    if key in BRAND_SLUG_OVERRIDE:
        return BRAND_SLUG_OVERRIDE[key]
    # Varsayilan: bosluk -> tire, ozel karakterleri kaldir
    slug = re.sub(r"[^\w\s-]", "", b)
    slug = re.sub(r"\s+", "-", slug.strip())
    return slug


def _remove_accents(s: str) -> str:
    """Aksanli karakterleri ASCII karsiligina cevir."""
    replacements = {
        "é": "e", "è": "e", "ê": "e", "ë": "e",
        "á": "a", "à": "a", "â": "a", "ä": "a",
        "í": "i", "ì": "i", "î": "i", "ï": "i",
        "ó": "o", "ò": "o", "ô": "o", "ö": "o", "õ": "o",
        "ú": "u", "ù": "u", "û": "u", "ü": "u",
        "ñ": "n", "ç": "c", "ß": "ss",
    }
    for old, new in replacements.items():
        s = s.replace(old, new)
    return s


def normalize_name(s: str) -> str:
    """Karsilastirma icin normalize."""
    s = (s or "").lower().strip()
    s = _remove_accents(s)
    # No 5, N°5, No.5, N5 -> no 5
    s = re.sub(r"\bno\.?\s*5\b", "no 5", s, flags=re.I)
    s = re.sub(r"\bn[°ºo]?\s*5\b", "no 5", s, flags=re.I)
    s = re.sub(r"\bn\s*5\b", "no 5", s, flags=re.I)
    s = re.sub(r"[^\w\s]", " ", s)
    s = re.sub(r"\s+", " ", s)
    return s


def fetch_designer_perfumes(session, brand_slug: str) -> list[tuple[str, str, str]]:
    """
    Marka sayfasindan parfum listesi: (url_name, fid, full_link)
    url_name: URL'deki isim (Chanel-No-5-Eau-de-Parfum)
    fid: Fragrantica ID
    """
    url = f"https://www.fragrantica.com/designers/{brand_slug}.html"
    try:
        r = session.get(url, timeout=25)
        r.raise_for_status()
    except Exception:
        return []

    soup = BeautifulSoup(r.text, "html.parser")
    results = []
    seen = set()

    for a in soup.find_all("a", href=True):
        href = a.get("href", "")
        if "/perfume/" not in href or ".html" not in href:
            continue
        # /perfume/Chanel/Chanel-No-5-212.html veya /perfume/Chanel/Chanel-No-5-Eau-de-Parfum-40069.html
        m = re.search(r"/perfume/[^/]+/([^/]+)-(\d+)\.html", href)
        if not m:
            continue
        url_name = m.group(1).replace("-", " ")
        fid = m.group(2)
        if fid not in seen:
            seen.add(fid)
            results.append((url_name, fid, href))

    return results


def find_best_match(perfume_name: str, designer_perfumes: list[tuple[str, str, str]]) -> str | None:
    """
    Parfum ismine en iyi eslesen Fragrantica ID'sini dondur.
    Oncelik: tam eslesme > isim iceriyor > kismi eslesme
    """
    pnorm = normalize_name(perfume_name)
    if not pnorm:
        return None

    # Tam eslesme
    for url_name, fid, _ in designer_perfumes:
        if normalize_name(url_name) == pnorm:
            return fid

    # Parfum ismi URL isminde geciyor (Chanel No 5 -> Chanel No 5 Eau de Parfum)
    for url_name, fid, _ in designer_perfumes:
        if pnorm in normalize_name(url_name):
            return fid

    # URL ismi parfum isminde geciyor (kisa isim)
    for url_name, fid, _ in designer_perfumes:
        unorm = normalize_name(url_name)
        if unorm in pnorm:
            return fid

    # Kelime bazli: parfum ismindeki kelimelerin cogu url'de var
    pwords = set(pnorm.split())
    best = None
    best_score = 0
    for url_name, fid, _ in designer_perfumes:
        unorm = normalize_name(url_name)
        uwords = set(unorm.split())
        common = len(pwords & uwords)
        if common >= 2 and common > best_score:  # en az 2 kelime eslesmeli
            best_score = common
            best = fid
    return best


def get_fragrantica_id(session, brand: str, name: str, cache: dict) -> str | None:
    """Marka sayfasindan parfum ID'si bul. cache: brand_slug -> perfume listesi."""
    slug = brand_to_slug(brand)
    if not slug:
        return None

    if slug not in cache:
        cache[slug] = fetch_designer_perfumes(session, slug)

    perfumes = cache[slug]
    return find_best_match(name, perfumes)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0, help="Max kac placeholder parfum (0=tum)")
    ap.add_argument("--dry-run", action="store_true", help="Kaydetmeden test et")
    args = ap.parse_args()

    base = Path(__file__).parent.parent
    data_path = base / "data" / "perfumes.json"

    with open(data_path, "r", encoding="utf-8") as f:
        perfumes = json.load(f)

    to_fetch = [p for p in perfumes if p.get("image_url") == PLACEHOLDER]
    if args.limit:
        to_fetch = to_fetch[: args.limit]

    print(f"Placeholder: {len(to_fetch)} parfum")
    if not to_fetch:
        print("Yapilacak islem yok.")
        return

    session = get_session()
    cache = {}
    updated = 0

    for i, p in enumerate(to_fetch, 1):
        brand = p.get("brand", "")
        name = p.get("name", "")
        fid = get_fragrantica_id(session, brand, name, cache)
        if fid:
            p["image_url"] = f"https://fimgs.net/mdimg/perfume-thumbs/375x500.{fid}.jpg"
            updated += 1
            print(f"  [{i}/{len(to_fetch)}] OK: {brand} {name} -> ID {fid}")
        else:
            print(f"  [{i}/{len(to_fetch)}] --: {brand} {name} (eslesme yok)")

        time.sleep(DELAY)

    if not args.dry_run and updated:
        with open(data_path, "w", encoding="utf-8") as f:
            json.dump(perfumes, f, indent=2, ensure_ascii=False)

    print(f"\nSonuc: {updated} gorsel guncellendi")
    if args.dry_run:
        print("(dry-run - dosya kaydedilmedi)")


if __name__ == "__main__":
    main()
