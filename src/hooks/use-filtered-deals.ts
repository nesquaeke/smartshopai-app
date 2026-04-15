"use client";

import { useMemo } from "react";
import { filterDeals } from "@/lib/filter-deals";
import { withPersonalizationScore } from "@/lib/personalization";
import { rankDeals } from "@/lib/ranking";
import { useDealsStore } from "@/store/deals-store";
import { useFiltersStore } from "@/store/filters-store";
import { useUserStore } from "@/store/user-store";
import { useSupabaseCategories } from "@/hooks/use-supabase-categories";

export function useFilteredDeals() {
  const deals = useDealsStore((state) => state.deals);
  const query = useFiltersStore((state) => state.query);
  const selectedCategoryId = useFiltersStore((state) => state.selectedCategoryId);
  const dealType = useFiltersStore((state) => state.dealType);
  const city = useFiltersStore((state) => state.city);
  const sortMode = useFiltersStore((state) => state.sortMode);
  const interactions = useUserStore((state) => state.interactions);
  const { getSubtreeIdSet } = useSupabaseCategories();

  return useMemo(() => {
    const categorySubtreeIds = getSubtreeIdSet(selectedCategoryId);
    const filtered = filterDeals(deals, {
      query,
      selectedCategoryId,
      categorySubtreeIds,
      dealType,
      city,
    });
    const personalized = withPersonalizationScore(filtered, interactions);
    const ranked = rankDeals(personalized);

    if (sortMode === "newest") {
      ranked.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    } else if (sortMode === "discount") {
      ranked.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0));
    }

    return ranked;
  }, [deals, query, selectedCategoryId, dealType, city, sortMode, interactions, getSubtreeIdSet]);
}
