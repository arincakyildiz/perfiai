"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiUrl } from "@/lib/api";
import { authPrimaryCtaClassName } from "@/lib/authUi";
import { AuthModal } from "./AuthModal";

type RatingStarsProps = {
  perfumeId: string;
  currentRating?: number;
  userRatingCount?: number;
  onRated?: (rating: number, count: number) => void;
};

export function RatingStars({
  perfumeId,
  currentRating,
  userRatingCount = 0,
  onRated,
}: RatingStarsProps) {
  const { t } = useLanguage();
  const { user, getAuthHeaders } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const displayRating = currentRating ?? 0;
  const displayCount = userRatingCount ?? 0;

  async function handleRate(value: number) {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (!user.verified) return; // Doğrulama gerekli - VerifiedBanner gösterilir
    if (loading || submitted) return;
    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/perfumes/${perfumeId}/rate`), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ rating: value }),
      });
      const json = await res.json();
      if (json.ok) {
        setSubmitted(true);
        onRated?.(json.rating, json.user_rating_count);
      } else if (res.status === 401) {
        setAuthOpen(true);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  const active = hover || selected;
  const showInput = !submitted;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              type="button"
              disabled={loading || submitted}
              onMouseEnter={() => showInput && setHover(v)}
              onMouseLeave={() => setHover(0)}
              onClick={() => {
                if (showInput) {
                  setSelected(v);
                  handleRate(v);
                }
              }}
              className="rounded p-0.5 text-amber-400 transition hover:scale-110 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-60 dark:text-amber-500 dark:hover:text-amber-400"
              aria-label={`${v} yıldız`}
            >
              <Star filled={v <= (showInput ? active : displayRating)} />
            </button>
          ))}
        </div>
        <span className="text-sm font-medium text-stone-600 dark:text-zinc-400">
          {displayRating > 0 ? displayRating.toFixed(1) : "—"}
          {displayCount > 0 && (
            <span className="ml-1 font-normal text-stone-500 dark:text-zinc-500">
              ({displayCount} {t("perfume.rateCount")})
            </span>
          )}
        </span>
      </div>
      {showInput && (
        <p className="text-xs text-stone-500 dark:text-zinc-500">
          {!user
            ? t("auth.loginToRate")
            : !user.verified
              ? t("auth.verifyRequired")
              : t("perfume.rateTitle")}
        </p>
      )}
      {!user && showInput && (
        <button
          type="button"
          onClick={() => setAuthOpen(true)}
          className={`${authPrimaryCtaClassName} mt-2 w-full sm:w-auto`}
        >
          {t("auth.login")}
        </button>
      )}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      {submitted && (
        <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
          {t("perfume.rateThanks")}
        </p>
      )}
    </div>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
      aria-hidden
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
