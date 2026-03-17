type Perfume = {
  id: string;
  brand: string;
  name: string;
  image_url?: string;
  accords?: string[];
  rating?: number;
};

type PerfumeCardProps = {
  perfume: Perfume;
};

export function PerfumeCard({ perfume }: PerfumeCardProps) {
  const { brand, name, image_url, accords = [], rating } = perfume;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-violet-200/50 bg-white shadow-[0_4px_24px_rgba(139,92,246,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-400/60 hover:shadow-[0_16px_48px_rgba(139,92,246,0.15)] dark:border-violet-500/20 dark:bg-violet-950/15 dark:hover:border-violet-500/40 dark:hover:bg-violet-950/20 dark:hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]">
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image_url || "/placeholder-perfume.png"}
          alt={`${brand} ${name}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="pointer-events-none absolute inset-x-6 top-4 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {rating !== undefined && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-xs font-medium text-violet-100 backdrop-blur-md">
            ★ {rating.toFixed(1)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500 dark:text-zinc-500">
          {brand}
        </p>
        <h3 className="text-base font-semibold text-stone-900 line-clamp-2 transition group-hover:text-violet-700 dark:text-zinc-100 dark:group-hover:text-violet-200">
          {name}
        </h3>

        {accords.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {accords.slice(0, 3).map((acc, index) => (
              <span
                key={`${acc}-${index}`}
                className="rounded-full border border-stone-200/70 bg-stone-100/80 px-2.5 py-0.5 text-[11px] text-stone-600 dark:border-violet-500/10 dark:bg-violet-950/40 dark:text-zinc-400"
              >
                {acc}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
