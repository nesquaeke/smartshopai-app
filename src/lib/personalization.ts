import { ProductDeal } from "@/types/domain";

export function withPersonalizationScore(deals: ProductDeal[], interactions: Record<string, number>) {
  return deals.map((deal) => {
    const primaryCategory = deal.categoryPath[0] ?? "general";
    const signal = interactions[primaryCategory] ?? 0;
    return {
      ...deal,
      engagement: deal.engagement + signal
    };
  });
}
