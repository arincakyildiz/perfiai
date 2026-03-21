/**
 * Sephora US katalog API — parfümleri data/perfumes.json ile birleştirir.
 *
 * Kullanım:
 *   node scripts/import_sephora_perfumes.mjs --dry-run
 *   node scripts/import_sephora_perfumes.mjs
 *   node scripts/import_sephora_perfumes.mjs --include-gift-sets
 *
 * Mantık:
 * - Ana liste: "Fragrance" üst kategorisi (cat160006) — Sephora’daki tüm parfüm vitrini (~1827).
 * - Cinsiyet: Kadın / Erkek / Unisex alt kategorilerinden productId eşlemesi (yoksa unisex).
 * - Görseller: listelemedeki heroImage → Sephora CDN (imwidth=497).
 * - Notlar / accord detayı: liste API’sinde yok; ürün sayfası API’si ağır olduğu için şimdilik şema doldurulur.
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, "../data/perfumes.json");

const DRY = process.argv.includes("--dry-run");
const INCLUDE_GIFT_SETS = process.argv.includes("--include-gift-sets");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

function sephoraHeaders() {
  return {
    "User-Agent": UA,
    Accept: "application/json",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: "https://www.sephora.com/shop/fragrance",
    Origin: "https://www.sephora.com",
  };
}

/** Cinsiyet ipucu için alt kategoriler (ana liste bunların üst kümesi olabilir) */
const GENDER_CATEGORIES = [
  { id: "cat1230039", gender: "female" },
  { id: "cat1230040", gender: "male" },
  { id: "cat5000004", gender: "unisex" },
];

/** Tüm parfüm / koku vitrini (mum ve hediye setleri de dahil olabilir) */
const PARENT_FRAGRANCE = "cat160006";

const SKIP_NAME =
  /\b(gift\s*set|sampler|discovery\s*set|vault|holiday\s*set|value\s*set|travel\s*set|coffret|duo\s*set|trio\s*set|starter\s*kit)\b/i;
const SKIP_NAME_CANDLE = /\b(candle|diffuser|room\s*spray|home\s*scent|wax\s*melt)\b/i;

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function simplify(n) {
  let x = norm(n);
  x = x.replace(
    /\b(eau de parfum|eau de toilette|eau de cologne|eau de parf|edp|edt|edc|parfum|toilette|cologne|extrait|perfume oil|hair mist|body mist|refill|refillable|travel spray|rollerball|mini|spray)\b/g,
    " "
  );
  x = x.replace(/\s+/g, " ").trim();
  return x;
}

function maxNumericId(perfumes) {
  let m = 0;
  for (const p of perfumes) {
    const n = parseInt(String(p.id), 10);
    if (!Number.isNaN(n) && n > m) m = n;
  }
  return m;
}

function buildBrandIndex(perfumes) {
  /** @type {Map<string, { full: string; simp: string }[]>} */
  const byBrand = new Map();
  for (const p of perfumes) {
    const b = norm(p.brand);
    if (!b) continue;
    const full = norm(p.name);
    const simp = simplify(p.name);
    if (!byBrand.has(b)) byBrand.set(b, []);
    byBrand.get(b).push({ full, simp });
  }
  return byBrand;
}

function isDuplicate(byBrand, brandName, displayName) {
  const b = norm(brandName);
  const fullSep = norm(displayName);
  const simpSep = simplify(displayName);
  const arr = byBrand.get(b) || [];
  for (const ex of arr) {
    if (ex.full === fullSep || ex.simp === simpSep) return true;
    if (ex.simp.length >= 4 && simpSep.includes(ex.simp)) return true;
    if (simpSep.length >= 4 && ex.simp.includes(simpSep)) return true;
  }
  return false;
}

function registerNew(byBrand, brandName, displayName) {
  const b = norm(brandName);
  const full = norm(displayName);
  const simp = simplify(displayName);
  if (!byBrand.has(b)) byBrand.set(b, []);
  byBrand.get(b).push({ full, simp });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchCategoryPage(categoryId, currentPage, pageSize = 200) {
  const url = `https://www.sephora.com/api/v2/catalog/categories/${categoryId}/products?currentPage=${currentPage}&pageSize=${pageSize}`;
  const res = await fetch(url, { headers: sephoraHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
}

async function fetchAllInCategory(categoryId) {
  const first = await fetchCategoryPage(categoryId, 1, 200);
  const total = first.totalProducts ?? 0;
  const batch = first.products?.length || 0;
  if (!batch) return [];
  const pageSize = batch;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const out = [...(first.products || [])];
  for (let p = 2; p <= pages; p++) {
    await sleep(450);
    const j = await fetchCategoryPage(categoryId, p, pageSize);
    out.push(...(j.products || []));
  }
  return out;
}

/** Sephora zoom görsel — daha büyük küçük resim */
function heroToLarge(url) {
  if (!url || typeof url !== "string") return "";
  let u = url.replace(/imwidth=\d+/, "imwidth=497");
  if (!u.includes("imwidth=")) {
    u += (u.includes("?") ? "&" : "?") + "imwidth=497";
  }
  return u;
}

function toPerfumeRecord(p, gender, idStr) {
  const brand = (p.brandName || "Unknown").trim();
  const name = (p.displayName || "Unnamed").trim();
  const rating = parseFloat(p.rating) || 3.5;
  const image_url = heroToLarge(p.heroImage || p.altImage || "");
  const sku = p.currentSku || {};
  const skuId = sku.skuId ? String(sku.skuId) : undefined;
  const listPrice = typeof sku.listPrice === "string" ? sku.listPrice : undefined;
  const reviewCount = parseInt(String(p.reviews || "0"), 10) || 0;
  const year = new Date().getFullYear();

  let short_description = `${name} by ${brand}. Sephora US listing.`;
  if (reviewCount) short_description += ` ${reviewCount} reviews.`;
  if (listPrice) short_description += ` ${listPrice}.`;

  let short_description_tr = `${brand} — ${name}. Sephora ABD kataloğundan.`;
  if (reviewCount) short_description_tr += ` ${reviewCount} değerlendirme.`;

  return {
    id: idStr,
    brand,
    name,
    notes: { top: [], middle: [], base: [] },
    accords: ["aromatic", "fresh"],
    longevity: "moderate",
    sillage: "moderate",
    season: ["spring", "summer", "fall", "winter"],
    gender,
    rating: Math.min(5, Math.max(2.5, rating)),
    short_description,
    year,
    image_url,
    short_description_tr,
    sephoraProductId: p.productId || undefined,
    sephoraSkuId: skuId,
    sephoraReviewCount: reviewCount,
    sephoraListPrice: listPrice,
    source: "sephora",
  };
}

async function buildGenderByProductId() {
  /** @type {Map<string, string>} */
  const map = new Map();
  for (const { id: catId, gender } of GENDER_CATEGORIES) {
    console.log(`Cinsiyet haritası: ${catId} (${gender})…`);
    const list = await fetchAllInCategory(catId);
    for (const product of list) {
      const pid = product.productId;
      if (!pid) continue;
      const prev = map.get(pid);
      if (!prev) map.set(pid, gender);
      else if (prev !== gender) map.set(pid, "unisex");
    }
    await sleep(400);
  }
  console.log(`  → ${map.size} ürün için cinsiyet ipucu`);
  return map;
}

async function main() {
  console.log("Sephora import başlıyor…");
  console.log("  dry-run:", DRY);
  console.log("  include-gift-sets:", INCLUDE_GIFT_SETS);

  const perfumes = JSON.parse(readFileSync(DATA, "utf-8"));
  const byBrand = buildBrandIndex(perfumes);
  let nextId = maxNumericId(perfumes) + 1;

  const genderByPid = await buildGenderByProductId();

  console.log(`Ana kategori ${PARENT_FRAGRANCE} (tüm vitrin) çekiliyor…`);
  const masterList = await fetchAllInCategory(PARENT_FRAGRANCE);
  console.log(`  → ${masterList.length} satır`);

  const added = [];
  let skippedDup = 0;
  let skippedFilter = 0;

  for (const product of masterList) {
    const pid = product.productId;
    if (!pid) continue;
    const dn = product.displayName || "";

    if (!INCLUDE_GIFT_SETS && (SKIP_NAME.test(dn) || SKIP_NAME_CANDLE.test(dn))) {
      skippedFilter++;
      continue;
    }
    if (isDuplicate(byBrand, product.brandName, dn)) {
      skippedDup++;
      continue;
    }

    const gender = genderByPid.get(pid) || "unisex";
    const rec = toPerfumeRecord(product, gender, String(nextId++));
    added.push(rec);
    registerNew(byBrand, product.brandName, dn);
  }

  console.log("\nÖzet:");
  console.log("  Sephora ana vitrin satırı:", masterList.length);
  console.log("  Filtrelenen (set/mum; --include-gift-sets ile kapatılır):", skippedFilter);
  console.log("  Veritabanında zaten var (marka+isim):", skippedDup);
  console.log("  Eklenecek yeni:", added.length);

  if (!DRY && added.length > 0) {
    const merged = perfumes.concat(added);
    writeFileSync(DATA, JSON.stringify(merged, null, 2) + "\n", "utf-8");
    console.log("perfumes.json güncellendi. Toplam kayıt:", merged.length);
  } else if (DRY) {
    console.log("(dry-run: dosya yazılmadı)");
    if (added[0]) console.log("Örnek:", added[0].brand, "—", added[0].name, "|", added[0].image_url?.slice(0, 70));
  } else {
    console.log("Eklenecek yeni yok.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
