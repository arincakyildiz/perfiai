"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiUrl } from "@/lib/api";
import { authPrimaryCtaClassName } from "@/lib/authUi";
import { AuthModal } from "./AuthModal";

type Comment = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
};

type CommentSectionProps = {
  perfumeId: string;
  initialComments: Comment[];
  onCommentAdded?: (comment: Comment) => void;
};

function formatDate(iso: string, locale: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return locale === "tr" ? "Az önce" : "Just now";
  if (diff < 3600000) return locale === "tr" ? `${Math.floor(diff / 60000)} dk önce` : `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return locale === "tr" ? `${Math.floor(diff / 3600000)} sa önce` : `${Math.floor(diff / 3600000)} hr ago`;
  return d.toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", { day: "numeric", month: "short", year: "numeric" });
}

export function CommentSection({
  perfumeId,
  initialComments,
  onCommentAdded,
}: CommentSectionProps) {
  const { t, locale } = useLanguage();
  const { user, getAuthHeaders } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authOpen, setAuthOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      setAuthOpen(true);
      return;
    }
    const trimmed = text.trim();
    if (!trimmed) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/perfumes/${perfumeId}/comments`), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ text: trimmed }),
      });
      const data = await res.json();
      if (data.ok && data.comment) {
        setComments((c) => [data.comment, ...c]);
        setText("");
        onCommentAdded?.(data.comment);
      } else if (res.status === 401) {
        setAuthOpen(true);
      } else {
        setError(data.error || "Yorum eklenemedi");
      }
    } catch {
      setError("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-stone-900 dark:text-zinc-100">
        {t("perfume.comments")} ({comments.length})
      </h2>

      {user && user.verified ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("perfume.commentPlaceholder")}
            rows={3}
            maxLength={500}
            className="w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 dark:border-violet-500/20 dark:bg-violet-950/10 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className={`${authPrimaryCtaClassName} disabled:hover:translate-y-0 disabled:hover:shadow-md`}
          >
            {t("perfume.commentSubmit")}
          </button>
        </form>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-violet-200/50 bg-violet-50/30 p-4 dark:border-violet-500/20 dark:bg-violet-950/10">
          <p className="text-sm text-stone-600 dark:text-zinc-400">
            {user ? t("auth.verifyRequired") : t("auth.loginToComment")}
          </p>
          {!user && (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className={`${authPrimaryCtaClassName} mt-3 w-full sm:w-auto`}
            >
              {t("auth.login")}
            </button>
          )}
        </div>
      )}

      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-stone-500 dark:text-zinc-500">
            {t("perfume.noComments")}
          </p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-violet-500/20 dark:bg-violet-950/10"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-stone-800 dark:text-zinc-200">
                  {c.userName}
                </span>
                <span className="text-xs text-stone-500 dark:text-zinc-500">
                  {formatDate(c.createdAt, locale)}
                </span>
              </div>
              <p className="mt-1 text-sm text-stone-600 dark:text-zinc-400">
                {c.text}
              </p>
            </div>
          ))
        )}
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </section>
  );
}
