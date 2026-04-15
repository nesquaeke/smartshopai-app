"use client";

import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { categories as fallbackCategories } from "@/data/categories";
import { flattenCategoryNodes, getSubtreeIds, rowsToCategoryTree, type CategoryRow } from "@/lib/category-tree";
import { supabase } from "@/lib/supabase";
import { CategoryNode } from "@/types/domain";

async function fetchCategoryRows(): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,name_pl,slug,parent_id,icon,trending")
    .order("parent_id", { ascending: true, nullsFirst: true })
    .order("name");

  if (error) {
    console.warn("categories fetch failed, using local tree:", error.message);
    return flattenCategoryNodes(fallbackCategories);
  }
  if (!data?.length) {
    return flattenCategoryNodes(fallbackCategories);
  }
  const seen = new Set<string>();
  const uniq: CategoryRow[] = [];
  for (const row of data as CategoryRow[]) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    uniq.push(row);
  }
  return uniq;
}

export function useSupabaseCategories() {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategoryRows,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
  });

  const rows = query.data ?? flattenCategoryNodes(fallbackCategories);
  const tree: CategoryNode[] = rowsToCategoryTree(rows);

  const getSubtreeIdSet = useCallback((categoryId: string | null): Set<string> | null => {
    if (!categoryId) return null;
    return getSubtreeIds(rows, categoryId);
  }, [rows]);

  const getDisplayName = useCallback(
    (categoryId: string, locale: "tr" | "en"): string => {
      const row = rows.find((r) => r.id === categoryId);
      if (!row) return categoryId;
      if (locale === "tr" && row.name_pl) return row.name_pl;
      return row.name;
    },
    [rows]
  );

  return {
    rows,
    tree,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
    getSubtreeIdSet,
    getDisplayName,
  };
}
