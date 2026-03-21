"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  authPrimaryCtaClassName,
  authSecondaryCtaClassName,
} from "@/lib/authUi";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
};

const inputClass =
  "w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 shadow-sm outline-none transition-all duration-200 placeholder:text-stone-400 hover:border-violet-300 hover:shadow-md focus:border-violet-500 focus:ring-2 focus:ring-violet-500/25 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:hover:border-violet-500/60 dark:focus:border-violet-400 dark:focus:ring-violet-400/20";

const tabBase =
  "flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900";
const tabActive =
  "scale-[1.02] bg-white text-violet-800 shadow-md ring-1 ring-violet-200/90 dark:bg-zinc-700 dark:text-violet-200 dark:ring-violet-500/35";
const tabInactive =
  "text-stone-600 hover:scale-[1.02] hover:bg-white/80 hover:text-violet-700 hover:shadow-sm active:scale-[0.98] dark:text-zinc-400 dark:hover:bg-zinc-700/90 dark:hover:text-violet-200";

export function AuthModal({ open, onClose, initialTab = "login" }: AuthModalProps) {
  const { t } = useLanguage();
  const { sendLoginCode, verifyCode, register } = useAuth();
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [step, setStep] = useState<"email" | "code">("email");
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerDone, setRegisterDone] = useState<{
    message: string;
    devUrl?: string;
  } | null>(null);
  const [devLoginCode, setDevLoginCode] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setTab(initialTab);
    setStep("email");
    setRegisterStep(1);
    setError("");
    setCode("");
    setEmailConfirm("");
    setAcceptTerms(false);
    setRegisterDone(null);
    setDevLoginCode(null);
  }, [open, initialTab]);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setDevLoginCode(null);
    setLoading(true);
    const r = await sendLoginCode(email);
    setLoading(false);
    if (r.ok) {
      setDevLoginCode(r.devLoginCode ?? null);
      setStep("code");
    } else setError(r.error || "");
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

  function handleRegisterStep1(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError(t("auth.errorNameShort"));
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t("auth.errorEmailInvalid"));
      return;
    }
    setRegisterStep(2);
    setEmailConfirm("");
  }

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (email.trim().toLowerCase() !== emailConfirm.trim().toLowerCase()) {
      setError(t("auth.errorEmailMismatch"));
      return;
    }
    if (!acceptTerms) {
      setError(t("auth.errorTerms"));
      return;
    }
    setLoading(true);
    const r = await register(email.trim(), name.trim());
    setLoading(false);
    if (r.ok) {
      setRegisterDone({
        message: r.message || "",
        devUrl: r.devVerificationUrl,
      });
    } else setError(r.error || "");
  }

  function switchTab(newTab: "login" | "register") {
    setTab(newTab);
    setStep("email");
    setRegisterStep(1);
    setError("");
    setCode("");
    setEmailConfirm("");
    setAcceptTerms(false);
    setRegisterDone(null);
    setDevLoginCode(null);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-[2px]">
      <div
        className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl transition-all duration-300 ease-out hover:shadow-[0_24px_64px_-12px_rgba(139,92,246,0.35)] dark:border-zinc-700 dark:bg-zinc-900 dark:hover:shadow-[0_24px_64px_-12px_rgba(139,92,246,0.22)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <div className="mb-5 flex gap-1.5 rounded-xl border border-stone-200/80 bg-stone-100/90 p-1.5 shadow-inner dark:border-zinc-700/80 dark:bg-zinc-800/90">
          <button
            type="button"
            onClick={() => switchTab("login")}
            className={`${tabBase} ${tab === "login" ? tabActive : tabInactive}`}
          >
            {t("auth.login")}
          </button>
          <button
            type="button"
            onClick={() => switchTab("register")}
            className={`${tabBase} ${tab === "register" ? tabActive : tabInactive}`}
          >
            {t("auth.register")}
          </button>
        </div>

        {tab === "register" ? (
          registerDone ? (
            <div className="space-y-4 text-center">
              <h2 id="auth-modal-title" className="text-lg font-bold text-stone-900 dark:text-zinc-50">
                {t("auth.registerCreate")} ✓
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-stone-600 dark:text-zinc-300">
                {registerDone.message}
              </p>
              {registerDone.devUrl ? (
                <a
                  href={registerDone.devUrl}
                  className="inline-block text-sm font-semibold text-violet-600 underline-offset-2 transition hover:underline dark:text-violet-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("auth.openVerificationLink")}
                </a>
              ) : null}
              <button
                type="button"
                className={`${authPrimaryCtaClassName} w-full`}
                onClick={() => {
                  setRegisterDone(null);
                  onClose();
                }}
              >
                {t("auth.registerDoneClose")}
              </button>
            </div>
          ) : registerStep === 1 ? (
            <form onSubmit={handleRegisterStep1} className="space-y-4">
              <div>
                <h2 id="auth-modal-title" className="text-lg font-bold text-stone-900 dark:text-zinc-50">
                  {t("auth.registerTitle")}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-zinc-300">
                  {t("auth.registerSubtitle")}
                </p>
              </div>
              <ul className="space-y-2 rounded-xl border border-violet-100 bg-violet-50/90 px-4 py-3 text-sm text-violet-900 dark:border-violet-500/25 dark:bg-violet-950/50 dark:text-violet-100">
                <li className="flex gap-2">
                  <span className="shrink-0" aria-hidden>
                    ✓
                  </span>
                  <span>{t("auth.registerBenefit1")}</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0" aria-hidden>
                    ✓
                  </span>
                  <span>{t("auth.registerBenefit2")}</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0" aria-hidden>
                    ✓
                  </span>
                  <span>{t("auth.registerBenefit3")}</span>
                </li>
              </ul>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-zinc-400">
                  {t("auth.name")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("auth.namePlaceholder")}
                  required
                  minLength={2}
                  autoComplete="name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-zinc-400">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className={inputClass}
                />
              </div>
              {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className={authSecondaryCtaClassName}
                >
                  {t("auth.cancel")}
                </button>
                <button
                  type="submit"
                  className={`${authPrimaryCtaClassName} flex-1`}
                >
                  {t("auth.registerContinue")}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <h2 id="auth-modal-title" className="text-lg font-bold text-stone-900 dark:text-zinc-50">
                {t("auth.registerConfirmTitle")}
              </h2>
              <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm dark:border-zinc-600 dark:bg-zinc-800/80">
                <p className="font-medium text-stone-800 dark:text-zinc-100">
                  <span className="text-stone-500 dark:text-zinc-400">{t("auth.name")}: </span>
                  {name.trim()}
                </p>
                <p className="mt-1 font-medium text-stone-800 dark:text-zinc-100">
                  <span className="text-stone-500 dark:text-zinc-400">Email: </span>
                  {email.trim()}
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-zinc-400">
                  {t("auth.registerEmailAgain")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={emailConfirm}
                  onChange={(e) => setEmailConfirm(e.target.value)}
                  required
                  autoComplete="email"
                  className={inputClass}
                />
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stone-200 bg-stone-50/80 p-3 transition-all duration-200 hover:border-violet-300 hover:bg-violet-50/50 hover:shadow-md dark:border-zinc-600 dark:bg-zinc-800/50 dark:hover:border-violet-500/40 dark:hover:bg-violet-950/30">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-stone-400 text-violet-600 focus:ring-violet-500 dark:border-zinc-500 dark:bg-zinc-800"
                />
                <span className="text-sm leading-snug text-stone-700 dark:text-zinc-300">{t("auth.registerTerms")}</span>
              </label>
              <p className="text-xs leading-relaxed text-stone-500 dark:text-zinc-500">{t("auth.registerHint")}</p>
              {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setRegisterStep(1);
                    setError("");
                  }}
                  className={authSecondaryCtaClassName}
                >
                  {t("auth.registerBackEdit")}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`${authPrimaryCtaClassName} flex-1 disabled:hover:translate-y-0 disabled:hover:shadow-md`}
                >
                  {loading ? "…" : t("auth.registerCreate")}
                </button>
              </div>
            </form>
          )
        ) : step === "email" ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-zinc-400">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={inputClass}
              />
            </div>
            <p className="text-sm text-stone-600 dark:text-zinc-300">{t("auth.codeHint")}</p>
            {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className={authSecondaryCtaClassName}
              >
                {t("auth.cancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`${authPrimaryCtaClassName} flex-1 disabled:hover:translate-y-0 disabled:hover:shadow-md`}
              >
                {loading ? "…" : t("auth.sendCode")}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <p className="text-sm text-stone-700 dark:text-zinc-300">
              {t("auth.codeSent")} <strong className="text-stone-900 dark:text-zinc-100">{email}</strong>
            </p>
            {devLoginCode ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left dark:border-amber-900/50 dark:bg-amber-950/30">
                <p className="text-xs font-medium text-amber-900 dark:text-amber-100">
                  {t("auth.devLoginCodeHint")}
                </p>
                <p className="mt-2 font-mono text-2xl font-bold tracking-[0.35em] text-amber-950 dark:text-amber-50">
                  {devLoginCode}
                </p>
              </div>
            ) : null}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-zinc-400">
                {t("auth.code")}
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                className={`${inputClass} text-center text-lg tracking-[0.5em]`}
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-transparent px-2 py-2 transition-all duration-200 hover:border-violet-200/80 hover:bg-violet-50/60 dark:hover:border-violet-500/30 dark:hover:bg-violet-950/25">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-stone-400 text-violet-600 dark:border-zinc-500 dark:bg-zinc-800"
              />
              <span className="text-sm text-stone-700 dark:text-zinc-300">{t("auth.remember")}</span>
            </label>
            {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setError("");
                  setCode("");
                  setDevLoginCode(null);
                }}
                className={authSecondaryCtaClassName}
              >
                {t("auth.back")}
              </button>
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className={`${authPrimaryCtaClassName} flex-1 disabled:hover:translate-y-0 disabled:hover:shadow-md`}
              >
                {loading ? "…" : t("auth.login")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
