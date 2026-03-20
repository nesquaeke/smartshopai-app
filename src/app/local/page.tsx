import { Navbar } from "@/components/layout/navbar";
import { Card } from "@/components/ui/card";
import { products } from "@/data/products";

export default function LocalDealsPage() {
  const localDeals = products.filter((item) => item.dealType === "local");

  return (
    <main className="relative min-h-screen px-2 pb-10 pt-4 sm:px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <div className="mx-auto w-[min(1200px,calc(100%-0.5rem))] space-y-4">
        <Navbar />
        <h1 className="text-2xl font-semibold text-white">Local Deals</h1>
        <Card className="p-4">
          <p className="mb-3 text-sm text-white/75">Map view placeholder (feature-flag ready). Pins represent city-based local deals.</p>
          <div className="grid gap-2 md:grid-cols-3">
            {localDeals.map((deal) => (
              <div key={deal.id} className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-sm text-white/90">
                <p className="font-medium">{deal.title}</p>
                <p className="text-xs text-white/60">
                  {deal.city} - {new Intl.NumberFormat("tr-TR").format(deal.currentPrice)} TL
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
