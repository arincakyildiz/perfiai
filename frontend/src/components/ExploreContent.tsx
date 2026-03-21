"use client";

import Link from "next/link";
import { Suspense } from "react";
import { PerfumeCardFavoriteWrap } from "@/components/PerfumeCardFavoriteWrap";
import { ExploreFilters } from "@/components/ExploreFilters";
import { useLanguage } from "@/contexts/LanguageContext";
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

export type ExploreFilterParams = {
  page?: number;
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
};

type ExploreContentProps = {
  brands: string[];
  facets: PerfumeFacets;
  perfumes: Perfume[];
  total: number;
  page: number;
  totalPages: number;
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
  loadError?: boolean;
};

function buildExploreUrl(params: ExploreFilterParams) {
  const sp = new URLSearchParams();
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  if (params.brand) sp.set("brand", params.brand);
  if (params.gender) sp.set("gender", params.gender);
  if (params.season) sp.set("season", params.season);
  if (params.sort && params.sort !== "rating") sp.set("sort", params.sort);
  if (params.order === "asc") sp.set("order", "asc");
  if (params.q) sp.set("q", params.q);
  if (params.min_rating) sp.set("min_rating", params.min_rating);
  if (params.max_rating) sp.set("max_rating", params.max_rating);
  if (params.year_min) sp.set("year_min", params.year_min);
  if (params.year_max) sp.set("year_max", params.year_max);
  if (params.longevity) sp.set("longevity", params.longevity);
  if (params.sillage) sp.set("sillage", params.sillage);
  if (params.accords) sp.set("accords", params.accords);
  if (params.accord_mode === "all") sp.set("accord_mode", "all");
  if (params.min_reviews) sp.set("min_reviews", params.min_reviews);
  const s = sp.toString();
  return s ? `/explore?${s}` : "/explore";
}

export function ExploreContent({
  brands,
  facets,
  perfumes,
  total,
  page,
  totalPages,
  currentBrand,
  currentGender,
  currentSeason,
  currentSort = "rating",
  currentOrder = "desc",
  currentQ = "",
  currentMinRating = "",
  currentMaxRating = "",
  currentYearMin = "",
  currentYearMax = "",
  currentLongevity = "",
  currentSillage = "",
  currentAccords = "",
  currentAccordMode = "any",
  currentMinReviews = "",
  loadError = false,
}: ExploreContentProps) {
  const { t } = useLanguage();
  const currentFilters: ExploreFilterParams = {
    brand: currentBrand,
    gender: currentGender,
    season: currentSeason,
    sort: currentSort,
    order: currentOrder,
    q: currentQ,
    min_rating: currentMinRating,
    max_rating: currentMaxRating,
    year_min: currentYearMin,
    year_max: currentYearMax,
    longevity: currentLongevity,
    sillage: currentSillage,
    accords: currentAccords,
    accord_mode: currentAccordMode,
    min_reviews: currentMinReviews,
  };

  return (
    <main className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-zinc-50">
          {t("explore.title")}
        </h1>
        <p className="text-sm text-stone-500 dark:text-zinc-500">
          {total} {t("explore.subtitle")} • {t("explore.pageLabel")} {page} / {totalPages}
        </p>
      </div>

      {loadError && (
        <div className="rounded-2xl border-2 border-violet-300 bg-violet-50 px-6 py-4 text-violet-800 dark:border-violet-500/50 dark:bg-violet-950/30 dark:text-violet-200">
          <p className="font-medium">{t("explore.loadError")}</p>
        </div>
      )}

      <Suspense
        fallback={
          <div className="h-14 animate-pulse rounded-2xl bg-stone-200 dark:bg-violet-950/10" />
        }
      >
        <ExploreFilters
          brands={brands}
          facets={facets}
          currentBrand={currentBrand}
          currentGender={currentGender}
          currentSeason={currentSeason}
          currentSort={currentSort}
          currentOrder={currentOrder}
          currentQ={currentQ}
          currentMinRating={currentMinRating}
          currentMaxRating={currentMaxRating}
          currentYearMin={currentYearMin}
          currentYearMax={currentYearMax}
          currentLongevity={currentLongevity}
          currentSillage={currentSillage}
          currentAccords={currentAccords}
          currentAccordMode={currentAccordMode}
          currentMinReviews={currentMinReviews}
        />
      </Suspense>

      {perfumes.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-violet-200/50 bg-violet-50/50 px-8 py-16 text-center text-stone-500 dark:border-violet-500/20 dark:bg-violet-950/10 dark:text-zinc-500">
          {t("explore.noResults")}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perfumes.map((p) => (
            <PerfumeCardFavoriteWrap key={p.id} perfume={p} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {page > 1 ? (
            <Link
              href={buildExploreUrl({ ...currentFilters, page: page - 1 })}
              className="w-full rounded-xl border-2 border-violet-200/40 bg-white px-5 py-2.5 text-center text-sm font-medium text-stone-700 transition hover:bg-violet-50 hover:text-violet-700 dark:border-violet-500/20 dark:bg-violet-950/10 dark:text-zinc-300 dark:hover:bg-violet-950/20 dark:hover:text-violet-100 sm:w-auto"
            >
              {t("explore.prev")}
            </Link>
          ) : (
            <span className="w-full rounded-xl border border-stone-200 px-5 py-2.5 text-center text-sm text-stone-400 dark:border-violet-500/20 dark:text-zinc-600 sm:w-auto">
              {t("explore.prev")}
            </span>
          )}
          <span className="text-sm text-stone-500 dark:text-zinc-500">
            {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={buildExploreUrl({ ...currentFilters, page: page + 1 })}
              className="w-full rounded-xl border-2 border-violet-200/40 bg-white px-5 py-2.5 text-center text-sm font-medium text-stone-700 transition hover:bg-violet-50 hover:text-violet-700 dark:border-violet-500/20 dark:bg-violet-950/10 dark:text-zinc-300 dark:hover:bg-violet-950/20 dark:hover:text-violet-100 sm:w-auto"
            >
              {t("explore.next")}
            </Link>
          ) : (
            <span className="w-full rounded-xl border border-stone-200 px-5 py-2.5 text-center text-sm text-stone-400 dark:border-violet-500/20 dark:text-zinc-600 sm:w-auto">
              {t("explore.next")}
            </span>
          )}
        </div>
      )}
    </main>
  );
}
