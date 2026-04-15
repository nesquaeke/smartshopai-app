"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface SupabaseComment {
  id: string;
  product_id: string;
  author_name: string;
  author_badge: string;
  content: string;
  upvotes: number;
  parent_id: string | null;
  created_at: string;
  replies?: SupabaseComment[];
}

function nestComments(flat: SupabaseComment[]): SupabaseComment[] {
  const map = new Map<string, SupabaseComment>();
  const roots: SupabaseComment[] = [];

  for (const c of flat) {
    map.set(c.id, { ...c, replies: [] });
  }

  for (const c of flat) {
    const node = map.get(c.id)!;
    if (c.parent_id && map.has(c.parent_id)) {
      map.get(c.parent_id)!.replies!.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export function useSupabaseComments(productId: string) {
  const [comments, setComments] = useState<SupabaseComment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    if (!productId) return;
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(nestComments(data || []));
    } catch (e) {
      console.warn("Failed to fetch comments:", e);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchComments();

    const channel = supabase
      .channel(`comments:${productId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments", filter: `product_id=eq.${productId}` },
        () => { fetchComments(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [productId, fetchComments]);

  const addComment = async (content: string, authorName: string, parentId?: string) => {
    if (!content.trim()) return;

    const { error } = await supabase.from("comments").insert({
      product_id: productId,
      author_name: authorName || "Anonymous",
      author_badge: "Member",
      content: content.trim(),
      parent_id: parentId || null,
    });

    if (error) {
      console.error("Failed to add comment:", error);
      return;
    }

    await fetchComments();
  };

  return { comments, loading, addComment };
}
