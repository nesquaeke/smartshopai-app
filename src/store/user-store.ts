"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PriceAlert, ProductDeal } from "@/types/domain";

interface UserStore {
  isLoggedIn: boolean;
  profile: {
    name: string;
    email: string;
    city: string;
  };
  savedDealIds: string[];
  alerts: PriceAlert[];
  points: number;
  rank: string;
  interactions: Record<string, number>;
  login: (payload: { name: string; email: string }) => void;
  logout: () => void;
  updateProfile: (payload: { name: string; email: string; city: string }) => void;
  saveDeal: (dealId: string) => void;
  removeSavedDeal: (dealId: string) => void;
  addAlert: (alert: PriceAlert) => void;
  removeAlert: (alertId: string) => void;
  addPoints: (delta: number) => void;
  trackDealInteraction: (deal: ProductDeal, source: "click" | "vote" | "comment") => void;
}

const deriveRank = (points: number) => {
  if (points > 700) return "Elite Hunter";
  if (points > 400) return "Pro Scout";
  if (points > 200) return "Active Finder";
  return "Rookie";
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      profile: {
        name: "Smart User",
        email: "user@smartshopai.app",
        city: "Istanbul"
      },
      savedDealIds: [],
      alerts: [],
      points: 80,
      rank: "Rookie",
      interactions: {},
      login: ({ name, email }) =>
        set((state) => ({
          isLoggedIn: true,
          profile: {
            name,
            email,
            city: state.profile.city
          }
        })),
      logout: () =>
        set({
          isLoggedIn: false,
          profile: { name: "Smart User", email: "user@smartshopai.app", city: "Istanbul" },
          savedDealIds: [],
          alerts: [],
          points: 80,
          rank: "Rookie",
          interactions: {}
        }),
      updateProfile: ({ name, email, city }) =>
        set({
          profile: {
            name,
            email,
            city
          }
        }),
      saveDeal: (dealId) =>
        set((state) => ({
          savedDealIds: state.savedDealIds.includes(dealId) ? state.savedDealIds : [...state.savedDealIds, dealId]
        })),
      removeSavedDeal: (dealId) =>
        set((state) => ({
          savedDealIds: state.savedDealIds.filter((id) => id !== dealId)
        })),
      addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
      removeAlert: (alertId) =>
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== alertId)
        })),
      addPoints: (delta) =>
        set((state) => {
          const points = Math.max(0, state.points + delta);
          return { points, rank: deriveRank(points) };
        }),
      trackDealInteraction: (deal, source) =>
        set((state) => {
          const categoryKey = deal.categoryPath[0] ?? "general";
          const current = state.interactions[categoryKey] ?? 0;
          const increment = source === "vote" ? 4 : source === "comment" ? 6 : 2;
          return {
            interactions: {
              ...state.interactions,
              [categoryKey]: current + increment
            }
          };
        })
    }),
    { name: "smartshop-user-store", version: 1 }
  )
);
