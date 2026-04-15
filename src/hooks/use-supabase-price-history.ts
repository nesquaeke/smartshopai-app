"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PriceHistoryPoint } from "@/types/domain";

export function useSupabasePriceHistory(productId: string) {
  const [data, setData] = useState<PriceHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    async function fetch() {
      try {
        const { data: rows, error } = await supabase
          .from("price_history")
          .select("*")
          .eq("product_id", productId)
          .order("recorded_at", { ascending: true });

        if (error) throw error;

        setData(
          (rows || []).map((r) => ({
            date: new Date(r.recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            price: Number(r.price),
          }))
        );
      } catch (e) {
        console.warn("Failed to fetch price history:", e);
      } finally {
        setLoading(false);
      }
    }

    fetch();
  }, [productId]);

  return { data, loading };
}
