"use client";

import Link from "next/link";
import { ProductCard } from "@/components/deals/product-card";
import { Navbar } from "@/components/layout/navbar";
import { Card } from "@/components/ui/card";
import { useDealsStore } from "@/store/deals-store";
import { useUserStore } from "@/store/user-store";

export default function WatchlistPage() {
  const savedDealIds = useUserStore((state) => state.savedDealIds);
  const deals = useDealsStore((state) => state.deals);
  const savedDeals = deals.filter((deal) => savedDealIds.includes(deal.id));

  return (
    <main className="relative min-h-screen px-2 pb-10 pt-4 sm:px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <div className="mx-auto w-[min(1200px,calc(100%-0.5rem))] space-y-4">
        <Navbar />
        <h1 className="text-2xl font-semibold text-white">Your Watchlist</h1>
        {savedDeals.length ? (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {savedDeals.map((deal) => (
              <ProductCard key={deal.id} deal={deal} />
            ))}
          </section>
        ) : (
          <Card className="p-6 text-sm text-white/75">
            No saved products yet. Browse the <Link href="/" className="text-accent-from underline">feed</Link> and bookmark deals.
          </Card>
        )}
      </div>
    </main>
  );
}
