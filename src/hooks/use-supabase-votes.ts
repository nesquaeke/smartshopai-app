"use client";

import { useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useDealsStore } from "@/store/deals-store";

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

async function rpcAdjust(productId: string, direction: "up" | "down", delta: number) {
  const { error } = await supabase.rpc("adjust_product_vote_count", {
    p_product_id: productId,
    p_direction: direction,
    p_delta: delta,
  });
  if (error) {
    console.error("adjust_product_vote_count failed:", error.message);
    throw error;
  }
}

async function refreshDealVotes(productId: string) {
  const { data, error } = await supabase
    .from("products")
    .select("upvotes, downvotes")
    .eq("id", productId)
    .maybeSingle();
  if (error || !data) return;
  useDealsStore.getState().patchDeal(productId, {
    upvotes: Number(data.upvotes) || 0,
    downvotes: Number(data.downvotes) || 0,
  });
}

export type VoteResult = "voted" | "removed" | "switched";

export function useSupabaseVotes() {
  const vote = useCallback(async (productId: string, direction: "up" | "down"): Promise<VoteResult | "error"> => {
    const fingerprint = getFingerprint();

    try {
      const { data: existing, error: selErr } = await supabase
        .from("votes")
        .select("id, direction")
        .eq("product_id", productId)
        .eq("user_fingerprint", fingerprint)
        .maybeSingle();

      if (selErr) throw selErr;

      if (existing) {
        if (existing.direction === direction) {
          await supabase.from("votes").delete().eq("id", existing.id);
          await rpcAdjust(productId, direction, -1);
          await refreshDealVotes(productId);
          return "removed";
        }
        await supabase.from("votes").update({ direction }).eq("id", existing.id);
        await rpcAdjust(productId, existing.direction as "up" | "down", -1);
        await rpcAdjust(productId, direction, 1);
        await refreshDealVotes(productId);
        return "switched";
      }

      await supabase.from("votes").insert({
        product_id: productId,
        user_fingerprint: fingerprint,
        direction,
      });
      await rpcAdjust(productId, direction, 1);
      await refreshDealVotes(productId);
      return "voted";
    } catch (e) {
      console.error("Vote failed:", e);
      return "error";
    }
  }, []);

  return { vote };
}
