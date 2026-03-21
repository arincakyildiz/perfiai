/**
 * Shared styles for auth entry points (modal, navbar, compare teaser, favorites).
 * Strong hover / focus / active feedback so targets feel interactive.
 */

export const authPrimaryCtaClassName =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 via-violet-600 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md ring-2 ring-transparent transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/35 hover:ring-violet-300/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 dark:from-violet-500 dark:via-violet-600 dark:to-pink-500 dark:hover:shadow-pink-500/20 dark:focus-visible:ring-offset-zinc-900";

/** Slightly larger padding for hero / compare lock card */
export const authPrimaryCtaLgClassName =
  "mx-auto inline-flex w-full max-w-sm items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 via-violet-600 to-pink-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg ring-2 ring-transparent transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/40 hover:ring-violet-300/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98] dark:from-violet-500 dark:via-violet-600 dark:to-pink-500 dark:hover:shadow-pink-500/25 sm:w-auto sm:max-w-none";

export const authSecondaryCtaClassName =
  "inline-flex flex-1 items-center justify-center rounded-xl border-2 border-stone-200 bg-stone-50 py-2.5 text-sm font-semibold text-stone-700 shadow-sm ring-violet-400/0 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50/90 hover:shadow-md hover:ring-2 hover:ring-violet-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98] dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-violet-500/50 dark:hover:bg-violet-950/40 dark:hover:ring-violet-500/20 dark:focus-visible:ring-offset-zinc-900";

/** Küçük mor-pembe CTA’lar (yardım gönder, kıyasla, favoriler…) — belirgin hover */
export const gradientCompactCtaClassName =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 font-semibold text-white shadow-md ring-2 ring-transparent transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/35 hover:ring-violet-300/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-md disabled:hover:ring-transparent dark:from-violet-500 dark:to-pink-500 dark:hover:shadow-pink-500/25 dark:focus-visible:ring-offset-zinc-900";
