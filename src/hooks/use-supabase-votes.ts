"use client";

import { useCallback } from "react";
import { supabase } from "@/lib/supabase";

function getFingerprint(): string {
  if (typeof window === "undefined") return "server";
  const nav = window.navigator;
  const raw = [nav.userAgent, nav.language, screen.width, screen.height, new Date().getTimezoneOffset()].join("|");
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36);
}

export function useSupabaseVotes() {
  const vote = useCallback(async (productId: string, direction: "up" | "down") => {
    const fingerprint = getFingerprint();

    const { data: existing } = await supabase
      .from("votes")
      .select("id, direction")
      .eq("product_id", productId)
      .eq("user_fingerprint", fingerprint)
      .limit(1)
      .single();

    if (existing) {
      if (existing.direction === direction) {
        await supabase.from("votes").delete().eq("id", existing.id);
        await updateProductVoteCount(productId, direction, -1);
        return "removed";
      } else {
        await supabase.from("votes").update({ direction }).eq("id", existing.id);
        await updateProductVoteCount(productId, existing.direction === "up" ? "up" : "down", -1);
        await updateProductVoteCount(productId, direction, 1);
        return "switched";
      }
    } else {
      await supabase.from("votes").insert({
        product_id: productId,
        user_fingerprint: fingerprint,
        direction,
      });
      await updateProductVoteCount(productId, direction, 1);
      return "voted";
    }
  }, []);

  return { vote };
}

async function updateProductVoteCount(productId: string, direction: string, delta: number) {
  const field = direction === "up" ? "upvotes" : "downvotes";
  const { data } = await supabase.from("products").select(field).eq("id", productId).single();
  if (data) {
    const current = (data as Record<string, number>)[field] || 0;
    await supabase.from("products").update({ [field]: Math.max(0, current + delta) }).eq("id", productId);
  }
}
