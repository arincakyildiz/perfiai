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

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  sendLoginCode: (email: string) => Promise<{ ok: boolean; error?: string }>;
  verifyCode: (email: string, code: string, remember?: boolean) => Promise<{ ok: boolean; error?: string }>;
  register: (email: string, name?: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  resendVerification: () => Promise<{ ok: boolean; error?: string }>;
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

  const sendLoginCode = useCallback(async (email: string) => {
    try {
      const res = await fetch(apiUrl("/auth/send-code"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) return { ok: true };
      return { ok: false, error: data.error || "Kod gönderilemedi" };
    } catch {
      return { ok: false, error: "Bağlantı hatası" };
    }
  }, []);

  const verifyCode = useCallback(async (email: string, code: string, remember = false) => {
    try {
      const res = await fetch(apiUrl("/auth/verify-code"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, remember }),
      });
      const data = await res.json();
      if (data.ok && data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setUser(data.user);
        return { ok: true };
      }
      return { ok: false, error: data.error || "Giriş başarısız" };
    } catch {
      return { ok: false, error: "Bağlantı hatası" };
    }
  }, []);

  const register = useCallback(async (email: string, name?: string) => {
    try {
      const res = await fetch(apiUrl("/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (data.ok && data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setUser(data.user);
        return { ok: true };
      }
      return { ok: false, error: data.error || "Kayıt başarısız" };
    } catch {
      return { ok: false, error: "Bağlantı hatası" };
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

  const resendVerification = useCallback(async () => {
    const t = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (!t) return { ok: false, error: "Giriş yapmanız gerekiyor" };
    try {
      const res = await fetch(apiUrl("/auth/resend-verification"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
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
      value={{ user, token, loading, sendLoginCode, verifyCode, register, logout, refreshUser, resendVerification, getAuthHeaders }}
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
