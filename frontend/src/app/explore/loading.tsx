import { PerfumeCardSkeleton } from "@/components/PerfumeCardSkeleton";

export default function ExploreLoading() {
  return (
    <main className="space-y-8">
      <div className="space-y-2">
        <div className="h-9 w-64 animate-pulse rounded bg-stone-200 dark:bg-violet-950/30" />
        <div className="h-4 w-40 animate-pulse rounded bg-stone-200 dark:bg-violet-950/30" />
      </div>
      <div className="h-24 animate-pulse rounded-2xl bg-stone-200 dark:bg-violet-950/30" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <PerfumeCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
