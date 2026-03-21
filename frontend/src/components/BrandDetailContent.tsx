"use client";

import Link from "next/link";
import { PerfumeCardFavoriteWrap } from "@/components/PerfumeCardFavoriteWrap";
import { useLanguage } from "@/contexts/LanguageContext";

type Perfume = {
  id: string;
  brand: string;
  name: string;
  image_url?: string;
  accords?: string[];
  rating?: number;
};

type BrandDetailContentProps = {
  brand: string;
  slug: string;
  perfumes: Perfume[];
  total: number;
  page: number;
  totalPages: number;
};

export function BrandDetailContent({
  brand,
  slug,
  perfumes,
  total,
  page,
  totalPages,
}: BrandDetailContentProps) {
  const { t } = useLanguage();

  return (
    <main className="space-y-8">
      <Link
        href="/brands"
        className="hover-underline inline-flex items-center text-sm text-zinc-500 hover:text-violet-200"
      >
        {t("brands.back")}
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-zinc-50">
          {brand}
        </h1>
        <p className="text-sm text-stone-500 dark:text-zinc-500">
          {total} {t("brands.perfumeCount")} • {t("explore.pageLabel")} {page} / {totalPages}
        </p>
      </div>

      {perfumes.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 px-8 py-16 text-center text-stone-500 dark:border-violet-950/40 dark:bg-violet-950/10 dark:text-zinc-500">
          {t("brands.noPerfumes")}
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
              href={`/brands/${slug}?page=${page - 1}`}
              className="w-full rounded-xl border-2 border-stone-200 bg-white px-5 py-2.5 text-center text-sm font-medium text-stone-700 transition hover:bg-stone-50 hover:text-violet-700 dark:border-violet-950/40 dark:bg-violet-950/10 dark:text-zinc-300 dark:hover:bg-violet-950/20 dark:hover:text-violet-100 sm:w-auto"
            >
              {t("explore.prev")}
            </Link>
          ) : (
            <span className="w-full rounded-xl border border-stone-200 px-5 py-2.5 text-center text-sm text-stone-400 dark:border-violet-950/30 dark:text-zinc-600 sm:w-auto">
              {t("explore.prev")}
            </span>
          )}
          <span className="text-sm text-stone-500 dark:text-zinc-500">
            {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={`/brands/${slug}?page=${page + 1}`}
              className="w-full rounded-xl border-2 border-stone-200 bg-white px-5 py-2.5 text-center text-sm font-medium text-stone-700 transition hover:bg-stone-50 hover:text-violet-700 dark:border-violet-950/40 dark:bg-violet-950/10 dark:text-zinc-300 dark:hover:bg-violet-950/20 dark:hover:text-violet-100 sm:w-auto"
            >
              {t("explore.next")}
            </Link>
          ) : (
            <span className="w-full rounded-xl border border-stone-200 px-5 py-2.5 text-center text-sm text-stone-400 dark:border-violet-950/30 dark:text-zinc-600 sm:w-auto">
              {t("explore.next")}
            </span>
          )}
        </div>
      )}
    </main>
  );
}
