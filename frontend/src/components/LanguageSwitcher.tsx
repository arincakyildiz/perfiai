"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { Locale } from "@/lib/translations";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-violet-200/50 bg-violet-50/50 p-0.5 dark:border-violet-500/30 dark:bg-violet-950/10">
      {(["tr", "en"] as Locale[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
            locale === l
              ? "bg-violet-500/40 text-violet-800 dark:bg-violet-500/30 dark:text-violet-200"
              : "text-stone-600 hover:text-violet-700 dark:text-zinc-500 dark:hover:text-zinc-300"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
