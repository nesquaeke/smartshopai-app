"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useMemo, useState } from "react";
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
  const accentTheme = useUiStore((state) => state.accentTheme);

  useEffect(() => {
    const persisted = window.localStorage.getItem("smartshop-theme");
    const nextMode = persisted === "light" ? "light" : "dark";
    setMode(nextMode);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    window.localStorage.setItem("smartshop-theme", mode);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accentTheme);
  }, [accentTheme]);

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
    </QueryClientProvider>
  );
}
