"use client";

import { create } from "zustand";

interface FiltersStore {
  query: string;
  /** Selected category id (matches products.category_id + subtree) */
  selectedCategoryId: string | null;
  dealType: "all" | "online" | "local";
  city: string;
  sortMode: "trending" | "newest" | "discount";
  setQuery: (value: string) => void;
  setSelectedCategoryId: (value: string | null) => void;
  setDealType: (value: "all" | "online" | "local") => void;
  setCity: (value: string) => void;
  setSortMode: (mode: "trending" | "newest" | "discount") => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersStore>((set) => ({
  query: "",
  selectedCategoryId: null,
  dealType: "all",
  city: "",
  sortMode: "trending",
  setQuery: (value) => set({ query: value }),
  setSelectedCategoryId: (value) => set({ selectedCategoryId: value }),
  setDealType: (value) => set({ dealType: value }),
  setCity: (value) => set({ city: value }),
  setSortMode: (mode) => set({ sortMode: mode }),
  resetFilters: () =>
    set({ query: "", selectedCategoryId: null, dealType: "all", city: "", sortMode: "trending" }),
}));
