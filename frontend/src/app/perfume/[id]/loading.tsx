export default function PerfumeDetailLoading() {
  return (
    <main className="space-y-10 sm:space-y-12">
      <div className="h-5 w-32 animate-pulse rounded bg-stone-200 dark:bg-violet-950/30" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-12">
        <div className="mx-auto w-full max-w-md">
          <div className="aspect-[3/4] animate-pulse rounded-3xl bg-stone-200 dark:bg-violet-950/30" />
        </div>
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-stone-200 dark:bg-violet-950/30" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-stone-200 dark:bg-violet-950/30" />
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-stone-200 dark:bg-violet-950/30" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-stone-200 dark:bg-violet-950/30" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-stone-200 dark:bg-violet-950/30" />
            <div className="h-4 w-4/5 max-w-md animate-pulse rounded bg-stone-200 dark:bg-violet-950/30" />
          </div>
          <div className="h-24 animate-pulse rounded-2xl bg-stone-200 dark:bg-violet-950/30" />
        </div>
      </div>
    </main>
  );
}
