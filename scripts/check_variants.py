"""Supheli varyantlari Fragrantica'dan dogrula."""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "scraper"))
import cloudscraper
from bs4 import BeautifulSoup

session = cloudscraper.CloudScraper(browser={"browser": "chrome", "platform": "windows", "desktop": True})

# Supheli: farkli parfumler ayni ID almis olabilir
checks = [
    ("Yves Saint Laurent", "Yves-Saint-Laurent", ["31890", "opium", "black"]),
    ("Versace", "Versace", ["40031", "2318", "dylan", "pour homme"]),
    ("Ralph Lauren", "Ralph-Lauren", ["16658", "polo"]),
    ("Kenzo", "Kenzo", ["3403", "18701", "flower", "homme"]),
]

for brand, slug, keywords in checks:
    url = f"https://www.fragrantica.com/designers/{slug}.html"
    print(f"\n=== {brand} (IDs: {keywords[0]} vb.) ===")
    try:
        r = session.get(url, timeout=25)
        r.raise_for_status()
    except Exception as e:
        print(f"Hata: {e}")
        continue

    soup = BeautifulSoup(r.text, "html.parser")
    seen = set()
    for a in soup.find_all("a", href=True):
        m = re.search(r"/perfume/[^/]+/([^/]+)-(\d+)\.html", a.get("href", ""))
        if m:
            name, fid = m.group(1).replace("-", " "), m.group(2)
            if fid in keywords or any(k in name.lower() for k in keywords[1:] if k.isalpha()):
                key = (name, fid)
                if key not in seen:
                    seen.add(key)
                    print(f"  ID {fid}: {name}")
