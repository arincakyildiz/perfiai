import { HomeContent } from "@/components/HomeContent";
import { apiUrl } from "@/lib/api";

type Perfume = {
  id: string;
  brand: string;
  name: string;
  image_url?: string;
  accords?: string[];
  rating?: number;
};

async function fetchTrendingPerfumes(): Promise<Perfume[]> {
  try {
    const res = await fetch(apiUrl("/perfumes?limit=8&sort=rating"), {
      next: { revalidate: 0 },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const perfumes = await fetchTrendingPerfumes();
  return <HomeContent perfumes={perfumes} />;
}
