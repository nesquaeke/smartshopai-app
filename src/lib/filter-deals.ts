import { ProductDeal } from "@/types/domain";

interface FilterParams {
  query: string;
  selectedCategory: string | null;
  dealType: "all" | "online" | "local";
  city: string;
}

export function filterDeals(deals: ProductDeal[], params: FilterParams) {
  const normalizedQuery = params.query.trim().toLowerCase();

  return deals.filter((deal) => {
    const matchesQuery =
      !normalizedQuery ||
      deal.title.toLowerCase().includes(normalizedQuery) ||
      deal.storeName.toLowerCase().includes(normalizedQuery) ||
      deal.categoryPath.some((item) => item.toLowerCase().includes(normalizedQuery));

    const matchesCategory =
      !params.selectedCategory ||
      deal.categoryPath.some((item) => item.toLowerCase() === params.selectedCategory?.toLowerCase());

    const matchesDealType = params.dealType === "all" || deal.dealType === params.dealType;
    const matchesCity = !params.city.trim() || (deal.city ?? "").toLowerCase().includes(params.city.toLowerCase());

    return matchesQuery && matchesCategory && matchesDealType && matchesCity;
  });
}
