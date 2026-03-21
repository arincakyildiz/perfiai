/**
 * data/sephora_manual_overrides.json içeriğini perfumes.json'daki
 * source === "sephora" kayıtlarına uygular (sephoraProductId eşleşmesi).
 *
 *   node scripts/merge_sephora_overrides.mjs
 *   node scripts/merge_sephora_overrides.mjs --dry-run
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PERFUMES = join(ROOT, "data/perfumes.json");
const OVERRIDES = join(ROOT, "data/sephora_manual_overrides.json");
const DRY = process.argv.includes("--dry-run");

const ACCORD_TR = {
  "fresh spicy": "ferah baharatlı",
  "warm spicy": "sıcak baharatlı",
  spicy: "baharatlı",
  citrus: "narenciye",
  aromatic: "aromatik",
  fresh: "ferah",
  amber: "amber",
  musky: "misk",
  musk: "misk",
  woody: "odunsu",
  lavender: "lavanta",
  herbal: "bitkisel",
  floral: "çiçeksi",
  "white floral": "beyaz çiçek",
  sweet: "tatlı",
  powdery: "pudralı",
  fruity: "meyveli",
  rose: "gül",
  aquatic: "deniz",
  vanilla: "vanilya",
  gourmand: "gurme",
  oud: "oud",
  oriental: "oryantal",
  leather: "deri",
  green: "yeşil",
  coconut: "hindistancevizi",
  coffee: "kahve",
  honey: "bal",
};

const GENDER_TR = {
  male: "erkeklere özel",
  female: "kadınlara özel",
  unisex: "uniseks",
};

const SEASON_TR = {
  spring: "ilkbahar",
  summer: "yaz",
  fall: "sonbahar",
  winter: "kış",
};

const LONGEVITY_TR = {
  short: "kısa süreli kalıcılık",
  moderate: "orta düzey kalıcılık",
  long: "uzun süreli kalıcılık",
  "very long": "çok uzun süreli kalıcılık",
};

const SILLAGE_TR = {
  soft: "hafif iz",
  moderate: "orta güçte iz",
  strong: "güçlü iz",
  enormous: "çok güçlü iz",
};

function trAccord(a) {
  return ACCORD_TR[a.toLowerCase().trim()] || a;
}

function generateShortDescriptionTr(p) {
  const accords = (p.accords || []).slice(0, 3).map(trAccord);
  const gender = GENDER_TR[p.gender] || "herkes için";
  const seasons = p.season || [];
  const lon = LONGEVITY_TR[p.longevity] || "";
  const sil = SILLAGE_TR[p.sillage] || "";
  const parts = [];
  if (accords.length) {
    parts.push(
      `${accords.join(", ")} notalarıyla öne çıkan, ${gender} bir parfüm.`
    );
  } else {
    parts.push(`${gender[0].toUpperCase()}${gender.slice(1)} için özenle formüle edilmiş bir koku.`);
  }
  if (seasons.length === 4) {
    parts.push("Dört mevsim rahatlıkla kullanılabilir.");
  } else if (seasons.length) {
    const s = seasons.map((x) => SEASON_TR[x] || x).join(" ve ");
    parts.push(`${s[0].toUpperCase()}${s.slice(1)} ayları için ideal.`);
  }
  if (lon && sil) {
    parts.push(`${lon[0].toUpperCase()}${lon.slice(1)}, ${sil} bırakır.`);
  } else if (lon) {
    parts.push(`${lon[0].toUpperCase()}${lon.slice(1)}.`);
  }
  return parts.join(" ");
}

function applyOverride(row, ov) {
  if (ov.notes) {
    row.notes = {
      top: ov.notes.top || [],
      middle: ov.notes.middle || [],
      base: ov.notes.base || [],
    };
  }
  if (ov.accords?.length) row.accords = [...ov.accords];
  if (typeof ov.year === "number" && ov.year > 1900 && ov.year <= 2035) {
    row.year = ov.year;
  }
  if (ov.short_description) {
    row.short_description = ov.short_description.slice(0, 1200);
  }
  const touchesPyramidOrCopy =
    Boolean(ov.notes) ||
    Boolean(ov.accords?.length) ||
    Boolean(ov.short_description);
  if (touchesPyramidOrCopy) {
    row.enrichmentSource = "manual";
    row.short_description_tr = generateShortDescriptionTr(row);
  }
}

function main() {
  const perfumes = JSON.parse(readFileSync(PERFUMES, "utf8"));
  const raw = JSON.parse(readFileSync(OVERRIDES, "utf8"));
  const overrides = Object.fromEntries(
    Object.entries(raw).filter(([k]) => !k.startsWith("_"))
  );

  let n = 0;
  for (const row of perfumes) {
    if (row.source !== "sephora") continue;
    const pid = row.sephoraProductId;
    if (!pid || !overrides[pid]) continue;
    applyOverride(row, overrides[pid]);
    n += 1;
  }

  console.log(`merge_sephora_overrides: ${n} kayıt güncellendi (dry-run=${DRY})`);
  if (!DRY && n) {
    writeFileSync(PERFUMES, JSON.stringify(perfumes, null, 2) + "\n", "utf8");
  }
}

main();
