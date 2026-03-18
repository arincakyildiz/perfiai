export function PerfumeCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-violet-200/30 bg-white dark:border-violet-500/15 dark:bg-violet-950/10">
      <div className="relative aspect-[3/4] animate-pulse bg-stone-200 dark:bg-violet-950/30" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="h-3 w-16 animate-pulse rounded bg-stone-200 dark:bg-violet-950/30" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-stone-200 dark:bg-violet-950/30" />
        <div className="mt-1 flex gap-1.5">
          <div className="h-5 w-14 animate-pulse rounded-full bg-stone-200 dark:bg-violet-950/30" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-stone-200 dark:bg-violet-950/30" />
          <div className="h-5 w-12 animate-pulse rounded-full bg-stone-200 dark:bg-violet-950/30" />
        </div>
      </div>
    </div>
  );
}
