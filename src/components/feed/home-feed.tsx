"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/deals/product-card";
import { useFilteredDeals } from "@/hooks/use-filtered-deals";
import { t } from "@/lib/i18n";
import { getCardSize } from "@/lib/ranking";
import { useSupabaseCategories } from "@/hooks/use-supabase-categories";
import { useFiltersStore } from "@/store/filters-store";
import { useUiStore } from "@/store/ui-store";

export function HomeFeed() {
  const rankedDeals = useFilteredDeals();
  const selectedCategoryId = useFiltersStore((state) => state.selectedCategoryId);
  const dealType = useFiltersStore((state) => state.dealType);
  const city = useFiltersStore((state) => state.city);
  const locale = useUiStore((state) => state.locale);
  const sortMode = useFiltersStore((state) => state.sortMode);
  const { getDisplayName } = useSupabaseCategories();
  const setDealType = useFiltersStore((state) => state.setDealType);
  const setSelectedCategoryId = useFiltersStore((state) => state.setSelectedCategoryId);
  const setCity = useFiltersStore((state) => state.setCity);
  const setSortMode = useFiltersStore((state) => state.setSortMode);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(4);
  }, [selectedCategoryId, dealType, city, sortMode]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (loadingMore) return;
        if (!entry.isIntersecting || visibleCount >= rankedDeals.length) return;
        setLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + 4, rankedDeals.length));
          setLoadingMore(false);
        }, 280);
      },
      { rootMargin: "260px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rankedDeals.length, visibleCount, loadingMore]);

  const displayedDeals = rankedDeals.slice(0, visibleCount);

  return (
    <section className="mt-6 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/55">{t(locale, "smartFeed")}</p>
          <h1 className="text-2xl font-semibold text-white md:text-3xl">{t(locale, "trendingDiscovery")}</h1>
        </div>
        <p className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80">
          {t(locale, "rankingHint")}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant={dealType === "all" ? "primary" : "secondary"} size="sm" onClick={() => setDealType("all")} aria-pressed={dealType === "all"}>
          {t(locale, "allDeals")}
        </Button>
        <Button
          variant={dealType === "online" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setDealType("online")}
          aria-pressed={dealType === "online"}
        >
          {t(locale, "online")}
        </Button>
        <Button
          variant={dealType === "local" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setDealType("local")}
          aria-pressed={dealType === "local"}
        >
          {t(locale, "local")}
        </Button>
        <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
          {(["trending", "newest", "discount"] as const).map((mode) => (
            <Button
              key={mode}
              size="sm"
              variant={sortMode === mode ? "primary" : "ghost"}
              onClick={() => setSortMode(mode)}
              aria-pressed={sortMode === mode}
            >
              {t(locale, mode === "trending" ? "sortTrending" : mode === "newest" ? "sortNewest" : "sortDiscount")}
            </Button>
          ))}
        </div>
        <Input value={city} onChange={(event) => setCity(event.target.value)} placeholder={t(locale, "filterByCity")} className="h-9 w-44 text-xs" />
        {selectedCategoryId ? (
          <>
            <Badge className="h-8 px-3 text-xs">
              {t(locale, "selectedCategory")}: {getDisplayName(selectedCategoryId, locale)}
            </Badge>
            <Button size="sm" variant="ghost" onClick={() => setSelectedCategoryId(null)}>
              {t(locale, "clearCategory")}
            </Button>
          </>
        ) : null}
      </div>

      <div aria-live="polite" className="text-xs text-white/65">
        {selectedCategoryId ? `${t(locale, "category")}: ${getDisplayName(selectedCategoryId, locale)}` : ""}
      </div>

      <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {displayedDeals.map((deal, index) => (
          <ProductCard key={deal.id} deal={deal} cardSize={getCardSize(index)} />
        ))}
        {loadingMore
          ? Array.from({ length: 2 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="min-h-[18rem] animate-pulse rounded-3xl border border-white/10 bg-white/5 shadow-glass"
              />
            ))
          : null}
      </motion.div>

      {rankedDeals.length === 0 ? (
        <div className="rounded-3xl border border-white/15 bg-white/5 p-8 text-center text-sm text-white/70">
          {t(locale, "noDeals")}
        </div>
      ) : null}

      {visibleCount < rankedDeals.length ? (
        <div className="flex justify-center">
          <Button
            variant="secondary"
            onClick={() => setVisibleCount((prev) => Math.min(prev + 4, rankedDeals.length))}
          >
            {t(locale, "loadMore")}
          </Button>
        </div>
      ) : null}
      <div ref={sentinelRef} className="h-1" />
    </section>
  );
}
