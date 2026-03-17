"use client";

import { useLanguage } from "@/contexts/LanguageContext";

type AccordsChartProps = {
  accords: string[];
};

const CATEGORIES = [
  "fresh",
  "sweet",
  "woody",
  "citrus",
  "spicy",
  "floral",
  "aromatic",
  "musky",
  "violet",
];

function normalizeAccord(a: string): string {
  const lower = a.toLowerCase();
  if (lower.includes("fresh")) return "fresh";
  if (lower.includes("sweet")) return "sweet";
  if (lower.includes("woody") || lower.includes("wood")) return "woody";
  if (lower.includes("citrus")) return "citrus";
  if (lower.includes("spicy")) return "spicy";
  if (lower.includes("floral") || lower.includes("flower")) return "floral";
  if (lower.includes("aromatic")) return "aromatic";
  if (lower.includes("musky") || lower.includes("musk")) return "musky";
  if (lower.includes("violet")) return "violet";
  return lower.split(" ")[0] || lower;
}

export function AccordsChart({ accords }: AccordsChartProps) {
  const { t } = useLanguage();
  const values: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    values[cat] = 0;
  }
  for (const a of accords) {
    const key = normalizeAccord(a);
    if (key in values) {
      values[key] = Math.min(1, values[key] + 0.4);
    }
  }
  const maxVal = Math.max(...Object.values(values), 0.01);

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-zinc-500">
        {t("perfume.scentProfile")}
      </h2>
      <div className="space-y-2.5">
        {CATEGORIES.filter((c) => values[c] > 0).map((cat) => (
          <div key={cat} className="flex items-center gap-3">
            <span className="w-20 text-xs capitalize text-stone-600 dark:text-zinc-400">
              {cat}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200 dark:bg-violet-950/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600/80 to-violet-500/60 transition-all duration-500"
                style={{
                  width: `${(values[cat] / maxVal) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
