"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type ExploreFiltersProps = {
  brands: string[];
  currentBrand: string;
  currentGender: string;
  currentSeason: string;
};

export function ExploreFilters({
  brands,
  currentBrand,
  currentGender,
  currentSeason,
}: ExploreFiltersProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = useCallback(
    (key: "brand" | "gender" | "season", value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("q");
      router.push(`/explore?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.push("/explore");
  }, [router]);

  const hasFilters = currentBrand || currentGender || currentSeason;

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border-2 border-violet-200/40 bg-white p-4 shadow dark:border-violet-500/20 dark:bg-violet-950/10 sm:p-5">
      <span className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-zinc-500">
        {t("explore.filter")}
      </span>

      <select
        value={currentBrand}
        onChange={(e) => handleChange("brand", e.target.value)}
        className="rounded-lg border-2 border-violet-200/40 bg-violet-50/50 px-4 py-2.5 text-sm text-stone-700 focus:border-violet-500 focus:outline-none dark:border-violet-500/30 dark:bg-black/40 dark:text-zinc-200 dark:focus:border-violet-500 dark:focus:ring-violet-500/20"
      >
        <option value="">{t("explore.filterBrand")}</option>
        {brands.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      <select
        value={currentGender}
        onChange={(e) => handleChange("gender", e.target.value)}
        className="rounded-lg border-2 border-violet-200/40 bg-violet-50/50 px-4 py-2.5 text-sm text-stone-700 focus:border-violet-500 focus:outline-none dark:border-violet-500/30 dark:bg-black/40 dark:text-zinc-200 dark:focus:border-violet-500 dark:focus:ring-violet-500/20"
      >
        <option value="">{t("explore.filterGender")}</option>
        <option value="male">{t("home.genderMale")}</option>
        <option value="female">{t("home.genderFemale")}</option>
        <option value="unisex">{t("home.genderUnisex")}</option>
      </select>

      <select
        value={currentSeason}
        onChange={(e) => handleChange("season", e.target.value)}
        className="rounded-lg border-2 border-violet-200/40 bg-violet-50/50 px-4 py-2.5 text-sm text-stone-700 focus:border-violet-500 focus:outline-none dark:border-violet-500/30 dark:bg-black/40 dark:text-zinc-200 dark:focus:border-violet-500 dark:focus:ring-violet-500/20"
      >
        <option value="">{t("explore.filterSeason")}</option>
        <option value="spring">{t("explore.seasonSpring")}</option>
        <option value="summer">{t("explore.seasonSummer")}</option>
        <option value="fall">{t("explore.seasonFall")}</option>
        <option value="winter">{t("explore.seasonWinter")}</option>
      </select>

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-stone-500 transition hover:bg-violet-100 hover:text-violet-700 dark:text-zinc-500 dark:hover:bg-white/5 dark:hover:text-violet-200"
        >
          {t("explore.clearFilters")}
        </button>
      )}
    </div>
  );
}
