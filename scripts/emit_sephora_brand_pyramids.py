#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Marka + koku adı kataloğu -> data/sephora_brand_pyramids.json (kamuya açık piramitler)."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "sephora_brand_pyramids.json"


def P(
    year: int,
    accords: list[str],
    top: list[str],
    middle: list[str],
    base: list[str],
    desc: str,
) -> dict:
    return {
        "year": year,
        "accords": accords,
        "notes": {"top": top, "middle": middle, "base": base},
        "short_description": desc,
    }


# Anahtarlar: simplifyProductName ile eşleşecek şekilde (küçük harf, gereksiz kelimeler scriptte atılıyor)
CATALOG: dict[str, dict[str, dict]] = {
    "tom ford": {
        "vanilla sex": P(
            2023,
            ["vanilla", "amber", "woody", "powdery"],
            ["Vanilla tincture India"],
            ["Jasmine absolute", "Orris accord"],
            ["Sandalwood", "Vanilla absolute", "Animalis accord"],
            "Tom Ford Vanilla Sex (2023): creamy vanilla, jasmine, sandalwood and soft animalic depth.",
        ),
        "bitter peach": P(
            2020,
            ["fruity", "sweet", "woody", "warm spicy"],
            ["Peach", "Blood orange", "Cardamom"],
            ["Rum absolute", "Jasmine", "Davana"],
            ["Vanilla", "Tonka bean", "Sandalwood", "Cashmeran"],
            "Tom Ford Bitter Peach — boozy peach, rum and warm woods.",
        ),
        "lost cherry": P(
            2018,
            ["sweet", "fruity", "almond", "vanilla"],
            ["Black cherry", "Cherry liqueur", "Bitter almond"],
            ["Turkish rose", "Jasmine sambac", "Peru balsam"],
            ["Tonka bean", "Sandalwood", "Vetiver", "Cedar"],
            "Tom Ford Lost Cherry — cherry liqueur, almond and rose over warm woods.",
        ),
        "tobacco vanille": P(
            2007,
            ["sweet", "warm spicy", "vanilla", "tobacco"],
            ["Tobacco leaf", "Spicy notes"],
            ["Tonka bean", "Tobacco flower", "Vanilla", "Cacao"],
            ["Dried fruits", "Woody notes"],
            "Tom Ford Tobacco Vanille — honeyed tobacco, vanilla and dried fruit.",
        ),
        "black orchid": P(
            2006,
            ["earthy", "warm spicy", "sweet", "chocolate"],
            ["Truffle", "Gardenia", "Black currant", "Ylang-ylang", "Bergamot"],
            ["Orchid", "Spicy notes", "Fruity notes", "Lotus"],
            ["Patchouli", "Mexican chocolate", "Vanilla", "Incense", "Amber", "Sandalwood", "Vetiver"],
            "Tom Ford Black Orchid — dark florals, chocolate patchouli and truffle.",
        ),
        "ombre leather": P(
            2018,
            ["leather", "warm spicy", "woody", "animalic"],
            ["Cardamom"],
            ["Jasmine sambac", "Leather"],
            ["Patchouli", "Amber", "Moss"],
            "Tom Ford Ombré Leather — jasmine, black leather and patchouli.",
        ),
        "electric cherry": P(
            2023,
            ["cherry", "musky", "powdery", "floral"],
            ["Cherry", "Ginger"],
            ["Jasmine sambac", "Pink pepper"],
            ["Ambrettolide", "Musk"],
            "Tom Ford Electric Cherry — bright cherry, jasmine and musk.",
        ),
        "cherry smoke": P(
            2023,
            ["smoky", "cherry", "woody", "leather"],
            ["Sour cherry", "Saffron"],
            ["Leather", "Olive", "Chinese osmanthus"],
            ["Cypriol", "Woody notes", "Smoke"],
            "Tom Ford Cherry Smoke — smoked cherry, leather and woody depth.",
        ),
        "fabulous": P(
            2017,
            ["leather", "vanilla", "warm spicy", "aromatic"],
            ["Clary sage", "Lavender"],
            ["Bitter almond", "Vanilla", "Leather", "Orris"],
            ["Tonka bean", "Leather", "Cashmeran", "Amber", "White woods"],
            "Tom Ford Fucking Fabulous — almond, lavender leather and tonka.",
        ),
        "metallique": P(
            2019,
            ["powdery", "floral", "musky", "aldehydic"],
            ["Aldehydes", "Pink pepper", "Bergamot"],
            ["Heliotrope", "Lily-of-the-valley", "Jasmine"],
            ["Vanilla", "Ambrette", "Sandalwood", "Amber"],
            "Tom Ford Metallique — metallic aldehydes, heliotrope and musk.",
        ),
        "soleil blanc": P(
            2016,
            ["sweet", "coconut", "white floral", "warm spicy"],
            ["Pistachio", "Bergamot", "Cardamom", "Pink pepper"],
            ["Tuberose", "Ylang-ylang", "Jasmine"],
            ["Coconut", "Amber", "Tonka bean", "Benzoin"],
            "Tom Ford Soleil Blanc — solar tuberose, coconut and amber.",
        ),
        "neroli portofino": P(
            2011,
            ["citrus", "white floral", "aromatic", "fresh"],
            ["Bergamot", "Mandarin orange", "Lemon", "Bitter orange", "Lavender", "Rosemary", "Myrtle"],
            ["African orange flower", "Neroli", "Jasmine", "Pittosporum"],
            ["Amber", "Angelica", "Ambrette"],
            "Tom Ford Neroli Portofino — Mediterranean citrus and neroli.",
        ),
        "rose prick": P(
            2020,
            ["rose", "warm spicy", "woody", "patchouli"],
            ["Turkish rose", "Bulgarian rose", "Sichuan pepper"],
            ["Turkish rose", "Bulgarian rose", "May rose"],
            ["Patchouli", "Tonka bean"],
            "Tom Ford Rose Prick — three roses, pepper and patchouli.",
        ),
    },
    "kilian paris": {
        "princess": P(
            2022,
            ["sweet", "powdery", "green", "vanilla"],
            ["Green tea", "Ginger", "Peach", "Apple", "Marshmallow"],
            ["Jasmine"],
            ["Vanilla", "Musk", "Amber"],
            "Kilian Princess — green tea, ginger, marshmallow and vanilla.",
        ),
        "good girl gone bad": P(
            2012,
            ["white floral", "sweet", "tropical", "fruity"],
            ["Osmanthus", "Jasmine", "May rose"],
            ["Indian tuberose", "Narcissus"],
            ["Amber", "Cedar"],
            "Kilian Good Girl Gone Bad — lush white florals and narcotic tuberose.",
        ),
        "angels share": P(
            2020,
            ["warm spicy", "sweet", "woody", "vanilla"],
            ["Cognac"],
            ["Cinnamon", "Tonka bean", "Oak"],
            ["Vanilla", "Praline", "Sandalwood"],
            "Kilian Angels' Share — cognac, cinnamon, oak and praline.",
        ),
        "love don t be shy": P(
            2007,
            ["sweet", "white floral", "gourmand", "citrus"],
            ["Neroli", "Bergamot", "Pink pepper", "Coriander"],
            ["Orange blossom", "Jasmine", "Honeysuckle", "Rose"],
            ["Sugar", "Vanilla", "Caramel", "Musk", "Labdanum", "Civet"],
            "Kilian Love, Don't Be Shy — marshmallow orange blossom and caramel musk.",
        ),
        "love dont be shy eau fraiche": P(
            2022,
            ["citrus", "white floral", "fresh", "sweet"],
            ["Bergamot", "Neroli"],
            ["Orange blossom", "Rose"],
            ["Musk", "Ambroxan"],
            "Kilian Love Don't Be Shy Eau Fraîche — airy neroli, orange blossom and musk.",
        ),
        "straight to heaven": P(
            2007,
            ["warm spicy", "woody", "rum", "vanilla"],
            ["Rum", "Dried fruits", "Patchouli"],
            ["Vanilla", "Cedar", "Musk"],
            ["Amber", "Moss", "Jasmine"],
            "Kilian Straight to Heaven — dark rum, patchouli and cedar.",
        ),
        "black phantom": P(
            2017,
            ["sweet", "coffee", "caramel", "rum"],
            ["Rum", "Sugar cane"],
            ["Coffee", "Caramel", "Almond", "Heliotrope"],
            ["Sandalwood", "Vanilla"],
            "Kilian Black Phantom — rum, coffee, caramel and sandalwood.",
        ),
        "moonlight in heaven": P(
            2016,
            ["citrus", "tropical", "sweet", "rice"],
            ["Grapefruit", "Lemon", "Pink pepper"],
            ["Mango", "Rice", "Coconut"],
            ["Tonka bean", "Vetiver"],
            "Kilian Moonlight in Heaven — mango, rice, coconut and vetiver.",
        ),
        "vodka on the rocks": P(
            2014,
            ["fresh", "aromatic", "citrus", "woody"],
            ["Coriander", "Aldehydes", "Cardamom"],
            ["Rhododendron", "Lily-of-the-valley", "Rose"],
            ["Oakmoss", "Amber", "Sandalwood"],
            "Kilian Vodka on the Rocks — icy aldehydes, spices and cool woods.",
        ),
    },
    "maison margiela": {
        "afternoon delight": P(
            2024,
            ["gourmand", "woody", "sweet", "powdery"],
            ["Bitter almond", "Angelica root"],
            ["Madeleine accord", "Carrot heart", "Ambrette absolute"],
            ["Sandalwood", "Madagascar vanilla", "Musk"],
            "REPLICA Afternoon Delight — almond, madeleine accord, sandalwood and vanilla.",
        ),
        "lazy sunday morning": P(
            2013,
            ["fresh", "powdery", "musky", "floral"],
            ["Aldehydes", "Pear", "Lily-of-the-valley"],
            ["Iris", "Rose absolu", "Orange flower"],
            ["White musk", "Ambrette seeds", "Patchouli"],
            "REPLICA Lazy Sunday Morning — clean linen, iris and white musk.",
        ),
        "jazz club": P(
            2013,
            ["warm spicy", "sweet", "tobacco", "rum"],
            ["Pink pepper", "Lemon", "Neroli"],
            ["Rum", "Clary sage", "Java vetiver oil"],
            ["Tobacco leaf", "Vanilla bean", "Styrax"],
            "REPLICA Jazz Club — rum, tobacco and vanilla.",
        ),
        "by the fireplace": P(
            2015,
            ["woody", "smoky", "sweet", "vanilla"],
            ["Pink pepper", "Orange flower", "Clove oil"],
            ["Chestnut", "Guaiac wood", "Juniper"],
            ["Vanilla", "Cashmeran", "Peru balsam"],
            "REPLICA By the Fireplace — chestnut, smoke, vanilla and woods.",
        ),
        "beach walk": P(
            2012,
            ["coconut", "sweet", "musky", "citrus"],
            ["Bergamot", "Lemon", "Pink pepper"],
            ["Ylang-ylang", "Heliotrope", "Coconut milk"],
            ["Musk", "Cedar", "Benzoin"],
            "REPLICA Beach Walk — coconut, ylang and salty musk.",
        ),
        "bubble bath": P(
            2020,
            ["clean", "soapy", "powdery", "fresh"],
            ["Soap", "Bergamot", "Pink pepper"],
            ["Lavender", "Jasmine", "Rose"],
            ["White musk", "Coconut milk", "Patchouli"],
            "REPLICA Bubble Bath — soap, lavender and coconut musk.",
        ),
        "coffee break": P(
            2019,
            ["coffee", "lavender", "sweet", "powdery"],
            ["Peppermint", "Orange blossom", "Pink pepper"],
            ["Lavender", "Coffee", "Milk"],
            ["Vanilla", "Suede", "Cedar"],
            "REPLICA Coffee Break — lavender, milk coffee and vanilla suede.",
        ),
        "when the rain stops": P(
            2022,
            ["aquatic", "green", "floral", "fresh"],
            ["Bergamot", "Green notes", "Pink pepper"],
            ["Aquatic notes", "Rose", "Jasmine"],
            ["Moss", "Pine needles", "Musk"],
            "REPLICA When the Rain Stops — aquatic greens, rose and wet moss.",
        ),
        "springtime in a park": P(
            2019,
            ["floral", "fresh", "fruity", "green"],
            ["Bergamot", "Mandarin orange", "Pear"],
            ["Lily-of-the-valley", "Jasmine", "Rose"],
            ["Musk", "Vanilla", "Ambroxan"],
            "REPLICA Springtime in a Park — pear, lily-of-the-valley and musk.",
        ),
        "sailing day": P(
            2015,
            ["aquatic", "fresh", "aromatic", "woody"],
            ["Sea notes", "Aldehydes", "Red pepper", "Coriander"],
            ["Juniper", "Amalfi lemon", "Rose"],
            ["Ambergris", "Musk", "Cedar"],
            "REPLICA Sailing Day — sea spray, juniper and ambergris.",
        ),
    },
}

try:
    from sephora_catalog_fragments import EXTRA_CATALOG
except ImportError:
    EXTRA_CATALOG = {}

for b, frags in EXTRA_CATALOG.items():
    CATALOG.setdefault(b, {}).update(frags)


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(CATALOG, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    n = sum(len(v) for v in CATALOG.values())
    print(f"wrote {OUT} — {len(CATALOG)} brands, {n} fragrances")


if __name__ == "__main__":
    main()
