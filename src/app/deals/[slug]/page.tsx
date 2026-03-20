import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AdvancedPricePanels } from "@/components/deals/advanced-price-panels";
import { AiInsightBox } from "@/components/deals/ai-insight-box";
import { PriceAlertButton } from "@/components/deals/price-alert-button";
import { CommentThread } from "@/components/forum/comment-thread";
import { Navbar } from "@/components/layout/navbar";
import { PriceComparisonTable } from "@/components/deals/price-comparison-table";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getDealBySlug } from "@/lib/deals";

const PriceHistoryChart = dynamic(
  () => import("@/components/deals/price-history-chart").then((module) => module.PriceHistoryChart),
  {
    loading: () => <div className="h-64 animate-pulse rounded-3xl border border-white/15 bg-white/5" />
  }
);

interface DealDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DealDetailPage({ params }: DealDetailPageProps) {
  const { slug } = await params;
  const deal = getDealBySlug(slug);

  if (!deal) {
    notFound();
  }

  const score = deal.upvotes - deal.downvotes;

  return (
    <main className="relative min-h-screen px-2 pb-10 pt-4 sm:px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <div className="mx-auto w-[min(1200px,calc(100%-0.5rem))] space-y-4">
        <Navbar />
        <Card elevated className="p-4">
          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-3">
              <div className="relative h-72 w-full">
                <Image src={deal.imageUrl} alt={deal.title} fill className="rounded-2xl object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
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
              <p className="text-3xl font-bold text-white">{new Intl.NumberFormat("tr-TR").format(deal.currentPrice)} TL</p>
              <p className="text-sm text-white/70 line-through">
                {deal.oldPrice ? `${new Intl.NumberFormat("tr-TR").format(deal.oldPrice)} TL` : "No previous price"}
              </p>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <p className="mb-2 text-xs uppercase tracking-[0.08em] text-white/55">Deal Source</p>
                <div className="flex items-center gap-3">
                  <Avatar name={deal.postedBy.username} />
                  <div>
                    <p className="text-sm font-medium text-white">{deal.postedBy.username}</p>
                    <p className="text-xs text-white/70">
                      {deal.postedBy.rank} - {deal.postedBy.badge}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <PriceAlertButton productId={deal.id} />
                <Link href="/watchlist" className="text-xs text-accent-from underline">
                  Open Watchlist
                </Link>
                {deal.dealType === "local" ? (
                  <Link href="/local" className="text-xs text-emerald-300 underline">
                    View Local Deals Map
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </Card>

        <AiInsightBox deal={deal} />
        <PriceComparisonTable productSlug={deal.slug} />
        <PriceHistoryChart productId={deal.id} />
        <AdvancedPricePanels />
        <CommentThread productSlug={deal.slug} />
      </div>
    </main>
  );
}
