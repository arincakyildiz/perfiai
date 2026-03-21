#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sephora (source=sephora) kayitlarini Fragrantica ile doldurur; kalanlari
urun adindaki anahtar kelimelerle (heuristic) makul accords/notalar uretir.

  python -u scripts/enrich_sephora_from_fragrantica.py --resume
  python -u scripts/enrich_sephora_from_fragrantica.py --resume --only-missing-year
  python -u scripts/enrich_sephora_from_fragrantica.py --heuristic-only
  python -u scripts/enrich_sephora_from_fragrantica.py --skip-heuristic
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import unicodedata
from pathlib import Path

def log(msg: str) -> None:
    print(msg, flush=True)

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = Path(__file__).resolve().parent
SCRAPER = ROOT / "scraper"
sys.path.insert(0, str(SCRIPTS))
sys.path.insert(0, str(SCRAPER))

from fetch_images_from_search import (  # noqa: E402
    brand_to_slug,
    fetch_designer_perfumes,
    get_session,
    normalize_name,
)
from scrape_fragrantica import scrape_perfume  # noqa: E402

DATA_PATH = ROOT / "data" / "perfumes.json"
MANUAL_OVERRIDES_PATH = ROOT / "data" / "sephora_manual_overrides.json"
_manual_overrides_cache: dict[str, dict] | None = None
DELAY_DESIGNER = 3.5
DELAY_PERFUME = 5.0

# Sephora / ABD vitrin isimleri -> Fragrantica designers/ SLUG (sirayla dene)
BRAND_SLUG_TRIES: dict[str, list[str]] = {
    "rabanne": ["Rabanne", "Paco-Rabanne"],
    "armani beauty": ["Giorgio-Armani"],
    "kayali": ["Kayali-Fragrances"],
    "rare beauty by selena gomez": ["Rare-Beauty"],
    "marc jacobs fragrances": ["Marc-Jacobs"],
    "maison margiela": ["Maison-Martin-Margiela", "Maison-Margiela"],
    "kilian paris": ["By-Kilian", "Kilian"],
    "the 7 virtues": ["The-7-Virtues"],
    "brown girl jane": ["Brown-Girl-Jane"],
    "clean reserve": ["Clean"],
    "dolce&gabbana": ["Dolce-Gabbana"],
    "dolce & gabbana": ["Dolce-Gabbana"],
    "nest new york": ["Nest"],
    "loveshackfancy": ["LoveShackFancy"],
    "skylar": ["Skylar"],
    "by rosie jane": ["By-Rosie-Jane"],
    "sol de janeiro": ["Sol-de-Janeiro"],
    "the maker": ["The-Maker"],
    "montale": ["Montale"],
    "dedcool": ["DedCool"],
    "commodity": ["Commodity"],
    "cyklar": ["CYKLAR"],
    "boy smells": ["Boy-Smells"],
    "born to stand out": ["BORNTOSTANDOUT"],
    "5 sens": ["5-SENS"],
    "fenty beauty by rihanna": ["Fenty", "Rihanna"],
    "charlotte tilbury": ["Charlotte-Tilbury"],
    "henry rose": ["Henry-Rose"],
    "forvr mood": ["FORVR-MOOD"],
    "glossier": ["Glossier"],
    "harlem perfume co.": ["Harlem-Perfume-Co", "Harlem-Perfume-CO"],
    "touchland": ["Touchland"],
    "world of chris collins": ["World-of-Chris-Collins"],
    "salt & stone": ["Salt-Stone"],
    "nette": ["Nette"],
    "juliette has a gun": ["Juliette-Has-A-Gun"],
    "lore": ["LORE"],
    "fugazzi": ["Fugazzi", "FUGAZZI"],
    "evereden": ["Evereden"],
    "fable & mane": ["Fable-Mane"],
    "canopy": ["CANOPY"],
    "gisou": ["Gisou"],
    "amika": ["Amika"],
    "josie maran": ["Josie-Maran"],
    "ceremonia": ["Ceremonia"],
    "patrick ta": ["PATRICK-TA"],
    "mane": ["Mane"],
    "hermes": ["Hermes"],
    "hermès": ["Hermes"],
    "tom ford": ["Tom-Ford"],
    "chanel": ["Chanel"],
    "prada": ["Prada"],
    "versace": ["Versace"],
    "jimmy choo": ["Jimmy-Choo"],
    "gucci": ["Gucci"],
    "burberry": ["Burberry"],
    "yves saint laurent": ["Yves-Saint-Laurent"],
    "miu miu": ["Miu-Miu"],
    "pureology": ["Pureology"],
    "jack black": ["Jack-Black"],
    "phlur": ["Phlur"],
    "jo malone london": ["Jo-Malone-London"],
    "ouai": ["OUAI"],
    "moroccanoil": ["Moroccanoil"],
    "dae": ["dae"],
    "necessaire": ["Necessaire"],
    "bobbi brown": ["Bobbi-Brown"],
    "crown affair": ["Crown-Affair"],
    "emi jay": ["Emi-Jay"],
    "u beauty": ["U-Beauty"],
    "violette_fr": ["VIOLETTE-FR"],
    "oui the people": ["OUI-the-People"],
    "akt london": ["AKT-London"],
    "ariana grande": ["Ariana-Grande"],
    "chris collins": ["World-of-Chris-Collins"],
}


def normalize_brand_key(brand: str) -> str:
    b = (brand or "").strip().lower()
    b = unicodedata.normalize("NFKD", b)
    b = "".join(c for c in b if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", b).strip()


def slugs_for_brand(brand: str) -> list[str]:
    key = normalize_brand_key(brand)
    out: list[str] = []
    seen: set[str] = set()
    for s in BRAND_SLUG_TRIES.get(key, []):
        if s and s not in seen:
            seen.add(s)
            out.append(s)
    primary = brand_to_slug(brand)
    if primary and primary not in seen:
        out.append(primary)
    return out


def merge_designer_perfumes(
    session, slugs: list[str], cache: dict[str, list], delay: float
) -> list[tuple[str, str, str]]:
    """Ayni marka icin birden fazla designer slug listesini birlestir (fid tekil)."""
    merged: list[tuple[str, str, str]] = []
    seen_fid: set[str] = set()
    for slug in slugs:
        if not slug:
            continue
        if slug not in cache:
            log(f"  (marka sayfasi) {slug} …")
            cache[slug] = fetch_designer_perfumes(session, slug)
            time.sleep(delay)
        for item in cache[slug]:
            fid = item[1]
            if fid not in seen_fid:
                seen_fid.add(fid)
                merged.append(item)
    return merged


ACCORD_TR = {
    "fresh spicy": "ferah baharatlı",
    "warm spicy": "sıcak baharatlı",
    "spicy": "baharatlı",
    "citrus": "narenciye",
    "aromatic": "aromatik",
    "fresh": "ferah",
    "amber": "amber",
    "musky": "misk",
    "musk": "misk",
    "woody": "odunsu",
    "lavender": "lavanta",
    "herbal": "bitkisel",
    "floral": "çiçeksi",
    "white floral": "beyaz çiçek",
    "sweet": "tatlı",
    "powdery": "pudralı",
    "fruity": "meyveli",
    "rose": "gül",
    "aquatic": "deniz",
    "vanilla": "vanilya",
    "gourmand": "gurme",
    "oud": "oud",
    "oriental": "oryantal",
    "leather": "deri",
    "green": "yeşil",
    "coconut": "hindistancevizi",
    "coffee": "kahve",
    "honey": "bal",
}

GENDER_TR = {"male": "erkeklere özel", "female": "kadınlara özel", "unisex": "uniseks"}
SEASON_TR = {
    "spring": "ilkbahar",
    "summer": "yaz",
    "fall": "sonbahar",
    "winter": "kış",
}
LONGEVITY_TR = {
    "short": "kısa süreli kalıcılık",
    "moderate": "orta düzey kalıcılık",
    "long": "uzun süreli kalıcılık",
    "very long": "çok uzun süreli kalıcılık",
}
SILLAGE_TR = {
    "soft": "hafif iz",
    "moderate": "orta güçte iz",
    "strong": "güçlü iz",
    "enormous": "çok güçlü iz",
}


def tr_accord(a: str) -> str:
    return ACCORD_TR.get(a.lower().strip(), a)


def generate_short_description_tr(p: dict) -> str:
    accords = [tr_accord(a) for a in (p.get("accords") or [])[:3]]
    gender = GENDER_TR.get(p.get("gender") or "", "herkes için")
    seasons = p.get("season") or []
    lon = LONGEVITY_TR.get(p.get("longevity") or "", "")
    sil = SILLAGE_TR.get(p.get("sillage") or "", "")
    parts = []
    if accords:
        parts.append(f"{', '.join(accords)} notalarıyla öne çıkan, {gender} bir parfüm.")
    else:
        parts.append(f"{gender[0].upper()}{gender[1:]} için özenle formüle edilmiş bir koku.")
    if len(seasons) == 4:
        parts.append("Dört mevsim rahatlıkla kullanılabilir.")
    elif seasons:
        s = " ve ".join(SEASON_TR.get(s, s) for s in map(str, seasons))
        parts.append(f"{s[0].upper()}{s[1:]} ayları için ideal.")
    if lon and sil:
        parts.append(f"{lon[0].upper()}{lon[1:]}, {sil} bırakır.")
    elif lon:
        parts.append(f"{lon[0].upper()}{lon[1:]}.")
    return " ".join(parts)


def sephora_name_for_match(display_name: str) -> str:
    n = (display_name or "").split("|")[0].strip()
    n = re.sub(r"\s+", " ", n)
    return n


def find_fragrantica_url(
    perfume_name: str, designer_perfumes: list[tuple[str, str, str]]
) -> str | None:
    pnorm = normalize_name(perfume_name)
    if not pnorm:
        return None

    def full(h: str) -> str:
        if h.startswith("http"):
            return h
        return "https://www.fragrantica.com" + h

    for url_name, _fid, href in designer_perfumes:
        if normalize_name(url_name) == pnorm:
            return full(href)

    for url_name, _fid, href in designer_perfumes:
        if pnorm in normalize_name(url_name):
            return full(href)

    for url_name, _fid, href in designer_perfumes:
        unorm = normalize_name(url_name)
        if unorm in pnorm:
            return full(href)

    pwords = set(pnorm.split()) - {"mini", "travel", "spray", "with", "and", "the", "eau", "de", "parfum", "toilette", "edp", "edt"}
    thresh = 1 if len(pwords) >= 5 else 2
    best_href = None
    best_score = 0
    for url_name, _fid, href in designer_perfumes:
        unorm = normalize_name(url_name)
        uwords = set(unorm.split())
        common = len(pwords & uwords)
        if common >= thresh and common > best_score:
            best_score = common
            best_href = href

    if best_href:
        return full(best_href)

    if len(pwords) == 1:
        w = next(iter(pwords))
        if len(w) >= 5:
            for url_name, _fid, href in designer_perfumes:
                if w in normalize_name(url_name):
                    return full(href)
    return None


def merge_fragrantica_into_row(row: dict, scraped: dict) -> bool:
    notes = scraped.get("notes") or {}
    accords = scraped.get("accords") or []
    has_notes = any(notes.get(k) for k in ("top", "middle", "base"))
    if not has_notes and len(accords) < 2:
        return False

    row["notes"] = {
        "top": notes.get("top") or [],
        "middle": notes.get("middle") or [],
        "base": notes.get("base") or [],
    }
    row["accords"] = accords if accords else row.get("accords") or ["aromatic", "fresh"]
    row["longevity"] = scraped.get("longevity") or "moderate"
    row["sillage"] = scraped.get("sillage") or "moderate"
    row["season"] = scraped.get("season") or row.get("season")
    row["gender"] = scraped.get("gender") or row.get("gender")
    r = scraped.get("rating") or 0
    if r and r > 0:
        row["rating"] = round(min(5.0, max(2.5, float(r))), 2)
    y = scraped.get("year") or 0
    if y and int(y) > 1900:
        row["year"] = int(y)
    desc = (scraped.get("short_description") or "").strip()
    if desc and len(desc) > 20:
        row["short_description"] = desc[:1200]
    row["short_description_tr"] = generate_short_description_tr(row)
    row["fragranticaUrl"] = scraped.get("source_url")
    row["enrichmentSource"] = "fragrantica"
    return True


# (küçük harf anahtar kelime, accord etiketi, isteğe bağlı nota gösterimi)
KEYWORD_HEURISTICS: list[tuple[str, str, str]] = [
    ("vanilla", "vanilla", "Vanilla"),
    ("musk", "musky", "Musk"),
    ("rose", "rose", "Rose"),
    ("jasmine", "floral", "Jasmine"),
    ("orange blossom", "white floral", "Orange blossom"),
    ("bergamot", "citrus", "Bergamot"),
    ("citrus", "citrus", "Citrus"),
    ("lemon", "citrus", "Lemon"),
    ("mandarin", "citrus", "Mandarin"),
    ("patchouli", "woody", "Patchouli"),
    ("sandalwood", "woody", "Sandalwood"),
    ("cedar", "woody", "Cedar"),
    ("oud", "oud", "Oud"),
    ("amber", "amber", "Amber"),
    ("coconut", "sweet", "Coconut"),
    ("fig", "fruity", "Fig"),
    ("peach", "fruity", "Peach"),
    ("pear", "fruity", "Pear"),
    ("cherry", "fruity", "Cherry"),
    ("strawberry", "fruity", "Strawberry"),
    ("raspberry", "fruity", "Raspberry"),
    ("mango", "fruity", "Mango"),
    ("plum", "fruity", "Plum"),
    ("honey", "sweet", "Honey"),
    ("caramel", "gourmand", "Caramel"),
    ("coffee", "gourmand", "Coffee"),
    ("chocolate", "gourmand", "Chocolate"),
    ("tonka", "sweet", "Tonka bean"),
    ("lavender", "aromatic", "Lavender"),
    ("mint", "fresh", "Mint"),
    ("marine", "aquatic", "Marine"),
    ("aquatic", "aquatic", "Aquatic"),
    ("sea salt", "aquatic", "Sea salt"),
    ("leather", "leather", "Leather"),
    ("tobacco", "warm spicy", "Tobacco"),
    ("pepper", "fresh spicy", "Pepper"),
    ("pink pepper", "fresh spicy", "Pink pepper"),
    ("iris", "powdery", "Iris"),
    ("tuberose", "white floral", "Tuberose"),
    ("lily", "floral", "Lily"),
    ("peony", "floral", "Peony"),
    ("gardenia", "white floral", "Gardenia"),
    ("ylang", "floral", "Ylang-ylang"),
    ("sage", "aromatic", "Sage"),
    ("vetiver", "woody", "Vetiver"),
    ("pineapple", "fruity", "Pineapple"),
    ("apple", "fruity", "Apple"),
    ("blackcurrant", "fruity", "Blackcurrant"),
    ("currant", "fruity", "Currant"),
    ("orchid", "floral", "Orchid"),
    ("lotus", "floral", "Lotus"),
    ("bamboo", "green", "Bamboo"),
    ("green tea", "green", "Green tea"),
    ("tea", "aromatic", "Tea"),
    ("rum", "sweet", "Rum"),
    ("rumin", "sweet", "Rum"),
    ("suede", "leather", "Suede"),
    ("cashmere", "powdery", "Cashmere"),
    ("marshmallow", "sweet", "Marshmallow"),
    ("sugar", "sweet", "Sugar"),
    ("salt", "aquatic", "Salt"),
    ("watermelon", "fruity", "Watermelon"),
    ("dragon fruit", "fruity", "Dragon fruit"),
    ("passion fruit", "fruity", "Passion fruit"),
    ("lychee", "fruity", "Lychee"),
    ("almond", "gourmand", "Almond"),
    ("pistachio", "gourmand", "Pistachio"),
    ("hazelnut", "gourmand", "Hazelnut"),
    ("santal", "woody", "Sandalwood"),
    ("saffron", "warm spicy", "Saffron"),
    ("cardamom", "warm spicy", "Cardamom"),
    ("cinnamon", "warm spicy", "Cinnamon"),
    ("ginger", "fresh spicy", "Ginger"),
    ("neroli", "citrus", "Neroli"),
    ("aldehyd", "fresh", "Aldehydes"),
    ("guava", "fruity", "Guava"),
    ("tangerine", "citrus", "Tangerine"),
    ("banana", "gourmand", "Banana"),
    ("frangipani", "white floral", "Frangipani"),
    ("plumeria", "white floral", "Plumeria"),
    ("matcha", "green", "Matcha"),
    ("pitaya", "fruity", "Dragon fruit"),
    ("star anise", "warm spicy", "Star anise"),
    ("macadamia", "gourmand", "Macadamia"),
    ("white chocolate", "gourmand", "White chocolate"),
    ("eucalyptus", "fresh", "Eucalyptus"),
    ("spearmint", "fresh", "Spearmint"),
    ("seaweed", "aquatic", "Seaweed"),
    ("lavandin", "aromatic", "Lavandin"),
    ("orris", "powdery", "Orris"),
    ("cypriol", "woody", "Cypriol"),
]


def load_manual_overrides() -> dict[str, dict]:
    global _manual_overrides_cache
    if _manual_overrides_cache is not None:
        return _manual_overrides_cache
    out: dict[str, dict] = {}
    if MANUAL_OVERRIDES_PATH.is_file():
        with open(MANUAL_OVERRIDES_PATH, encoding="utf-8") as f:
            raw = json.load(f)
        for k, v in raw.items():
            if isinstance(k, str) and not k.startswith("_") and isinstance(v, dict):
                out[k] = v
    _manual_overrides_cache = out
    return out


def apply_manual_override(row: dict) -> bool:
    """sephora_manual_overrides.json — Fragrantica URL yokken elle doğrulanmış piramit."""
    if row.get("source") != "sephora":
        return False
    if (row.get("fragranticaUrl") or "").strip():
        return False
    pid = (row.get("sephoraProductId") or "").strip()
    if not pid:
        return False
    ov = load_manual_overrides().get(pid)
    if not ov:
        return False
    notes = ov.get("notes") or {}
    row["notes"] = {
        "top": list(notes.get("top") or []),
        "middle": list(notes.get("middle") or []),
        "base": list(notes.get("base") or []),
    }
    if ov.get("accords"):
        row["accords"] = list(ov["accords"])
    y = ov.get("year")
    if y and isinstance(y, int) and 1900 < y <= 2035:
        row["year"] = y
    desc = (ov.get("short_description") or "").strip()
    if desc:
        row["short_description"] = desc[:1200]
    row["enrichmentSource"] = "manual"
    row["short_description_tr"] = generate_short_description_tr(row)
    return True


def apply_heuristic_enrichment(row: dict) -> bool:
    """Fragrantica yok / piramit bos ise isimden accords + top notalar."""
    if row.get("source") != "sephora":
        return False
    if apply_manual_override(row):
        return True
    if row.get("fragranticaUrl"):
        return False
    notes = row.get("notes") or {}
    has_any = any((notes.get(k) or []) for k in ("top", "middle", "base"))
    if has_any:
        return False

    text = ((row.get("name") or "") + " " + (row.get("brand") or "")).lower()
    accords: list[str] = []
    tops: list[str] = []
    seen_a: set[str] = set()

    for needle, accord, label in KEYWORD_HEURISTICS:
        if needle in text:
            if accord not in seen_a:
                seen_a.add(accord)
                accords.append(accord)
            if label not in tops and len(tops) < 8:
                tops.append(label)

    if not accords:
        accords = ["aromatic", "fresh"]

    if not tops:
        tops = [a.replace("-", " ").strip().title() for a in accords[:8] if a]

    row["notes"] = {"top": tops[:8], "middle": [], "base": []}
    row["accords"] = accords[:12]
    row["longevity"] = row.get("longevity") or "moderate"
    row["sillage"] = row.get("sillage") or "moderate"

    ym = re.search(r"\b(19|20)\d{2}\b", row.get("name") or "")
    if ym:
        y = int(ym.group(0))
        if 1950 <= y <= 2035:
            row["year"] = y

    hint = ", ".join(tops[:5]) if tops else ", ".join(accords[:4])
    row["short_description"] = (
        f"{row.get('name')} by {row.get('brand')}. "
        f"Scent profile inferred from product name keywords: {hint}. "
        "See retailer for official note pyramid."
    )
    row["short_description_tr"] = generate_short_description_tr(row)
    row["enrichmentSource"] = "heuristic"
    return True


def sephora_name_looks_like_bundle(name: str) -> bool:
    """Hediye seti / duo / deodorant vb. — Fragrantica'da tek parfüm URL'si genelde yok."""
    n = (name or "").lower()
    needles = (
        " set",
        " duo",
        "discovery",
        "keychain",
        "layering",
        "mini perfume set",
        "body mist set",
        "antiperspirant",
        "deodorant",
        "hair & body",
        " fragrance case",
        "obsessions mini",
        " deluxe ",
        "perfume set",
        "eau de parfum set",
        "travel spray set",
    )
    return any(x in n for x in needles)


def save_perfumes(perfumes: list) -> None:
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(perfumes, f, indent=2, ensure_ascii=False)
        f.write("\n")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument(
        "--start-sleep",
        type=float,
        default=0.0,
        help="Ilk HTTP oncesi bekleme (sn); 429 sonrasi tekrar denemede kullanin",
    )
    ap.add_argument("--delay", type=float, default=DELAY_PERFUME)
    ap.add_argument("--resume", action="store_true", help="fragranticaUrl dolu olanlari atla")
    ap.add_argument(
        "--only-missing-year",
        action="store_true",
        help="Sadece source=sephora ve year alani olmayan (veya null) satirlar",
    )
    ap.add_argument("--skip-heuristic", action="store_true")
    ap.add_argument(
        "--heuristic-only",
        action="store_true",
        help="Sadece isimden tahmin (HTTP yok); eksik Sephora satirlari",
    )
    args = ap.parse_args()

    with open(DATA_PATH, encoding="utf-8") as f:
        perfumes = json.load(f)

    if args.heuristic_only:
        n = 0
        for row in perfumes:
            if row.get("source") != "sephora":
                continue
            if apply_heuristic_enrichment(row):
                n += 1
        log(f"Heuristic-only: {n} satir guncellendi (dry-run={args.dry_run})")
        if not args.dry_run and n:
            save_perfumes(perfumes)
        return

    targets = [p for p in perfumes if p.get("source") == "sephora"]
    if args.only_missing_year:
        targets = [p for p in targets if p.get("year") is None]
    if args.resume:
        targets = [p for p in targets if not (p.get("fragranticaUrl") or "").strip()]
    if args.only_missing_year:
        # Önce tek parfüm satırları (set/duo sona); eşleşme ve 429 isabeti artar
        targets.sort(
            key=lambda p: (
                sephora_name_looks_like_bundle(p.get("name") or ""),
                (p.get("name") or "").lower(),
            )
        )
    if args.limit:
        targets = targets[: args.limit]

    log(f"Fragrantica: {len(targets)} satir (dry-run={args.dry_run})")

    if args.start_sleep and args.start_sleep > 0:
        log(f"Baslangic beklemesi: {args.start_sleep}s…")
        time.sleep(args.start_sleep)

    session = get_session()
    designer_cache: dict[str, list] = {}
    ok = fail = skip = 0

    for i, row in enumerate(targets, 1):
        brand = row.get("brand") or ""
        name_raw = row.get("name") or ""
        match_name = sephora_name_for_match(name_raw)
        slugs = slugs_for_brand(brand)
        if not slugs:
            log(f"  [{i}] -- marka slug yok: {brand}")
            fail += 1
            time.sleep(args.delay)
            continue

        plist = merge_designer_perfumes(session, slugs, designer_cache, DELAY_DESIGNER)
        url = find_fragrantica_url(match_name, plist)
        if not url:
            log(f"  [{i}] -- eslesme yok: {brand} / {match_name!r}")
            fail += 1
            time.sleep(args.delay)
            continue

        pid = row.get("id", str(i))
        data = scrape_perfume(url, str(pid), session)
        time.sleep(args.delay)

        if not data:
            log(f"  [{i}] -- scrape basarisiz: {url}")
            fail += 1
            continue

        if merge_fragrantica_into_row(row, data):
            ok += 1
            log(f"  [{i}] OK: {brand} — {match_name}")
            if not args.dry_run:
                save_perfumes(perfumes)
        else:
            skip += 1
            log(f"  [{i}] (yetersiz veri) {brand} — {match_name}")

    log(f"\nFragrantica ozet: ok={ok}, fail={fail}, skip={skip}")

    if not args.skip_heuristic:
        h = 0
        for row in perfumes:
            if apply_heuristic_enrichment(row):
                h += 1
        log(f"Heuristic tamamlama: {h} satir")
        if not args.dry_run and h:
            save_perfumes(perfumes)

    if args.dry_run:
        log("(dry-run: son kayit yapilmadi - heuristic dry-run da dosya yazmaz)")
    elif ok or (not args.skip_heuristic):
        log(f"Kayit: {DATA_PATH}")


if __name__ == "__main__":
    main()
