"""
Bilinen yanlis gorsel eslesmelerini duzeltir.
urls.txt oncelikli; sonra manuel duzeltmeler.
"""

import json
import re
from pathlib import Path

# (brand, name_contains) -> dogru Fragrantica ID
# name_contains: parfum isminde gecmeli (kucuk harf)
# Daha ozel eslesmeler once kontrol edilir (uzun name_part oncelikli)
CORRECTIONS = [
    # Marc Jacobs - ozel varyantlar once (en uzun eslesme)
    ("Marc Jacobs", "daisy love eau so sweet", "54415"),
    ("Marc Jacobs", "daisy love", "49108"),
    ("Marc Jacobs", "daisy eau so fresh", "10858"),
    ("Marc Jacobs", "daisy dream", "25289"),
    ("Marc Jacobs", "daisy marc jacobs", "1361"),
    ("Marc Jacobs", "daisy", "1361"),
    # Diesel - 7542 yanlis (Diesel ana parfum), dogru ID'ler:
    ("Diesel", "bad", "39383"),
    ("Diesel", "spirit", "17821"),  # Fuel For Life Spirit
    ("Diesel", "loverdose tattoo", "18714"),
    ("Diesel", "only the brave tattoo", "14383"),
    # Valentino - Uomo (2014 orijinal) 48583 degil 19558
    ("Valentino", "uomo", "19558"),  # Born in Roma degil, sadece Uomo
    # YSL - Black Opium (31890) ve Opium klasik (93) - black opium once
    ("Yves Saint Laurent", "black opium", "31890"),
    ("Yves Saint Laurent", "opium", "93"),  # Sadece Opium, Black Opium degil
    # Versace - Pour Homme 40031 degil (o Dylan Blue)
    ("Versace", "pour homme", "2318"),  # Dylan Blue degil
    ("Versace", "versace pour homme", "2318"),
    ("Versace", "dylan blue", "40031"),  # Dylan Blue dogru
    # Ralph Lauren - her varyant ayri ID
    ("Ralph Lauren", "polo deep blue", "59650"),
    ("Ralph Lauren", "polo earth", "73298"),
    ("Ralph Lauren", "polo blue", "1198"),
    ("Ralph Lauren", "polo green", "890"),
    ("Ralph Lauren", "polo red", "18598"),
    ("Ralph Lauren", "polo", "890"),  # Sadece "Polo" (yesil) - polo red/blue'dan sonra  # Polo yesil
    # Kenzo - Flower/Kenzo Homme Intense 3403 yanlis (o Kenzo ana)
    ("Kenzo", "flower by kenzo", "72"),
    ("Kenzo", "flower kenzo", "72"),
    ("Kenzo", "kenzo homme intense", "67899"),
    ("Kenzo", "flower in the sky", "18701"),
    # Placeholder olanlar - manuel Fragrantica ID
    ("Bvlgari", "aqva atlantique", "42856"),  # Aqva Pour Homme Atlantiqve
    ("Dolce & Gabbana", "king", "56358"),  # K by Dolce & Gabbana
    # Clone parfumler - orijinalin gorselini kullan
    ("Paris Corner", "majestic woods", "9099"),  # Bleu de Chanel inspired
    ("Maison Alhambra", "amber coco", "640"),  # Tobacco Vanille inspired
    # Benzer parfum gorseli (Fragrantica'da tam eslesme yok)
    ("Guess", "man blue", "15564"),  # Guess Seductive Homme Blue
    ("Guess", "glamour", "9453"),  # Guess Seductive
    ("Guess", "yes", "1591"),  # Guess for Women
    ("Guess", "man urban", "1592"),  # Guess Man
    ("Guess", "suave", "1593"),  # Guess Suede
    ("Guess", "no. 1", "17012"),  # Guess Girl
    ("Guess", "infinite", "43675"),  # Guess 1981
    ("Nautica", "classic", "59563"),  # Voyage benzeri sise
    ("Nautica", "turquoise", "59563"),
    ("Adidas", "tattoo", "1719"),  # Team Force benzeri
    ("Adidas", "impossible", "1719"),
    # Placeholder - Fragrantica'da bulunanlar
    ("Acqua dell'Elba", "ambra", "21909"),  # Ambra yok, Classica Women benzer
    ("Clean Reserve", "radiant nectar", "59860"),
    ("Clean Reserve", "skin", "35244"),
    ("Clean Reserve", "warm cotton", "35233"),
    ("Van Cleef & Arpels", "collection extraordinaire", "6463"),  # Orchidee Vanille (koleksiyon temsili)
    # Placeholder - marka temsili gorsel (Fragrantica'da tam eslesme yok)
    ("Elizabeth Arden", "always yours", "1104"),  # Red Door (marka temsili)
    ("Oriflame", "eclipse man", "39097"),  # Orange Blossom (marka temsili)
    ("Avon", "rare ruby", "82180"),  # Avon Active (Rare serisi temsili)
    ("Avon", "rare opal", "82180"),
    ("Avon", "rare turquoise", "82180"),
    ("Avon", "rare topaz", "82180"),
    ("Avon", "rare jade", "82180"),
    ("Avon", "rare coral", "82180"),
    ("Avon", "rare garnet", "82180"),
    # Massimo Dutti Fragrantica'da yok - placeholder kalsin
]


def extract_fid(url: str) -> str | None:
    m = re.search(r"375x500\.(\d+)\.jpg", url or "")
    return m.group(1) if m else None


def main():
    base = Path(__file__).parent.parent
    data_path = base / "data" / "perfumes.json"

    with open(data_path, "r", encoding="utf-8") as f:
        perfumes = json.load(f)

    # En ozel eslesme once (uzun name_part oncelikli)
    sorted_corrections = sorted(CORRECTIONS, key=lambda x: -len(x[1]))

    fixed = 0
    for p in perfumes:
        brand = p.get("brand", "")
        name = (p.get("name", "") or "").lower()
        url = p.get("image_url", "")
        fid = extract_fid(url)

        for cb, name_part, correct_fid in sorted_corrections:
            if brand == cb and name_part in name and (fid is None or fid != correct_fid):
                # Valentino Uomo: Born in Roma'yi degistirme (48583 dogru)
                if brand == "Valentino" and "born" in name:
                    continue
                p["image_url"] = f"https://fimgs.net/mdimg/perfume-thumbs/375x500.{correct_fid}.jpg"
                fixed += 1
                print(f"  Duzeltildi: {brand} {p.get('name')} -> ID {correct_fid}")
                break

    if fixed:
        with open(data_path, "w", encoding="utf-8") as f:
            json.dump(perfumes, f, indent=2, ensure_ascii=False)
        print(f"\n{fixed} parfum duzeltildi.")
    else:
        print("Duzeltilecek eslesme bulunamadi.")


if __name__ == "__main__":
    main()
