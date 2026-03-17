"use client";

import Link from "next/link";
import Image from "next/image";
import { PerfumeCard } from "@/components/PerfumeCard";
import { SearchSection } from "@/components/SearchSection";
import { useLanguage } from "@/contexts/LanguageContext";

type Perfume = {
  id: string;
  brand: string;
  name: string;
  image_url?: string;
  accords?: string[];
  rating?: number;
};

const SEASONS = [
  { slug: "summer", icon: "☀️", gradient: "from-amber-400 to-orange-500" },
  { slug: "winter", icon: "❄️", gradient: "from-blue-400 to-indigo-500" },
  { slug: "spring", icon: "🌸", gradient: "from-pink-400 to-rose-500" },
  { slug: "fall", icon: "🍂", gradient: "from-orange-400 to-red-500" },
];

const SCENT_TYPES = [
  { q: "fresh", emoji: "🌿" },
  { q: "sweet", emoji: "🍯" },
  { q: "woody", emoji: "🪵" },
  { q: "citrus", emoji: "🍊" },
  { q: "spicy", emoji: "🌶️" },
  { q: "floral", emoji: "🌹" },
];

type HomeContentProps = {
  perfumes: Perfume[];
};

export function HomeContent({ perfumes }: HomeContentProps) {
  const { t } = useLanguage();

  return (
    <main className="space-y-14 sm:space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-violet-200/40 bg-gradient-to-br from-violet-50 via-white to-pink-50/60 p-6 shadow-2xl dark:border-violet-500/20 dark:from-violet-950/50 dark:via-violet-950/20 dark:to-pink-950/30 sm:p-10 lg:p-20">
        {/* Decorative glows */}
        <div className="absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-violet-400/20 blur-3xl animate-pulse-glow dark:bg-violet-500/20" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-pink-400/15 blur-3xl animate-float dark:bg-pink-500/15" />
        <div className="absolute right-1/4 top-1/4 h-48 w-48 rounded-full bg-amber-300/10 blur-3xl animate-pulse-glow dark:bg-amber-400/10" style={{ animationDelay: "2s" }} />

        {/* Twinkle dots */}
        <div className="absolute right-[15%] top-[20%] h-2 w-2 rounded-full bg-violet-500/70 animate-twinkle" />
        <div className="absolute left-[20%] top-[15%] h-1.5 w-1.5 rounded-full bg-pink-500/60 animate-twinkle animate-twinkle-delay-1" />
        <div className="absolute right-[35%] top-[75%] h-1.5 w-1.5 rounded-full bg-amber-400/70 animate-twinkle animate-twinkle-delay-2" />
        <div className="absolute left-[5%] top-[60%] h-1 w-1 rounded-full bg-violet-400/50 animate-twinkle animate-twinkle-delay-3" />
        <div className="absolute right-[8%] top-[55%] h-2 w-2 rounded-full bg-pink-400/40 animate-twinkle animate-twinkle-delay-4" />

        <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-16">
          {/* Text content */}
          <div className="flex-1 space-y-5 sm:space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-violet-400/50 bg-violet-100/80 px-4 py-2 text-xs font-semibold text-violet-800 shadow-sm animate-slide-up dark:border-violet-500/30 dark:bg-violet-950/60 dark:text-violet-200 sm:px-5 sm:text-sm">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-gradient-to-r from-violet-500 to-pink-500" />
              {t("home.badge")}
            </div>

            <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-stone-900 animate-slide-up sm:text-5xl lg:text-6xl dark:text-zinc-50" style={{ animationDelay: "0.1s" }}>
              {t("home.title1")}
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 bg-clip-text text-transparent animate-gradient-shift dark:from-violet-300 dark:via-pink-300 dark:to-amber-300">
                {t("home.title2")}
              </span>
            </h1>

            <p className="max-w-xl text-sm text-stone-600 animate-slide-up dark:text-zinc-400 sm:text-base" style={{ animationDelay: "0.2s" }}>
              {t("home.subtitle")}
            </p>

            <p className="inline-flex items-center gap-2 rounded-xl bg-violet-100/60 px-4 py-2 text-sm font-medium text-violet-700 animate-slide-up dark:bg-violet-950/40 dark:text-violet-300/90" style={{ animationDelay: "0.3s" }}>
              💡 {t("home.searchHint")}
            </p>
          </div>

          {/* Logo display */}
          <div className="relative hidden shrink-0 lg:block">
            <div className="relative h-52 w-52 animate-float">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/20 via-pink-500/15 to-amber-500/10 blur-2xl" />
              <Image
                src="/logo.png"
                alt="Perfai"
                width={208}
                height={208}
                className="relative h-full w-full object-contain drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <SearchSection />

      {/* Season discovery */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-violet-500 to-pink-500" />
          <h2 className="text-xl font-bold tracking-tight text-stone-800 dark:text-zinc-200">
            {t("home.discoverBySeason")}
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SEASONS.map((s, i) => (
            <Link
              key={s.slug}
              href={`/explore?season=${s.slug}`}
              className="group relative overflow-hidden rounded-2xl border-2 border-violet-200/30 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-400/50 hover:shadow-xl hover:shadow-violet-500/10 dark:border-violet-500/15 dark:bg-violet-950/10 dark:hover:border-violet-500/40 dark:hover:shadow-violet-500/15"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${s.gradient} opacity-10 transition duration-500 group-hover:scale-150 group-hover:opacity-20`} />
              <div className="relative flex items-center gap-4">
                <span className="text-4xl transition duration-300 group-hover:scale-110">{s.icon}</span>
                <div>
                  <p className="font-bold text-stone-900 transition group-hover:text-violet-700 dark:text-zinc-100 dark:group-hover:text-violet-200">
                    {t(`seasons.${s.slug}`)}
                  </p>
                  <p className="text-sm text-stone-500 dark:text-zinc-500">
                    {t("home.seasonPerfumes")}
                  </p>
                </div>
                <span className="ml-auto text-2xl text-violet-500/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-violet-500 dark:group-hover:text-violet-400">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand discovery - gradient card */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-violet-200/40 bg-gradient-to-r from-violet-50 via-white to-pink-50/60 p-6 shadow-xl dark:border-violet-500/20 dark:from-violet-950/30 dark:via-violet-950/15 dark:to-pink-950/20 sm:p-10">
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-400/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-pink-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-violet-500 to-pink-500" />
              <h2 className="text-xl font-bold text-stone-800 dark:text-zinc-200">
                {t("home.discoverByBrand")}
              </h2>
            </div>
            <p className="ml-4 text-stone-600 dark:text-zinc-500">{t("home.brandDesc")}</p>
          </div>
          <Link
            href="/brands"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 px-6 py-3.5 text-center font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/25 hover:brightness-110 sm:w-auto sm:px-8 sm:py-4"
          >
            {t("home.exploreBrands")}
            <span className="text-xl transition duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      {/* Scent types */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-pink-500 to-amber-500" />
          <h2 className="text-xl font-bold tracking-tight text-stone-800 dark:text-zinc-200">
            {t("home.discoverByScent")}
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {SCENT_TYPES.map((st) => (
            <Link
              key={st.q}
              href={`/explore?q=${encodeURIComponent(st.q)}`}
              className="group flex items-center gap-2 rounded-full border-2 border-violet-200/30 bg-white px-5 py-3 text-sm font-semibold text-stone-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/50 hover:bg-violet-50 hover:text-violet-800 hover:shadow-md hover:shadow-violet-500/10 dark:border-violet-500/15 dark:bg-violet-950/10 dark:text-zinc-300 dark:hover:border-violet-500/40 dark:hover:bg-violet-950/20 dark:hover:text-violet-100"
            >
              <span className="transition duration-300 group-hover:scale-110">{st.emoji}</span>
              {t(`scentTypes.${st.q}`)}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured perfumes */}
      <section className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-violet-500 to-amber-500" />
            <h2 className="text-2xl font-bold tracking-tight text-stone-800 dark:text-zinc-100">
              {t("home.featured")}
            </h2>
          </div>
          <Link
            href="/explore"
            className="group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-violet-500 px-5 py-2.5 text-sm font-bold text-violet-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-violet-600 hover:to-pink-500 hover:text-white hover:shadow-lg hover:shadow-violet-500/20 dark:border-violet-500 dark:text-violet-200 dark:hover:text-white sm:w-auto"
          >
            {t("home.seeAll")}
            <span className="text-lg transition duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {perfumes.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-violet-200/50 bg-violet-50/50 px-8 py-20 text-center text-stone-500 dark:border-violet-500/20 dark:bg-violet-950/10 dark:text-zinc-500">
            {t("home.loadError")}
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {perfumes.map((p) => (
              <Link
                key={p.id}
                href={`/perfume/${p.id}`}
                className="group block transition duration-300 hover:-translate-y-2"
              >
                <PerfumeCard perfume={p} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
