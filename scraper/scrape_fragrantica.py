"""
Fragrantica Parfüm Scraper
Perfiai projesi için parfüm verisi çeker.
Kullanım: python scrape_fragrantica.py
"""

import requests
import cloudscraper
from bs4 import BeautifulSoup
import json
import time
import re
from pathlib import Path

# Fragrantica rate limiting icin bekleme suresi (saniye)
DELAY_BETWEEN_REQUESTS = 2

# Cloudflare bypass - Fragrantica 403 veriyor
def get_session():
    try:
        scraper = cloudscraper.CloudScraper(
            browser={"browser": "chrome", "platform": "windows", "desktop": True}
        )
        return scraper
    except Exception:
        return requests.Session()


def parse_notes_from_text(text: str) -> dict:
    """Aciklamadan 'Top notes are X; middle notes are Y; base notes are Z' parse et."""
    notes = {"top": [], "middle": [], "base": []}
    # "Top notes are Calabrian bergamot and Pepper; middle notes are Sichuan Pepper, Lavender..."
    for key, pattern in [
        ("top", r"[Tt]op notes? (?:are|is)\s+([^.;]+)"),
        ("middle", r"[Mm]iddle notes? (?:are|is)\s+([^.;]+)"),
        ("base", r"[Bb]ase notes? (?:are|is)\s+([^.;]+)"),
    ]:
        m = re.search(pattern, text)
        if m:
            part = m.group(1).strip()
            # "X, Y and Z" veya "X and Y" -> liste
            part = re.sub(r"\s+and\s+", ", ", part, flags=re.I)
            notes[key] = [n.strip() for n in part.split(",") if n.strip() and len(n.strip()) < 40]
    return notes


def parse_notes(soup: BeautifulSoup, description: str = "") -> dict:
    """Top, middle, base notlari parse et."""
    notes = {"top": [], "middle": [], "base": []}
    
    # 1. Aciklamadan parse et (guvenilir)
    if description:
        notes = parse_notes_from_text(description)
    
    # 2. HTML'den note linkleri (pyramid)
    if not any(notes.values()):
        note_headers = soup.find_all(["h4", "h5", "h6", "strong"], string=re.compile(r"Top|Middle|Base|Head|Heart", re.I))
        for i, header in enumerate(note_headers):
            section = header.find_next_sibling()
            if section:
                note_links = section.find_all("a", href=re.compile(r"/notes/"))
                key = "top" if i == 0 else "middle" if i == 1 else "base"
                notes[key] = [a.get_text(strip=True) for a in note_links if a.get_text(strip=True)]
    
    return notes


def parse_accords(soup: BeautifulSoup) -> list:
    """Main accords parse et."""
    accords = []
    accord_links = soup.find_all("a", href=re.compile(r"accords-search"))
    for link in accord_links:
        parent = link.find_parent("div", class_=re.compile(r"accord|main"))
        if parent:
            accord_text = link.get_text(strip=True).lower()
            if accord_text and accord_text not in accords and len(accord_text) < 30:
                accords.append(accord_text)
    
    # Alternatif: accord kelimesini içeren div'ler
    if not accords:
        for div in soup.find_all("div", class_=re.compile(r"accord")):
            for a in div.find_all("a"):
                t = a.get_text(strip=True).lower()
                if t and t not in ["search by accords", "accords"] and len(t) < 25:
                    accords.append(t)
    
    return accords[:12]  # Max 12 accord


def parse_rating(soup: BeautifulSoup) -> float:
    """Rating parse et (örn: 3.86 out of 5)."""
    text = soup.get_text()
    match = re.search(r"(\d+\.?\d*)\s*out of\s*5", text, re.I)
    if match:
        return float(match.group(1))
    return 0.0


def parse_season(text: str) -> list:
    """When to wear: winter, spring, summer, fall."""
    seasons = []
    text_lower = text.lower()
    for s in ["winter", "spring", "summer", "fall"]:
        if s in text_lower:
            seasons.append(s)
    return seasons if seasons else ["spring", "summer", "fall", "winter"]


def parse_longevity_sillage(soup: BeautifulSoup) -> tuple:
    """Longevity ve sillage - Fragrantica'da bazen votes ile gösterilir."""
    # Varsayılan - sayfa yapısına göre güncellenebilir
    return "moderate", "moderate"


def parse_image_url(soup: BeautifulSoup, url: str) -> str:
    """Parfum gorsel URL'si - og:image veya perfume-thumbs."""
    og = soup.find("meta", property="og:image")
    if og and og.get("content"):
        return og["content"]
    fid = re.search(r"-(\d+)\.html$", url)
    if fid:
        return f"https://fimgs.net/mdimg/perfume-thumbs/375x500.{fid.group(1)}.jpg"
    return ""


def extract_brand_name_from_url(url: str) -> tuple[str, str]:
    """URL'den brand ve name cikar: /perfume/Dior/Sauvage-31861.html -> (Dior, Sauvage)"""
    try:
        parts = url.rstrip("/").split("/")
        if len(parts) >= 5:
            brand_part = parts[-2]  # Dior
            name_part = parts[-1].replace(".html", "")  # Sauvage-31861 veya Bleu-de-Chanel-Eau-de-Parfum-25967
            name = re.sub(r"-\d+$", "", name_part)  # Sondaki ID'yi kaldir (-31861, -210 vb)
            name = name.replace("-", " ").strip()
            brand = brand_part.replace("-", " ")
            return (brand, name)
    except Exception:
        pass
    return ("", "")


def scrape_perfume(url: str, perfume_id: str, session) -> dict | None:
    """Tek bir parfum sayfasindan veri cek."""
    try:
        response = session.get(url, timeout=30)
        response.raise_for_status()
    except Exception as e:
        print(f"  [X] Request hatasi: {e}")
        return None

    soup = BeautifulSoup(response.text, "html.parser")

    # Brand ve name - SADECE URL'den (Fragrantica bazen yanlis sayfa gosteriyor)
    url_brand, url_name = extract_brand_name_from_url(url)
    brand = url_brand or "Unknown"
    name = url_name or "Unknown"

    # Aciklama - ilk uzun paragraf
    description = ""
    for p in soup.find_all("p"):
        text = p.get_text(strip=True)
        if len(text) > 80 and ("launched" in text.lower() or "fragrance" in text.lower()):
            description = text[:500]
            break
    if not description:
        desc_div = soup.find("div", class_=re.compile(r"description|review|text"))
        if desc_div:
            description = desc_div.get_text(strip=True)[:500]

    notes = parse_notes(soup, description)
    accords = parse_accords(soup)
    rating = parse_rating(soup)
    longevity, sillage = parse_longevity_sillage(soup)

    # Season - sayfa metninden
    page_text = soup.get_text()
    season = parse_season(page_text)

    # Gender - URL veya metinden
    gender = "unisex"
    if " for men" in page_text.lower() or " men " in page_text.lower():
        gender = "male"
    elif " for women" in page_text.lower() or " women " in page_text.lower():
        gender = "female"

    # Year - açıklamadan
    year_match = re.search(r"launched in (\d{4})", page_text, re.I)
    year = int(year_match.group(1)) if year_match else 0

    # Görsel URL
    image_url = parse_image_url(soup, url)

    return {
        "id": perfume_id,
        "brand": brand or "Unknown",
        "name": name or "Unknown",
        "notes": notes,
        "accords": accords,
        "longevity": longevity,
        "sillage": sillage,
        "season": season,
        "gender": gender,
        "rating": round(rating, 2),
        "short_description": description or f"{brand} {name} - fragrance.",
        "year": year,
        "source_url": url,
        "image_url": image_url or (f"https://fimgs.net/mdimg/perfume-thumbs/375x500.{m.group(1)}.jpg" if (m := re.search(r"-(\d+)\.html$", url)) else ""),
    }


def load_url_list(path: str = "urls.txt") -> list[str]:
    """urls.txt dosyasından URL listesi oku."""
    p = Path(__file__).parent / path
    if not p.exists():
        return []
    return [line.strip() for line in p.read_text(encoding="utf-8").splitlines() if line.strip() and line.startswith("http")]


def main():
    print("Fragrantica Scraper - Perfiai")
    print("=" * 40)

    urls = load_url_list()
    if not urls:
        # Örnek URL listesi oluştur
        sample_urls = [
            "https://www.fragrantica.com/perfume/Dior/Sauvage-31861.html",
            "https://www.fragrantica.com/perfume/Chanel/Bleu-de-Chanel-9099.html",
            "https://www.fragrantica.com/perfume/Yves-Saint-Laurent/Y-Eau-de-Parfum-50757.html",
            "https://www.fragrantica.com/perfume/Maison-Francis-Kurkdjian/Baccarat-Rouge-540-37035.html",
            "https://www.fragrantica.com/perfume/Creed/Aventus-9828.html",
        ]
        urls_file = Path(__file__).parent / "urls.txt"
        urls_file.write_text("\n".join(sample_urls), encoding="utf-8")
        print(f"urls.txt olusturuldu. {len(sample_urls)} ornek URL eklendi.")
        urls = sample_urls

    session = get_session()
    results = []
    for i, url in enumerate(urls, 1):
        print(f"  [{i}/{len(urls)}] Cekiliyor: {url.split('/')[-1]}")
        data = scrape_perfume(url, str(i), session)
        if data:
            results.append(data)
            print(f"      OK {data['brand']} - {data['name']}")
        time.sleep(DELAY_BETWEEN_REQUESTS)

    # Kaydet
    output_path = Path(__file__).parent.parent / "data" / "perfumes_scraped.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\nOK - {len(results)} parfum kaydedildi: {output_path}")
    return results


if __name__ == "__main__":
    main()
