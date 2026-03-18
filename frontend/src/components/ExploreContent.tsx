"use client";

import Link from "next/link";
import { Suspense } from "react";
import { PerfumeCard } from "@/components/PerfumeCard";
import { ExploreFilters } from "@/components/ExploreFilters";
import { useLanguage } from "@/contexts/LanguageContext";

type Perfume = {
  id: string;
  brand: string;
  name: string;
  image_url?: string;
  accords?: string[];
  rating?: number;
  gender?: string;
};

type ExploreContentProps = {
  brands: string[];
  perfumes: Perfume[];
  total: number;
  page: number;
  totalPages: number;
  currentBrand: string;
  currentGender: string;
  currentSeason: string;
  currentSort: string;
  loadError?: boolean;
};

function buildExploreUrl(params: {
  page?: number;
  brand?: string;
  gender?: string;
  season?: string;
  sort?: string;
  q?: string;
}) {
  const sp = new URLSearchParams();
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  if (params.brand) sp.set("brand", params.brand);
  if (params.gender) sp.set("gender", params.gender);
  if (params.season) sp.set("season", params.season);
  if (params.sort && params.sort !== "rating") sp.set("sort", params.sort);
  if (params.q) sp.set("q", params.q);
  const s = sp.toString();
  return s ? `/explore?${s}` : "/explore";
}

export function ExploreContent({
  brands,
  perfumes,
  total,
  page,
  totalPages,
  currentBrand,
  currentGender,
  currentSeason,
  currentSort = "rating",
  loadError = false,
}: ExploreContentProps) {
  const { t } = useLanguage();
  const currentFilters = { brand: currentBrand, gender: currentGender, season: currentSeason, sort: currentSort };

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
          currentBrand={currentBrand}
          currentGender={currentGender}
          currentSeason={currentSeason}
          currentSort={currentSort}
        />
      </Suspense>

      {perfumes.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-violet-200/50 bg-violet-50/50 px-8 py-16 text-center text-stone-500 dark:border-violet-500/20 dark:bg-violet-950/10 dark:text-zinc-500">
          {t("explore.noResults")}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perfumes.map((p) => (
            <Link
              key={p.id}
              href={`/perfume/${p.id}`}
              className="block transition duration-300 hover:-translate-y-1"
            >
              <PerfumeCard perfume={p} />
            </Link>
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
