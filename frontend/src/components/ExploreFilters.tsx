"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dropdown } from "@/components/Dropdown";
import type { DropdownOption } from "@/components/Dropdown";

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

  const brandOptions: DropdownOption[] = [
    { value: "", label: t("explore.filterBrand") },
    ...brands.map((b) => ({ value: b, label: b })),
  ];

  const genderOptions: DropdownOption[] = [
    { value: "", label: t("explore.filterGender") },
    { value: "male", label: t("home.genderMale") },
    { value: "female", label: t("home.genderFemale") },
    { value: "unisex", label: t("home.genderUnisex") },
  ];

  const seasonOptions: DropdownOption[] = [
    { value: "", label: t("explore.filterSeason") },
    { value: "spring", label: t("explore.seasonSpring") },
    { value: "summer", label: t("explore.seasonSummer") },
    { value: "fall", label: t("explore.seasonFall") },
    { value: "winter", label: t("explore.seasonWinter") },
  ];

  return (
    <div className="space-y-3 rounded-2xl border border-violet-200/50 bg-white p-4 shadow-sm dark:border-violet-500/20 dark:bg-violet-950/10 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-zinc-500">
          {t("explore.filter")}
        </span>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium text-stone-400 transition hover:bg-violet-50 hover:text-violet-700 dark:text-zinc-500 dark:hover:bg-violet-500/10 dark:hover:text-violet-300"
          >
            <svg
              className="h-3 w-3"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M1 1l10 10M11 1L1 11" />
            </svg>
            {t("explore.clearFilters")}
          </button>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Dropdown
          value={currentBrand}
          onChange={(v) => handleChange("brand", v)}
          options={brandOptions}
          searchable
          searchPlaceholder="Marka ara…"
        />
        <Dropdown
          value={currentGender}
          onChange={(v) => handleChange("gender", v)}
          options={genderOptions}
        />
        <Dropdown
          value={currentSeason}
          onChange={(v) => handleChange("season", v)}
          options={seasonOptions}
        />
      </div>
    </div>
  );
}
