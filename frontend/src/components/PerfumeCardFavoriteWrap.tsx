"use client";

import Link from "next/link";
import { PerfumeCard } from "@/components/PerfumeCard";
import { FavoriteButton } from "@/components/FavoriteButton";

export type PerfumeCardRef = {
  id: string;
  brand: string;
  name: string;
  image_url?: string;
  accords?: string[];
  rating?: number;
};

type PerfumeCardFavoriteWrapProps = {
  perfume: PerfumeCardRef;
  className?: string;
  linkClassName?: string;
};

export function PerfumeCardFavoriteWrap({
  perfume,
  className = "",
  linkClassName =
    "block h-full rounded-[1.4rem] outline-none ring-2 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:ring-violet-400/45 focus-visible:ring-violet-500/60 dark:hover:ring-violet-400/35",
}: PerfumeCardFavoriteWrapProps) {
  return (
    <div className={`relative ${className}`}>
      <Link href={`/perfume/${perfume.id}`} className={linkClassName}>
        <PerfumeCard perfume={perfume} />
      </Link>
      <div className="absolute left-2 top-12 z-20 sm:left-3 sm:top-14">
        <FavoriteButton perfumeId={perfume.id} size="sm" />
      </div>
    </div>
  );
}
