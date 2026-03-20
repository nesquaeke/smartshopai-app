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
  const interactions = useUserStore((state) => state.interactions);

  return useMemo(() => {
    const filtered = filterDeals(deals, { query, selectedCategory, dealType, city });
    const personalized = withPersonalizationScore(filtered, interactions);
    return rankDeals(personalized);
  }, [deals, query, selectedCategory, dealType, city, interactions]);
}
