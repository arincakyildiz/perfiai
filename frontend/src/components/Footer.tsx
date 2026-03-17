"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-16 py-8">
      <div className="glass flex flex-col items-center gap-5 rounded-3xl border border-violet-200/40 bg-white/70 px-5 py-6 text-center shadow-[0_16px_50px_rgba(139,92,246,0.06)] dark:border-violet-500/20 dark:bg-violet-950/15 dark:shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-violet-200/50 bg-white/80 p-1 dark:border-violet-500/20 dark:bg-violet-950/20">
            <Image src="/logo.png" alt="Perfai" width={28} height={28} className="h-full w-full object-contain" />
          </div>
          <div className="space-y-1">
            <p className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-sm font-semibold text-transparent dark:from-violet-300 dark:to-pink-300">
              Perfai
            </p>
            <p className="text-[11px] text-stone-500 dark:text-zinc-500">
              {t("footer.tagline")}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-stone-500 dark:text-zinc-500 sm:justify-end">
          <Link href="/" className="hover-underline rounded-full border border-transparent px-3 py-1.5 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 dark:hover:border-violet-500/20 dark:hover:bg-violet-500/10 dark:hover:text-violet-300">
            {t("nav.home")}
          </Link>
          <Link href="/explore" className="hover-underline rounded-full border border-transparent px-3 py-1.5 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 dark:hover:border-violet-500/20 dark:hover:bg-violet-500/10 dark:hover:text-violet-300">
            {t("nav.explore")}
          </Link>
          <Link href="/brands" className="hover-underline rounded-full border border-transparent px-3 py-1.5 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 dark:hover:border-violet-500/20 dark:hover:bg-violet-500/10 dark:hover:text-violet-300">
            {t("nav.brands")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
