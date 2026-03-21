import { Suspense } from "react";
import { CompareContent } from "@/components/CompareContent";

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <main className="space-y-6">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-stone-200 dark:bg-violet-950/20" />
          <div className="h-96 animate-pulse rounded-2xl bg-stone-200/80 dark:bg-violet-950/15" />
        </main>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
