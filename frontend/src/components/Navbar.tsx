"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthModal } from "./AuthModal";
import { authPrimaryCtaClassName } from "@/lib/authUi";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Navbar() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { count: favoriteCount } = useFavorites();
  const [authOpen, setAuthOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function openAuth() {
      setAuthOpen(true);
    }
    window.addEventListener("perfiai:open-auth", openAuth);
    return () => window.removeEventListener("perfiai:open-auth", openAuth);
  }, []);

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
        className="no-interactive-hover group flex min-w-0 items-center gap-3 rounded-2xl transition-opacity duration-200 opacity-90 hover:opacity-100"
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
          {(
            [
              { href: "/", label: t("nav.home") },
              { href: "/explore", label: t("nav.explore") },
              { href: "/brands", label: t("nav.brands") },
              { href: "/compare", label: t("nav.compare") },
              {
                href: "/favorites",
                label: t("nav.favorites"),
                badge: user ? favoriteCount : 0,
              },
            ] as { href: string; label: string; badge?: number }[]
          ).map(({ href, label, badge }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={(event) => handleNavClick(event, href)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-center text-sm font-medium ring-2 ring-transparent transition-all duration-200 sm:flex-none sm:px-4 ${
                  isActive
                    ? "bg-white text-violet-800 shadow-sm dark:bg-violet-500/15 dark:text-violet-200 dark:shadow-[inset_0_0_0_1px_rgba(139,92,246,0.2)]"
                    : "text-stone-500 hover:bg-white/80 hover:text-violet-800 hover:shadow-md hover:ring-violet-300/40 dark:text-zinc-400 dark:hover:bg-violet-500/20 dark:hover:text-violet-200 dark:hover:ring-violet-500/30"
                }`}
              >
                <span>{label}</span>
                {typeof badge === "number" && user && badge > 0 ? (
                  <span className="min-w-[1.25rem] rounded-full bg-pink-500 px-1 text-center text-[10px] font-bold leading-5 text-white">
                    {badge > 99 ? "99+" : badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center justify-end gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-stone-600 dark:text-zinc-400 sm:inline">
                {user.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-xl px-3 py-2 text-sm font-medium text-stone-500 ring-2 ring-transparent transition-all duration-200 hover:bg-violet-100/90 hover:text-violet-800 hover:ring-violet-300/50 dark:text-zinc-400 dark:hover:bg-violet-500/20 dark:hover:text-violet-200 dark:hover:ring-violet-500/35"
              >
                {t("auth.logout")}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className={authPrimaryCtaClassName}
            >
              {t("auth.login")}
            </button>
          )}
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </nav>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
