import { ExploreContent } from "@/components/ExploreContent";
import { apiUrl } from "@/lib/api";
import type { PerfumeFacets } from "@/lib/perfumeFilterParams";

type Perfume = {
  id: string;
  brand: string;
  name: string;
  image_url?: string;
  accords?: string[];
  rating?: number;
  gender?: string;
};

type PerfumeListResponse = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: Perfume[];
};

type BrandsResponse = {
  brands: string[];
};

type ExplorePageProps = {
  searchParams: Promise<{
    page?: string;
    brand?: string;
    gender?: string;
    season?: string;
    sort?: string;
    order?: string;
    q?: string;
    min_rating?: string;
    max_rating?: string;
    year_min?: string;
    year_max?: string;
    longevity?: string;
    sillage?: string;
    accords?: string;
    accord_mode?: string;
    min_reviews?: string;
  }>;
};

async function fetchBrands(): Promise<string[]> {
  try {
    const res = await fetch(apiUrl("/brands"), {
      next: { revalidate: 60 },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json: BrandsResponse = await res.json();
    return json.brands || [];
  } catch {
    return [];
  }
}

async function fetchPerfumeFacets(): Promise<PerfumeFacets> {
  try {
    const res = await fetch(apiUrl("/perfume-facets"), { cache: "no-store" });
    if (!res.ok) return { accords: [], longevity: [], sillage: [] };
    return res.json();
  } catch {
    return { accords: [], longevity: [], sillage: [] };
  }
}

async function fetchPerfumes(params: {
  page: number;
  brand?: string;
  gender?: string;
  season?: string;
  sort?: string;
  order?: string;
  q?: string;
  min_rating?: string;
  max_rating?: string;
  year_min?: string;
  year_max?: string;
  longevity?: string;
  sillage?: string;
  accords?: string;
  accord_mode?: string;
  min_reviews?: string;
}): Promise<PerfumeListResponse | null> {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  sp.set("limit", "24");
  sp.set("sort", params.sort || "rating");
  if (params.order === "asc") sp.set("order", "asc");
  if (params.brand) sp.set("brand", params.brand);
  if (params.q) sp.set("q", params.q);
  if (params.gender) sp.set("gender", params.gender);
  if (params.season) sp.set("season", params.season);
  if (params.min_rating) sp.set("min_rating", params.min_rating);
  if (params.max_rating) sp.set("max_rating", params.max_rating);
  if (params.year_min) sp.set("year_min", params.year_min);
  if (params.year_max) sp.set("year_max", params.year_max);
  if (params.longevity) sp.set("longevity", params.longevity);
  if (params.sillage) sp.set("sillage", params.sillage);
  if (params.accords) sp.set("accords", params.accords);
  if (params.accord_mode === "all") sp.set("accord_mode", "all");
  if (params.min_reviews) sp.set("min_reviews", params.min_reviews);

  try {
    const res = await fetch(apiUrl(`/perfumes?${sp.toString()}`), {
      next: { revalidate: 0 },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const brand = params.brand || "";
  const gender = params.gender || "";
  const season = params.season || "";
  const sort = ["rating", "year", "name"].includes(params.sort || "")
    ? params.sort!
    : "rating";
  const order = params.order === "asc" ? "asc" : "desc";
  const q = params.q || "";
  const min_rating = params.min_rating || "";
  const max_rating = params.max_rating || "";
  const year_min = params.year_min || "";
  const year_max = params.year_max || "";
  const longevity = params.longevity || "";
  const sillage = params.sillage || "";
  const accords = params.accords || "";
  const accord_mode = params.accord_mode === "all" ? "all" : "any";
  const min_reviews = params.min_reviews || "";

  const [brands, facets, list] = await Promise.all([
    fetchBrands(),
    fetchPerfumeFacets(),
    fetchPerfumes({
      page,
      brand: brand || undefined,
      gender: gender || undefined,
      season: season || undefined,
      sort,
      order,
      q: q || undefined,
      min_rating: min_rating || undefined,
      max_rating: max_rating || undefined,
      year_min: year_min || undefined,
      year_max: year_max || undefined,
      longevity: longevity || undefined,
      sillage: sillage || undefined,
      accords: accords || undefined,
      accord_mode,
      min_reviews: min_reviews || undefined,
    }),
  ]);

  const loadError = !list;
  const perfumes = list?.data ?? [];
  const total = list?.total ?? 0;
  const totalPages = list?.totalPages ?? 1;

  return (
    <ExploreContent
      brands={brands}
      facets={facets}
      perfumes={perfumes}
      total={total}
      page={list?.page ?? page}
      totalPages={totalPages}
      currentBrand={brand}
      currentGender={gender}
      currentSeason={season}
      currentSort={sort}
      currentOrder={order}
      currentQ={q}
      currentMinRating={min_rating}
      currentMaxRating={max_rating}
      currentYearMin={year_min}
      currentYearMax={year_max}
      currentLongevity={longevity}
      currentSillage={sillage}
      currentAccords={accords}
      currentAccordMode={accord_mode}
      currentMinReviews={min_reviews}
      loadError={loadError}
    />
  );
}
