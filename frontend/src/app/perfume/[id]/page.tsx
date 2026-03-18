import type { Metadata } from "next";
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
  user_rating_count?: number;
  gender?: string;
  season?: string[];
  year?: number;
  short_description?: string;
  short_description_tr?: string;
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

export async function generateMetadata({
  params,
}: PerfumePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const p = await fetchPerfume(id);
    const title = `${p.brand} ${p.name}`;
    const desc =
      p.short_description_tr || p.short_description || `${p.brand} ${p.name} parfüm detayları`;
    return {
      title,
      description: desc.slice(0, 160),
      openGraph: {
        title,
        description: desc.slice(0, 160),
        images: p.image_url ? [{ url: p.image_url, alt: title }] : undefined,
      },
    };
  } catch {
    return { title: "Parfüm" };
  }
}

export default async function PerfumePage({ params }: PerfumePageProps) {
  const { id } = await params;
  const [perfume, similar] = await Promise.all([
    fetchPerfume(id),
    fetchSimilar(id),
  ]);

  return <PerfumeDetailContent perfume={perfume} similar={similar} />;
}
