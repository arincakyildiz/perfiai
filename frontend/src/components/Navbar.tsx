"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Navbar() {
  const { t } = useLanguage();

  return (
    <header className="mb-10 flex items-center justify-between border-b border-violet-200/30 pb-6 dark:border-violet-500/20">
      <Link
        href="/"
        className="group flex items-center gap-3 transition opacity-90 hover:opacity-100"
      >
        <div className="relative h-11 w-11 overflow-hidden rounded-xl transition duration-300 group-hover:shadow-[0_0_24px_rgba(139,92,246,0.3)]">
          <Image
            src="/logo.png"
            alt="Perfai"
            width={44}
            height={44}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="animate-gradient-shift bg-gradient-to-r from-violet-600 via-pink-500 to-violet-600 bg-[length:200%_auto] bg-clip-text text-lg font-semibold tracking-tight text-transparent dark:from-violet-300 dark:via-pink-300 dark:to-violet-300">
            Perfai
          </span>
          <span className="text-[11px] text-stone-500 dark:text-violet-300/70">
            {t("nav.tagline")}
          </span>
        </div>
      </Link>

      <nav className="flex items-center gap-2">
        <Link
          href="/"
          className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-violet-100 hover:text-violet-800 dark:text-zinc-400 dark:hover:bg-violet-500/10 dark:hover:text-violet-200"
        >
          {t("nav.home")}
        </Link>
        <Link
          href="/explore"
          className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-violet-100 hover:text-violet-800 dark:text-zinc-400 dark:hover:bg-violet-500/10 dark:hover:text-violet-200"
        >
          {t("nav.explore")}
        </Link>
        <Link
          href="/brands"
          className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-violet-100 hover:text-violet-800 dark:text-zinc-400 dark:hover:bg-violet-500/10 dark:hover:text-violet-200"
        >
          {t("nav.brands")}
        </Link>
        <ThemeSwitcher />
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
