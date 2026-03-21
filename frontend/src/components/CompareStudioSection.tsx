"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PerfumeImage } from "@/components/PerfumeImage";
import {
  buildCompareAnalysis,
  longevityNumeric,
  sillageNumeric,
  topByLongevity,
  topByRating,
  topByReviews,
  topBySillage,
  type ComparePerfumeInput,
} from "@/lib/compareAnalysis";

type Props = {
  rows: ComparePerfumeInput[];
  t: (path: string) => string;
};

function label(p: ComparePerfumeInput) {
  return `${p.brand} — ${p.name}`;
}

const MEDALS = ["🥇", "🥈", "🥉", "✦"];

function ScoreBar({
  pct,
  delayMs,
  gradientClass,
}: {
  pct: number;
  delayMs: number;
  gradientClass: string;
}) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), delayMs);
    return () => window.clearTimeout(t);
  }, [delayMs]);

  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-200/90 dark:bg-zinc-800">
      <div
        className={`h-full rounded-full ${gradientClass} shadow-[0_0_12px_rgba(139,92,246,0.35)] transition-[width] duration-[1100ms] ease-out`}
        style={{ width: on ? `${Math.min(100, Math.max(0, pct))}%` : "0%" }}
      />
    </div>
  );
}

export function CompareStudioSection({ rows, t }: Props) {
  const analysis = useMemo(() => buildCompareAnalysis(rows), [rows]);
  const sorted = useMemo(
    () => [...analysis].sort((a, b) => b.communityScore - a.communityScore),
    [analysis]
  );

  const rankOnes = useMemo(
    () => new Set(sorted.filter((x) => x.communityRank === 1).map((x) => x.id)),
    [sorted]
  );

  const bestRatingIds = useMemo(() => new Set(topByRating(rows)), [rows]);
  const bestReviewIds = useMemo(() => new Set(topByReviews(rows)), [rows]);
  const bestLongIds = useMemo(() => new Set(topByLongevity(rows)), [rows]);
  const bestSilIds = useMemo(() => new Set(topBySillage(rows)), [rows]);

  const maxCommunity = Math.max(...analysis.map((a) => a.communityScore), 0.001);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="compare-studio-hero relative overflow-hidden rounded-3xl border border-violet-300/40 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/15 to-amber-400/10 px-6 py-10 shadow-[0_20px_60px_rgba(139,92,246,0.15)] dark:border-violet-500/25 dark:from-violet-950/50 dark:via-fuchsia-950/30 dark:to-amber-950/20 dark:shadow-[0_24px_80px_rgba(0,0,0,0.4)] sm:px-10 sm:py-12">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-400/25 blur-3xl compare-float-slow"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-violet-400/20 blur-3xl compare-float-slow-reverse"
          aria-hidden
        />
        <div className="relative z-[1] space-y-3 text-center sm:text-left">
          <p className="compare-rise inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-violet-900 backdrop-blur-md dark:border-violet-400/20 dark:bg-violet-950/40 dark:text-violet-200 sm:justify-start">
            <span className="inline-block animate-pulse">✨</span>
            {t("compare.studioBadge")}
          </p>
          <h1 className="compare-rise compare-rise-delay-1 bg-gradient-to-r from-violet-800 via-fuchsia-600 to-amber-600 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent dark:from-violet-200 dark:via-pink-300 dark:to-amber-200 sm:text-4xl">
            {t("compare.studioTitle")}
          </h1>
          <p className="compare-rise compare-rise-delay-2 mx-auto max-w-2xl text-sm leading-relaxed text-stone-700 dark:text-zinc-300 sm:mx-0">
            {t("compare.studioSubtitle")}
          </p>
        </div>
      </section>

      {/* Analysis */}
      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-xl font-bold text-stone-900 dark:text-zinc-50 sm:text-2xl">
            {t("compare.analysisTitle")}
          </h2>
          <span className="text-xs font-medium uppercase tracking-wider text-violet-600 dark:text-violet-300">
            {t("compare.analysisHint")}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-stone-600 dark:text-zinc-400">
          {t("compare.analysisExplainer")}
        </p>

        {/* Podium cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sorted.map((p, i) => {
            const medal = MEDALS[Math.min(i, MEDALS.length - 1)];
            const isTop = p.communityRank === 1;
            return (
              <article
                key={p.id}
                className={`compare-podium-card group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white/80 p-4 shadow-lg backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900/70 ${
                  isTop
                    ? "border-amber-400/70 shadow-amber-500/20 ring-2 ring-amber-400/30 dark:border-amber-500/50 dark:shadow-amber-500/10"
                    : "border-violet-200/60 dark:border-violet-800/40"
                }`}
                style={{
                  animation: `compare-rise 0.65s ease-out ${i * 0.09}s both`,
                }}
              >
                {isTop && (
                  <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                      background:
                        "linear-gradient(120deg, transparent 40%, rgba(251,191,36,0.15) 50%, transparent 60%)",
                      backgroundSize: "200% 100%",
                      animation: "compare-shimmer-sweep 3s ease-in-out infinite",
                    }}
                  />
                )}
                <div className="relative flex items-start justify-between gap-2">
                  <span className="text-2xl drop-shadow-sm" aria-hidden>
                    {medal}
                  </span>
                  <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-bold text-violet-800 dark:bg-violet-950 dark:text-violet-200">
                    #{p.communityRank}
                  </span>
                </div>
                <Link
                  href={`/perfume/${p.id}`}
                  className="relative mt-3 block space-y-2 rounded-xl p-1 outline-none ring-2 ring-transparent transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-50/40 hover:shadow-md hover:ring-violet-400/35 dark:hover:bg-violet-950/20 dark:hover:ring-violet-500/25"
                >
                  <div className="relative mx-auto aspect-[3/4] w-full max-w-[100px] overflow-hidden rounded-xl border border-stone-200 dark:border-violet-900/50">
                    <PerfumeImage
                      src={p.image_url}
                      alt={label(p)}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="line-clamp-2 text-center text-xs font-semibold text-violet-800 dark:text-violet-200">
                    {p.brand}
                  </p>
                  <p className="line-clamp-2 text-center text-[11px] text-stone-600 dark:text-zinc-400">
                    {p.name}
                  </p>
                </Link>
                <div className="relative mt-3 rounded-xl bg-gradient-to-br from-violet-50 to-pink-50/80 px-3 py-2 text-center dark:from-violet-950/50 dark:to-pink-950/20">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-300">
                    {t("compare.communityScore")}
                  </p>
                  <p className="text-lg font-bold tabular-nums text-stone-900 dark:text-white">
                    {p.communityScore.toFixed(2)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Insight chips */}
        <div className="flex flex-wrap gap-2">
          {rankOnes.size === 1 ? (
            <span className="compare-chip rounded-full border border-amber-300/60 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 text-xs font-medium text-amber-950 dark:border-amber-600/40 dark:from-amber-950/40 dark:to-orange-950/30 dark:text-amber-100">
              🏆 {t("compare.insightLeader")}{" "}
              <strong className="font-semibold">
                {label(sorted.find((x) => rankOnes.has(x.id))!)}
              </strong>
            </span>
          ) : (
            <span className="compare-chip rounded-full border border-violet-300/50 bg-violet-50 px-4 py-2 text-xs font-medium text-violet-900 dark:border-violet-600/40 dark:bg-violet-950/40 dark:text-violet-100">
              {t("compare.insightTie")}
            </span>
          )}
          {bestRatingIds.size > 0 && (
            <span className="compare-chip rounded-full border border-pink-300/50 bg-pink-50 px-4 py-2 text-xs text-pink-950 dark:border-pink-600/30 dark:bg-pink-950/30 dark:text-pink-100">
              ★ {t("compare.insightBestRating")}{" "}
              {rows
                .filter((r) => bestRatingIds.has(r.id))
                .map((r) => label(r))
                .join(" · ")}
            </span>
          )}
          {bestReviewIds.size > 0 && (rows.find((r) => r.id === [...bestReviewIds][0])?.user_rating_count ?? 0) > 0 && (
            <span className="compare-chip rounded-full border border-cyan-300/50 bg-cyan-50 px-4 py-2 text-xs text-cyan-950 dark:border-cyan-600/30 dark:bg-cyan-950/30 dark:text-cyan-100">
              💬 {t("compare.insightMostReviews")}{" "}
              {rows
                .filter((r) => bestReviewIds.has(r.id))
                .map((r) => label(r))
                .join(" · ")}
            </span>
          )}
          {bestLongIds.size > 0 && longevityNumeric(rows.find((r) => bestLongIds.has(r.id))?.longevity) > 0 && (
            <span className="compare-chip rounded-full border border-emerald-300/50 bg-emerald-50 px-4 py-2 text-xs text-emerald-950 dark:border-emerald-600/30 dark:bg-emerald-950/30 dark:text-emerald-100">
              ⏱ {t("compare.insightLongevity")}{" "}
              {rows
                .filter((r) => bestLongIds.has(r.id))
                .map((r) => label(r))
                .join(" · ")}
            </span>
          )}
          {bestSilIds.size > 0 && sillageNumeric(rows.find((r) => bestSilIds.has(r.id))?.sillage) > 0 && (
            <span className="compare-chip rounded-full border border-indigo-300/50 bg-indigo-50 px-4 py-2 text-xs text-indigo-950 dark:border-indigo-600/30 dark:bg-indigo-950/30 dark:text-indigo-100">
              〰 {t("compare.insightSillage")}{" "}
              {rows
                .filter((r) => bestSilIds.has(r.id))
                .map((r) => label(r))
                .join(" · ")}
            </span>
          )}
        </div>

        {/* Score breakdown bars */}
        <div className="rounded-2xl border border-violet-200/60 bg-white/70 p-5 shadow-inner dark:border-violet-800/40 dark:bg-zinc-900/50 sm:p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-violet-800 dark:text-violet-200">
            {t("compare.visualScores")}
          </h3>
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-xs font-semibold text-stone-500 dark:text-zinc-500">
                {t("compare.barCommunity")}
              </p>
              <div className="space-y-3">
                {analysis.map((p, idx) => (
                  <div key={`c-${p.id}`} className="space-y-1">
                    <div className="flex justify-between gap-2 text-xs">
                      <span className="line-clamp-1 font-medium text-stone-800 dark:text-zinc-200">
                        {p.name}
                      </span>
                      <span className="shrink-0 tabular-nums text-violet-600 dark:text-violet-300">
                        {p.communityScore.toFixed(2)}
                      </span>
                    </div>
                    <ScoreBar
                      pct={(p.communityScore / maxCommunity) * 100}
                      delayMs={120 + idx * 90}
                      gradientClass="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-semibold text-stone-500 dark:text-zinc-500">
                  {t("compare.barRating")}
                </p>
                <div className="space-y-3">
                  {analysis.map((p, idx) => (
                    <div key={`r-${p.id}`} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="line-clamp-1">{p.name}</span>
                        <span className="tabular-nums">
                          {typeof p.rating === "number" ? p.rating.toFixed(1) : "—"}
                        </span>
                      </div>
                      <ScoreBar
                        pct={p.ratingNorm}
                        delayMs={200 + idx * 70}
                        gradientClass="bg-gradient-to-r from-amber-500 to-orange-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold text-stone-500 dark:text-zinc-500">
                  {t("compare.barReviews")}
                </p>
                <div className="space-y-3">
                  {analysis.map((p, idx) => (
                    <div key={`v-${p.id}`} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="line-clamp-1">{p.name}</span>
                        <span className="tabular-nums">{p.user_rating_count ?? 0}</span>
                      </div>
                      <ScoreBar
                        pct={p.reviewNorm}
                        delayMs={260 + idx * 70}
                        gradientClass="bg-gradient-to-r from-cyan-500 to-teal-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
