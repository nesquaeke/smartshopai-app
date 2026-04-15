"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ProductDeal } from "@/types/domain";
import { useDealsStore } from "@/store/deals-store";

interface SupabaseProduct {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  store_name: string | null;
  store_logos: string[];
  current_price: number;
  old_price: number | null;
  discount_percent: number | null;
  category_id: string | null;
  category_path: string[] | null;
  deal_type: string;
  city: string | null;
  description: string | null;
  source_url: string | null;
  source: string | null;
  upvotes: number;
  downvotes: number;
  engagement: number;
  posted_by_username: string;
  posted_by_rank: string;
  posted_by_badge: string;
  created_at: string;
}

function toProductDeal(p: SupabaseProduct): ProductDeal {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    imageUrl: (() => {
      const url = p.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80";
      return url.includes("ceneostatic") ? url.replace("/f-", "/i-") : url;
    })(),
    storeName: p.store_name || "Unknown",
    storeLogos: p.store_logos?.length ? p.store_logos : [(p.store_name || "?").slice(0, 2).toUpperCase()],
    currentPrice: Number(p.current_price),
    oldPrice: p.old_price ? Number(p.old_price) : undefined,
    discountPercent: p.discount_percent ?? undefined,
    upvotes: p.upvotes,
    downvotes: p.downvotes,
    engagement: p.engagement,
    postedAt: p.created_at,
    dealType: (p.deal_type as "online" | "local") || "online",
    city: p.city ?? undefined,
    categoryPath: p.category_path || [],
    categoryId: p.category_id ?? undefined,
    description: p.description ?? undefined,
    sourceUrl: p.source_url ?? undefined,
    postedBy: {
      username: p.posted_by_username || "SmartShopAI",
      rank: p.posted_by_rank || "System",
      badge: p.posted_by_badge || "Bot",
    },
  };
}

export function useSupabaseProducts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setDeals = useDealsStore((state) => state.setDeals);
  const currentDeals = useDealsStore((state) => state.deals);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const { data, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(200);

        if (fetchError) throw fetchError;
        if (cancelled) return;

        if (data && data.length > 0) {
          const deals = (data as SupabaseProduct[]).map(toProductDeal);
          setDeals(deals);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to fetch products");
          console.warn("Supabase fetch failed, using mock data:", e);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();
    return () => { cancelled = true; };
  }, [setDeals]);

  return { loading, error, productsCount: currentDeals.length };
}
