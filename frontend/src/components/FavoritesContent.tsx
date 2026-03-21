"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PerfumeCardFavoriteWrap } from "@/components/PerfumeCardFavoriteWrap";
import {
  authPrimaryCtaLgClassName,
  gradientCompactCtaClassName,
} from "@/lib/authUi";

type PerfumeDetail = {
  id: string;
  brand: string;
  name: string;
  image_url?: string;
  accords?: string[];
  rating?: number;
};

const MAX_COMPARE = 4;
const MIN_COMPARE = 2;

export function FavoritesContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { ids, removeFavorite, loading: favLoading } = useFavorites();
  const [items, setItems] = useState<PerfumeDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    if (ids.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const results = await Promise.all(
      ids.map(async (id) => {
        try {
          const res = await fetch(apiUrl(`/perfumes/${id}`));
          if (!res.ok) return null;
          return (await res.json()) as PerfumeDetail;
        } catch {
          return null;
        }
      })
    );
    const ok = results.filter((x): x is PerfumeDetail => x != null);
    setItems(ok);
    setSelected((prev) => {
      const next = new Set<string>();
      for (const id of prev) {
        if (ok.some((p) => p.id === id)) next.add(id);
      }
      return next;
    });
    setLoading(false);
  }, [ids]);

  useEffect(() => {
    load();
  }, [load]);

  const idOrder = useMemo(() => {
    const map = new Map(items.map((p) => [String(p.id), p]));
    return ids
      .map((id) => map.get(String(id)))
      .filter((x): x is PerfumeDetail => x != null);
  }, [ids, items]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        if (next.size >= MAX_COMPARE) return prev;
        next.add(id);
      }
      return next;
    });
  }

  function goCompare() {
    if (selected.size < MIN_COMPARE || selected.size > MAX_COMPARE) return;
    const list = Array.from(selected);
    router.push(`/compare?ids=${encodeURIComponent(list.join(","))}`);
  }

  function purgeMissing() {
    const have = new Set(items.map((p) => String(p.id)));
    for (const id of ids) {
      if (!have.has(String(id))) void removeFavorite(id);
    }
  }

  if (authLoading) {
    return (
      <main className="space-y-6">
        <div className="h-10 w-56 animate-pulse rounded-xl bg-stone-200 dark:bg-violet-950/20" />
        <div className="h-48 animate-pulse rounded-2xl bg-stone-200/80 dark:bg-violet-950/15" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-zinc-50">
          {t("favorites.title")}
        </h1>
        <div className="rounded-2xl border-2 border-violet-300/50 bg-gradient-to-br from-violet-50 to-pink-50/80 px-8 py-14 text-center dark:border-violet-600/30 dark:from-violet-950/40 dark:to-pink-950/20">
          <p className="text-stone-700 dark:text-zinc-300">{t("favorites.loginRequired")}</p>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("perfiai:open-auth"))}
            className={`${authPrimaryCtaLgClassName} mt-6`}
          >
            {t("auth.login")}
          </button>
        </div>
      </main>
    );
  }

  if (favLoading) {
    return (
      <main className="space-y-6">
        <div className="h-10 w-56 animate-pulse rounded-xl bg-stone-200 dark:bg-violet-950/20" />
        <div className="h-48 animate-pulse rounded-2xl bg-stone-200/80 dark:bg-violet-950/15" />
      </main>
    );
  }

  if (ids.length === 0) {
    return (
      <main className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-zinc-50">
          {t("favorites.title")}
        </h1>
        <div className="rounded-2xl border-2 border-dashed border-violet-200/60 bg-violet-50/40 px-8 py-16 text-center dark:border-violet-500/25 dark:bg-violet-950/15">
          <p className="text-stone-600 dark:text-zinc-400">{t("favorites.empty")}</p>
          <Link
            href="/explore"
            className="mt-4 inline-block rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
          >
            {t("favorites.goExplore")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-zinc-50">
            {t("favorites.title")}
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-zinc-500">
            {ids.length} {t("favorites.countSuffix")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={goCompare}
            disabled={selected.size < MIN_COMPARE || selected.size > MAX_COMPARE}
            className={`${gradientCompactCtaClassName} px-4 py-2.5 text-sm ${
              selected.size >= MIN_COMPARE && selected.size <= MAX_COMPARE
                ? "compare-cta-pulse ring-2 ring-amber-400/60 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900"
                : ""
            }`}
          >
            {t("favorites.compareSelected")} ({selected.size}/{MAX_COMPARE})
          </button>
        </div>
      </div>

      <div className="compare-rise relative overflow-hidden rounded-2xl border border-violet-300/50 bg-gradient-to-r from-violet-500/15 via-fuchsia-500/10 to-amber-400/15 p-5 shadow-lg dark:border-violet-600/30 dark:from-violet-950/50 dark:via-fuchsia-950/30 dark:to-amber-950/20">
        <div className="compare-float-slow pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-pink-400/20 blur-2xl" />
        <div className="relative z-[1] flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700 dark:text-violet-300">
              ✨ {t("favorites.studioTitle")}
            </p>
            <p className="mt-1 max-w-xl text-sm text-stone-700 dark:text-zinc-300">
              {t("favorites.studioDesc")}
            </p>
            <p className="mt-2 text-xs font-medium text-violet-600 dark:text-violet-400">
              {t("favorites.studioCta")}
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm text-stone-600 dark:text-zinc-400">
        {t("favorites.compareHint")}
      </p>

      {loading && (
        <div className="h-32 animate-pulse rounded-2xl bg-stone-200/80 dark:bg-violet-950/20" />
      )}

      {!loading && idOrder.length < ids.length && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
          <span>{t("favorites.staleHint")}</span>
          <button
            type="button"
            onClick={purgeMissing}
            className="rounded-lg border border-amber-300 px-3 py-1 text-xs font-medium transition hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/40"
          >
            {t("favorites.cleanList")}
          </button>
        </div>
      )}

      {!loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {idOrder.map((p) => {
            const on = selected.has(p.id);
            const atMax = selected.size >= MAX_COMPARE && !on;
            return (
              <div key={p.id} className="relative">
                <button
                  type="button"
                  disabled={atMax}
                  onClick={() => toggleSelect(p.id)}
                  aria-pressed={on}
                  title={
                    on
                      ? t("favorites.compareDeselect")
                      : t("favorites.compareSelect")
                  }
                  className={`absolute right-2 top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 ${
                    on
                      ? "scale-105 border-white bg-gradient-to-br from-violet-600 to-pink-500 text-white"
                      : "border-white/80 bg-black/35 text-white backdrop-blur-md hover:border-violet-200 hover:bg-black/45 dark:border-zinc-600 dark:bg-zinc-900/70 dark:hover:border-violet-500"
                  } ${atMax ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  {on ? (
                    <svg
                      className="h-5 w-5"
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
                  ) : (
                    <span className="text-lg font-semibold leading-none">+</span>
                  )}
                </button>
                <PerfumeCardFavoriteWrap perfume={p} />
              </div>
            );
          })}
        </div>
      )}

      {!loading && idOrder.length === 0 && ids.length > 0 && (
        <p className="text-stone-500 dark:text-zinc-500">{t("favorites.loadFailed")}</p>
      )}
    </main>
  );
}
