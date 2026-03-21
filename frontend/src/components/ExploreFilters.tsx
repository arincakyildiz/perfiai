"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { PerfumeFilterPanel } from "@/components/PerfumeFilterPanel";
import type { PerfumeFacets } from "@/lib/perfumeFilterParams";

type ExploreFiltersProps = {
  brands: string[];
  facets: PerfumeFacets;
  currentBrand: string;
  currentGender: string;
  currentSeason: string;
  currentSort: string;
  currentOrder: string;
  currentQ: string;
  currentMinRating: string;
  currentMaxRating: string;
  currentYearMin: string;
  currentYearMax: string;
  currentLongevity: string;
  currentSillage: string;
  currentAccords: string;
  currentAccordMode: string;
  currentMinReviews: string;
};

export function ExploreFilters({
  brands,
  facets,
  currentBrand,
  currentGender,
  currentSeason,
  currentSort,
  currentOrder,
  currentQ,
  currentMinRating,
  currentMaxRating,
  currentYearMin,
  currentYearMax,
  currentLongevity,
  currentSillage,
  currentAccords,
  currentAccordMode,
  currentMinReviews,
}: ExploreFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pushFilters = useCallback(
    (patch: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      for (const [k, v] of Object.entries(patch)) {
        if (v === undefined || v === "") params.delete(k);
        else params.set(k, v);
      }
      router.push(`/explore?${params.toString()}`);
    },
    [router, searchParams]
  );

  const onClear = useCallback(() => {
    router.push("/explore");
  }, [router]);

  const merged = useMemo(
    () => ({
      q: currentQ,
      brand: currentBrand,
      gender: currentGender,
      season: currentSeason,
      sort: currentSort,
      order: (currentOrder === "asc" ? "asc" : "desc") as "asc" | "desc",
      min_rating: currentMinRating,
      max_rating: currentMaxRating,
      year_min: currentYearMin,
      year_max: currentYearMax,
      longevity: currentLongevity,
      sillage: currentSillage,
      accords: currentAccords,
      accord_mode: (currentAccordMode === "all" ? "all" : "any") as "any" | "all",
      min_reviews: currentMinReviews,
    }),
    [
      currentQ,
      currentBrand,
      currentGender,
      currentSeason,
      currentSort,
      currentOrder,
      currentMinRating,
      currentMaxRating,
      currentYearMin,
      currentYearMax,
      currentLongevity,
      currentSillage,
      currentAccords,
      currentAccordMode,
      currentMinReviews,
    ]
  );

  return (
    <PerfumeFilterPanel
      brands={brands}
      facets={facets}
      values={merged}
      pushFilters={pushFilters}
      onClear={onClear}
    />
  );
}
