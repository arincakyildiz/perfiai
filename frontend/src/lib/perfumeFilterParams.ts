/**
 * Keşfet ve kıyaslama seçici aynı /perfumes query parametrelerini kullanır.
 */

export type PerfumeFacets = {
  accords: string[];
  longevity: string[];
  sillage: string[];
};

export type PerfumeFilterValues = {
  q: string;
  brand: string;
  gender: string;
  season: string;
  sort: string;
  order: "asc" | "desc";
  min_rating: string;
  max_rating: string;
  year_min: string;
  year_max: string;
  longevity: string;
  sillage: string;
  accords: string;
  accord_mode: "any" | "all";
  min_reviews: string;
};

export function parsePerfumeFilterValues(sp: URLSearchParams): PerfumeFilterValues {
  const sortRaw = sp.get("sort") || "";
  const sort = ["rating", "year", "name"].includes(sortRaw) ? sortRaw : "rating";
  return {
    q: sp.get("q") || "",
    brand: sp.get("brand") || "",
    gender: sp.get("gender") || "",
    season: sp.get("season") || "",
    sort,
    order: sp.get("order") === "asc" ? "asc" : "desc",
    min_rating: sp.get("min_rating") || "",
    max_rating: sp.get("max_rating") || "",
    year_min: sp.get("year_min") || "",
    year_max: sp.get("year_max") || "",
    longevity: sp.get("longevity") || "",
    sillage: sp.get("sillage") || "",
    accords: sp.get("accords") || "",
    accord_mode: sp.get("accord_mode") === "all" ? "all" : "any",
    min_reviews: sp.get("min_reviews") || "",
  };
}

/** GET /perfumes için URLSearchParams (kıyaslama seçici + keşfet ile uyumlu) */
export function buildPerfumesListApiSearchParams(
  sp: URLSearchParams,
  opts: { limit: number; page?: number }
): URLSearchParams {
  const v = parsePerfumeFilterValues(sp);
  const out = new URLSearchParams();
  out.set("page", String(opts.page ?? 1));
  out.set("limit", String(opts.limit));
  out.set("sort", v.sort);
  if (v.order === "asc") out.set("order", "asc");
  if (v.q.trim()) out.set("q", v.q.trim());
  if (v.brand) out.set("brand", v.brand);
  if (v.gender) out.set("gender", v.gender);
  if (v.season) out.set("season", v.season);
  if (v.min_rating) out.set("min_rating", v.min_rating);
  if (v.max_rating) out.set("max_rating", v.max_rating);
  if (v.year_min) out.set("year_min", v.year_min);
  if (v.year_max) out.set("year_max", v.year_max);
  if (v.longevity) out.set("longevity", v.longevity);
  if (v.sillage) out.set("sillage", v.sillage);
  if (v.accords.trim()) out.set("accords", v.accords.trim());
  if (v.accord_mode === "all") out.set("accord_mode", "all");
  if (v.min_reviews) out.set("min_reviews", v.min_reviews);
  return out;
}

const SYNC_TO_EXPLORE_KEYS = [
  "q",
  "brand",
  "gender",
  "season",
  "sort",
  "order",
  "min_rating",
  "max_rating",
  "year_min",
  "year_max",
  "longevity",
  "sillage",
  "accords",
  "accord_mode",
  "min_reviews",
] as const;

/** Kıyaslama URL’sindeki filtreleri keşfet sayfasına taşı (ids hariç) */
export function buildExploreUrlFromCompareFilters(sp: URLSearchParams): string {
  const p = new URLSearchParams();
  for (const k of SYNC_TO_EXPLORE_KEYS) {
    const v = sp.get(k);
    if (v) p.set(k, v);
  }
  const s = p.toString();
  return s ? `/explore?${s}` : "/explore";
}

export function hasActivePerfumeFilters(sp: URLSearchParams): boolean {
  const v = parsePerfumeFilterValues(sp);
  return !!(
    v.q.trim() ||
    v.brand ||
    v.gender ||
    v.season ||
    v.min_rating ||
    v.max_rating ||
    v.year_min ||
    v.year_max ||
    v.longevity ||
    v.sillage ||
    v.accords.trim() ||
    v.accord_mode === "all" ||
    v.min_reviews ||
    v.order === "asc" ||
    v.sort !== "rating"
  );
}
