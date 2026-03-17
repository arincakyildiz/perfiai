"""
Fragrantica Marka Sayfalarından URL Toplayıcı
Hedef: 3000+ parfüm URL'si topla -> scraper/urls.txt dosyasına ekle.

Kullanım:
    pip install requests cloudscraper beautifulsoup4
    python scripts/collect_fragrantica_urls.py
"""

import re
import time
import json
from pathlib import Path

try:
    import cloudscraper
    def get_session():
        return cloudscraper.CloudScraper(
            browser={"browser": "chrome", "platform": "windows", "desktop": True}
        )
except ImportError:
    import requests
    def get_session():
        s = requests.Session()
        s.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"})
        return s

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("BeautifulSoup4 gerekli: pip install beautifulsoup4")
    raise

BASE_URL  = "https://www.fragrantica.com"
DELAY     = 3          # saniye
OUTPUT    = Path(__file__).parent.parent / "scraper" / "urls.txt"

# 200+ büyük parfüm markası
BRANDS = [
    "Dior", "Chanel", "Yves-Saint-Laurent", "Gucci", "Giorgio-Armani",
    "Versace", "Prada", "Dolce-Gabbana", "Tom-Ford", "Burberry",
    "Hugo-Boss", "Davidoff", "Lacoste", "Azzaro", "Montblanc",
    "Issey-Miyake", "Calvin-Klein", "Ralph-Lauren", "Marc-Jacobs",
    "Paco-Rabanne", "Jean-Paul-Gaultier", "Viktor-Rolf", "Jimmy-Choo",
    "Valentino", "Carolina-Herrera", "Michael-Kors", "Coach",
    "DKNY", "Stella-McCartney", "Nina-Ricci", "Givenchy",
    "Lancôme", "Christian-Louboutin", "Dsquared2", "Bvlgari",
    "Cartier", "Guerlain", "Chloé", "Sisley", "Annick-Goutal",
    "Creed", "Maison-Francis-Kurkdjian", "Parfums-de-Marly", "Xerjoff",
    "Amouage", "Byredo", "Diptyque", "Penhaligon-s", "Roja-Dove",
    "Kilian", "Acqua-di-Parma", "Maison-Margiela", "Celine",
    "Mugler", "Lanvin", "Elizabeth-Arden", "Clinique",
    "Narciso-Rodriguez", "Bulgari", "Jo-Malone-London",
    "Hermès", "Dolce-Gabbana", "Roberto-Cavalli", "Moschino",
    "Bleu-de-Chanel", "Christian-Dior",
    # Budget / accessible
    "Zara", "Lacoste", "Adidas", "Avon", "Benckiser",
    "Playboy", "Police", "Axe", "Lynx",
    # Oriental / Arabic
    "Lattafa", "Rasasi", "Al-Haramain", "Swiss-Arabian",
    "Afnan", "Maison-Alhambra", "Ajmal", "Arabian-Oud",
    "Paris-Corner", "Reyane-Tradition", "Zimaya", "Oud-Elite",
    "Detour-Noir",
    # Niche
    "Serge-Lutens", "L-Artisan-Parfumeur", "Histoires-de-Parfums",
    "Juliette-Has-a-Gun", "Comme-des-Garcons", "Le-Labo",
    "Atelier-Cologne", "Miller-Harris", "Frederic-Malle",
    "Etat-Libre-d-Orange", "Nasomatto", "Orto-Parisi",
    "Initio-Parfums-Prives", "Nishane", "Tiziana-Terenzi",
    "Zoologist-Perfumes", "DS-Durga", "Imaginary-Authors",
    "Commodity", "Phlur", "IKOU", "Abel",
    # Mainstream additional
    "Fahrenheit-Dior", "Elizabeth-Taylor", "Jennifer-Lopez",
    "Britney-Spears", "Beyoncé", "Ariana-Grande", "Rihanna",
    "Justin-Bieber", "One-Direction", "Katy-Perry",
    "Paris-Hilton", "Sarah-Jessica-Parker",
    # Men's sport
    "Lacoste", "Adidas", "Nike", "Azzaro", "Davidoff",
    # More designer
    "Alexander-McQueen", "Alexander-Wang", "Ann-Demeulemeester",
    "Balenciaga", "Balmain", "Bottega-Veneta", "Bulgari",
    "Christian-Louboutin", "Christian-Lacroix", "Donna-Karan",
    "Dunhill", "Emanuel-Ungaro", "Escada", "Fendi",
    "Furla", "Gianfranco-Ferre", "Givenchy", "Guy-Laroche",
    "Helmut-Lang", "Hugo-Boss", "Iceberg", "Jean-Patou",
    "Karl-Lagerfeld", "Kenneth-Cole", "Kenzo",
    "Lanvin", "Loewe", "Mauboussin", "Mexx",
    "Missoni", "Miyake", "Moschino", "Mugler",
    "Oscar-de-la-Renta", "Paul-Smith", "Prada",
    "Salvatore-Ferragamo", "Sonia-Rykiel", "Ted-Baker",
    "Thierry-Mugler", "Trussardi", "Vivienne-Westwood",
    "Yohji-Yamamoto", "Zegna",
]


def get_brand_perfume_urls(session, brand_slug: str) -> list[str]:
    """Marka sayfasından parfüm URL'lerini topla."""
    url = f"{BASE_URL}/designers/{brand_slug}.html"
    try:
        r = session.get(url, timeout=20)
        r.raise_for_status()
    except Exception as e:
        print(f"  [X] {brand_slug}: {e}")
        return []

    soup = BeautifulSoup(r.text, "html.parser")
    urls = []

    # Parfüm linkleri: /perfume/Brand/Name-12345.html
    for a in soup.find_all("a", href=re.compile(r"/perfume/[^/]+/[^/]+-\d+\.html$")):
        href = a.get("href", "")
        full = href if href.startswith("http") else BASE_URL + href
        if full not in urls:
            urls.append(full)

    return urls


def load_existing_urls(path: Path) -> set[str]:
    if not path.exists():
        return set()
    lines = path.read_text(encoding="utf-8").splitlines()
    return {l.strip() for l in lines if l.strip().startswith("http")}


def main():
    print("Fragrantica URL Toplayıcı")
    print("=" * 50)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    existing = load_existing_urls(OUTPUT)
    print(f"Mevcut URL sayısı: {len(existing)}")

    session = get_session()
    new_urls = []

    for i, brand in enumerate(BRANDS, 1):
        print(f"[{i}/{len(BRANDS)}] {brand}...", end=" ", flush=True)
        urls = get_brand_perfume_urls(session, brand)
        added = 0
        for u in urls:
            if u not in existing:
                existing.add(u)
                new_urls.append(u)
                added += 1
        print(f"{added} yeni URL ({len(urls)} toplam)")

        # Her 10 markada bir kaydet
        if i % 10 == 0:
            with open(OUTPUT, "a", encoding="utf-8") as f:
                for u in new_urls:
                    f.write(u + "\n")
            print(f"  → {len(new_urls)} URL kaydedildi. Toplam: {len(existing)}")
            new_urls.clear()

        time.sleep(DELAY)

    # Kalanları kaydet
    if new_urls:
        with open(OUTPUT, "a", encoding="utf-8") as f:
            for u in new_urls:
                f.write(u + "\n")

    print(f"\nToplam URL: {len(existing)}")
    print(f"Kaydedildi: {OUTPUT}")
    print("\nSıradaki adım:")
    print("  python scraper/scrape_fragrantica.py")


if __name__ == "__main__":
    main()
