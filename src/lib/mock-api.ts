import { products } from "@/data/products";
import { storeOffersByProduct } from "@/data/store-offers";

export interface DealScrapeJob {
  source: string;
  category: string;
  cron: string;
}

export interface PriceTrackResponse {
  productId: string;
  offers: Array<{ storeName: string; price: number; inStock: boolean }>;
}

export async function fetchTrackedPrices(productId: string): Promise<PriceTrackResponse> {
  const offers = storeOffersByProduct[productId] ?? [];
  return {
    productId,
    offers: offers.map((offer) => ({
      storeName: offer.storeName,
      price: offer.price,
      inStock: offer.inStock
    }))
  };
}

export async function runAutoDealDetection(job: DealScrapeJob) {
  return {
    job,
    scanned: products.length,
    detected: Math.max(1, Math.floor(products.length / 2)),
    status: "placeholder"
  };
}
