import { BrandDetailContent } from "@/components/BrandDetailContent";
import { BrandNotFoundContent } from "@/components/BrandNotFoundContent";
import { apiUrl } from "@/lib/api";

type Perfume = {
  id: string;
  brand: string;
  name: string;
  image_url?: string;
  accords?: string[];
  rating?: number;
};

type PerfumeListResponse = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: Perfume[];
};

type BrandPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

function findBrandBySlug(slug: string, brands: string[]): string | null {
  const lower = slug.toLowerCase();
  for (const b of brands) {
    if (
      slugify(b) === lower ||
      b.toLowerCase().replace(/\s+/g, "-") === lower
    ) {
      return b;
    }
  }
  return null;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

async function fetchBrands(): Promise<string[]> {
  try {
    const res = await fetch(apiUrl("/brands"), {
      next: { revalidate: 60 },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.brands || [];
  } catch {
    return [];
  }
}

async function fetchPerfumesByBrand(
  brand: string,
  page: number
): Promise<PerfumeListResponse | null> {
  try {
    const sp = new URLSearchParams();
    sp.set("brand", brand);
    sp.set("page", String(page));
    sp.set("limit", "24");
    sp.set("sort", "rating");

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

export default async function BrandPage({ params, searchParams }: BrandPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const brands = await fetchBrands();
  const brand = findBrandBySlug(slug, brands);

  if (!brand) {
    return <BrandNotFoundContent />;
  }

  const data = await fetchPerfumesByBrand(brand, page);

  if (!data) {
    return (
      <BrandDetailContent
        brand={brand}
        slug={slug}
        perfumes={[]}
        total={0}
        page={1}
        totalPages={1}
      />
    );
  }

  return (
    <BrandDetailContent
      brand={brand}
      slug={slug}
      perfumes={data.data}
      total={data.total}
      page={data.page}
      totalPages={data.totalPages}
    />
  );
}
