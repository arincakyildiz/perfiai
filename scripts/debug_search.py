"""Fragrantica arama sayfasi HTML yapisini incele."""
import re
import sys
from pathlib import Path
from urllib.parse import quote_plus

sys.path.insert(0, str(Path(__file__).parent.parent / "scraper"))
import cloudscraper
from bs4 import BeautifulSoup

session = cloudscraper.CloudScraper(browser={"browser": "chrome", "platform": "windows", "desktop": True})
url = f"https://www.fragrantica.com/search/?query={quote_plus('Chanel No 5')}"
r = session.get(url, timeout=25)
soup = BeautifulSoup(r.text, "html.parser")

# Chanel No 5 veya 212 iceren linkleri ara
links = []
for a in soup.find_all("a", href=True):
    href = a.get("href", "")
    text = a.get_text(strip=True)
    if "/perfume/" in href and ".html" in href:
        m = re.search(r"-(\d+)\.html", href)
        fid = m.group(1) if m else "?"
        if "chanel" in text.lower() or "212" in str(fid) or "no 5" in text.lower() or "no.5" in text.lower():
            links.append((href, fid, text[:40]))

print("Chanel/212/No5 iceren linkler:", links[:10])

# Alternatif: designers sayfasi - Chanel marka sayfasi
url2 = "https://www.fragrantica.com/designers/Chanel.html"
r2 = session.get(url2, timeout=25)
soup2 = BeautifulSoup(r2.text, "html.parser")
chanel_links = []
for a in soup2.find_all("a", href=True):
    href = a.get("href", "")
    if "/perfume/Chanel/" in href and "No" in a.get_text():
        m = re.search(r"-(\d+)\.html", href)
        chanel_links.append((href, m.group(1) if m else "?"))
print("\nChanel designer sayfasinda No 5 linkleri:", chanel_links[:5])
