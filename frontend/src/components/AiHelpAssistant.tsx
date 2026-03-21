"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiUrl } from "@/lib/api";
import { gradientCompactCtaClassName } from "@/lib/authUi";
import { localHelpAnswer } from "@/lib/helpAssistantLocal";
import type { Locale } from "@/lib/translations";

type ChatMessage = { role: "user" | "assistant"; text: string };

export function AiHelpAssistant() {
  const { t, locale } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setMessages((prev) => {
      if (prev.length > 0) return prev;
      return [{ role: "assistant", text: t("helpAssistant.welcome") }];
    });
  }, [open, t]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open, loading]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ask = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q || loading) return;

      setLoading(true);
      setMessages((m) => [...m, { role: "user", text: q }]);

      let remoteAnswer: string | null = null;
      try {
        const res = await fetch(apiUrl("/ai-help"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: q,
            path: pathname || "",
            locale: locale as Locale,
          }),
        });
        const raw = await res.text();
        if (res.ok && raw) {
          try {
            const data = JSON.parse(raw) as { answer?: string };
            if (typeof data.answer === "string" && data.answer.trim()) {
              remoteAnswer = data.answer.trim();
            }
          } catch {
            /* HTML 404 vb. — yerel yanıta düş */
          }
        }
      } catch {
        /* Ağ / CORS — yerel yanıt */
      }

      const answer =
        remoteAnswer ??
        localHelpAnswer(q, pathname || undefined, locale as Locale);

      setMessages((m) => [...m, { role: "assistant", text: answer }]);
      setLoading(false);
    },
    [loading, locale, pathname]
  );

  const chips: { label: string; q: string }[] = [
    { label: t("helpAssistant.chipSearch"), q: t("helpAssistant.chipSearchQ") },
    {
      label: t("helpAssistant.chipExplore"),
      q: t("helpAssistant.chipExploreQ"),
    },
    {
      label: t("helpAssistant.chipCompare"),
      q: t("helpAssistant.chipCompareQ"),
    },
    {
      label: t("helpAssistant.chipAccount"),
      q: t("helpAssistant.chipAccountQ"),
    },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput("");
    void ask(q);
  }

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label={t("helpAssistant.panelCloseAria")}
          className="fixed inset-0 z-[90] bg-black/25 backdrop-blur-[2px] md:bg-black/15"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] z-[100] flex flex-col items-end gap-3">
        {open && (
          <div
            role="dialog"
            aria-label={t("helpAssistant.title")}
            className="flex max-h-[min(72vh,540px)] w-[min(100vw-2rem,400px)] flex-col overflow-hidden rounded-2xl border border-violet-200/60 bg-white/95 shadow-[0_20px_60px_rgba(139,92,246,0.18)] backdrop-blur-xl dark:border-violet-500/30 dark:bg-zinc-900/95 dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-start justify-between gap-2 border-b border-violet-200/40 px-4 py-3 dark:border-violet-800/40">
              <div>
                <h2 className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-base font-bold text-transparent dark:from-violet-300 dark:to-pink-300">
                  {t("helpAssistant.title")}
                </h2>
                <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                  {t("helpAssistant.subtitle")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-lg px-2 py-1 text-sm font-medium text-zinc-500 transition hover:bg-violet-100 hover:text-violet-700 dark:text-zinc-400 dark:hover:bg-violet-950 dark:hover:text-violet-200"
              >
                {t("helpAssistant.close")}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 border-b border-violet-100/80 px-3 py-2 dark:border-violet-900/50">
              {chips.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  disabled={loading}
                  onClick={() => void ask(c.q)}
                  className="rounded-full border border-violet-300/90 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-950 transition hover:border-violet-600 hover:bg-violet-600 hover:text-white disabled:opacity-50 dark:border-violet-500/70 dark:bg-zinc-800/90 dark:text-violet-100 dark:hover:border-violet-400 dark:hover:bg-violet-600 dark:hover:text-white"
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div
              ref={listRef}
              className="min-h-[120px] flex-1 space-y-3 overflow-y-auto px-4 py-3"
            >
              {messages.map((m, i) => (
                <div
                  key={`${i}-${m.role}`}
                  className={
                    m.role === "user"
                      ? "ml-6 rounded-xl rounded-br-sm bg-gradient-to-br from-violet-600 to-pink-500 px-3 py-2 text-sm text-white shadow-md"
                      : "mr-4 rounded-xl rounded-bl-sm border border-violet-100 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 dark:border-violet-900/40 dark:bg-zinc-800/80 dark:text-zinc-100"
                  }
                >
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                </div>
              ))}
              {loading && (
                <p className="text-xs italic text-violet-600 dark:text-violet-300">
                  {t("helpAssistant.loading")}
                </p>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-violet-100 p-3 dark:border-violet-900/50"
            >
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("helpAssistant.placeholder")}
                  disabled={loading}
                  className="min-w-0 flex-1 rounded-xl border border-violet-200/80 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400/30 dark:border-violet-700/50 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                  maxLength={800}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className={`${gradientCompactCtaClassName} shrink-0 px-4 py-2 text-sm`}
                >
                  {t("helpAssistant.send")}
                </button>
              </div>
              <p className="mt-2 text-[10px] leading-snug text-zinc-500 dark:text-zinc-500">
                {t("helpAssistant.disclaimer")}
              </p>
            </form>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          title={t("helpAssistant.fabLabel")}
          aria-label={open ? t("helpAssistant.panelCloseAria") : t("helpAssistant.fabAria")}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-pink-500 text-2xl text-white shadow-[0_8px_32px_rgba(139,92,246,0.45)] ring-2 ring-white/30 transition-all duration-200 hover:scale-110 hover:shadow-[0_12px_40px_rgba(139,92,246,0.55)] hover:ring-violet-200/70 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-400/50 active:scale-95 dark:ring-violet-400/20"
        >
          {open ? (
            <span className="text-2xl font-light leading-none" aria-hidden>
              ×
            </span>
          ) : (
            <span aria-hidden>✦</span>
          )}
        </button>
      </div>
    </>
  );
}
