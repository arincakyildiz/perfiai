import { ExploreContent } from "@/components/ExploreContent";
import { apiUrl } from "@/lib/api";

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
    q?: string;
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

async function fetchPerfumes(params: {
  page: number;
  brand?: string;
  gender?: string;
  season?: string;
  sort?: string;
  q?: string;
}): Promise<PerfumeListResponse | null> {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  sp.set("limit", "24");
  sp.set("sort", params.sort || "rating");
  if (params.brand) sp.set("brand", params.brand);
  if (params.q) sp.set("q", params.q);
  if (params.gender) sp.set("gender", params.gender);
  if (params.season) sp.set("season", params.season);

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
  const q = params.q || "";

  const [brands, list] = await Promise.all([
    fetchBrands(),
    fetchPerfumes({
      page,
      brand: brand || undefined,
      gender: gender || undefined,
      season: season || undefined,
      sort,
      q: q || undefined,
    }),
  ]);

  const loadError = !list;
  const perfumes = list?.data ?? [];
  const total = list?.total ?? 0;
  const totalPages = list?.totalPages ?? 1;

  return (
    <ExploreContent
      brands={brands}
      perfumes={perfumes}
      total={total}
      page={list?.page ?? page}
      totalPages={totalPages}
      currentBrand={brand}
      currentGender={gender}
      currentSeason={season}
      currentSort={sort}
      loadError={loadError}
    />
  );
}
