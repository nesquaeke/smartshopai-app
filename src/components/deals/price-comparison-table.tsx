"use client";

import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSupabaseOffers } from "@/hooks/use-supabase-offers";
import { storeOffersByProduct } from "@/data/store-offers";
import { t } from "@/lib/i18n";
import { useUiStore } from "@/store/ui-store";

interface PriceComparisonTableProps {
  productId: string;
}

export function PriceComparisonTable({ productId }: PriceComparisonTableProps) {
  const locale = useUiStore((state) => state.locale);
  const { offers: supabaseOffers, loading } = useSupabaseOffers(productId);

  const fallbackOffers = storeOffersByProduct[productId] ?? [];
  const offers = supabaseOffers.length > 0 ? supabaseOffers : fallbackOffers;
  const cheapest = offers.length > 0 ? offers[0] : null;

  return (
    <section className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-2xl">
      <h3 className="mb-3 text-base font-semibold text-white">{t(locale, "priceComparison")}</h3>

      {cheapest ? (
        <div className="mb-3 flex items-center justify-between rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3">
          <div>
            <p className="text-xs text-emerald-300/70">{locale === "tr" ? "En ucuz fiyat" : "Best price"}</p>
            <p className="text-lg font-bold text-emerald-300">
              {new Intl.NumberFormat("pl-PL").format(cheapest.price)} zł
              <span className="ml-2 text-sm font-normal text-white/60">— {cheapest.storeName}</span>
            </p>
          </div>
          <a href={cheapest.url} target="_blank" rel="noreferrer">
            <Button variant="primary" size="sm" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              {locale === "tr" ? "Mağazaya Git" : "Go to Store"}
            </Button>
          </a>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[620px] text-left text-sm text-white/85">
          <thead className="bg-black/20 text-xs uppercase tracking-[0.08em] text-white/60">
            <tr>
              <th className="px-3 py-2">{t(locale, "store")}</th>
              <th className="px-3 py-2">{t(locale, "price")}</th>
              <th className="px-3 py-2">{t(locale, "availability")}</th>
              <th className="px-3 py-2 text-right">{t(locale, "action")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="border-t border-white/10 bg-white/[0.03]">
                <td className="px-3 py-4 text-sm text-white/40" colSpan={4}>
                  <div className="h-4 w-48 animate-pulse rounded bg-white/10" />
                </td>
              </tr>
            ) : offers.length ? (
              offers.map((offer, idx) => (
                <tr
                  key={offer.id}
                  className={`border-t border-white/10 ${idx === 0 ? "bg-emerald-500/5" : "bg-white/[0.03]"}`}
                >
                  <td className="px-3 py-2">
                    {idx === 0 ? <span className="mr-1.5 text-xs text-emerald-400">★</span> : null}
                    {offer.storeName}
                  </td>
                  <td className="px-3 py-2 font-semibold">
                    {new Intl.NumberFormat("pl-PL").format(offer.price)} zł
                  </td>
                  <td className="px-3 py-2">
                    <Badge variant={offer.inStock ? "success" : "warning"}>
                      {offer.inStock ? t(locale, "inStock") : t(locale, "limited")}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <a href={offer.url} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="secondary">
                        {t(locale, "visit")}
                      </Button>
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-white/10 bg-white/[0.03]">
                <td className="px-3 py-4 text-sm text-white/60" colSpan={4}>
                  {t(locale, "noStoreOffers")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
