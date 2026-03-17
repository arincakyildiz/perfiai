import { BrandsContent } from "@/components/BrandsContent";
import { apiUrl } from "@/lib/api";

type BrandsResponse = {
  brands: string[];
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

export default async function BrandsPage() {
  const brands = await fetchBrands();
  return <BrandsContent brands={brands} />;
}
