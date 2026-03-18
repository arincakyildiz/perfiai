"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export function VerifiedBanner() {
  const { t } = useLanguage();
  const { user, resendVerification } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!user || user.verified) return null;

  async function handleResend() {
    setLoading(true);
    setSent(false);
    const r = await resendVerification();
    setLoading(false);
    if (r.ok) setSent(true);
  }

  return (
    <div className="rounded-2xl border-2 border-amber-200/80 bg-amber-50 px-4 py-3 dark:border-amber-500/30 dark:bg-amber-950/20">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          {t("auth.verifyRequired")}
        </p>
        <button
          type="button"
          onClick={handleResend}
          disabled={loading || sent}
          className="rounded-lg bg-amber-200 px-3 py-1.5 text-xs font-medium text-amber-900 transition hover:bg-amber-300 disabled:opacity-60 dark:bg-amber-800/50 dark:text-amber-100 dark:hover:bg-amber-800"
        >
          {loading ? "..." : sent ? t("auth.verifySent") : t("auth.verifyResend")}
        </button>
      </div>
    </div>
  );
}
