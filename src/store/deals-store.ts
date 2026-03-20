"use client";

import { create } from "zustand";
import { products } from "@/data/products";
import { ProductDeal, VoteDirection } from "@/types/domain";

type VoteState = {
  direction: VoteDirection;
  scoreDelta: number;
};

interface DealsStore {
  deals: ProductDeal[];
  votes: Record<string, VoteState>;
  setDeals: (nextDeals: ProductDeal[]) => void;
  addDeal: (deal: ProductDeal) => void;
  voteOnDeal: (dealId: string, direction: Exclude<VoteDirection, null>) => void;
}

const initialVotes = products.reduce<Record<string, VoteState>>((acc, deal) => {
  acc[deal.id] = { direction: null, scoreDelta: 0 };
  return acc;
}, {});

export const useDealsStore = create<DealsStore>((set, get) => ({
  deals: products,
  votes: initialVotes,
  setDeals: (nextDeals) => set({ deals: nextDeals }),
  addDeal: (deal) =>
    set((state) => ({
      deals: [deal, ...state.deals],
      votes: {
        ...state.votes,
        [deal.id]: { direction: null, scoreDelta: 0 }
      }
    })),
  voteOnDeal: (dealId, direction) => {
    const previous = get().votes[dealId] ?? { direction: null, scoreDelta: 0 };
    const isSameVote = previous.direction === direction;

    const nextVote: VoteState = isSameVote
      ? { direction: null, scoreDelta: 0 }
      : direction === "up"
        ? { direction: "up", scoreDelta: 1 }
        : { direction: "down", scoreDelta: -1 };

    set((state) => ({
      votes: {
        ...state.votes,
        [dealId]: nextVote
      }
    }));
  }
}));
