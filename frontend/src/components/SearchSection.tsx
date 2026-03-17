"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { FC, FormEvent } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PerfumeCard } from "@/components/PerfumeCard";
import { Dropdown } from "@/components/Dropdown";
import { apiUrl } from "@/lib/api";

type SearchPerfume = {
  id: string;
  brand: string;
  name: string;
  image_url?: string;
  accords?: string[];
  rating?: number;
  tags?: string[];
  reason?: string;
};

type AiSearchResponse = {
  total: number;
  query: string;
  gender: string | null;
  season: string | null;
  lang: string;
  mode: string;
  data: SearchPerfume[];
};

export const SearchSection: FC = () => {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState<string | "">("");
  const [season, setSeason] = useState<string | "">("");
  const [results, setResults] = useState<SearchPerfume[]>([]);
  const [meta, setMeta] =
    useState<Pick<AiSearchResponse, "total" | "mode"> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query.trim()) return;

    startTransition(async () => {
      try {
        setError(null);
        const res = await fetch(apiUrl("/ai-search"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            gender: gender || undefined,
            season: season || undefined,
            limit: 12,
          }),
        });

        if (!res.ok) throw new Error("AI arama başarısız oldu");

        const json: AiSearchResponse = await res.json();
        setResults(json.data || []);
        setMeta({ total: json.total, mode: json.mode });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu"
        );
        setResults([]);
        setMeta(null);
      }
    });
  }

  return (
    <section className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border-2 border-violet-200/40 bg-white p-4 shadow-lg dark:border-violet-500/20 dark:bg-violet-950/10 sm:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1 rounded-xl border-2 border-violet-200/40 bg-violet-50/50 px-5 py-3.5 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 dark:border-violet-500/30 dark:bg-black/30 dark:focus-within:border-violet-500 dark:focus-within:ring-violet-500/20">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("home.searchPlaceholder")}
              className="w-full bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-violet-500 bg-gradient-to-r from-violet-600 to-pink-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:from-violet-500 hover:to-pink-400 disabled:opacity-60 dark:border-violet-500/40 dark:bg-violet-950/50 dark:text-violet-200 dark:shadow-[0_0_20px_rgba(139,92,246,0.2)] dark:hover:border-violet-500/50 dark:hover:bg-violet-950/70 dark:hover:text-violet-100 dark:hover:shadow-[0_0_30px_rgba(139,92,246,0.25)] sm:w-auto"
          >
            {isPending ? t("home.searching") : t("home.searchButton")}
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <Dropdown
            value={gender}
            onChange={setGender}
            options={[
              { value: "", label: t("home.filterGender") },
              { value: "male", label: t("home.genderMale") },
              { value: "female", label: t("home.genderFemale") },
              { value: "unisex", label: t("home.genderUnisex") },
            ]}
          />
          <Dropdown
            value={season}
            onChange={setSeason}
            options={[
              { value: "", label: t("home.filterSeason") },
              { value: "spring", label: t("seasons.spring") },
              { value: "summer", label: t("seasons.summer") },
              { value: "fall", label: t("seasons.fall") },
              { value: "winter", label: t("seasons.winter") },
            ]}
          />
          {meta && (
            <span className="flex items-center text-xs text-stone-500 dark:text-zinc-500">
              {meta.total} {t("ai.resultsCount")} • {meta.mode}
            </span>
          )}
        </div>
      </form>

      {error && (
        <div className="rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-200">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-stone-800 dark:text-zinc-100">
            {t("ai.results")}
          </h2>
          <p className="text-sm text-stone-500 dark:text-zinc-500">{t("ai.resultsDesc")}</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((p) => (
              <div key={p.id} className="space-y-3">
                <Link
                  href={`/perfume/${p.id}`}
                  className="block transition duration-300 hover:-translate-y-1"
                >
                  <PerfumeCard perfume={p} />
                </Link>
                {(p.tags?.length || p.reason) && (
                  <div className="space-y-1.5 text-xs text-zinc-500">
                    {p.tags && p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {p.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] text-stone-600 dark:bg-violet-950/30 dark:text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {p.reason && (
                      <p className="line-clamp-2 text-stone-600 dark:text-zinc-500">
                        {p.reason}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
