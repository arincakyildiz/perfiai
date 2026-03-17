"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type BrandsContentProps = {
  brands: string[];
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

const BRAND_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#";

export function BrandsContent({ brands }: BrandsContentProps) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = brands;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((b) => b.toLowerCase().includes(q));
    }
    if (activeLetter) {
      if (activeLetter === "#") {
        result = result.filter((b) => !/^[a-zA-Z]/.test(b));
      } else {
        result = result.filter(
          (b) => b.charAt(0).toUpperCase() === activeLetter
        );
      }
    }
    return result;
  }, [brands, search, activeLetter]);

  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    brands.forEach((b) => {
      const first = b.charAt(0).toUpperCase();
      set.add(/[A-Z]/.test(first) ? first : "#");
    });
    return set;
  }, [brands]);

  return (
    <main className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-violet-200/40 bg-gradient-to-br from-violet-50 via-white to-pink-50/60 p-6 shadow-xl dark:border-violet-500/20 dark:from-violet-950/40 dark:via-violet-950/20 dark:to-pink-950/30 sm:p-10">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-violet-400/15 blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-pink-400/10 blur-3xl animate-float" />
        <div className="absolute right-[25%] top-6 h-1.5 w-1.5 rounded-full bg-violet-500/50 animate-twinkle" />
        <div className="absolute left-[60%] bottom-8 h-1 w-1 rounded-full bg-pink-400/60 animate-twinkle animate-twinkle-delay-2" />

        <div className="relative space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-zinc-50 sm:text-4xl">
            {t("brands.title")}
          </h1>
          <p className="text-stone-600 dark:text-zinc-400">
            {t("brands.subtitle")}
          </p>
          <p className="text-sm text-violet-600 dark:text-violet-400">
            {brands.length} {t("brands.totalBrands")}
          </p>
        </div>
      </div>

      {/* Search + letter filter */}
      <div className="space-y-4">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-400 dark:text-violet-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("brands.searchPlaceholder")}
            className="w-full rounded-2xl border border-violet-200/50 bg-white py-3.5 pl-12 pr-5 text-stone-900 shadow-sm transition placeholder:text-stone-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-violet-500/20 dark:bg-violet-950/20 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-violet-500"
          />
        </div>

        {/* Alphabet bar */}
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2">
          <button
            type="button"
            onClick={() => setActiveLetter(null)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeLetter === null
                ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow"
                : "text-stone-500 hover:bg-violet-100 hover:text-violet-700 dark:text-zinc-500 dark:hover:bg-violet-500/10 dark:hover:text-violet-200"
            }`}
          >
            ALL
          </button>
          {BRAND_LETTERS.split("").map((letter) => {
            const available = availableLetters.has(letter);
            return (
              <button
                key={letter}
                type="button"
                onClick={() => available && setActiveLetter(letter === activeLetter ? null : letter)}
                disabled={!available}
                className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                  activeLetter === letter
                    ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow"
                    : available
                      ? "text-stone-600 hover:bg-violet-100 hover:text-violet-700 dark:text-zinc-400 dark:hover:bg-violet-500/10 dark:hover:text-violet-200"
                      : "cursor-default text-stone-300 dark:text-zinc-700"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-violet-200/40 bg-violet-50/50 px-8 py-16 text-center text-stone-500 dark:border-violet-500/20 dark:bg-violet-950/10 dark:text-zinc-500">
          {t("brands.noSearchResults")}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((brand, i) => (
            <Link
              key={brand}
              href={`/brands/${slugify(brand)}`}
              className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border-2 border-violet-200/30 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/50 hover:shadow-lg hover:shadow-violet-500/10 dark:border-violet-500/15 dark:bg-violet-950/10 dark:hover:border-violet-500/40 dark:hover:bg-violet-950/20 dark:hover:shadow-violet-500/10"
              style={{ animationDelay: `${Math.min(i * 30, 600)}ms` }}
            >
              {/* Initial circle */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 text-sm font-bold text-white shadow-sm transition duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-violet-500/25">
                {brand.charAt(0).toUpperCase()}
              </div>
              <span className="flex-1 font-semibold text-stone-800 transition group-hover:text-violet-700 dark:text-zinc-100 dark:group-hover:text-violet-200">
                {brand}
              </span>
              <span className="text-lg text-violet-400/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-violet-500 dark:group-hover:text-violet-300">
                →
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
