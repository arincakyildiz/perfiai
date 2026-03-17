"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Navbar() {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  function handleNavClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      pathname === href
    ) {
      return;
    }

    event.preventDefault();

    if ("startViewTransition" in document) {
      // Smoothly animate route changes for header navigation.
      (document as Document & {
        startViewTransition?: (callback: () => void) => void;
      }).startViewTransition?.(() => {
        router.push(href);
      });
      return;
    }

    router.push(href);
  }

  return (
    <header className="glass sticky top-3 z-30 mb-8 flex flex-col gap-4 rounded-3xl border border-violet-200/50 bg-white/75 px-4 py-4 shadow-[0_16px_50px_rgba(139,92,246,0.08)] dark:border-violet-500/20 dark:bg-[#120f18]/70 dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:mb-10 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <Link
        href="/"
        className="group flex min-w-0 items-center gap-3 transition opacity-90 hover:opacity-100"
      >
        <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-violet-200/50 bg-white/70 p-1 transition duration-300 group-hover:shadow-[0_0_24px_rgba(139,92,246,0.3)] dark:border-violet-500/20 dark:bg-violet-950/20">
          <Image
            src="/logo.png"
            alt="Perfai"
            width={44}
            height={44}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="animate-gradient-shift truncate bg-gradient-to-r from-violet-600 via-pink-500 to-violet-600 bg-[length:200%_auto] bg-clip-text text-lg font-semibold tracking-tight text-transparent dark:from-violet-300 dark:via-pink-300 dark:to-violet-300">
            Perfai
          </span>
          <span className="truncate text-[10px] text-stone-500 dark:text-violet-300/70 sm:text-[11px]">
            {t("nav.tagline")}
          </span>
        </div>
      </Link>

      <nav className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
        <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-violet-200/40 bg-violet-50/60 p-1 dark:border-violet-500/15 dark:bg-violet-950/15">
          {([
            { href: "/", label: t("nav.home") },
            { href: "/explore", label: t("nav.explore") },
            { href: "/brands", label: t("nav.brands") },
          ] as { href: string; label: string }[]).map(({ href, label }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={(event) => handleNavClick(event, href)}
                className={`flex-1 rounded-xl px-3 py-2 text-center text-sm font-medium transition-all duration-200 sm:flex-none sm:px-4 ${
                  isActive
                    ? "bg-white text-violet-800 shadow-sm dark:bg-violet-500/15 dark:text-violet-200 dark:shadow-[inset_0_0_0_1px_rgba(139,92,246,0.2)]"
                    : "text-stone-500 hover:bg-white/70 hover:text-violet-700 hover:shadow-sm dark:text-zinc-400 dark:hover:bg-violet-500/10 dark:hover:text-violet-300"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center justify-end gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}
