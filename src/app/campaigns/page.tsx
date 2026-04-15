"use client";

import Link from "next/link";
import { Zap, Gift } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { t } from "@/lib/i18n";
import { useUiStore } from "@/store/ui-store";

const campaigns = [
  {
    id: "flash-weekend",
    icon: Zap,
    title: "Flash Deals Weekend",
    description: "Up to 45% off across top brands this weekend.",
    href: "/campaigns/flash-weekend",
    gradient: "from-indigo-500/30 via-violet-500/25 to-sky-500/25",
    active: true
  },
  {
    id: "summer-sale",
    icon: Gift,
    title: "Summer Sale 2026",
    description: "Seasonal discounts on electronics and fashion.",
    href: "#",
    gradient: "from-amber-500/25 via-orange-500/20 to-red-500/20",
    active: false
  }
];

export default function CampaignsPage() {
  const locale = useUiStore((state) => state.locale);

  return (
    <main className="relative min-h-screen overflow-x-hidden px-2 pb-10 pt-4 sm:px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <Navbar />
      <div className="mx-auto mt-5 w-[min(1100px,calc(100%-0.5rem))] space-y-4">
        <h1 className="text-2xl font-semibold text-white">{t(locale, "campaigns")}</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {campaigns.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.id} href={c.href}>
                <Card elevated className="overflow-hidden p-0 transition hover:scale-[1.01]">
                  <div className={`bg-gradient-to-r ${c.gradient} p-6`}>
                    <div className="mb-2 flex items-center gap-2">
                      <Icon className="h-5 w-5 text-white/80" />
                      {c.active ? <Badge variant="success">Active</Badge> : <Badge variant="neutral">Coming Soon</Badge>}
                    </div>
                    <h2 className="text-lg font-semibold text-white">{c.title}</h2>
                    <p className="mt-1 text-sm text-white/70">{c.description}</p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
