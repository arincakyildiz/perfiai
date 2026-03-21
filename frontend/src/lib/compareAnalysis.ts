/** Topluluk tercihi: ortalama puan + değerlendirme sayısı (güven artışı) */

export function communityPreferenceScore(
  rating: number | undefined,
  reviewCount: number | undefined
): number {
  const r =
    typeof rating === "number" && !Number.isNaN(rating) ? Math.min(5, Math.max(0, rating)) : 0;
  const n =
    typeof reviewCount === "number" && reviewCount >= 0 ? reviewCount : 0;
  const trust = 1 + Math.log1p(n) * 0.14;
  return r * trust;
}

export function longevityNumeric(s?: string): number {
  const x = (s || "").toLowerCase();
  if (x.includes("very long")) return 4;
  if (x.includes("long") && !x.includes("very")) return 3;
  if (x.includes("moderate")) return 2;
  if (x.includes("short")) return 1;
  return 0;
}

export function sillageNumeric(s?: string): number {
  const x = (s || "").toLowerCase();
  if (x.includes("enormous")) return 4;
  if (x.includes("strong")) return 3;
  if (x.includes("moderate")) return 2;
  if (x.includes("soft")) return 1;
  return 0;
}

export type ComparePerfumeInput = {
  id: string;
  brand: string;
  name: string;
  image_url?: string;
  rating?: number;
  user_rating_count?: number;
  longevity?: string;
  sillage?: string;
};

export type PerfumeAnalysis = ComparePerfumeInput & {
  communityScore: number;
  communityRank: number;
  ratingNorm: number;
  reviewNorm: number;
  longevityNorm: number;
  sillageNorm: number;
};

export function buildCompareAnalysis(
  rows: ComparePerfumeInput[]
): PerfumeAnalysis[] {
  if (rows.length === 0) return [];

  const withScores = rows.map((p) => ({
    ...p,
    communityScore: communityPreferenceScore(p.rating, p.user_rating_count),
  }));

  const sorted = [...withScores].sort(
    (a, b) => b.communityScore - a.communityScore
  );
  const rankMap = new Map<string, number>();
  let rank = 1;
  for (let i = 0; i < sorted.length; i += 1) {
    const cur = sorted[i].communityScore;
    if (i > 0 && Math.abs(cur - sorted[i - 1].communityScore) > 1e-6) {
      rank = i + 1;
    }
    rankMap.set(sorted[i].id, rank);
  }

  const maxRating = Math.max(
    0.001,
    ...rows.map((p) => (typeof p.rating === "number" ? p.rating : 0))
  );
  const maxReviews = Math.max(
    0,
    ...rows.map((p) => p.user_rating_count ?? 0)
  );
  const longVals = rows.map((p) => longevityNumeric(p.longevity));
  const silVals = rows.map((p) => sillageNumeric(p.sillage));
  const maxLong = Math.max(0.001, ...longVals);
  const maxSil = Math.max(0.001, ...silVals);

  return rows.map((p) => ({
    ...p,
    communityScore: communityPreferenceScore(p.rating, p.user_rating_count),
    communityRank: rankMap.get(p.id) ?? rows.length,
    ratingNorm:
      (typeof p.rating === "number" ? p.rating : 0) / maxRating * 100,
    reviewNorm:
      maxReviews > 0 ? ((p.user_rating_count ?? 0) / maxReviews) * 100 : 0,
    longevityNorm: (longevityNumeric(p.longevity) / maxLong) * 100,
    sillageNorm: (sillageNumeric(p.sillage) / maxSil) * 100,
  }));
}

export function topByRating(rows: ComparePerfumeInput[]): string[] {
  const max = Math.max(
    ...rows.map((p) => (typeof p.rating === "number" ? p.rating : -1))
  );
  if (max < 0) return [];
  return rows
    .filter((p) => typeof p.rating === "number" && p.rating === max)
    .map((p) => p.id);
}

export function topByReviews(rows: ComparePerfumeInput[]): string[] {
  const max = Math.max(...rows.map((p) => p.user_rating_count ?? 0));
  if (max <= 0) return [];
  return rows.filter((p) => (p.user_rating_count ?? 0) === max).map((p) => p.id);
}

export function topByLongevity(rows: ComparePerfumeInput[]): string[] {
  const max = Math.max(...rows.map((p) => longevityNumeric(p.longevity)));
  if (max <= 0) return [];
  return rows
    .filter((p) => longevityNumeric(p.longevity) === max)
    .map((p) => p.id);
}

export function topBySillage(rows: ComparePerfumeInput[]): string[] {
  const max = Math.max(...rows.map((p) => sillageNumeric(p.sillage)));
  if (max <= 0) return [];
  return rows
    .filter((p) => sillageNumeric(p.sillage) === max)
    .map((p) => p.id);
}

