"use client";

import { useState } from "react";
import Link from "next/link";
import { FavoriteButton } from "@/components/FavoriteButton";
import { PerfumeCardFavoriteWrap } from "@/components/PerfumeCardFavoriteWrap";
import { AccordsChart } from "@/components/AccordsChart";
import { CommentSection } from "@/components/CommentSection";
import { RatingStars } from "@/components/RatingStars";
import { VerifiedBanner } from "@/components/VerifiedBanner";
import { PerfumeImage } from "@/components/PerfumeImage";
import { useLanguage } from "@/contexts/LanguageContext";

type Notes = {
  top?: string[];
  middle?: string[];
  base?: string[];
};

type Comment = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
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
  comments?: Comment[];
};

type PerfumeDetailContentProps = {
  perfume: Perfume;
  similar: Perfume[];
};

export function PerfumeDetailContent({ perfume, similar }: PerfumeDetailContentProps) {
  const { t, locale } = useLanguage();
  const [displayRating, setDisplayRating] = useState(perfume.rating);
  const [displayCount, setDisplayCount] = useState(perfume.user_rating_count ?? 0);
  const accords = perfume.accords ?? [];
  const season = perfume.season ?? [];
  const description =
    locale === "tr" && perfume.short_description_tr
      ? perfume.short_description_tr
      : perfume.short_description;

  return (
    <main className="space-y-10 sm:space-y-12">
      <Link
        href="/explore"
        className="hover-underline inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-violet-600 dark:text-zinc-500 dark:hover:text-violet-200"
      >
        {t("perfume.back")}
      </Link>

      <VerifiedBanner />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-12">
        <div className="mx-auto w-full max-w-md">
          <div className="overflow-hidden rounded-3xl border-2 border-stone-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-[0_0_60px_rgba(212,165,116,0.05)]">
            <div className="relative aspect-[3/4] overflow-hidden bg-violet-50 dark:bg-zinc-800">
              <PerfumeImage
                src={perfume.image_url}
                alt={`${perfume.brand} ${perfume.name}`}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {(typeof displayRating === "number" ? displayRating : perfume.rating) !== undefined && (
                <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-sm font-semibold text-violet-200 backdrop-blur-sm">
                  ★ {(displayRating ?? perfume.rating)!.toFixed(1)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 dark:text-zinc-500">
              {perfume.brand}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-zinc-50 sm:text-3xl">
              {perfume.name}
            </h1>
            <div className="flex flex-wrap gap-2">
              {perfume.gender && (
                <span className="rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-700 dark:bg-violet-950/40 dark:text-zinc-300">
                  {perfume.gender}
                </span>
              )}
              {season.length > 0 && (
                <span className="rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-700 dark:bg-violet-950/40 dark:text-zinc-300">
                  {season.join(" • ")}
                </span>
              )}
              {typeof perfume.year === "number" && perfume.year > 0 && (
                <span className="rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-700 dark:bg-violet-950/40 dark:text-zinc-300">
                  {perfume.year}
                </span>
              )}
            </div>
            </div>
            <div className="shrink-0 self-start sm:pt-1">
              <FavoriteButton perfumeId={perfume.id} size="lg" />
            </div>
          </div>

          <div className="rounded-2xl border-2 border-stone-200 bg-stone-50 p-4 dark:border-violet-950/40 dark:bg-violet-950/10 sm:p-5">
            <RatingStars
              perfumeId={perfume.id}
              currentRating={displayRating ?? perfume.rating}
              userRatingCount={displayCount}
              onRated={(r, c) => {
                setDisplayRating(r);
                setDisplayCount(c);
              }}
            />
          </div>

          {description && (
            <p className="text-base leading-relaxed text-stone-600 dark:text-zinc-400">
              {description}
            </p>
          )}

          {accords.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-zinc-500">
                {t("perfume.accords")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {accords.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-violet-100 px-4 py-1.5 text-sm text-violet-800 ring-1 ring-violet-300 dark:bg-violet-950/40 dark:text-violet-200/90 dark:ring-violet-600/20"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {accords.length > 0 && (
            <div className="rounded-2xl border-2 border-stone-200 bg-stone-50 p-4 dark:border-violet-950/40 dark:bg-violet-950/10 sm:p-6">
              <AccordsChart accords={accords} />
            </div>
          )}

          {perfume.notes && (
            <div className="grid gap-5 rounded-2xl border-2 border-stone-200 bg-stone-50 p-4 sm:grid-cols-3 sm:gap-6 sm:p-6 dark:border-violet-950/40 dark:bg-violet-950/10">
              <div className="space-y-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500 dark:text-zinc-500">
                  {t("perfume.topNotes")}
                </h3>
                <p className="text-sm text-stone-700 dark:text-zinc-300">
                  {perfume.notes.top?.join(", ") || "—"}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500 dark:text-zinc-500">
                  {t("perfume.middleNotes")}
                </h3>
                <p className="text-sm text-stone-700 dark:text-zinc-300">
                  {perfume.notes.middle?.join(", ") || "—"}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500 dark:text-zinc-500">
                  {t("perfume.baseNotes")}
                </h3>
                <p className="text-sm text-stone-700 dark:text-zinc-300">
                  {perfume.notes.base?.join(", ") || "—"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border-2 border-stone-200 bg-stone-50 p-4 dark:border-violet-950/40 dark:bg-violet-950/10 sm:p-6">
        <CommentSection
          perfumeId={perfume.id}
          initialComments={perfume.comments ?? []}
        />
      </div>

      {similar.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight text-stone-900 dark:text-zinc-100">
            {t("perfume.similar")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <PerfumeCardFavoriteWrap key={p.id} perfume={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
