/**
 * Her parfüm için accords, gender, season, longevity, sillage verisinden
 * doğal Türkçe kısa açıklama üretir; short_description_tr alanı olarak kaydeder.
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "../data/perfumes.json");

// ─── Çeviriler ────────────────────────────────────────────────────────────────

const ACCORD_TR = {
  "fresh spicy":    "ferah baharatlı",
  "warm spicy":     "sıcak baharatlı",
  "soft spicy":     "yumuşak baharatlı",
  "spicy":          "baharatlı",
  "citrus":         "narenciye",
  "aromatic":       "aromatik",
  "fresh":          "ferah",
  "amber":          "amber",
  "musky":          "misk",
  "musk":           "misk",
  "woody":          "odunsu",
  "lavender":       "lavanta",
  "herbal":         "bitkisel",
  "floral":         "çiçeksi",
  "white floral":   "beyaz çiçek",
  "sweet":          "tatlı",
  "powdery":        "pudralı",
  "fruity":         "meyveli",
  "rose":           "gül",
  "jasmine":        "yasemin",
  "iris":           "iris",
  "tuberose":       "sümbülteber",
  "aquatic":        "deniz",
  "marine":         "deniz",
  "green":          "yeşil/taze",
  "vanilla":        "vanilya",
  "gourmand":       "gurme/yenilebilir",
  "oud":            "oud",
  "oriental":       "oryantal",
  "earthy":         "toprak",
  "smoky":          "dumanlı",
  "leather":        "deri",
  "creamy":         "kremsi",
  "sandalwood":     "sandal ağacı",
  "patchouli":      "paçuli",
  "animalic":       "hayvani",
  "balsamic":       "balsam",
  "incense":        "tütsü",
  "tobacco":        "tütün",
  "honey":          "bal",
  "caramel":        "karamel",
  "coconut":        "hindistancevizi",
  "almond":         "badem",
  "praline":        "pralin",
  "cinnamon":       "tarçın",
  "pepper":         "biber",
  "bergamot":       "bergamot",
  "cedar":          "sedir",
  "vetiver":        "vetiver",
  "cashmeran":      "keşmir",
  "soapy":          "sabunsu",
  "soft":           "yumuşak",
  "clean":          "temiz",
  "rich":           "yoğun",
  "dark":           "koyu",
  "mossy":          "yosunlu",
  "fougere":        "fougère",
  "chypre":         "chypre",
};

const GENDER_TR = {
  male:    "erkeklere özel",
  female:  "kadınlara özel",
  unisex:  "uniseks",
};

const SEASON_TR = {
  spring: "ilkbahar",
  summer: "yaz",
  fall:   "sonbahar",
  winter: "kış",
};

const LONGEVITY_TR = {
  "short":     "kısa süreli kalıcılık",
  "moderate":  "orta düzey kalıcılık",
  "long":      "uzun süre kalıcılık",
  "very long": "çok uzun süre kalıcılık",
};

const SILLAGE_TR = {
  "soft":     "hafif iz",
  "moderate": "orta güçte iz",
  "strong":   "güçlü iz",
  "enormous": "çok güçlü iz",
};

// ─── Üretim fonksiyonu ────────────────────────────────────────────────────────

function trAccord(a) {
  const key = a.toLowerCase().trim();
  return ACCORD_TR[key] || a;
}

function generateTR(p) {
  const accords  = (p.accords  || []).map(trAccord).slice(0, 3);
  const gender   = GENDER_TR[p.gender] || "herkes için";
  const seasons  = (p.season   || []);
  const lon      = LONGEVITY_TR[p.longevity];
  const sil      = SILLAGE_TR[p.sillage];

  const parts = [];

  // Cümle 1 — karakter + cinsiyet
  if (accords.length > 0) {
    const accordStr = accords.join(", ");
    parts.push(`${accordStr} notalarıyla öne çıkan, ${gender} bir parfüm.`);
  } else {
    parts.push(`${gender.charAt(0).toUpperCase() + gender.slice(1)} için özenle formüle edilmiş bir koku.`);
  }

  // Cümle 2 — mevsim
  if (seasons.length === 4) {
    parts.push("Dört mevsim rahatlıkla kullanılabilir.");
  } else if (seasons.length > 0) {
    const s = seasons.map(x => SEASON_TR[x] || x).join(" ve ");
    parts.push(`${s.charAt(0).toUpperCase() + s.slice(1)} ayları için ideal.`);
  }

  // Cümle 3 — kalıcılık ve iz
  if (lon && sil) {
    parts.push(`${lon.charAt(0).toUpperCase() + lon.slice(1)}, ${sil} bırakır.`);
  } else if (lon) {
    parts.push(`${lon.charAt(0).toUpperCase() + lon.slice(1)}.`);
  }

  return parts.join(" ");
}

// ─── Çalıştır ─────────────────────────────────────────────────────────────────

const perfumes = JSON.parse(readFileSync(DATA_PATH, "utf-8"));
let added = 0;

for (const p of perfumes) {
  p.short_description_tr = generateTR(p);
  added++;
}

writeFileSync(DATA_PATH, JSON.stringify(perfumes, null, 2), "utf-8");
console.log(`✓ ${added} parfüme Türkçe açıklama eklendi.`);
