"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export function BrandNotFoundContent() {
  const { t } = useLanguage();

  return (
    <main className="space-y-8">
      <Link
        href="/brands"
        className="inline-flex items-center text-sm text-zinc-500 hover:text-violet-200"
      >
        {t("brands.back")}
      </Link>
      <div className="rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 px-8 py-16 text-center text-stone-500 dark:border-violet-950/40 dark:bg-violet-950/10 dark:text-zinc-500">
        {t("brands.notFound")}
      </div>
    </main>
  );
}
