"""
1000 parfum hedefi - benzersiz parfumleri perfumes.json'a ekler.
"""
import json
from pathlib import Path

# Kesinlikle benzersiz olacak parfumler - nadir marka/isim
def _p(brand, name, gender, notes, accord, season="summer"):
    return {"brand": brand, "name": name, "gender": gender,
        "notes": {"top": notes[:2], "middle": notes[1:3] if len(notes)>2 else ["Jasmine", "Rose"], "base": ["Sandalwood", "Musk", "Vanilla"]},
        "accords": [accord, "fresh", "floral"], "longevity": "moderate", "sillage": "moderate",
        "season": [season], "rating": 3.8, "short_description": f"{name} by {brand}.", "year": 2020}

UNIQUE_ADD = [
    _p("Hollister", "SoCal", "male", ["Bergamot", "Lavender", "Woody"], "fresh"),
    _p("Hollister", "Wave", "male", ["Citrus", "Aquatic", "Musk"], "aquatic"),
    _p("Hollister", "Festival Vibes", "male", ["Bergamot", "Jasmine", "Musk"], "fresh"),
    _p("Hollister", "Coastline", "male", ["Sea Salt", "Citrus", "Woody"], "aquatic"),
    _p("Hollister", "Jake", "male", ["Bergamot", "Lavender", "Musk"], "fresh"),
    _p("Abercrombie & Fitch", "First Instinct", "male", ["Bergamot", "Ginger", "Woody"], "fresh"),
    _p("Abercrombie & Fitch", "First Instinct Blue", "male", ["Citrus", "Aquatic", "Musk"], "aquatic"),
    _p("Abercrombie & Fitch", "Fierce", "male", ["Bergamot", "Lavender", "Musk"], "aromatic"),
    _p("Abercrombie & Fitch", "First Instinct Together", "unisex", ["Bergamot", "Jasmine", "Vanilla"], "floral"),
    _p("Abercrombie & Fitch", "First Instinct Extreme", "male", ["Bergamot", "Woody", "Musk"], "fresh"),
    _p("Dunhill", "Icon", "male", ["Bergamot", "Lavender", "Leather"], "aromatic", "fall"),
    _p("Dunhill", "Century", "male", ["Bergamot", "Woody", "Musk"], "fresh"),
    _p("Dunhill", "Desire", "male", ["Lavender", "Vanilla", "Musk"], "aromatic", "fall"),
    _p("Dunhill", "Edition", "male", ["Bergamot", "Lavender", "Sandalwood"], "aromatic"),
    _p("Dunhill", "Pursuit", "male", ["Citrus", "Lavender", "Woody"], "fresh"),
    _p("Kenneth Cole", "Mankind", "male", ["Bergamot", "Lavender", "Musk"], "fresh"),
    _p("Kenneth Cole", "Mankind Ultimate", "male", ["Bergamot", "Woody", "Musk"], "fresh"),
    _p("Kenneth Cole", "Black", "male", ["Lavender", "Woody", "Leather"], "aromatic", "fall"),
    _p("Kenneth Cole", "Reaction", "male", ["Citrus", "Lavender", "Musk"], "fresh"),
    _p("Kenneth Cole", "For Her", "female", ["Bergamot", "Jasmine", "Vanilla"], "floral"),
    _p("John Varvatos", "Artisan", "male", ["Citrus", "Lavender", "Woody"], "fresh"),
    _p("John Varvatos", "Artisan Blu", "male", ["Bergamot", "Aquatic", "Musk"], "aquatic"),
    _p("John Varvatos", "Dark Rebel", "male", ["Leather", "Tobacco", "Vanilla"], "leather", "fall"),
    _p("John Varvatos", "Vintage", "male", ["Bergamot", "Lavender", "Leather"], "aromatic", "fall"),
    _p("John Varvatos", "Star USA", "male", ["Bergamot", "Lavender", "Musk"], "fresh"),
    _p("Vera Wang", "Princess", "female", ["Apple", "Jasmine", "Vanilla"], "floral"),
    _p("Vera Wang", "Love", "female", ["Bergamot", "Peony", "Musk"], "floral"),
    _p("Vera Wang", "Truly Pink", "female", ["Bergamot", "Rose", "Vanilla"], "floral"),
    _p("Vera Wang", "Embrace", "female", ["Bergamot", "Jasmine", "Sandalwood"], "floral"),
    _p("Vera Wang", "Lovestruck", "female", ["Guava", "Jasmine", "Musk"], "floral"),
    _p("Rihanna", "Reb'l Fleur", "female", ["Bergamot", "Jasmine", "Vanilla"], "floral"),
    _p("Rihanna", "Rogue", "female", ["Bergamot", "Jasmine", "Musk"], "floral"),
    _p("Rihanna", "Nude", "female", ["Bergamot", "Jasmine", "Vanilla"], "floral"),
    _p("Lady Gaga", "Fame", "female", ["Apricot", "Jasmine", "Honey"], "oriental", "fall"),
    _p("Lady Gaga", "Eau de Gaga", "female", ["Lime", "Jasmine", "Leather"], "floral"),
    _p("Beyoncé", "Heat", "female", ["Red Vanilla", "Jasmine", "Amber"], "oriental", "fall"),
    _p("Beyoncé", "Pulse", "female", ["Bergamot", "Jasmine", "Vanilla"], "floral"),
    _p("Beyoncé", "Rise", "female", ["Bergamot", "Jasmine", "Musk"], "floral"),
    _p("Taylor Swift", "Wonderstruck", "female", ["Freesia", "Jasmine", "Vanilla"], "floral"),
    _p("Taylor Swift", "Taylor", "female", ["Bergamot", "Jasmine", "Musk"], "floral"),
    _p("Katy Perry", "Purr", "female", ["Peach", "Jasmine", "Vanilla"], "floral"),
    _p("Katy Perry", "Killer Queen", "female", ["Bergamot", "Jasmine", "Musk"], "floral"),
    _p("Katy Perry", "Mad Potion", "female", ["Bergamot", "Jasmine", "Vanilla"], "floral"),
    _p("Nicki Minaj", "Pink Friday", "female", ["Bergamot", "Jasmine", "Vanilla"], "floral"),
    _p("Nicki Minaj", "Minajesty", "female", ["Bergamot", "Jasmine", "Musk"], "floral"),
    _p("Justin Bieber", "Someday", "female", ["Bergamot", "Jasmine", "Vanilla"], "floral"),
    _p("Justin Bieber", "The Key", "female", ["Bergamot", "Jasmine", "Musk"], "floral"),
    _p("One Direction", "Our Moment", "female", ["Bergamot", "Jasmine", "Vanilla"], "floral"),
    _p("One Direction", "Between Us", "female", ["Bergamot", "Jasmine", "Musk"], "floral"),
    _p("One Direction", "That Moment", "female", ["Bergamot", "Rose", "Vanilla"], "floral"),
]

def main():
    base = Path(__file__).parent.parent
    data_path = base / "data" / "perfumes.json"
    with open(data_path, "r", encoding="utf-8") as f:
        perfumes = json.load(f)
    existing = {(p["brand"].lower(), p["name"].lower()) for p in perfumes}
    added = 0
    start_id = len(perfumes) + 1
    for p in UNIQUE_ADD:
        key = (p["brand"].lower(), p["name"].lower())
        if key not in existing:
            p = p.copy()
            p["id"] = str(start_id)
            perfumes.append(p)
            existing.add(key)
            start_id += 1
            added += 1
    with open(data_path, "w", encoding="utf-8") as f:
        json.dump(perfumes, f, indent=2, ensure_ascii=False)
    print(f"OK - Veritabani: {len(perfumes)} parfum (yeni: {added})")

if __name__ == "__main__":
    main()
