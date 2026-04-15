import { StoreOffer } from "@/types/domain";

export const storeOffersByProduct: Record<string, StoreOffer[]> = {
  p1: [
    { id: "o1", storeName: "TechWorld", price: 48999, inStock: true, url: "https://example.com/samsung-techworld" },
    { id: "o2", storeName: "MegaElectro", price: 49499, inStock: true, url: "https://example.com/samsung-megaelectro" },
    { id: "o3", storeName: "PriceRadar", price: 50249, inStock: false, url: "https://example.com/samsung-priceradar" }
  ],
  p2: [
    { id: "o4", storeName: "AudioHub", price: 10899, inStock: true, url: "https://example.com/sony-audiohub" },
    { id: "o5", storeName: "NeoSound", price: 11149, inStock: true, url: "https://example.com/sony-neosound" }
  ],
  p3: [
    { id: "o6", storeName: "Metro Market", price: 3999, inStock: true, url: "https://example.com/ninja-metromarket" },
    { id: "o7", storeName: "HomePoint", price: 4199, inStock: true, url: "https://example.com/ninja-homepoint" },
    { id: "o8", storeName: "KitchenPro", price: 4399, inStock: false, url: "https://example.com/ninja-kitchenpro" }
  ],
  p4: [
    { id: "o9", storeName: "GameCore", price: 73999, inStock: true, url: "https://example.com/asus-gamecore" },
    { id: "o10", storeName: "TechWorld", price: 74499, inStock: true, url: "https://example.com/asus-techworld" },
    { id: "o11", storeName: "NotebookHub", price: 75299, inStock: true, url: "https://example.com/asus-notebookhub" },
    { id: "o12", storeName: "MegaElectro", price: 76499, inStock: false, url: "https://example.com/asus-megaelectro" }
  ],
  p5: [
    { id: "o13", storeName: "RunLab", price: 3699, inStock: true, url: "https://example.com/nike-runlab" },
    { id: "o14", storeName: "FitStore", price: 3799, inStock: true, url: "https://example.com/nike-fitstore" },
    { id: "o15", storeName: "SportStreet", price: 3899, inStock: true, url: "https://example.com/nike-sportstreet" }
  ],
  p7: [
    { id: "o16", storeName: "ApplePoint", price: 67999, inStock: true, url: "https://example.com/iphone-applepoint" },
    { id: "o17", storeName: "TechWorld", price: 68499, inStock: true, url: "https://example.com/iphone-techworld" },
    { id: "o18", storeName: "MegaElectro", price: 69199, inStock: false, url: "https://example.com/iphone-megaelectro" }
  ],
  p8: [
    { id: "o19", storeName: "MiStore", price: 26999, inStock: true, url: "https://example.com/xiaomi-mistore" },
    { id: "o20", storeName: "TechWorld", price: 27499, inStock: true, url: "https://example.com/xiaomi-techworld" },
    { id: "o21", storeName: "PriceRadar", price: 27999, inStock: true, url: "https://example.com/xiaomi-priceradar" }
  ],
  p9: [
    { id: "o22", storeName: "NotebookHub", price: 58999, inStock: true, url: "https://example.com/macbook-notebookhub" },
    { id: "o23", storeName: "ApplePoint", price: 59499, inStock: true, url: "https://example.com/macbook-applepoint" },
    { id: "o24", storeName: "TechWorld", price: 59999, inStock: false, url: "https://example.com/macbook-techworld" }
  ],
  p10: [
    { id: "o25", storeName: "ConsoleArena", price: 24999, inStock: true, url: "https://example.com/ps5-consolearena" },
    { id: "o26", storeName: "GameCore", price: 25499, inStock: true, url: "https://example.com/ps5-gamecore" },
    { id: "o27", storeName: "MegaElectro", price: 25999, inStock: true, url: "https://example.com/ps5-megaelectro" },
    { id: "o28", storeName: "TechWorld", price: 26299, inStock: false, url: "https://example.com/ps5-techworld" }
  ],
  p12: [
    { id: "o29", storeName: "AudioHub", price: 4999, inStock: true, url: "https://example.com/jbl-audiohub" },
    { id: "o30", storeName: "NeoSound", price: 5199, inStock: true, url: "https://example.com/jbl-neosound" }
  ],
  p13: [
    { id: "o31", storeName: "EarLab", price: 3299, inStock: true, url: "https://example.com/anker-earlab" },
    { id: "o32", storeName: "AudioHub", price: 3399, inStock: true, url: "https://example.com/anker-audiohub" },
    { id: "o33", storeName: "NeoSound", price: 3499, inStock: false, url: "https://example.com/anker-neosound" }
  ]
};
