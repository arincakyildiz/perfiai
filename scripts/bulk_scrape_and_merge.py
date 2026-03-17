"""
Fragrantica Toplu Scraper + Otomatik Merge
urls.txt'teki parfümleri çekip mevcut perfumes.json ile birleştirir.
Kesintide kaldığı yerden devam eder.

Kullanım:
    pip install requests cloudscraper beautifulsoup4
    python scripts/bulk_scrape_and_merge.py
    python scripts/bulk_scrape_and_merge.py --limit 200   # sadece 200 URL işle
    python scripts/bulk_scrape_and_merge.py --start 100   # 100. URL'den başla
"""

import json
import re
import sys
import time
import argparse
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
        s.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        return s

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("pip install beautifulsoup4")
    raise

BASE        = Path(__file__).parent.parent
DATA_PATH   = BASE / "data" / "perfumes.json"
URLS_PATH   = BASE / "scraper" / "urls.txt"
PROGRESS    = BASE / "data" / "scrape_progress.json"
DELAY       = 2.5

# ─── Türkçe açıklama üretici ──────────────────────────────────────────────────
ACCORD_TR = {"fresh spicy":"ferah baharatlı","warm spicy":"sıcak baharatlı","spicy":"baharatlı","citrus":"narenciye","aromatic":"aromatik","fresh":"ferah","amber":"amber","musky":"misk","woody":"odunsu","lavender":"lavanta","herbal":"bitkisel","floral":"çiçeksi","white floral":"beyaz çiçek","sweet":"tatlı","powdery":"pudralı","fruity":"meyveli","rose":"gül","aquatic":"deniz","vanilla":"vanilya","gourmand":"gurme","oud":"oud","oriental":"oryantal","earthy":"toprak","smoky":"dumanlı","leather":"deri","creamy":"kremsi","sandalwood":"sandal ağacı","patchouli":"paçuli","tobacco":"tütün","honey":"bal","incense":"tütsü","green":"yeşil/taze","balsamic":"balsam","animalic":"hayvani"}
GENDER_TR  = {"male":"erkeklere özel","female":"kadınlara özel","unisex":"uniseks"}
SEASON_TR  = {"spring":"ilkbahar","summer":"yaz","fall":"sonbahar","winter":"kış"}
LON_TR     = {"short":"kısa süreli kalıcılık","moderate":"orta düzey kalıcılık","long":"uzun süre kalıcılık","very long":"çok uzun süre kalıcılık"}
SIL_TR     = {"soft":"hafif iz","moderate":"orta güçte iz","strong":"güçlü iz","enormous":"çok güçlü iz"}

def gen_tr(p):
    accords = [(ACCORD_TR.get(a.lower()) or a) for a in (p.get("accords") or [])[:3]]
    gender = GENDER_TR.get(p.get("gender","unisex"), "herkes için")
    seasons = p.get("season",[])
    lon = LON_TR.get(p.get("longevity",""))
    sil = SIL_TR.get(p.get("sillage",""))
    parts = []
    if accords:
        parts.append(f"{', '.join(accords)} notalarıyla öne çıkan, {gender} bir parfüm.")
    else:
        parts.append(f"{gender.capitalize()} için özel bir koku.")
    if len(seasons)==4: parts.append("Dört mevsim kullanılabilir.")
    elif seasons: parts.append(f"{' ve '.join(SEASON_TR.get(s,s) for s in seasons).capitalize()} ayları için ideal.")
    if lon and sil: parts.append(f"{lon.capitalize()}, {sil} bırakır.")
    return " ".join(parts)

# ─── Fragrantica parse fonksiyonları ──────────────────────────────────────────
def parse_notes_from_text(text):
    notes = {"top":[],"middle":[],"base":[]}
    for key, pat in [("top",r"[Tt]op notes? (?:are|is)\s+([^.;]+)"),("middle",r"[Mm]iddle notes? (?:are|is)\s+([^.;]+)"),("base",r"[Bb]ase notes? (?:are|is)\s+([^.;]+)")]:
        m = re.search(pat, text)
        if m:
            part = re.sub(r"\s+and\s+", ", ", m.group(1).strip(), flags=re.I)
            notes[key] = [n.strip() for n in part.split(",") if n.strip() and len(n.strip())<40]
    return notes

def parse_accords(soup):
    accords = []
    for div in soup.find_all("div", class_=re.compile(r"accord")):
        for a in div.find_all("a"):
            t = a.get_text(strip=True).lower()
            if t and t not in ["search by accords","accords"] and len(t)<25 and t not in accords:
                accords.append(t)
    return accords[:12]

def parse_season(text):
    seasons = []
    text_l = text.lower()
    for s in ["winter","spring","summer","fall"]:
        if s in text_l: seasons.append(s)
    return seasons or ["spring","summer","fall","winter"]

def parse_image(soup, url):
    og = soup.find("meta", property="og:image")
    if og and og.get("content"): return og["content"]
    m = re.search(r"-(\d+)\.html$", url)
    return f"https://fimgs.net/mdimg/perfume-thumbs/375x500.{m.group(1)}.jpg" if m else ""

def extract_brand_name(url):
    try:
        parts = url.rstrip("/").split("/")
        if len(parts)>=5:
            brand = parts[-2].replace("-"," ").strip()
            name  = re.sub(r"-\d+$","",parts[-1].replace(".html","")).replace("-"," ").strip()
            return brand, name
    except: pass
    return "", ""

def scrape_one(url, session):
    try:
        r = session.get(url, timeout=25)
        r.raise_for_status()
    except Exception as e:
        return None, str(e)

    soup = BeautifulSoup(r.text, "html.parser")
    brand, name = extract_brand_name(url)
    if not brand: return None, "URL parse hatası"

    description = ""
    for p in soup.find_all("p"):
        t = p.get_text(strip=True)
        if len(t)>80 and ("launched" in t.lower() or "fragrance" in t.lower()):
            description = t[:500]; break

    notes = parse_notes_from_text(description) if description else {"top":[],"middle":[],"base":[]}
    accords = parse_accords(soup)
    text = soup.get_text()

    m = re.search(r"(\d+\.?\d*)\s*out of\s*5", text, re.I)
    rating = round(float(m.group(1)),2) if m else 0.0

    gender = "unisex"
    if " for men" in text.lower() or " men's" in text.lower(): gender = "male"
    elif " for women" in text.lower() or " women's" in text.lower(): gender = "female"

    year_m = re.search(r"launched in (\d{4})", text, re.I)
    year = int(year_m.group(1)) if year_m else 0

    p_obj = {"brand":brand,"name":name,"notes":notes,"accords":accords,
             "longevity":"moderate","sillage":"moderate","season":parse_season(text),
             "gender":gender,"rating":rating,"short_description":description or f"{brand} {name} fragrance.",
             "year":year,"image_url":parse_image(soup, url)}
    p_obj["short_description_tr"] = gen_tr(p_obj)
    return p_obj, None

# ─── Ana fonksiyon ─────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=99999, help="Max işlenecek URL sayısı")
    parser.add_argument("--start", type=int, default=0, help="Başlangıç indexi")
    args = parser.parse_args()

    # URL listesi
    if not URLS_PATH.exists():
        print(f"urls.txt bulunamadı: {URLS_PATH}")
        print("Önce: python scripts/collect_fragrantica_urls.py")
        sys.exit(1)

    all_urls = [l.strip() for l in URLS_PATH.read_text(encoding="utf-8").splitlines()
                if l.strip().startswith("http")]
    print(f"Toplam URL: {len(all_urls)}")

    # Mevcut veri
    perfumes = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    seen = {(p["brand"].lower().strip(), p["name"].lower().strip()) for p in perfumes}
    print(f"Mevcut parfüm: {len(perfumes)}")

    # İlerleme kaydı
    progress = {}
    if PROGRESS.exists():
        progress = json.loads(PROGRESS.read_text(encoding="utf-8"))
    done_urls = set(progress.get("done", []))

    session  = get_session()
    to_process = [u for u in all_urls[args.start:] if u not in done_urls][:args.limit]
    print(f"İşlenecek URL: {len(to_process)}")
    print("─"*50)

    added = 0
    errors = 0

    for i, url in enumerate(to_process, 1):
        frag_name = url.split("/")[-1][:50]
        print(f"[{i}/{len(to_process)}] {frag_name}...", end=" ", flush=True)

        p, err = scrape_one(url, session)
        done_urls.add(url)

        if err or not p:
            print(f"HATA: {err}")
            errors += 1
        else:
            key = (p["brand"].lower().strip(), p["name"].lower().strip())
            if key in seen:
                print(f"var (atlandı)")
            else:
                seen.add(key)
                perfumes.append(p)
                added += 1
                print(f"OK {p['brand']} - {p['name']}")

        # Her 25 parfümde kaydet
        if i % 25 == 0:
            _save(perfumes, done_urls, progress)
            print(f"  → Kaydedildi. Toplam: {len(perfumes)} (+{added} yeni)")

        time.sleep(DELAY)

    _save(perfumes, done_urls, progress)
    print(f"\n{'='*50}")
    print(f"Eklenen: {added} | Hata: {errors} | Toplam: {len(perfumes)}")

def _save(perfumes, done_urls, progress):
    perfumes_clean = []
    seen_keys = set()
    for p in perfumes:
        key = (p.get("brand","").lower().strip(), p.get("name","").lower().strip())
        if key not in seen_keys:
            seen_keys.add(key)
            perfumes_clean.append(p)
    for i, p in enumerate(perfumes_clean, 1):
        p["id"] = str(i)
    DATA_PATH.write_text(json.dumps(perfumes_clean, ensure_ascii=False, indent=2), encoding="utf-8")
    progress["done"] = list(done_urls)
    PROGRESS.write_text(json.dumps(progress, ensure_ascii=False), encoding="utf-8")

if __name__ == "__main__":
    main()
