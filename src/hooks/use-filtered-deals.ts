"use client";

import { useMemo } from "react";
import { filterDeals } from "@/lib/filter-deals";
import { withPersonalizationScore } from "@/lib/personalization";
import { rankDeals } from "@/lib/ranking";
import { useDealsStore } from "@/store/deals-store";
import { useFiltersStore } from "@/store/filters-store";
import { useUserStore } from "@/store/user-store";

export function useFilteredDeals() {
  const deals = useDealsStore((state) => state.deals);
  const query = useFiltersStore((state) => state.query);
  const selectedCategory = useFiltersStore((state) => state.selectedCategory);
  const dealType = useFiltersStore((state) => state.dealType);
  const city = useFiltersStore((state) => state.city);
  const sortMode = useFiltersStore((state) => state.sortMode);
  const interactions = useUserStore((state) => state.interactions);

  return useMemo(() => {
    const filtered = filterDeals(deals, { query, selectedCategory, dealType, city });
    const personalized = withPersonalizationScore(filtered, interactions);
    const ranked = rankDeals(personalized);

    if (sortMode === "newest") {
      ranked.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    } else if (sortMode === "discount") {
      ranked.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0));
    }

    return ranked;
  }, [deals, query, selectedCategory, dealType, city, sortMode, interactions]);
}
