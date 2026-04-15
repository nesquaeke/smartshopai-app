"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AdvancedPricePanels } from "@/components/deals/advanced-price-panels";
import { AiInsightBox } from "@/components/deals/ai-insight-box";
import { PriceAlertButton } from "@/components/deals/price-alert-button";
import { CommentThread } from "@/components/forum/comment-thread";
import { Navbar } from "@/components/layout/navbar";
import { PriceComparisonTable } from "@/components/deals/price-comparison-table";
import { PriceHistoryChart } from "@/components/deals/price-history-chart";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { t } from "@/lib/i18n";
import { useDealsStore } from "@/store/deals-store";
import { useUiStore } from "@/store/ui-store";
import { ProductDeal } from "@/types/domain";

function fixImageUrl(url: string): string {
  if (!url) return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80";
  if (url.includes("ceneostatic")) return url.replace("/f-", "/i-");
  return url;
}

export default function DealDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const locale = useUiStore((state) => state.locale);
  const allDeals = useDealsStore((state) => state.deals);
  const [deal, setDeal] = useState<ProductDeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    const storeMatch = allDeals.find((d) => d.slug === slug);
    if (storeMatch) {
      setDeal(storeMatch);
      setLoading(false);
      return;
    }

    async function fetchDeal() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (error || !data) {
          setNotFoundState(true);
          setLoading(false);
          return;
        }

        setDeal({
          id: data.id,
          title: data.title,
          slug: data.slug,
          imageUrl: fixImageUrl(data.image_url || ""),
          storeName: data.store_name || "Unknown",
          storeLogos: data.store_logos?.length ? data.store_logos : [(data.store_name || "?").slice(0, 2).toUpperCase()],
          currentPrice: Number(data.current_price),
          oldPrice: data.old_price ? Number(data.old_price) : undefined,
          discountPercent: data.discount_percent ?? undefined,
          upvotes: data.upvotes || 0,
          downvotes: data.downvotes || 0,
          engagement: data.engagement || 0,
          postedAt: data.created_at,
          dealType: (data.deal_type as "online" | "local") || "online",
          city: data.city ?? undefined,
          categoryPath: data.category_path || [],
          categoryId: data.category_id ?? undefined,
          description: data.description ?? undefined,
          postedBy: {
            username: data.posted_by_username || "SmartShopAI",
            rank: data.posted_by_rank || "System",
            badge: data.posted_by_badge || "Bot",
          },
        });
      } catch {
        setNotFoundState(true);
      } finally {
        setLoading(false);
      }
    }

    fetchDeal();
  }, [slug, allDeals]);

  if (notFoundState) {
    notFound();
  }

  if (loading || !deal) {
    return (
      <main className="relative min-h-screen px-2 pb-10 pt-4 sm:px-4">
        <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
        <div className="mx-auto w-[min(1200px,calc(100%-0.5rem))] space-y-4">
          <Navbar />
          <div className="h-96 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
          <div className="h-32 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
          <div className="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
        </div>
      </main>
    );
  }

  const score = deal.upvotes - deal.downvotes;
  const formatPrice = (value: number) => new Intl.NumberFormat("pl-PL").format(value);

  return (
    <main className="relative min-h-screen px-2 pb-10 pt-4 sm:px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <div className="mx-auto w-[min(1200px,calc(100%-0.5rem))] space-y-4">
        <Navbar />
        <Card elevated className="p-4">
          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-3">
              <div className="relative h-72 w-full">
                <Image src={deal.imageUrl} alt={deal.title} fill priority className="rounded-2xl object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-semibold text-white">{deal.title}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="warning">{score > 0 ? `+${score}°` : `${score}°`}</Badge>
                <Badge variant="neutral">{deal.storeName}</Badge>
                <Badge variant={deal.dealType === "local" ? "success" : "info"}>{deal.dealType}</Badge>
                {deal.city ? <Badge variant="success">{deal.city}</Badge> : null}
              </div>
              <p className="text-3xl font-bold text-white">{formatPrice(deal.currentPrice)} zł</p>
              <p className="text-sm text-white/70 line-through">
                {deal.oldPrice ? `${formatPrice(deal.oldPrice)} zł` : t(locale, "noPreviousPrice")}
              </p>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <p className="mb-2 text-xs uppercase tracking-[0.08em] text-white/55">{t(locale, "dealSource")}</p>
                <div className="flex items-center gap-3">
                  <Avatar name={deal.postedBy.username} />
                  <div>
                    <p className="text-sm font-medium text-white">{deal.postedBy.username}</p>
                    <p className="text-xs text-white/70">{deal.postedBy.rank} - {deal.postedBy.badge}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <PriceAlertButton productId={deal.id} />
                <Link href="/watchlist" className="text-xs text-accent-from underline">{t(locale, "openWatchlist")}</Link>
                {deal.sourceUrl ? (
                  <a href={deal.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-emerald-300 underline">
                    {locale === "tr" ? "Ceneo'da Gör" : "View on Ceneo"}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </Card>

        <AiInsightBox deal={deal} />
        <PriceComparisonTable productId={deal.id} />
        <PriceHistoryChart productId={deal.id} />
        <AdvancedPricePanels />
        <CommentThread productId={deal.id} productSlug={deal.slug} />
      </div>
    </main>
  );
}
