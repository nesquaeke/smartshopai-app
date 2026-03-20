import { StoreOffer } from "@/types/domain";

export const storeOffersByProduct: Record<string, StoreOffer[]> = {
  "samsung-galaxy-s25-ultra-512gb": [
    { id: "o1", storeName: "TechWorld", price: 48999, inStock: true, url: "https://example.com/samsung-techworld" },
    { id: "o2", storeName: "MegaElectro", price: 49499, inStock: true, url: "https://example.com/samsung-megaelectro" },
    { id: "o3", storeName: "PriceRadar", price: 50249, inStock: false, url: "https://example.com/samsung-priceradar" }
  ],
  "sony-wh1000xm6": [
    { id: "o4", storeName: "AudioHub", price: 10899, inStock: true, url: "https://example.com/sony-audiohub" },
    { id: "o5", storeName: "NeoSound", price: 11149, inStock: true, url: "https://example.com/sony-neosound" }
  ]
};
