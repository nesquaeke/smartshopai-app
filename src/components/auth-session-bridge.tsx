"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/user-store";

/** Keeps Zustand user profile in sync with Supabase Auth (session survives refresh). */
export function AuthSessionBridge() {
  const login = useUserStore((s) => s.login);
  const logout = useUserStore((s) => s.logout);

  useEffect(() => {
    const applyUser = (session: { user: { user_metadata?: Record<string, unknown>; email?: string | null } } | null) => {
      if (!session?.user) return;
      const u = session.user;
      const meta = u.user_metadata as { display_name?: string } | undefined;
      login({
        name: meta?.display_name || u.email?.split("@")[0] || "User",
        email: u.email || "",
      });
    };

    void supabase.auth.getSession().then(({ data: { session } }) => {
      applyUser(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        logout();
        return;
      }
      if (session?.user) applyUser(session);
    });

    return () => subscription.unsubscribe();
  }, [login, logout]);

  return null;
}
