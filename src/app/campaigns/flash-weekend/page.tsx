import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function FlashWeekendCampaignPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden px-2 pb-10 pt-4 sm:px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <Navbar />
      <div className="mx-auto mt-5 w-[min(1100px,calc(100%-0.5rem))] space-y-4">
        <Card elevated className="overflow-hidden p-0">
          <div className="bg-gradient-to-r from-indigo-500/40 via-violet-500/35 to-sky-500/35 p-7">
            <Badge className="mb-3">Sponsored Campaign</Badge>
            <h1 className="text-3xl font-semibold text-white">Flash Deals Weekend</h1>
            <p className="mt-2 text-white/80">Save up to 45% across top brands and stores curated by SmartShopAI.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="primary">See Top Deals</Button>
              <Button variant="secondary">Follow Campaign</Button>
            </div>
          </div>
        </Card>
        <div className="grid gap-3 md:grid-cols-3">
          {["Electronics", "Home", "Fashion"].map((item) => (
            <Card key={item} className="p-4">
              <h3 className="text-sm font-medium text-white">{item} Highlights</h3>
              <p className="mt-1 text-xs text-white/70">Exclusive coupon bundles and high-score community picks.</p>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
