"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiFetch } from "@/lib/client/api";

interface ClientUser {
  name: string;
  email: string;
  credits: number;
  plan: "free" | "creator" | "pro";
  role: "user" | "admin";
}

interface UserState {
  user: ClientUser | null;
  loading: boolean;
  /** Re-reads the account from the server (source of truth for credits). */
  refresh: () => Promise<void>;
  /** Optimistic update after an API response that returned the new balance. */
  setCredits: (n: number) => void;
}

const Ctx = createContext<UserState>({ user: null, loading: true, refresh: async () => {}, setCredits: () => {} });
export const useUser = () => useContext(Ctx);

/**
 * Loads auth state client-side so public pages stay statically cacheable (fast, SEO-friendly).
 * The credit balance shown here is display-only; every mutation is validated on the server.
 */
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await apiFetch<{ user: ClientUser | null }>("/api/user");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setCredits = useCallback((credits: number) => setUser((u) => (u ? { ...u, credits } : u)), []);
  const value = useMemo(() => ({ user, loading, refresh, setCredits }), [user, loading, refresh, setCredits]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
