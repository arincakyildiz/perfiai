"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PerfumeImage } from "@/components/PerfumeImage";
import { CompareStudioSection } from "@/components/CompareStudioSection";
import { ComparePickerContent } from "@/components/ComparePickerContent";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/lib/api";
import { buildCompareAnalysis } from "@/lib/compareAnalysis";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { authPrimaryCtaLgClassName } from "@/lib/authUi";

type Notes = {
  top?: string[];
  middle?: string[];
  base?: string[];
};

type PerfumeFull = {
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
  longevity?: string;
  sillage?: string;
};

const MAX = 4;
const MIN = 2;

export function CompareContent() {
  const { t, locale } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<PerfumeFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const raw = searchParams.get("ids") || "";
    const ids = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, MAX);

    if (ids.length < MIN) {
      setError("short");
      setRows([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const results = await Promise.all(
      ids.map(async (id) => {
        try {
          const res = await fetch(apiUrl(`/perfumes/${id}`));
          if (!res.ok) return null;
          return (await res.json()) as PerfumeFull;
        } catch {
          return null;
        }
      })
    );

    const ok = results.filter((x): x is PerfumeFull => x != null);
    if (ok.length < MIN) {
      setError("fetch");
      setRows(ok);
    } else {
      setRows(ok);
    }
    setLoading(false);
  }, [searchParams]);

  useEffect(() => {
    if (authLoading || !user) return;
    void load();
  }, [load, authLoading, user]);

  const communityLeaders = useMemo(() => {
    if (rows.length < MIN) return new Set<string>();
    const a = buildCompareAnalysis(rows);
    return new Set(a.filter((x) => x.communityRank === 1).map((x) => x.id));
  }, [rows]);

  if (authLoading) {
    return (
      <main className="space-y-6">
        <div className="h-10 w-56 animate-pulse rounded-xl bg-stone-200 dark:bg-violet-950/20" />
        <div className="h-48 animate-pulse rounded-2xl bg-stone-200/80 dark:bg-violet-950/15" />
      </main>
    );
  }

  if (!user) {
    const rawGuest = searchParams.get("ids") || "";
    const guestPartialIds = rawGuest
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, MAX);

    return (
      <main className="relative isolate min-h-[70vh] pb-16">
        <div
          aria-hidden
          className="pointer-events-none select-none blur-[9px] brightness-[0.88] contrast-[0.92] saturate-[0.85] dark:brightness-[0.72] dark:contrast-[0.9] sm:blur-[11px]"
        >
          <ComparePickerContent initialSelectedIds={guestPartialIds} />
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 flex justify-center bg-gradient-to-b from-white/55 via-violet-100/25 to-white/65 dark:from-zinc-950/60 dark:via-violet-950/20 dark:to-zinc-950/70 px-4 pt-10 sm:pt-16">
          <div className="pointer-events-auto h-fit w-full max-w-lg rounded-3xl border-2 border-violet-300/70 bg-white/92 p-8 text-center shadow-[0_24px_80px_rgba(139,92,246,0.2)] backdrop-blur-xl dark:border-violet-500/40 dark:bg-zinc-900/92 dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              {t("compare.previewBadge")}
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 dark:text-zinc-50 sm:text-3xl">
              {t("compare.title")}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-zinc-400">
              {t("compare.previewTeaser")}
            </p>
            <p className="mt-2 text-sm text-stone-500 dark:text-zinc-500">
              {t("compare.loginRequired")}
            </p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("perfiai:open-auth"))}
              className={`${authPrimaryCtaLgClassName} mt-6`}
            >
              {t("compare.loginToCompare")}
            </button>
            <div className="mt-5">
              <Link
                href="/explore"
                className="text-sm font-medium text-violet-600 underline-offset-4 transition-all duration-200 hover:underline hover:text-pink-600 dark:text-violet-300 dark:hover:text-pink-300"
              >
                {t("compare.browseWithoutCompare")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="space-y-8">
        <div className="relative overflow-hidden rounded-3xl border border-violet-200/50 bg-gradient-to-br from-violet-100/80 to-pink-100/50 px-8 py-16 dark:border-violet-800/40 dark:from-violet-950/40 dark:to-pink-950/20">
          <div className="compare-float-slow pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-400/30 blur-2xl" />
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
            <div className="flex gap-1 text-2xl">
              <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
                ✨
              </span>
              <span className="animate-bounce" style={{ animationDelay: "120ms" }}>
                🔮
              </span>
              <span className="animate-bounce" style={{ animationDelay: "240ms" }}>
                ✨
              </span>
            </div>
            <div className="h-3 w-full max-w-xs overflow-hidden rounded-full bg-white/60 dark:bg-zinc-800">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-violet-500 to-pink-500" />
            </div>
            <p className="text-sm font-medium text-violet-800 dark:text-violet-200">
              {t("compare.loadingStudio")}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error === "short") {
    const raw = searchParams.get("ids") || "";
    const partialIds = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, MAX);
    return <ComparePickerContent initialSelectedIds={partialIds} />;
  }

  if (error === "fetch" || rows.length < MIN) {
    return (
      <main className="space-y-6">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-zinc-50">
          {t("compare.title")}
        </h1>
        <p className="text-stone-600 dark:text-zinc-400">{t("compare.loadError")}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/compare"
            className="inline-block rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white"
          >
            {t("compare.pickAgain")}
          </Link>
          <Link
            href="/favorites"
            className="inline-flex items-center rounded-xl border border-violet-300 px-4 py-2 text-sm font-medium text-violet-700 dark:border-violet-700 dark:text-violet-300"
          >
            {t("compare.backToFavorites")}
          </Link>
        </div>
      </main>
    );
  }

  function desc(p: PerfumeFull) {
    if (locale === "tr" && p.short_description_tr) return p.short_description_tr;
    return p.short_description || "—";
  }

  const labels: { key: string; render: (p: PerfumeFull) => string }[] = [
    { key: "compare.brand", render: (p) => p.brand },
    { key: "compare.name", render: (p) => p.name },
    {
      key: "compare.year",
      render: (p) =>
        typeof p.year === "number" && p.year > 0 ? String(p.year) : "—",
    },
    { key: "compare.gender", render: (p) => p.gender || "—" },
    {
      key: "compare.season",
      render: (p) => (p.season?.length ? p.season.join(", ") : "—"),
    },
    {
      key: "compare.rating",
      render: (p) =>
        typeof p.rating === "number" ? p.rating.toFixed(1) : "—",
    },
    {
      key: "compare.reviewCount",
      render: (p) => String(p.user_rating_count ?? 0),
    },
    { key: "compare.longevity", render: (p) => p.longevity || "—" },
    { key: "compare.sillage", render: (p) => p.sillage || "—" },
    {
      key: "compare.accords",
      render: (p) => (p.accords?.length ? p.accords.join(", ") : "—"),
    },
    {
      key: "compare.topNotes",
      render: (p) => p.notes?.top?.join(", ") || "—",
    },
    {
      key: "compare.middleNotes",
      render: (p) => p.notes?.middle?.join(", ") || "—",
    },
    {
      key: "compare.baseNotes",
      render: (p) => p.notes?.base?.join(", ") || "—",
    },
    { key: "compare.description", render: (p) => desc(p) },
  ];

  const colHighlight =
    "bg-gradient-to-b from-amber-50/95 via-amber-50/50 to-transparent shadow-[inset_0_0_0_1px_rgba(251,191,36,0.35)] dark:from-amber-950/35 dark:via-amber-950/15 dark:to-transparent dark:shadow-[inset_0_0_0_1px_rgba(251,191,36,0.2)]";

  return (
    <main className="space-y-12 pb-10">
      <CompareStudioSection rows={rows} t={t} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-zinc-50 sm:text-2xl">
          {t("compare.detailTable")}
        </h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 transition hover:gap-3 hover:underline dark:text-violet-300"
          >
            {t("compare.changeSelection")}
          </Link>
          <Link
            href="/favorites"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:gap-3 hover:text-violet-600 hover:underline dark:text-zinc-400 dark:hover:text-violet-300"
          >
            {t("compare.backToFavorites")}
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border-2 border-violet-200/60 bg-white/90 shadow-[0_20px_50px_rgba(139,92,246,0.08)] dark:border-violet-900/40 dark:bg-zinc-900/50">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/95 dark:border-violet-950/30 dark:bg-violet-950/25">
              <th className="sticky left-0 z-10 min-w-[140px] bg-stone-50/95 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 dark:bg-zinc-900 dark:text-zinc-400">
                {t("compare.attribute")}
              </th>
              {rows.map((p) => {
                const win = communityLeaders.has(p.id);
                return (
                  <th
                    key={p.id}
                    className={`min-w-[180px] px-3 py-3 text-left align-bottom transition duration-500 ${
                      win ? colHighlight : ""
                    }`}
                  >
                    <Link
                      href={`/perfume/${p.id}`}
                      className="group block space-y-2"
                    >
                      <div className="relative mx-auto aspect-[3/4] w-full max-w-[120px] overflow-hidden rounded-xl border border-stone-200 dark:border-violet-950/40">
                        <PerfumeImage
                          src={p.image_url}
                          alt={`${p.brand} ${p.name}`}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-95"
                        />
                        {win && (
                          <span className="absolute right-1 top-1 rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-md">
                            {t("compare.topPick")}
                          </span>
                        )}
                      </div>
                      <span className="line-clamp-2 text-xs font-semibold text-violet-700 group-hover:underline dark:text-violet-200">
                        {p.brand} — {p.name}
                      </span>
                    </Link>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {labels.map((row, ri) => (
              <tr
                key={row.key}
                className="compare-table-row border-b border-stone-100 dark:border-violet-950/20"
                style={{ animationDelay: `${Math.min(ri, 12) * 0.04}s` }}
              >
                <td className="sticky left-0 z-[1] bg-white px-3 py-2.5 text-xs font-medium text-stone-500 dark:bg-zinc-900 dark:text-zinc-400">
                  {t(row.key)}
                </td>
                {rows.map((p) => (
                  <td
                    key={`${row.key}-${p.id}`}
                    className={`max-w-[220px] px-3 py-2.5 align-top text-stone-800 transition dark:text-zinc-200 ${
                      communityLeaders.has(p.id) ? colHighlight : ""
                    }`}
                  >
                    <span className="line-clamp-6 whitespace-pre-wrap break-words">
                      {row.render(p)}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
