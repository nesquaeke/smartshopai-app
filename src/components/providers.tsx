"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { BackToTop } from "@/components/ui/back-to-top";
import { ToastContainer } from "@/components/ui/toast";
import { ThemeContext, ThemeMode } from "@/hooks/use-theme";
import { useUiStore } from "@/store/ui-store";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false
          }
        }
      })
  );
  const [mode, setMode] = useState<ThemeMode>("dark");
  const locale = useUiStore((state) => state.locale);
  const accentTheme = useUiStore((state) => state.accentTheme);

  useLayoutEffect(() => {
    // Clean up stale persist data that can break hydration
    try { window.localStorage.removeItem("smartshop-deals-store"); } catch { /* noop */ }

    const persisted = window.localStorage.getItem("smartshop-theme");
    const nextMode = persisted === "light" ? "light" : "dark";
    setMode(nextMode);

    const persistedUiRaw = window.localStorage.getItem("smartshop-ui-store");
    if (persistedUiRaw) {
      try {
        const persistedUi = JSON.parse(persistedUiRaw);
        if (persistedUi?.state?.accentTheme) {
          document.documentElement.setAttribute("data-accent", persistedUi.state.accentTheme);
        }
        if (persistedUi?.state?.locale) {
          document.documentElement.lang = persistedUi.state.locale;
        }
      } catch {
        document.documentElement.setAttribute("data-accent", "default");
      }
    } else {
      document.documentElement.setAttribute("data-accent", "default");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    window.localStorage.setItem("smartshop-theme", mode);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accentTheme);
  }, [accentTheme]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const themeValue = useMemo(
    () => ({
      mode,
      toggleTheme: () => setMode((current) => (current === "dark" ? "light" : "dark"))
    }),
    [mode]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
      <ToastContainer />
      <BackToTop />
    </QueryClientProvider>
  );
}
