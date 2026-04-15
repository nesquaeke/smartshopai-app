import { ProductDeal } from "@/types/domain";

export function getDealBySlug(slug: string, allDeals: ProductDeal[] = []) {
  return allDeals.find((product) => product.slug === slug);
}
