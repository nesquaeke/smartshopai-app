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

export const useDealsStore = create<DealsStore>()((set, get) => ({
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
      deals: state.deals.map((deal) => {
        if (deal.id !== dealId) return deal;
        let upDelta = 0;
        let downDelta = 0;
        if (previous.direction === "up") upDelta -= 1;
        if (previous.direction === "down") downDelta -= 1;
        if (!isSameVote) {
          if (direction === "up") upDelta += 1;
          if (direction === "down") downDelta += 1;
        }
        return {
          ...deal,
          upvotes: deal.upvotes + upDelta,
          downvotes: deal.downvotes + downDelta
        };
      }),
      votes: {
        ...state.votes,
        [dealId]: nextVote
      }
    }));
  }
}));
