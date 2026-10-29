"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface AuthContextValue {
  user: User | null;
  configured: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  displayName: string;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  configured: false,
  loading: true,
  signOut: async () => {},
  displayName: "",
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, [configured]);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  }, []);

  const displayName = useMemo(() => {
    if (!user) return "";
    const meta = user.user_metadata as Record<string, unknown> | undefined;
    const fullName = typeof meta?.full_name === "string" ? meta.full_name : "";
    if (fullName) return fullName.split(" ")[0];
    return user.email?.split("@")[0] ?? "";
  }, [user]);

  const value = useMemo(
    () => ({ user, configured, loading, signOut, displayName }),
    [user, configured, loading, signOut, displayName],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
