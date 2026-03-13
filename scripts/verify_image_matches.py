"""
Parfum-gorsel eslesmelerini dogrular.
1. Ayni gorsel ID'si farkli parfumlerde kullanilmis mi? (suskun eslesme)
2. Ornek parfumler icin Fragrantica sayfasindan dogrulama
"""

import json
import re
import sys
from pathlib import Path
from collections import defaultdict

sys.path.insert(0, str(Path(__file__).parent.parent / "scraper"))
try:
    import cloudscraper
    from bs4 import BeautifulSoup
except ImportError:
    cloudscraper = None

PLACEHOLDER = "https://images.unsplash.com/photo-1541643600914-78b084683601?w=375&h=500&fit=crop"


def extract_fid(image_url: str) -> str | None:
    """fimgs.net URL'den ID cikar."""
    m = re.search(r"375x500\.(\d+)\.jpg", image_url or "")
    return m.group(1) if m else None


def main():
    base = Path(__file__).parent.parent
    data_path = base / "data" / "perfumes.json"

    with open(data_path, "r", encoding="utf-8") as f:
        perfumes = json.load(f)

    # 1. Ayni (brand, fid) ile birden fazla farkli parfum?
    brand_fid_to_perfumes = defaultdict(list)
    for p in perfumes:
        url = p.get("image_url", "")
        if url == PLACEHOLDER:
            continue
        fid = extract_fid(url)
        if fid:
            key = (p.get("brand", ""), p.get("name", ""), fid)
            brand_fid_to_perfumes[(p.get("brand", ""), fid)].append(p.get("name", ""))

    duplicates = {k: v for k, v in brand_fid_to_perfumes.items() if len(v) > 1}
    print("=" * 60)
    print("1. AYNI GORSEL, FARKLI PARFUM (potansiyel yanlis eslesme)")
    print("=" * 60)
    if duplicates:
        for (brand, fid), names in sorted(duplicates.items(), key=lambda x: -len(x[1])):
            unique_names = list(dict.fromkeys(names))
            if len(unique_names) > 1:
                print(f"\n  {brand} | ID {fid} -> {len(unique_names)} farkli parfum:")
                for n in unique_names[:8]:
                    print(f"    - {n}")
                if len(unique_names) > 8:
                    print(f"    ... +{len(unique_names)-8} daha")
        print(f"\n  Toplam: {len(duplicates)} markada cakisma var")
    else:
        print("  Cakisma yok.")

    # 2. Ornek dogrulama: Fragrantica'dan ID -> parfum adi
    print("\n" + "=" * 60)
    print("2. ORNEK DOGRULAMA (ilk 5 marka)")
    print("=" * 60)

    if not cloudscraper:
        print("  cloudscraper yok, atlaniyor.")
        return

    session = cloudscraper.CloudScraper(browser={"browser": "chrome", "platform": "windows", "desktop": True})
    brand_slugs = {"Dior": "Dior", "Chanel": "Chanel", "Tom Ford": "Tom-Ford", "Creed": "Creed", "Diesel": "Diesel"}

    for brand, slug in brand_slugs.items():
        url = f"https://www.fragrantica.com/designers/{slug}.html"
        try:
            r = session.get(url, timeout=20)
            r.raise_for_status()
        except Exception as e:
            print(f"  {brand}: Hata - {e}")
            continue

        soup = BeautifulSoup(r.text, "html.parser")
        fid_to_name = {}
        for a in soup.find_all("a", href=True):
            href = a.get("href", "")
            m = re.search(r"/perfume/[^/]+/([^/]+)-(\d+)\.html", href)
            if m:
                fid_to_name[m.group(2)] = m.group(1).replace("-", " ")

        # Bizim verilerle karsilastir
        our_perfumes = [(p["name"], extract_fid(p.get("image_url", ""))) for p in perfumes if p.get("brand") == brand and extract_fid(p.get("image_url", ""))]
        mismatches = []
        for our_name, fid in our_perfumes[:15]:  # ilk 15
            frag_name = fid_to_name.get(fid, "")
            if frag_name:
                # Karsilastir: "Sauvage" vs "Sauvage Eau de Toilette" -> OK
                our_norm = our_name.lower().replace(" ", "")
                frag_norm = frag_name.lower().replace(" ", "")
                if our_norm not in frag_norm and frag_norm not in our_norm:
                    # Tam eslesme degil, kontrol et
                    if our_norm[:5] != frag_norm[:5]:  # ilk 5 karakter farkli
                        mismatches.append((our_name, fid, frag_name))

        if mismatches:
            print(f"\n  {brand} - Suskun uyusmazliklar:")
            for our, fid, frag in mismatches[:5]:
                print(f"    Bizim: {our} | Fragrantica ID {fid}: {frag}")
        else:
            print(f"\n  {brand}: Ornekler uyumlu")

    print("\n" + "=" * 60)
    print("OZET")
    print("=" * 60)
    fimgs = sum(1 for p in perfumes if "fimgs.net" in (p.get("image_url") or ""))
    placeholders = sum(1 for p in perfumes if p.get("image_url") == PLACEHOLDER)
    print(f"  Fragrantica gorseli: {fimgs}")
    print(f"  Placeholder: {placeholders}")
    print(f"  Toplam: {len(perfumes)}")


if __name__ == "__main__":
    main()
