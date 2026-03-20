import { PriceHistoryPoint } from "@/types/domain";

export const priceHistoryByProduct: Record<string, PriceHistoryPoint[]> = {
  p1: [
    { date: "2026-02-20", price: 54999 },
    { date: "2026-02-25", price: 53999 },
    { date: "2026-03-01", price: 52999 },
    { date: "2026-03-05", price: 51999 },
    { date: "2026-03-10", price: 50999 },
    { date: "2026-03-15", price: 49999 },
    { date: "2026-03-20", price: 48999 }
  ],
  p2: [
    { date: "2026-02-20", price: 13499 },
    { date: "2026-02-25", price: 12999 },
    { date: "2026-03-01", price: 12499 },
    { date: "2026-03-05", price: 11999 },
    { date: "2026-03-10", price: 11499 },
    { date: "2026-03-15", price: 11099 },
    { date: "2026-03-20", price: 10899 }
  ],
  p3: [
    { date: "2026-02-20", price: 5699 },
    { date: "2026-02-25", price: 5499 },
    { date: "2026-03-01", price: 5299 },
    { date: "2026-03-05", price: 4999 },
    { date: "2026-03-10", price: 4699 },
    { date: "2026-03-15", price: 4399 },
    { date: "2026-03-20", price: 3999 }
  ]
};
