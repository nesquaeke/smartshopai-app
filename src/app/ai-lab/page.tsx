import Link from "next/link";
import { products } from "@/data/products";
import { scoreDeal } from "@/lib/ranking";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const topAiPicks = [...products].sort((a, b) => scoreDeal(b) - scoreDeal(a)).slice(0, 6);

export default function AiLabPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden px-2 pb-10 pt-4 sm:px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <Navbar />
      <div className="mx-auto mt-5 w-[min(1200px,calc(100%-0.5rem))] space-y-4">
        <Card elevated className="p-5">
          <h1 className="text-2xl font-semibold text-white">AI Lab - Daily Picks</h1>
          <p className="mt-1 text-sm text-white/70">
            Picks are computed from live mock signals: vote momentum, engagement velocity, recency and discount depth.
          </p>
        </Card>

        <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {topAiPicks.map((deal, index) => (
            <Card key={deal.id} className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <Badge variant="info">AI Pick #{index + 1}</Badge>
                <Badge variant={deal.discountPercent && deal.discountPercent > 15 ? "success" : "neutral"}>
                  {deal.discountPercent ? `-${deal.discountPercent}%` : "Deal"}
                </Badge>
              </div>
              <h3 className="text-sm font-medium text-white">{deal.title}</h3>
              <p className="mt-1 text-xs text-white/70">{deal.storeName}</p>
              <p className="mt-2 text-sm text-white/90">
                Reason: high community trust + recent activity + competitive pricing.
              </p>
              <Link href={`/deals/${deal.slug}`} className="mt-3 inline-flex text-xs text-accent-from underline">
                Open deal
              </Link>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
