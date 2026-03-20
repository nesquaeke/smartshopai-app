import { products } from "@/data/products";

export function getDealBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
