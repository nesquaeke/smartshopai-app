"use client";

import { create } from "zustand";
import { products } from "@/data/products";
import { ProductDeal } from "@/types/domain";

interface DealsStore {
  deals: ProductDeal[];
  setDeals: (nextDeals: ProductDeal[]) => void;
  addDeal: (deal: ProductDeal) => void;
  patchDeal: (dealId: string, partial: Partial<Pick<ProductDeal, "upvotes" | "downvotes" | "engagement">>) => void;
}

export const useDealsStore = create<DealsStore>()((set) => ({
  deals: products,
  setDeals: (nextDeals) => set({ deals: nextDeals }),
  addDeal: (deal) =>
    set((state) => ({
      deals: [deal, ...state.deals],
    })),
  patchDeal: (dealId, partial) =>
    set((state) => ({
      deals: state.deals.map((d) => (d.id === dealId ? { ...d, ...partial } : d)),
    })),
}));
