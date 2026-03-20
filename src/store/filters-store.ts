"use client";

import { create } from "zustand";

interface FiltersStore {
  query: string;
  selectedCategory: string | null;
  dealType: "all" | "online" | "local";
  city: string;
  setQuery: (value: string) => void;
  setSelectedCategory: (value: string | null) => void;
  setDealType: (value: "all" | "online" | "local") => void;
  setCity: (value: string) => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersStore>((set) => ({
  query: "",
  selectedCategory: null,
  dealType: "all",
  city: "",
  setQuery: (value) => set({ query: value }),
  setSelectedCategory: (value) => set({ selectedCategory: value }),
  setDealType: (value) => set({ dealType: value }),
  setCity: (value) => set({ city: value }),
  resetFilters: () => set({ query: "", selectedCategory: null, dealType: "all", city: "" })
}));
