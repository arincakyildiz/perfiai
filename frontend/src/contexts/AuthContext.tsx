"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiUrl } from "@/lib/api";

const TOKEN_KEY = "perfiai_token";

type User = { id: string; email: string; name: string; verified?: boolean };

type SendLoginCodeResult =
  | {
      ok: true;
      message?: string;
      emailSent?: boolean;
      devLoginCode?: string;
      /** Sunucu saatiyle bitiş (ms); geri sayım için */
      codeExpiresAt?: number;
      /** Yalnızca geliştirme: SMTP hata özeti */
      smtpErrorHint?: string;
    }
  | { ok: false; error: string };

type RegisterResult =
  | {
      ok: true;
      message?: string;
      emailVerificationSent?: boolean;
      devVerificationUrl?: string;
      /** Sunucu: bir sonraki doğrulama e-postası isteğinden önceki zaman (ms) */
      verificationResendNotBefore?: number;
    }
  | { ok: false; error: string };

type SendCodeResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
  emailSent?: boolean;
  devLoginCode?: string;
  codeExpiresAt?: number;
  codeValidSeconds?: number;
  smtpErrorHint?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  sendLoginCode: (email: string, locale?: string) => Promise<SendLoginCodeResult>;
  verifyCode: (email: string, code: string, remember?: boolean) => Promise<{ ok: boolean; error?: string }>;
  register: (email: string, name?: string, locale?: string) => Promise<RegisterResult>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  /** E-posta doğrulama sayfasından dönen JWT ile oturum aç */
  establishSessionFromToken: (sessionToken: string) => Promise<boolean>;
  resendVerification: (locale?: string) => Promise<{ ok: boolean; error?: string }>;
  getAuthHeaders: () => Record<string, string>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (!t) {
      setLoading(false);
      return;
    }
    setToken(t);
    fetch(apiUrl("/auth/me"), {
      headers: { Authorization: `Bearer ${t}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.user) setUser(data.user);
        else localStorage.removeItem(TOKEN_KEY);
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const sendLoginCode = useCallback(
    async (email: string, locale?: string): Promise<SendLoginCodeResult> => {
      try {
        const res = await fetch(apiUrl("/auth/send-code"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, locale: locale || "tr" }),
        });
        const data = (await res.json()) as SendCodeResponse;
        if (res.ok && data.ok) {
          return {
            ok: true,
            message: data.message,
            emailSent: data.emailSent,
            devLoginCode: data.devLoginCode,
            codeExpiresAt:
              typeof data.codeExpiresAt === "number"
                ? data.codeExpiresAt
                : undefined,
            smtpErrorHint:
              typeof data.smtpErrorHint === "string"
                ? data.smtpErrorHint
                : undefined,
          };
        }
        return {
          ok: false,
          error:
            typeof data.error === "string" && data.error
              ? data.error
              : "Kod gönderilemedi",
        };
      } catch {
        return { ok: false, error: "Bağlantı hatası" };
      }
    },
    []
  );

  const verifyCode = useCallback(async (email: string, code: string, remember = false) => {
    try {
      const res = await fetch(apiUrl("/auth/verify-code"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, remember }),
      });
      const data = await res.json();
      if (res.ok && data.ok && data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setUser(data.user);
        return { ok: true };
      }
      return {
        ok: false,
        error:
          typeof data.error === "string" && data.error
            ? data.error
            : "Giriş başarısız",
      };
    } catch {
      return { ok: false, error: "Bağlantı hatası" };
    }
  }, []);

  const register = useCallback(async (email: string, name?: string, locale?: string): Promise<RegisterResult> => {
    try {
      const res = await fetch(apiUrl("/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, locale: locale || "tr" }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        return {
          ok: true,
          message: typeof data.message === "string" ? data.message : undefined,
          emailVerificationSent: data.emailVerificationSent,
          devVerificationUrl: data.devVerificationUrl,
          verificationResendNotBefore:
            typeof data.verificationResendNotBefore === "number"
              ? data.verificationResendNotBefore
              : undefined,
        };
      }
      return {
        ok: false,
        error:
          typeof data.error === "string" && data.error
            ? data.error
            : "Kayıt başarısız",
      };
    } catch {
      return { ok: false, error: "Bağlantı hatası" };
    }
  }, []);

  const establishSessionFromToken = useCallback(async (sessionToken: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, sessionToken);
      setToken(sessionToken);
      const res = await fetch(apiUrl("/auth/me"), {
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      const data = await res.json();
      if (res.ok && data.ok && data.user) {
        setUser(data.user);
        return true;
      }
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      return false;
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const t = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (!t) return;
    try {
      const res = await fetch(apiUrl("/auth/me"), { headers: { Authorization: `Bearer ${t}` } });
      const data = await res.json();
      if (data.ok && data.user) setUser(data.user);
    } catch {
      // ignore
    }
  }, []);

  const resendVerification = useCallback(async (locale?: string) => {
    const t = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (!t) return { ok: false, error: "Giriş yapmanız gerekiyor" };
    try {
      const res = await fetch(apiUrl("/auth/resend-verification"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
        body: JSON.stringify({ locale: locale || "tr" }),
      });
      const data = await res.json();
      if (data.ok) return { ok: true };
      return { ok: false, error: data.error || "Gönderilemedi" };
    } catch {
      return { ok: false, error: "Bağlantı hatası" };
    }
  }, []);

  const getAuthHeaders = useCallback((): Record<string, string> => {
    const t = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    return t ? { Authorization: `Bearer ${t}` } : ({} as Record<string, string>);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        sendLoginCode,
        verifyCode,
        register,
        logout,
        refreshUser,
        establishSessionFromToken,
        resendVerification,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
