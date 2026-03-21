/**
 * data/sephora_brand_pyramids.json — marka + ürün adından (Sephora heuristic satırlar)
 * kamuya açık / marka piramitlerine dayalı notalar uygular.
 *
 *   node scripts/enrich_sephora_from_brand_catalog.mjs
 *   node scripts/enrich_sephora_from_brand_catalog.mjs --dry-run
 *
 * Varsayılan: yalnızca enrichmentSource === "heuristic" ve fragranticaUrl yok.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { generateShortDescriptionTr } from "./lib/sephora_tr_description.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PERFUMES = join(ROOT, "data/perfumes.json");
const CATALOG = join(ROOT, "data/sephora_brand_pyramids.json");

const DRY = process.argv.includes("--dry-run");

/** @type {Record<string, string>} */
const BRAND_ALIASES = {
  "marc jacobs fragrances": "marc jacobs",
  "giorgio armani": "armani beauty",
  "yves saint laurent": "ysl",
  "rabanne": "rabanne",
  "paco rabanne": "rabanne",
  "kilian": "kilian paris",
  "by kilian": "kilian paris",
  "nest new york": "nest new york",
  "clean reserve": "clean reserve",
  "dolce gabbana": "dolce gabbana",
  "dolce&gabbana": "dolce gabbana",
  "jo malone london": "jo malone london",
  "maison louis marie": "maison louis marie",
  "the 7 virtues": "the 7 virtues",
  "7 virtues": "the 7 virtues",
  "boy smells": "boy smells",
  "forvr mood": "forvr mood",
  "loveshackfancy": "loveshackfancy",
  "love shack fancy": "loveshackfancy",
  "fenty beauty by rihanna": "fenty beauty",
  "rare beauty by selena gomez": "rare beauty",
  "armani beauty": "armani beauty",
  "burberry": "burberry",
  "montale": "montale",
  "ellis brooklyn": "ellis brooklyn",
  "the maker": "the maker",
  "henry rose": "henry rose",
  "born to stand out": "borntostandout",
  "borntostandout": "borntostandout",
  "dedcool": "dedcool",
  "commodity": "commodity",
  "juliette has a gun": "juliette has a gun",
  "gisou": "gisou",
  "josie maran": "josie maran",
  "ceremonia": "ceremonia",
  "emi jay": "emi jay",
  "u beauty": "u beauty",
  "chris collins": "world of chris collins",
  "world of chris collins": "world of chris collins",
  "moroccanoil": "moroccanoil",
  "amika": "amika",
  "pureology": "pureology",
  "evereden": "evereden",
  "charlotte tilbury": "charlotte tilbury",
  "fugazzi": "fugazzi",
  "miu miu": "miu miu",
  "tom ford": "tom ford",
  "skylar": "skylar",
  "by rosie jane": "by rosie jane",
  "sol de janeiro": "sol de janeiro",
  "cyklar": "cyklar",
  "fable mane": "fable mane",
  "harlem perfume co": "harlem perfume co",
  "ariana grande": "ariana grande",
  "nette": "nette",
  "violette fr": "violette fr",
  "mane": "mane",
  "crown affair": "crown affair",
  "bobbi brown": "bobbi brown",
};

function normBrand(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/&/g, " ")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveCatalogKey(brandNorm, catalog) {
  if (catalog[brandNorm]) return brandNorm;
  if (BRAND_ALIASES[brandNorm]) {
    const a = BRAND_ALIASES[brandNorm];
    if (catalog[a]) return a;
  }
  const strip = brandNorm
    .replace(/\s+fragrances$/i, "")
    .replace(/\s+beauty$/i, "")
    .replace(/\s+paris$/i, "")
    .replace(/\s+new york$/i, "")
    .trim();
  if (strip !== brandNorm && catalog[strip]) return strip;
  for (const [k, v] of Object.entries(BRAND_ALIASES)) {
    if (brandNorm === k || brandNorm.includes(k) || k.includes(brandNorm)) {
      if (catalog[v]) return v;
    }
  }
  return catalog[brandNorm] ? brandNorm : null;
}

function simplifyProductName(name) {
  let s = String(name).toLowerCase();
  s = s.normalize("NFD").replace(/\p{M}/gu, "");
  s = s.replace(/\([^)]*\)/g, " ");
  s = s.replace(/\|\s*\d+\s*/g, " ");
  const wi = s.search(/\s+with\s+/);
  if (wi > 4) s = s.slice(0, wi);
  s = s.replace(
    /\b(eau de parfum|eau de toilette|eau de cologne|eau intimite|eau intimit|edp|edt|edc|hair perfume|body perfume|hair body|hair and body|body hair|hair mist|body mist|fragrance mist|perfume mist|hair body mist|body fragrance|perfume oil|rollerball|travel spray|travel|roll on|refill|refillable|mini|spray|set|coffret|duo|trio|gift|discovery|sampler|layering|layer|case|keychain|vault|holiday|value|starter kit|collection|duo perfume|perfume set|fragrance set)\b/gi,
    " "
  );
  s = s.replace(/\b(and|or|x27|replica)\b/gi, " ");
  s = s.replace(/[\u2018\u2019\u201b`']/g, "");
  s = s.replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
  return s;
}

/**
 * @param {string} brand
 * @param {string} name
 * @param {Record<string, Record<string, any>>} catalog
 */
function lookupPyramid(brand, name, catalog) {
  const bn = normBrand(brand);
  const catKey = resolveCatalogKey(bn, catalog);
  if (!catKey) return null;
  const sub = catalog[catKey];
  const sn = simplifyProductName(name);
  if (!sn || sn.length < 2) return null;

  const snNoTailNum =
    catKey === "kayali" ? sn.replace(/\s+\d+$/, "").trim() : sn;
  const fuzzy = snNoTailNum.length >= 3 ? snNoTailNum : sn;

  if (sub[sn]) return sub[sn];
  if (fuzzy !== sn && sub[fuzzy]) return sub[fuzzy];

  let best = null;
  let bestScore = 0;
  for (const [fragKey, data] of Object.entries(sub)) {
    if (fragKey.startsWith("_")) continue;
    if (fuzzy === fragKey) return data;
    const fk = fragKey;
    if (fuzzy.includes(fk) || fk.includes(fuzzy)) {
      const score = Math.min(fk.length, fuzzy.length);
      if (score > bestScore && fk.length >= 4) {
        bestScore = score;
        best = data;
      }
    }
  }
  if (best && bestScore >= 5) return best;

  for (const [fragKey, data] of Object.entries(sub)) {
    if (fragKey.startsWith("_")) continue;
    const words = fragKey.split(" ").filter((w) => w.length > 2);
    if (words.length === 0) continue;
    if (words.every((w) => fuzzy.includes(w))) {
      const score = fragKey.length;
      if (score > bestScore) {
        bestScore = score;
        best = data;
      }
    }
  }
  if (best && bestScore >= 6) return best;
  return null;
}

function applyPyramid(row, py) {
  const notes = py.notes || {};
  row.notes = {
    top: [...(notes.top || [])],
    middle: [...(notes.middle || [])],
    base: [...(notes.base || [])],
  };
  if (py.accords?.length) row.accords = [...py.accords];
  if (typeof py.year === "number" && py.year > 1900 && py.year <= 2035) {
    row.year = py.year;
  }
  const desc = (py.short_description || "").trim();
  if (desc) row.short_description = desc.slice(0, 1200);
  row.enrichmentSource = "catalog";
  row.short_description_tr = generateShortDescriptionTr(row);
}

function main() {
  if (!existsSync(CATALOG)) {
    console.error("Eksik:", CATALOG);
    process.exit(1);
  }
  const catalog = JSON.parse(readFileSync(CATALOG, "utf8"));
  const perfumes = JSON.parse(readFileSync(PERFUMES, "utf8"));

  let updated = 0;
  let skipped = 0;
  for (const row of perfumes) {
    if (row.source !== "sephora") continue;
    if (row.enrichmentSource !== "heuristic") {
      skipped++;
      continue;
    }
    if ((row.fragranticaUrl || "").trim()) {
      skipped++;
      continue;
    }

    const py = lookupPyramid(row.brand, row.name, catalog);
    if (!py) continue;
    applyPyramid(row, py);
    updated++;
  }

  console.log(
    `enrich_sephora_from_brand_catalog: güncellenen=${updated}, atlanan satır=${skipped}, dry-run=${DRY}`
  );
  if (!DRY && updated > 0) {
    writeFileSync(PERFUMES, JSON.stringify(perfumes, null, 2) + "\n", "utf8");
  }
}

main();
