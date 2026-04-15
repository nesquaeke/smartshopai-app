import { products } from "@/data/products";
import { ProductDeal } from "@/types/domain";

export function getDealBySlug(slug: string, allDeals?: ProductDeal[]) {
  const source = allDeals ?? products;
  return source.find((product) => product.slug === slug);
}
