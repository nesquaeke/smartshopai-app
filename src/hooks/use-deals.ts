"use client";

import { useDealsStore } from "@/store/deals-store";

export function useDeals() {
  return useDealsStore((state) => state.deals);
}
