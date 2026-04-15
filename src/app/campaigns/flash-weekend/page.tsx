"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { t } from "@/lib/i18n";
import { useToastStore } from "@/store/toast-store";
import { useUiStore } from "@/store/ui-store";

const categoryKeys = [
  { key: "electronics", tr: "Elektronik", en: "Electronics" },
  { key: "home", tr: "Ev & Yaşam", en: "Home" },
  { key: "fashion", tr: "Moda", en: "Fashion" }
] as const;

export default function FlashWeekendCampaignPage() {
  const locale = useUiStore((state) => state.locale);

  return (
    <main className="relative min-h-screen overflow-x-hidden px-2 pb-10 pt-4 sm:px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <Navbar />
      <div className="mx-auto mt-5 w-[min(1100px,calc(100%-0.5rem))] space-y-4">
        <Card elevated className="overflow-hidden p-0">
          <div className="bg-gradient-to-r from-indigo-500/40 via-violet-500/35 to-sky-500/35 p-7">
            <Badge className="mb-3">{t(locale, "campaignSponsored")}</Badge>
            <h1 className="text-3xl font-semibold text-white">{t(locale, "campaignTitle")}</h1>
            <p className="mt-2 text-white/80">{t(locale, "campaignSubtitle")}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/">
                <Button variant="primary">{t(locale, "seeTopDeals")}</Button>
              </Link>
              <Button
                variant="secondary"
                onClick={() => useToastStore.getState().addToast(t(locale, "followCampaign"), "success")}
              >
                {t(locale, "followCampaign")}
              </Button>
            </div>
          </div>
        </Card>
        <div className="grid gap-3 md:grid-cols-3">
          {categoryKeys.map((cat) => (
            <Card key={cat.key} className="p-4">
              <h3 className="text-sm font-medium text-white">
                {locale === "tr" ? cat.tr : cat.en} {t(locale, "highlights")}
              </h3>
              <p className="mt-1 text-xs text-white/70">{t(locale, "highlightsText")}</p>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
