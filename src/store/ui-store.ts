"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "tr" | "en";
export type AccentTheme = "default" | "ocean" | "emerald";

interface UiStore {
  locale: Locale;
  accentTheme: AccentTheme;
  setLocale: (locale: Locale) => void;
  setAccentTheme: (theme: AccentTheme) => void;
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      locale: "tr",
      accentTheme: "default",
      setLocale: (locale) => set({ locale }),
      setAccentTheme: (theme) => set({ accentTheme: theme })
    }),
    { name: "smartshop-ui-store", version: 1 }
  )
);
