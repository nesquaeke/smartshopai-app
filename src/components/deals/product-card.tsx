"use client";

import { motion } from "framer-motion";
import { ArrowBigDown, ArrowBigUp, Bookmark, MapPin, MessageCircle, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDealsStore } from "@/store/deals-store";
import { useUserStore } from "@/store/user-store";
import { ProductDeal } from "@/types/domain";
import { cn } from "@/lib/utils";

type CardSize = "lg" | "md" | "sm";

interface ProductCardProps {
  deal: ProductDeal;
  cardSize?: CardSize;
}

const cardClasses: Record<CardSize, string> = {
  lg: "md:col-span-2 md:row-span-2 min-h-[28rem]",
  md: "md:col-span-2 min-h-[21rem]",
  sm: "min-h-[19rem]"
};

const formatPrice = (value: number) => new Intl.NumberFormat("tr-TR").format(value);

export function ProductCard({ deal, cardSize = "sm" }: ProductCardProps) {
  const { voteOnDeal, votes } = useDealsStore();
  const savedDealIds = useUserStore((state) => state.savedDealIds);
  const saveDeal = useUserStore((state) => state.saveDeal);
  const removeSavedDeal = useUserStore((state) => state.removeSavedDeal);
  const trackDealInteraction = useUserStore((state) => state.trackDealInteraction);
  const addPoints = useUserStore((state) => state.addPoints);
  const vote = votes[deal.id] ?? { direction: null, scoreDelta: 0 };
  const score = deal.upvotes - deal.downvotes + vote.scoreDelta;
  const isSaved = savedDealIds.includes(deal.id);

  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cardClasses[cardSize]}
    >
      <Card elevated className="group relative h-full overflow-hidden p-3">
        <Link href={`/deals/${deal.slug}`} className="block" onClick={() => trackDealInteraction(deal, "click")}>
          <div className="relative mb-3 h-48 overflow-hidden rounded-2xl border border-white/10 bg-black/20 md:h-56">
            <Image
              src={deal.imageUrl}
              alt={deal.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            {deal.discountPercent ? (
              <Badge variant="warning" className="absolute left-3 top-3 bg-gradient-to-r from-vote-up/90 to-rose-500/90 text-white">
                -{deal.discountPercent}%
              </Badge>
            ) : null}
            {deal.dealType === "local" ? (
              <Badge variant="success" className="absolute right-3 top-3 inline-flex gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {deal.city}
              </Badge>
            ) : null}
          </div>
        </Link>

        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-white">{deal.title}</h3>
            <div className="flex items-center gap-2 text-xs text-white/65">
              <Store className="h-3.5 w-3.5" />
              {deal.storeName}
            </div>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-xl font-bold text-white">{formatPrice(deal.currentPrice)} TL</div>
              {deal.oldPrice ? (
                <div className="text-xs text-white/55 line-through">{formatPrice(deal.oldPrice)} TL</div>
              ) : null}
            </div>
            <div className="flex flex-wrap justify-end gap-1.5">
              {deal.storeLogos.map((logo) => (
                <Badge key={`${deal.id}-${logo}`} className="h-6 min-w-6 justify-center px-1.5 text-[10px]">
                  {logo}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-2xl border border-white/20 bg-black/45 p-1.5 backdrop-blur-xl">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              voteOnDeal(deal.id, "up");
              trackDealInteraction(deal, "vote");
              addPoints(2);
            }}
            className={cn("h-8 w-8 rounded-xl", vote.direction === "up" ? "bg-vote-up/25 text-vote-up" : "text-white/70")}
            aria-label={`Upvote ${deal.title}`}
          >
            <ArrowBigUp className="h-5 w-5" />
          </Button>
          <motion.span
            key={score}
            initial={{ scale: 0.9, opacity: 0.65 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn("min-w-12 text-center text-sm font-semibold", score >= 0 ? "text-vote-up" : "text-vote-down")}
          >
            {score > 0 ? `+${score}°` : `${score}°`}
          </motion.span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              voteOnDeal(deal.id, "down");
              trackDealInteraction(deal, "vote");
            }}
            className={cn(
              "h-8 w-8 rounded-xl",
              vote.direction === "down" ? "bg-vote-down/25 text-vote-down" : "text-white/70"
            )}
            aria-label={`Downvote ${deal.title}`}
          >
            <ArrowBigDown className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
          <MessageCircle className="h-3.5 w-3.5" />
          <span>{deal.engagement} interactions</span>
          <Badge className="px-2 py-0.5 text-[10px]">{deal.postedBy.badge}</Badge>
          <Button
            size="sm"
            variant={isSaved ? "primary" : "secondary"}
            className="ml-auto h-7 rounded-full px-2"
            onClick={() => (isSaved ? removeSavedDeal(deal.id) : saveDeal(deal.id))}
          >
            <Bookmark className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Card>
    </motion.article>
  );
}
