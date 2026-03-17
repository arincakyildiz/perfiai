import { PerfumeDetailContent } from "@/components/PerfumeDetailContent";
import { apiUrl } from "@/lib/api";

type Notes = {
  top?: string[];
  middle?: string[];
  base?: string[];
};

type Perfume = {
  id: string;
  brand: string;
  name: string;
  image_url?: string;
  accords?: string[];
  rating?: number;
  gender?: string;
  season?: string[];
  year?: number;
  short_description?: string;
  notes?: Notes;
};

type SimilarResponse = {
  data: Perfume[];
};

async function fetchPerfume(id: string): Promise<Perfume> {
  const res = await fetch(apiUrl(`/perfumes/${id}`), {
    next: { revalidate: 0 },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Parfüm bulunamadı");
  return res.json();
}

async function fetchSimilar(id: string): Promise<Perfume[]> {
  try {
    const res = await fetch(apiUrl(`/perfumes/${id}/similar?limit=6`), {
      next: { revalidate: 0 },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json: SimilarResponse = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

type PerfumePageProps = {
  params: Promise<{ id: string }>;
};

export default async function PerfumePage({ params }: PerfumePageProps) {
  const { id } = await params;
  const [perfume, similar] = await Promise.all([
    fetchPerfume(id),
    fetchSimilar(id),
  ]);

  return <PerfumeDetailContent perfume={perfume} similar={similar} />;
}
