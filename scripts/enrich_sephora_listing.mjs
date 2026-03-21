/**
 * Sephora ana vitrin (cat160006) listesini bir kez çeker;
 * source === "sephora" ve sephoraProductId eşleşen kayıtlara
 * sephoraSkuId, sephoraReviewCount, sephoraListPrice, image_url günceller.
 *
 *   node scripts/enrich_sephora_listing.mjs
 *   node scripts/enrich_sephora_listing.mjs --dry-run
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, "../data/perfumes.json");
const DRY = process.argv.includes("--dry-run");
const PARENT = "cat160006";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

function headers() {
  return {
    "User-Agent": UA,
    Accept: "application/json",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: "https://www.sephora.com/shop/fragrance",
    Origin: "https://www.sephora.com",
  };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchPage(cat, page, pageSize) {
  const url = `https://www.sephora.com/api/v2/catalog/categories/${cat}/products?currentPage=${page}&pageSize=${pageSize}`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchAll() {
  const first = await fetchPage(PARENT, 1, 200);
  const total = first.totalProducts ?? 0;
  const ps = first.products?.length || 200;
  const pages = Math.max(1, Math.ceil(total / ps));
  const out = [...(first.products || [])];
  for (let p = 2; p <= pages; p++) {
    await sleep(400);
    out.push(...((await fetchPage(PARENT, p, ps)).products || []));
  }
  return out;
}

function largeImg(url) {
  if (!url || typeof url !== "string") return "";
  let u = url.replace(/imwidth=\d+/, "imwidth=497");
  if (!u.includes("imwidth=")) u += (u.includes("?") ? "&" : "?") + "imwidth=497";
  return u;
}

async function main() {
  console.log("Sephora listing ile zenginleştirme… dry-run:", DRY);
  const list = await fetchAll();
  /** @type {Map<string, any>} */
  const byPid = new Map();
  for (const p of list) {
    if (p.productId) byPid.set(p.productId, p);
  }
  console.log("Vitrin ürün sayısı:", byPid.size);

  const perfumes = JSON.parse(readFileSync(DATA, "utf-8"));
  let updated = 0;
  for (const row of perfumes) {
    if (row.source !== "sephora" || !row.sephoraProductId) continue;
    const p = byPid.get(row.sephoraProductId);
    if (!p) continue;

    const sku = p.currentSku || {};
    const skuId = sku.skuId ? String(sku.skuId) : undefined;
    const listPrice = typeof sku.listPrice === "string" ? sku.listPrice : undefined;
    const reviewCount = parseInt(String(p.reviews || "0"), 10) || 0;
    const img = largeImg(p.heroImage || p.altImage || "");

    let changed = false;
    if (skuId && row.sephoraSkuId !== skuId) {
      row.sephoraSkuId = skuId;
      changed = true;
    }
    if (reviewCount && row.sephoraReviewCount !== reviewCount) {
      row.sephoraReviewCount = reviewCount;
      changed = true;
    }
    if (listPrice && row.sephoraListPrice !== listPrice) {
      row.sephoraListPrice = listPrice;
      changed = true;
    }
    if (img && row.image_url !== img) {
      row.image_url = img;
      changed = true;
    }
    if (changed) updated++;
  }

  console.log("Güncellenen Sephora kaydı:", updated);
  if (!DRY && updated > 0) {
    writeFileSync(DATA, JSON.stringify(perfumes, null, 2) + "\n", "utf-8");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
