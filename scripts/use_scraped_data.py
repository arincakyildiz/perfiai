"""
Scraped veriyi perfumes.json'a yazar.
Kullanim: python scripts/use_scraped_data.py
"""

import json
from pathlib import Path

def main():
    base = Path(__file__).parent.parent
    scraped_path = base / "data" / "perfumes_scraped.json"
    perfumes_path = base / "data" / "perfumes.json"
    
    if not scraped_path.exists():
        print("HATA: perfumes_scraped.json bulunamadi. Once scraper calistirin.")
        return
    
    with open(scraped_path, "r", encoding="utf-8") as f:
        scraped = json.load(f)
    
    # source_url opsiyonel - kalabilir
    # ID'leri duzelt
    for i, p in enumerate(scraped, 1):
        p["id"] = str(i)
    
    # Yedek al
    if perfumes_path.exists():
        backup = base / "data" / "perfumes_backup.json"
        with open(perfumes_path, "r", encoding="utf-8") as f:
            old = json.load(f)
        with open(backup, "w", encoding="utf-8") as f:
            json.dump(old, f, indent=2, ensure_ascii=False)
        print(f"Yedek: {backup} ({len(old)} parfum)")
    
    with open(perfumes_path, "w", encoding="utf-8") as f:
        json.dump(scraped, f, indent=2, ensure_ascii=False)
    
    print(f"OK - perfumes.json guncellendi: {len(scraped)} parfum (Fragrantica'dan)")

if __name__ == "__main__":
    main()
