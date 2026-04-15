import { CategoryNode } from "@/types/domain";

export interface CategoryRow {
  id: string;
  name: string;
  name_pl: string | null;
  slug: string;
  parent_id: string | null;
  icon: string;
  trending: boolean;
}

function rowDepth(rows: CategoryRow[], id: string, memo = new Map<string, number>(), chain = new Set<string>()): number {
  if (memo.has(id)) return memo.get(id)!;
  if (chain.has(id)) return 0;
  chain.add(id);
  const row = rows.find((r) => r.id === id);
  if (!row || !row.parent_id) {
    memo.set(id, 0);
    return 0;
  }
  const d = Math.min(24, 1 + rowDepth(rows, row.parent_id, memo, chain));
  memo.set(id, d);
  return d;
}

export function rowsToCategoryTree(rows: CategoryRow[]): CategoryNode[] {
  const sorted = [...rows].sort((a, b) => rowDepth(rows, a.id) - rowDepth(rows, b.id));
  const map = new Map<string, CategoryNode>();
  for (const r of sorted) {
    map.set(r.id, {
      id: r.id,
      name: r.name,
      namePl: r.name_pl,
      slug: r.slug,
      icon: r.icon || "Sparkles",
      trending: r.trending,
      children: [],
    });
  }
  const roots: CategoryNode[] = [];
  for (const r of sorted) {
    const node = map.get(r.id)!;
    if (!r.parent_id || !map.has(r.parent_id)) {
      roots.push(node);
    } else {
      const parent = map.get(r.parent_id)!;
      if (!parent.children) parent.children = [];
      parent.children.push(node);
    }
  }
  const seen = new Set<string>();
  return roots.filter((n) => {
    if (seen.has(n.id)) return false;
    seen.add(n.id);
    return true;
  });
}

export function getSubtreeIds(rows: Pick<CategoryRow, "id" | "parent_id">[], rootId: string): Set<string> {
  const byParent = new Map<string, string[]>();
  for (const r of rows) {
    const p = r.parent_id ?? "__root__";
    if (!byParent.has(p)) byParent.set(p, []);
    byParent.get(p)!.push(r.id);
  }
  const out = new Set<string>();
  const stack = [rootId];
  while (stack.length) {
    const id = stack.pop()!;
    if (out.has(id)) continue;
    out.add(id);
    for (const child of byParent.get(id) ?? []) {
      stack.push(child);
    }
  }
  return out;
}

export function flattenCategoryNodes(nodes: CategoryNode[], parentId: string | null = null): CategoryRow[] {
  const out: CategoryRow[] = [];
  for (const n of nodes) {
    out.push({
      id: n.id,
      name: n.name,
      name_pl: n.namePl ?? null,
      slug: n.slug,
      parent_id: parentId,
      icon: n.icon,
      trending: Boolean(n.trending),
    });
    if (n.children?.length) {
      out.push(...flattenCategoryNodes(n.children, n.id));
    }
  }
  return out;
}
