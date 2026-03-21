"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { apiUrl } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const LEGACY_STORAGE_KEY = "perfiai-favorites";

type FavoritesContextType = {
  ids: string[];
  count: number;
  loading: boolean;
  syncing: boolean;
  isFavorite: (perfumeId: string) => boolean;
  toggleFavorite: (perfumeId: string) => Promise<void>;
  addFavorite: (perfumeId: string) => Promise<void>;
  removeFavorite: (perfumeId: string) => Promise<void>;
  reorderFavorites: (ids: string[]) => Promise<void>;
  refreshFavorites: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user, token, loading: authLoading, getAuthHeaders } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const pendingRef = useRef(false);
  const idsRef = useRef<string[]>([]);
  idsRef.current = ids;

  const refreshFavorites = useCallback(async () => {
    if (!token || !user) {
      setIds([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/me/favorites"), {
        headers: { ...getAuthHeaders() },
      });
      if (res.status === 401) {
        setIds([]);
        return;
      }
      if (!res.ok) {
        setIds([]);
        return;
      }
      const data = (await res.json()) as { ids?: string[] };
      let next = Array.isArray(data.ids) ? data.ids : [];

      const legacyRaw =
        typeof window !== "undefined"
          ? localStorage.getItem(LEGACY_STORAGE_KEY)
          : null;
      if (legacyRaw && next.length === 0) {
        try {
          const parsed = JSON.parse(legacyRaw) as unknown;
          if (Array.isArray(parsed) && parsed.length > 0) {
            const merged = [
              ...new Set(parsed.map((x) => String(x)).filter(Boolean)),
            ].slice(0, 500);
            const put = await fetch(apiUrl("/me/favorites"), {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
              },
              body: JSON.stringify({ ids: merged }),
            });
            if (put.ok) {
              const putJson = (await put.json()) as { ids?: string[] };
              next = Array.isArray(putJson.ids) ? putJson.ids : merged;
            }
            localStorage.removeItem(LEGACY_STORAGE_KEY);
          }
        } catch {
          localStorage.removeItem(LEGACY_STORAGE_KEY);
        }
      }

      setIds(next);
    } catch {
      setIds([]);
    } finally {
      setLoading(false);
    }
  }, [token, user, getAuthHeaders]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) {
      setIds([]);
      setLoading(false);
      return;
    }
    void refreshFavorites();
  }, [authLoading, user, token, refreshFavorites]);

  const isFavorite = useCallback(
    (perfumeId: string) => ids.includes(perfumeId),
    [ids]
  );

  const addFavorite = useCallback(
    async (perfumeId: string) => {
      if (!token || !user) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("perfiai:open-auth"));
        }
        return;
      }
      if (pendingRef.current || idsRef.current.includes(perfumeId)) return;
      pendingRef.current = true;
      setSyncing(true);
      try {
        const res = await fetch(apiUrl("/me/favorites"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ perfumeId }),
        });
        if (res.status === 401) {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("perfiai:open-auth"));
          }
          return;
        }
        if (res.ok) {
          const data = (await res.json()) as { ids?: string[] };
          if (Array.isArray(data.ids)) setIds(data.ids);
        }
      } finally {
        pendingRef.current = false;
        setSyncing(false);
      }
    },
    [token, user, getAuthHeaders]
  );

  const removeFavorite = useCallback(
    async (perfumeId: string) => {
      if (!token || !user) return;
      if (pendingRef.current) return;
      pendingRef.current = true;
      setSyncing(true);
      try {
        const res = await fetch(
          apiUrl(`/me/favorites/${encodeURIComponent(perfumeId)}`),
          {
            method: "DELETE",
            headers: { ...getAuthHeaders() },
          }
        );
        if (res.ok) {
          const data = (await res.json()) as { ids?: string[] };
          if (Array.isArray(data.ids)) setIds(data.ids);
        }
      } finally {
        pendingRef.current = false;
        setSyncing(false);
      }
    },
    [token, user, getAuthHeaders]
  );

  const toggleFavorite = useCallback(
    async (perfumeId: string) => {
      if (!token || !user) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("perfiai:open-auth"));
        }
        return;
      }
      if (pendingRef.current) return;
      if (idsRef.current.includes(perfumeId)) await removeFavorite(perfumeId);
      else await addFavorite(perfumeId);
    },
    [token, user, addFavorite, removeFavorite]
  );

  const reorderFavorites = useCallback(
    async (next: string[]) => {
      if (!token || !user) return;
      setSyncing(true);
      try {
        const res = await fetch(apiUrl("/me/favorites"), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ ids: next }),
        });
        if (res.ok) {
          const data = (await res.json()) as { ids?: string[] };
          if (Array.isArray(data.ids)) setIds(data.ids);
        }
      } finally {
        setSyncing(false);
      }
    },
    [token, user, getAuthHeaders]
  );

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      loading,
      syncing,
      isFavorite,
      toggleFavorite,
      addFavorite,
      removeFavorite,
      reorderFavorites,
      refreshFavorites,
    }),
    [
      ids,
      loading,
      syncing,
      isFavorite,
      toggleFavorite,
      addFavorite,
      removeFavorite,
      reorderFavorites,
      refreshFavorites,
    ]
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
