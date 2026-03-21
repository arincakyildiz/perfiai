"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PerfumeImage } from "@/components/PerfumeImage";
import { PerfumeFilterPanel } from "@/components/PerfumeFilterPanel";
import { gradientCompactCtaClassName } from "@/lib/authUi";
import {
  buildExploreUrlFromCompareFilters,
  buildPerfumesListApiSearchParams,
  hasActivePerfumeFilters,
  parsePerfumeFilterValues,
  type PerfumeFacets,
} from "@/lib/perfumeFilterParams";

type PerfumeRow = {
  id: string;
  brand: string;
  name: string;
  image_url?: string;
  rating?: number;
};

type ListResponse = { data: PerfumeRow[]; total?: number };

const MAX = 4;
const MIN = 2;

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export type ComparePickerContentProps = {
  /** Pre-fill from URL when user opened /compare?ids= with &lt;2 valid IDs */
  initialSelectedIds?: string[];
};

export function ComparePickerContent({
  initialSelectedIds = [],
}: ComparePickerContentProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { ids: favoriteIds } = useFavorites();

  const [brands, setBrands] = useState<string[]>([]);
  const [facets, setFacets] = useState<PerfumeFacets>({
    accords: [],
    longevity: [],
    sillage: [],
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [brRes, fcRes] = await Promise.all([
          fetch(apiUrl("/brands")),
          fetch(apiUrl("/perfume-facets")),
        ]);
        const brJson = brRes.ok ? await brRes.json() : {};
        const fcJson = fcRes.ok ? await fcRes.json() : {};
        if (cancelled) return;
        const br = brJson.brands;
        setBrands(Array.isArray(br) ? br : []);
        setFacets({
          accords: Array.isArray(fcJson.accords) ? fcJson.accords : [],
          longevity: Array.isArray(fcJson.longevity) ? fcJson.longevity : [],
          sillage: Array.isArray(fcJson.sillage) ? fcJson.sillage : [],
        });
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const searchParamsKey = searchParams.toString();
  const filterValues = useMemo(() => {
    const sp = new URLSearchParams(searchParamsKey);
    return parsePerfumeFilterValues(sp);
  }, [searchParamsKey]);

  const pushCompareFilters = useCallback(
    (patch: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      for (const [k, v] of Object.entries(patch)) {
        if (v === undefined || v === "") params.delete(k);
        else params.set(k, v);
      }
      router.push(`/compare?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearCompareFilters = useCallback(() => {
    const params = new URLSearchParams();
    const ids = searchParams.get("ids");
    if (ids) params.set("ids", ids);
    const s = params.toString();
    router.push(s ? `/compare?${s}` : "/compare");
  }, [router, searchParams]);

  const apiQueryKey = useMemo(() => {
    const sp = new URLSearchParams(searchParamsKey);
    return buildPerfumesListApiSearchParams(sp, { limit: 24, page: 1 }).toString();
  }, [searchParamsKey]);

  const initialIdsKey = (initialSelectedIds ?? []).map(String).join(",");
  const initialIds = useMemo(
    () =>
      [...new Set((initialSelectedIds ?? []).map(String))]
        .filter(Boolean)
        .slice(0, MAX),
    [initialIdsKey]
  );

  const [selected, setSelected] = useState<string[]>(() => initialIds);
  const [meta, setMeta] = useState<Map<string, PerfumeRow>>(() => new Map());

  const remember = useCallback((row: PerfumeRow) => {
    setMeta((prev) => {
      const next = new Map(prev);
      next.set(String(row.id), row);
      return next;
    });
  }, []);

  useEffect(() => {
    setSelected((prev) => {
      const merged = [...new Set([...initialIds, ...prev])].slice(0, MAX);
      return merged;
    });
  }, [initialIdsKey]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const id of initialIds) {
        if (cancelled) break;
        try {
          const res = await fetch(apiUrl(`/perfumes/${id}`));
          if (!res.ok) continue;
          const p = (await res.json()) as PerfumeRow;
          if (cancelled) break;
          remember(p);
        } catch {
          /* ignore */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialIdsKey, remember]);

  const [results, setResults] = useState<PerfumeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        const res = await fetch(apiUrl(`/perfumes?${apiQueryKey}`));
        if (!res.ok) throw new Error("bad");
        const json = (await res.json()) as ListResponse;
        if (!cancelled) setResults(Array.isArray(json.data) ? json.data : []);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [apiQueryKey]);

  const [favoriteRows, setFavoriteRows] = useState<PerfumeRow[]>([]);
  useEffect(() => {
    if (!user || favoriteIds.length === 0) {
      setFavoriteRows([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const sliced = favoriteIds.slice(0, 16);
      const out = await Promise.all(
        sliced.map(async (id) => {
          try {
            const res = await fetch(apiUrl(`/perfumes/${id}`));
            if (!res.ok) return null;
            return (await res.json()) as PerfumeRow;
          } catch {
            return null;
          }
        })
      );
      if (!cancelled) {
        setFavoriteRows(out.filter((x): x is PerfumeRow => x != null));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, favoriteIds.join(",")]);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  function toggle(id: string, row?: PerfumeRow) {
    if (row) remember(row);
    setSelected((prev) => {
      const i = prev.indexOf(id);
      if (i >= 0) return prev.filter((x) => x !== id);
      if (prev.length >= MAX) return prev;
      return [...prev, id];
    });
  }

  function removeSelected(id: string) {
    setSelected((prev) => prev.filter((x) => x !== id));
  }

  function goCompare() {
    if (selected.length < MIN || selected.length > MAX) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("ids", selected.join(","));
    params.delete("page");
    router.push(`/compare?${params.toString()}`);
  }

  const exploreHref = useMemo(() => {
    const sp = new URLSearchParams(searchParamsKey);
    return buildExploreUrlFromCompareFilters(sp);
  }, [searchParamsKey]);

  return (
    <main className="space-y-8 pb-10">
      <div className="relative overflow-hidden rounded-3xl border border-violet-200/50 bg-gradient-to-br from-violet-100/80 via-white/90 to-pink-100/50 px-6 py-10 shadow-[0_20px_60px_rgba(139,92,246,0.12)] dark:border-violet-800/40 dark:from-violet-950/50 dark:via-[#120f18]/80 dark:to-pink-950/25 sm:px-10">
        <div className="compare-float-slow pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-pink-400/25 blur-3xl dark:bg-pink-500/15" />
        <div className="compare-float-slow pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-600/20" />
        <div className="relative z-[1] space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-700 dark:text-violet-300">
            {t("compare.studioBadge")}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-zinc-50 sm:text-4xl">
            {t("compare.pickerTitle")}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-stone-600 dark:text-zinc-400">
            {t("compare.pickerSubtitle")}
          </p>
        </div>
      </div>

      <PerfumeFilterPanel
        brands={brands}
        facets={facets}
        values={filterValues}
        pushFilters={pushCompareFilters}
        onClear={clearCompareFilters}
        intro={t("compare.pickerFiltersIntro")}
      />

      <div className="rounded-2xl border border-violet-200/60 bg-white/80 p-4 shadow-sm dark:border-violet-900/40 dark:bg-zinc-900/40 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">
              {t("compare.pickerSelectedLabel")}
            </p>
            {selected.length === 0 ? (
              <p className="mt-2 text-sm text-stone-500 dark:text-zinc-500">
                {t("compare.pickerEmptySelection")}
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.map((id) => {
                  const p = meta.get(id);
                  return (
                    <div
                      key={id}
                      className="group flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/90 py-1 pl-1 pr-2 shadow-sm dark:border-violet-700/50 dark:bg-violet-950/40"
                    >
                      <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/60 dark:border-zinc-700">
                        <PerfumeImage
                          src={p?.image_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="max-w-[10rem] truncate text-xs font-medium text-stone-800 dark:text-zinc-200">
                        {p ? `${p.brand} · ${p.name}` : `…${id.slice(-6)}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSelected(id)}
                        className="ml-1 flex h-7 w-7 items-center justify-center rounded-full text-stone-400 transition hover:bg-violet-200/60 hover:text-stone-700 dark:hover:bg-violet-900/50 dark:hover:text-zinc-200"
                        aria-label={t("compare.pickerRemove")}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={exploreHref}
              className="rounded-xl border border-violet-200/80 px-4 py-2.5 text-sm font-medium text-violet-700 shadow-sm ring-2 ring-transparent transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-50 hover:shadow-md hover:ring-violet-300/40 dark:border-violet-800/60 dark:text-violet-300 dark:hover:bg-violet-950/40 dark:hover:ring-violet-500/25"
            >
              {t("compare.pickerExploreLink")}
            </Link>
            <Link
              href="/favorites"
              className="rounded-xl border border-violet-200/80 px-4 py-2.5 text-sm font-medium text-violet-700 shadow-sm ring-2 ring-transparent transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-50 hover:shadow-md hover:ring-violet-300/40 dark:border-violet-800/60 dark:text-violet-300 dark:hover:bg-violet-950/40 dark:hover:ring-violet-500/25"
            >
              {t("compare.backToFavorites")}
            </Link>
            <button
              type="button"
              onClick={goCompare}
              disabled={selected.length < MIN || selected.length > MAX}
              className={`${gradientCompactCtaClassName} px-5 py-2.5 text-sm`}
            >
              {t("compare.pickerGo")} ({selected.length}/{MAX})
            </button>
          </div>
        </div>
      </div>

      {user && favoriteRows.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-stone-800 dark:text-zinc-200">
            {t("compare.pickerFavoritesSection")}
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {favoriteRows.map((p) => {
              const on = selectedSet.has(p.id);
              const atMax = selected.length >= MAX && !on;
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={atMax}
                  onClick={() => toggle(p.id, p)}
                  className={`relative flex w-[7.5rem] shrink-0 flex-col overflow-hidden rounded-2xl border-2 text-left transition ${
                    on
                      ? "border-violet-500 bg-violet-50/90 shadow-[0_0_0_3px_rgba(139,92,246,0.2)] dark:border-violet-400 dark:bg-violet-950/50"
                      : "border-transparent bg-white/90 ring-1 ring-stone-200/80 hover:ring-violet-300/80 dark:bg-zinc-900/50 dark:ring-zinc-700 dark:hover:ring-violet-700"
                  } ${atMax ? "cursor-not-allowed opacity-45" : ""}`}
                >
                  <div className="relative aspect-[3/4] w-full bg-stone-100 dark:bg-zinc-800">
                    <PerfumeImage
                      src={p.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <span
                      className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-md transition ${
                        on
                          ? "border-white bg-gradient-to-br from-violet-600 to-pink-500 text-white"
                          : "border-white/70 bg-black/35 text-white backdrop-blur-sm"
                      }`}
                    >
                      {on ? (
                        <CheckIcon className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-bold opacity-90">+</span>
                      )}
                    </span>
                  </div>
                  <div className="p-2">
                    <p className="truncate text-[10px] font-medium text-stone-500 dark:text-zinc-400">
                      {p.brand}
                    </p>
                    <p className="line-clamp-2 text-xs font-semibold text-stone-900 dark:text-zinc-100">
                      {p.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-stone-800 dark:text-zinc-200">
          {hasActivePerfumeFilters(new URLSearchParams(searchParamsKey))
            ? t("compare.pickerResultsFiltered")
            : t("compare.pickerPopular")}
        </h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-2xl bg-stone-200/80 dark:bg-violet-950/25"
              />
            ))}
          </div>
        ) : results.length === 0 ? (
          <p className="text-sm text-stone-500 dark:text-zinc-500">
            {t("compare.pickerNoResults")}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((p) => {
              const on = selectedSet.has(p.id);
              const atMax = selected.length >= MAX && !on;
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={atMax}
                  onClick={() => toggle(p.id, p)}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 text-left transition ${
                    on
                      ? "border-violet-500 bg-violet-50/40 shadow-[0_0_0_3px_rgba(139,92,246,0.18)] dark:border-violet-400 dark:bg-violet-950/30"
                      : "border-transparent bg-white/90 ring-1 ring-stone-200/70 hover:ring-violet-300/70 dark:bg-zinc-900/45 dark:ring-zinc-700 dark:hover:ring-violet-700"
                  } ${atMax ? "cursor-not-allowed opacity-45" : ""}`}
                >
                  <div className="relative aspect-[3/4] w-full bg-stone-100 dark:bg-zinc-800">
                    <PerfumeImage
                      src={p.image_url}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                    <span
                      className={`absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-lg transition ${
                        on
                          ? "scale-105 border-white bg-gradient-to-br from-violet-600 to-pink-500 text-white"
                          : "border-white/80 bg-black/30 text-white backdrop-blur-md"
                      }`}
                    >
                      {on ? (
                        <CheckIcon className="h-[18px] w-[18px]" />
                      ) : (
                        <span className="text-sm font-semibold">+</span>
                      )}
                    </span>
                    {typeof p.rating === "number" ? (
                      <span className="absolute bottom-2 left-2 rounded-full bg-black/45 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                        ★ {p.rating.toFixed(1)}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5 p-3">
                    <span className="truncate text-[11px] font-medium uppercase tracking-wide text-violet-600 dark:text-violet-400">
                      {p.brand}
                    </span>
                    <span className="line-clamp-2 text-sm font-semibold text-stone-900 dark:text-zinc-50">
                      {p.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
