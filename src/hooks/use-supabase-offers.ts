"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { StoreOffer } from "@/types/domain";

export function useSupabaseOffers(productId: string) {
  const [offers, setOffers] = useState<StoreOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    async function fetch() {
      try {
        const { data, error } = await supabase
          .from("store_offers")
          .select("*")
          .eq("product_id", productId)
          .order("price", { ascending: true });

        if (error) throw error;

        setOffers(
          (data || []).map((o) => ({
            id: o.id,
            storeName: o.store_name,
            price: Number(o.price),
            inStock: o.in_stock,
            url: o.url,
          }))
        );
      } catch (e) {
        console.warn("Failed to fetch offers:", e);
      } finally {
        setLoading(false);
      }
    }

    fetch();
  }, [productId]);

  return { offers, loading };
}
