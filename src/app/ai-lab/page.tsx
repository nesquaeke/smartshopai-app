"use client";

import Link from "next/link";
import { products } from "@/data/products";
import { scoreDeal } from "@/lib/ranking";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { t } from "@/lib/i18n";
import { useUiStore } from "@/store/ui-store";

const topAiPicks = [...products].sort((a, b) => scoreDeal(b) - scoreDeal(a)).slice(0, 6);

export default function AiLabPage() {
  const locale = useUiStore((state) => state.locale);

  return (
    <main className="relative min-h-screen overflow-x-hidden px-2 pb-10 pt-4 sm:px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <Navbar />
      <div className="mx-auto mt-5 w-[min(1200px,calc(100%-0.5rem))] space-y-4">
        <Card elevated className="p-5">
          <h1 className="text-2xl font-semibold text-white">{t(locale, "aiLabTitle")}</h1>
          <p className="mt-1 text-sm text-white/70">{t(locale, "aiLabSubtitle")}</p>
        </Card>

        <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {topAiPicks.map((deal, index) => (
            <Card key={deal.id} className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <Badge variant="info">
                  {t(locale, "pickLabel")} #{index + 1}
                </Badge>
                <Badge variant={deal.discountPercent && deal.discountPercent > 15 ? "success" : "neutral"}>
                  {deal.discountPercent ? `-${deal.discountPercent}%` : "Deal"}
                </Badge>
              </div>
              <h3 className="text-sm font-medium text-white">{deal.title}</h3>
              <p className="mt-1 text-xs text-white/70">{deal.storeName}</p>
              <p className="mt-2 text-sm text-white/90">
                {t(locale, "reasonLabel")}: {t(locale, "reasonText")}
              </p>
              <Link href={`/deals/${deal.slug}`} className="mt-3 inline-flex text-xs text-accent-from underline">
                {t(locale, "openDeal")}
              </Link>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
