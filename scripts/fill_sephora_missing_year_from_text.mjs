/**
 * source === "sephora" ve year alanı yokken (Fragrantica gerektirmez)
 * isim + kısa açıklamalarda geçen 4 haneli yılı atar.
 *
 *   node scripts/fill_sephora_missing_year_from_text.mjs
 *   node scripts/fill_sephora_missing_year_from_text.mjs --dry-run
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PERFUMES = join(ROOT, "data/perfumes.json");
const DRY = process.argv.includes("--dry-run");

const MIN_Y = 1980;
const MAX_Y = 2026;

function collectYears(text) {
  if (!text || typeof text !== "string") return [];
  const re = /\b(19|20)\d{2}\b/g;
  const out = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    const y = Number(m[0]);
    if (y >= MIN_Y && y <= MAX_Y) out.push(y);
  }
  return out;
}

function pickYear(text) {
  const ys = collectYears(text);
  if (ys.length === 0) return null;
  return Math.max(...ys);
}

function main() {
  const raw = readFileSync(PERFUMES, "utf8");
  const list = JSON.parse(raw);
  if (!Array.isArray(list)) throw new Error("perfumes.json list değil");

  let filled = 0;
  for (const p of list) {
    if (p.source !== "sephora") continue;
    if (p.year != null) continue;

    const blob = [
      p.name,
      p.short_description,
      p.short_description_tr,
      p.brand,
    ]
      .filter(Boolean)
      .join(" ");

    const y = pickYear(blob);
    if (y != null) {
      if (!DRY) p.year = y;
      filled += 1;
    }
  }

  console.log(
    DRY
      ? `[dry-run] year atanacak Sephora satırı: ${filled}`
      : `year atanan Sephora satırı: ${filled}`
  );

  if (!DRY && filled) {
    writeFileSync(PERFUMES, JSON.stringify(list, null, 2) + "\n", "utf8");
    console.log("Yazıldı:", PERFUMES);
  }
}

main();
