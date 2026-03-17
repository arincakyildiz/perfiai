"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-16 border-t border-violet-200/30 py-8 dark:border-violet-500/20">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="relative h-7 w-7 overflow-hidden rounded-lg">
            <Image src="/logo.png" alt="Perfai" width={28} height={28} className="h-full w-full object-contain" />
          </div>
          <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-sm font-semibold text-transparent dark:from-violet-300 dark:to-pink-300">
            Perfai
          </span>
        </div>
        <p className="text-xs text-stone-500 dark:text-zinc-600">
          {t("footer.tagline")}
        </p>
        <div className="flex gap-6 text-xs text-stone-500 dark:text-zinc-600">
          <Link href="/" className="transition hover:text-violet-600 dark:hover:text-violet-300">
            {t("nav.home")}
          </Link>
          <Link href="/explore" className="transition hover:text-violet-600 dark:hover:text-violet-300">
            {t("nav.explore")}
          </Link>
          <Link href="/brands" className="transition hover:text-violet-600 dark:hover:text-violet-300">
            {t("nav.brands")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
