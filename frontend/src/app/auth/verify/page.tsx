"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiUrl } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Doğrulama linki geçersiz.");
      return;
    }
    fetch(apiUrl(`/auth/verify?token=${encodeURIComponent(token)}`))
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setStatus("success");
          setMessage(data.message || "E-posta adresiniz doğrulandı.");
          refreshUser();
        } else {
          setStatus("error");
          setMessage(data.error || "Doğrulama başarısız.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Bağlantı hatası.");
      });
  }, [token, refreshUser]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-violet-200/50 bg-white p-8 shadow-lg dark:border-violet-500/20 dark:bg-violet-950/20">
        {status === "loading" && (
          <p className="text-center text-stone-600 dark:text-zinc-400">
            Doğrulanıyor...
          </p>
        )}
        {status === "success" && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-stone-900 dark:text-zinc-100">
              E-posta doğrulandı
            </h1>
            <p className="text-stone-600 dark:text-zinc-400">{message}</p>
            <Link
              href="/"
              className="inline-block rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
            >
              Ana sayfaya dön
            </Link>
          </div>
        )}
        {status === "error" && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-stone-900 dark:text-zinc-100">
              Doğrulama başarısız
            </h1>
            <p className="text-stone-600 dark:text-zinc-400">{message}</p>
            <Link
              href="/"
              className="inline-block rounded-xl border border-violet-200 px-6 py-2.5 text-sm font-medium text-violet-700 transition hover:bg-violet-50 dark:border-violet-500/20 dark:text-violet-300 dark:hover:bg-violet-950/30"
            >
              Ana sayfaya dön
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
