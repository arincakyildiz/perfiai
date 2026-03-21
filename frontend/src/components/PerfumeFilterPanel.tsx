"use client";

import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dropdown } from "@/components/Dropdown";
import type { DropdownOption } from "@/components/Dropdown";
import type { PerfumeFacets, PerfumeFilterValues } from "@/lib/perfumeFilterParams";

export type PerfumeFilterPanelProps = {
  brands: string[];
  facets: PerfumeFacets;
  values: PerfumeFilterValues;
  pushFilters: (patch: Record<string, string | undefined>) => void;
  onClear: () => void;
  /** Üstte ek açıklama (ör. kıyaslama seçici) */
  intro?: string;
};

function formatFacetLabel(value: string) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function PerfumeFilterPanel({
  brands,
  facets,
  values: v,
  pushFilters,
  onClear,
  intro,
}: PerfumeFilterPanelProps) {
  const { t } = useLanguage();
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [qDraft, setQDraft] = useState(v.q);
  const [yearMinLocal, setYearMinLocal] = useState(v.year_min);
  const [yearMaxLocal, setYearMaxLocal] = useState(v.year_max);
  const [accordsDraft, setAccordsDraft] = useState(v.accords);

  useEffect(() => {
    setQDraft(v.q);
  }, [v.q]);

  useEffect(() => {
    setYearMinLocal(v.year_min);
  }, [v.year_min]);

  useEffect(() => {
    setYearMaxLocal(v.year_max);
  }, [v.year_max]);

  useEffect(() => {
    setAccordsDraft(v.accords);
  }, [v.accords]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const next = qDraft.trim();
      const cur = (v.q || "").trim();
      if (next === cur) return;
      pushFilters({ q: next || undefined });
    }, 450);
    return () => window.clearTimeout(id);
  }, [qDraft, v.q, pushFilters]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const next = accordsDraft.trim();
      const cur = (v.accords || "").trim();
      if (next === cur) return;
      pushFilters({ accords: next || undefined });
    }, 500);
    return () => window.clearTimeout(id);
  }, [accordsDraft, v.accords, pushFilters]);

  const hasFilters =
    !!(v.q && v.q.trim()) ||
    !!v.brand ||
    !!v.gender ||
    !!v.season ||
    !!v.min_rating ||
    !!v.max_rating ||
    !!v.year_min ||
    !!v.year_max ||
    !!v.longevity ||
    !!v.sillage ||
    !!(v.accords && v.accords.trim()) ||
    v.accord_mode === "all" ||
    !!v.min_reviews ||
    v.order === "asc" ||
    (v.sort !== "rating" && !!v.sort);

  const sortOptions: DropdownOption[] = [
    { value: "rating", label: t("explore.sortRating") },
    { value: "year", label: t("explore.sortYear") },
    { value: "name", label: t("explore.sortName") },
  ];

  const orderOptions: DropdownOption[] = [
    { value: "desc", label: t("explore.orderDesc") },
    { value: "asc", label: t("explore.orderAsc") },
  ];

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

  const minRatingOptions: DropdownOption[] = [
    { value: "", label: t("explore.minRatingAny") },
    { value: "3", label: "≥ 3" },
    { value: "3.5", label: "≥ 3.5" },
    { value: "4", label: "≥ 4" },
    { value: "4.5", label: "≥ 4.5" },
  ];

  const maxRatingOptions: DropdownOption[] = [
    { value: "", label: t("explore.maxRatingAny") },
    { value: "5", label: "≤ 5" },
    { value: "4.5", label: "≤ 4.5" },
    { value: "4", label: "≤ 4" },
    { value: "3.5", label: "≤ 3.5" },
  ];

  const minReviewsOptions: DropdownOption[] = [
    { value: "", label: t("explore.minReviewsAny") },
    { value: "1", label: "≥ 1" },
    { value: "5", label: "≥ 5" },
    { value: "10", label: "≥ 10" },
    { value: "25", label: "≥ 25" },
    { value: "50", label: "≥ 50" },
  ];

  const longevityOptions: DropdownOption[] = [
    { value: "", label: t("explore.longevityAny") },
    ...facets.longevity.map((x) => ({
      value: x,
      label: formatFacetLabel(x),
    })),
  ];

  const sillageOptions: DropdownOption[] = [
    { value: "", label: t("explore.sillageAny") },
    ...facets.sillage.map((x) => ({
      value: x,
      label: formatFacetLabel(x),
    })),
  ];

  const accordPickOptions: DropdownOption[] = [
    { value: "", label: t("explore.accordPick") },
    ...facets.accords.slice(0, 400).map((a) => ({ value: a, label: a })),
  ];

  const accordModeOptions: DropdownOption[] = [
    { value: "any", label: t("explore.accordModeAny") },
    { value: "all", label: t("explore.accordModeAll") },
  ];

  const addAccordFromList = useCallback(
    (picked: string) => {
      if (!picked) return;
      const cur = accordsDraft.trim();
      const parts = cur ? cur.split(/[,;]+/).map((x) => x.trim()).filter(Boolean) : [];
      const vl = picked.toLowerCase();
      if (!parts.some((p) => p.toLowerCase() === vl)) parts.push(picked);
      const next = parts.join(", ");
      setAccordsDraft(next);
      pushFilters({ accords: next || undefined });
    },
    [accordsDraft, pushFilters]
  );

  return (
    <div className="space-y-4 rounded-2xl border border-violet-200/50 bg-white p-4 shadow-sm dark:border-violet-500/20 dark:bg-violet-950/10 sm:p-5">
      {intro ? (
        <p className="text-xs leading-relaxed text-stone-600 dark:text-zinc-400">{intro}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-zinc-500">
          {t("explore.filter")}
        </span>
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
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

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-zinc-400">
          {t("explore.searchLabel")}
        </label>
        <input
          type="search"
          value={qDraft}
          onChange={(e) => setQDraft(e.target.value)}
          placeholder={t("explore.searchPlaceholder")}
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition-all placeholder:text-stone-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
        <p className="mt-1.5 text-xs text-stone-500 dark:text-zinc-500">{t("explore.searchHint")}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Dropdown value={v.sort} onChange={(x) => pushFilters({ sort: x })} options={sortOptions} />
        <Dropdown value={v.order} onChange={(x) => pushFilters({ order: x })} options={orderOptions} />
        <Dropdown
          value={v.brand}
          onChange={(x) => pushFilters({ brand: x })}
          options={brandOptions}
          searchable
          searchPlaceholder={t("brands.searchPlaceholder")}
        />
        <Dropdown value={v.gender} onChange={(x) => pushFilters({ gender: x })} options={genderOptions} />
        <Dropdown value={v.season} onChange={(x) => pushFilters({ season: x })} options={seasonOptions} />
      </div>

      <button
        type="button"
        onClick={() => setAdvancedOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl border border-violet-200/60 bg-violet-50/50 px-4 py-3 text-left text-sm font-semibold text-violet-800 transition hover:bg-violet-100/80 dark:border-violet-800/40 dark:bg-violet-950/30 dark:text-violet-200 dark:hover:bg-violet-950/50 sm:w-auto sm:justify-start sm:gap-2 sm:border-0 sm:bg-transparent sm:p-0 sm:hover:bg-transparent"
        aria-expanded={advancedOpen}
      >
        <span>{t("explore.advancedFilters")}</span>
        <span className="text-violet-500 dark:text-violet-400">{advancedOpen ? "▲" : "▼"}</span>
      </button>

      {advancedOpen ? (
        <div className="grid gap-4 rounded-xl border border-violet-100 bg-violet-50/30 p-4 dark:border-violet-900/30 dark:bg-violet-950/20 sm:grid-cols-2 lg:grid-cols-3">
          <Dropdown
            value={v.min_rating}
            onChange={(x) => pushFilters({ min_rating: x })}
            options={minRatingOptions}
          />
          <Dropdown
            value={v.max_rating}
            onChange={(x) => pushFilters({ max_rating: x })}
            options={maxRatingOptions}
          />
          <Dropdown
            value={v.min_reviews}
            onChange={(x) => pushFilters({ min_reviews: x })}
            options={minReviewsOptions}
          />
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-zinc-400">
              {t("explore.yearFrom")}
            </label>
            <input
              type="number"
              min={1900}
              max={2035}
              placeholder="1990"
              value={yearMinLocal}
              onChange={(e) => setYearMinLocal(e.target.value)}
              onBlur={() => {
                const val = yearMinLocal.trim();
                if (val === (v.year_min || "").trim()) return;
                pushFilters({ year_min: val || undefined });
              }}
              className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-zinc-400">
              {t("explore.yearTo")}
            </label>
            <input
              type="number"
              min={1900}
              max={2035}
              placeholder="2024"
              value={yearMaxLocal}
              onChange={(e) => setYearMaxLocal(e.target.value)}
              onBlur={() => {
                const val = yearMaxLocal.trim();
                if (val === (v.year_max || "").trim()) return;
                pushFilters({ year_max: val || undefined });
              }}
              className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <Dropdown
            value={v.longevity}
            onChange={(x) => pushFilters({ longevity: x })}
            options={longevityOptions}
          />
          <Dropdown
            value={v.sillage}
            onChange={(x) => pushFilters({ sillage: x })}
            options={sillageOptions}
          />
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-zinc-400">
              {t("explore.accordsLabel")}
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <input
                type="text"
                value={accordsDraft}
                onChange={(e) => setAccordsDraft(e.target.value)}
                placeholder={t("explore.accordsPlaceholder")}
                className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
              <div className="sm:w-64">
                <Dropdown
                  value=""
                  onChange={addAccordFromList}
                  options={accordPickOptions}
                  searchable
                  searchPlaceholder={t("explore.accordSearch")}
                />
              </div>
            </div>
            <div className="mt-2 max-w-md">
              <Dropdown
                value={v.accord_mode === "all" ? "all" : "any"}
                onChange={(x) => pushFilters({ accord_mode: x })}
                options={accordModeOptions}
              />
            </div>
            <p className="mt-1 text-xs text-stone-500 dark:text-zinc-500">{t("explore.accordsHint")}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
