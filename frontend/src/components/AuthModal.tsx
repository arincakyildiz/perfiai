"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
};

export function AuthModal({ open, onClose, initialTab = "login" }: AuthModalProps) {
  const { t } = useLanguage();
  const { sendLoginCode, verifyCode, register } = useAuth();
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const r = await sendLoginCode(email);
    setLoading(false);
    if (r.ok) setStep("code");
    else setError(r.error || "");
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const r = await verifyCode(email, code, remember);
    setLoading(false);
    if (r.ok) onClose();
    else setError(r.error || "");
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const r = await register(email, name || undefined);
    setLoading(false);
    if (r.ok) onClose();
    else setError(r.error || "");
  }

  function switchTab(newTab: "login" | "register") {
    setTab(newTab);
    setStep("email");
    setError("");
    setCode("");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-violet-200/50 bg-white p-6 shadow-xl dark:border-violet-500/20 dark:bg-violet-950/20">
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => switchTab("login")}
            className={`flex-1 rounded-xl py-2 text-sm font-medium transition ${
              tab === "login"
                ? "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200"
                : "text-stone-500 hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-violet-950/30"
            }`}
          >
            {t("auth.login")}
          </button>
          <button
            type="button"
            onClick={() => switchTab("register")}
            className={`flex-1 rounded-xl py-2 text-sm font-medium transition ${
              tab === "register"
                ? "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200"
                : "text-stone-500 hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-violet-950/30"
            }`}
          >
            {t("auth.register")}
          </button>
        </div>

        {tab === "register" ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-500 dark:text-zinc-500">
                {t("auth.name")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("auth.namePlaceholder")}
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-stone-900 dark:border-violet-500/20 dark:bg-violet-950/10 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-500 dark:text-zinc-500">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-stone-900 dark:border-violet-500/20 dark:bg-violet-950/10 dark:text-zinc-100"
              />
            </div>
            <p className="text-xs text-stone-500 dark:text-zinc-500">
              {t("auth.registerHint")}
            </p>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-stone-200 py-2.5 text-sm font-medium text-stone-600 dark:border-violet-500/20 dark:text-zinc-400"
              >
                {t("auth.cancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60 dark:bg-violet-500 dark:hover:bg-violet-600"
              >
                {loading ? "..." : t("auth.register")}
              </button>
            </div>
          </form>
        ) : step === "email" ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-500 dark:text-zinc-500">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-stone-900 dark:border-violet-500/20 dark:bg-violet-950/10 dark:text-zinc-100"
              />
            </div>
            <p className="text-xs text-stone-500 dark:text-zinc-500">
              {t("auth.codeHint")}
            </p>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-stone-200 py-2.5 text-sm font-medium text-stone-600 dark:border-violet-500/20 dark:text-zinc-400"
              >
                {t("auth.cancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60 dark:bg-violet-500 dark:hover:bg-violet-600"
              >
                {loading ? "..." : t("auth.sendCode")}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <p className="text-sm text-stone-600 dark:text-zinc-400">
              {t("auth.codeSent")} <strong>{email}</strong>
            </p>
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-500 dark:text-zinc-500">
                {t("auth.code")}
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-center text-lg tracking-[0.5em] text-stone-900 dark:border-violet-500/20 dark:bg-violet-950/10 dark:text-zinc-100"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-stone-300"
              />
              <span className="text-sm text-stone-600 dark:text-zinc-400">
                {t("auth.remember")}
              </span>
            </label>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setStep("email"); setError(""); setCode(""); }}
                className="flex-1 rounded-xl border border-stone-200 py-2.5 text-sm font-medium text-stone-600 dark:border-violet-500/20 dark:text-zinc-400"
              >
                {t("auth.back")}
              </button>
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60 dark:bg-violet-500 dark:hover:bg-violet-600"
              >
                {loading ? "..." : t("auth.login")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
