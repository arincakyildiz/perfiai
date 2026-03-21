"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useLanguage } from "@/contexts/LanguageContext";

type FavoriteButtonProps = {
  perfumeId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function FavoriteButton({
  perfumeId,
  size = "md",
  className = "",
}: FavoriteButtonProps) {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { isFavorite, toggleFavorite, syncing } = useFavorites();
  const active = isFavorite(perfumeId);

  const pad =
    size === "lg" ? "p-3" : size === "sm" ? "p-1.5" : "p-2";
  const icon =
    size === "lg" ? "h-6 w-6" : size === "sm" ? "h-4 w-4" : "h-5 w-5";

  const guestTitle = t("favorites.loginToSaveHeart");
  const addTitle = t("favorites.addToList");
  const removeTitle = t("favorites.removeFromList");

  return (
    <button
      type="button"
      disabled={authLoading || syncing}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await toggleFavorite(perfumeId);
      }}
      className={`rounded-full border border-white/20 bg-black/45 text-white shadow-lg backdrop-blur-md ring-2 ring-transparent transition-all duration-200 hover:scale-110 hover:bg-black/60 hover:shadow-xl hover:ring-pink-300/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 active:scale-95 disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100 ${pad} ${className}`}
      aria-pressed={active}
      aria-label={!user ? guestTitle : active ? removeTitle : addTitle}
      title={!user ? guestTitle : active ? removeTitle : addTitle}
    >
      <svg
        viewBox="0 0 24 24"
        className={`${icon} ${!user ? "opacity-80" : ""}`}
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
