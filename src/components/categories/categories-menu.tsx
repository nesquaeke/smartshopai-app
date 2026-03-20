"use client";

import {
  Apple,
  ChefHat,
  ChevronDown,
  Cpu,
  Flame,
  Footprints,
  Gamepad2,
  Gem,
  House,
  Laptop,
  LucideIcon,
  MonitorSmartphone,
  Phone,
  Shirt,
  Smartphone,
  Sparkles,
  SprayCan
} from "lucide-react";
import { useMemo, useState } from "react";
import { categories, recentlyVisitedCategories } from "@/data/categories";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { t } from "@/lib/i18n";
import { useFiltersStore } from "@/store/filters-store";
import { useUiStore } from "@/store/ui-store";
import { CategoryNode } from "@/types/domain";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Smartphone,
  Apple,
  Phone,
  Cpu,
  Sparkles,
  Flame,
  Laptop,
  MonitorSmartphone,
  Gamepad2,
  House,
  ChefHat,
  SprayCan,
  Shirt,
  Footprints,
  Gem
};

function CategoryItem({ category, level = 0 }: { category: CategoryNode; level?: number }) {
  const [open, setOpen] = useState(level === 0);
  const Icon = iconMap[category.icon] ?? Sparkles;
  const selectedCategory = useFiltersStore((state) => state.selectedCategory);
  const setSelectedCategory = useFiltersStore((state) => state.setSelectedCategory);
  const isSelected = selectedCategory?.toLowerCase() === category.name.toLowerCase();
  const hasChildren = Boolean(category.children?.length);

  return (
    <li>
      <button
        type="button"
        onClick={() => {
          setSelectedCategory(isSelected ? null : category.name);
          if (hasChildren) setOpen((value) => !value);
        }}
        className={cn(
          "group flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-3 py-2 text-left transition hover:border-white/20 hover:bg-white/10",
          level > 0 && "ml-2",
          isSelected && "border-white/30 bg-white/15"
        )}
      >
        <span className="flex items-center gap-2 text-sm text-white/90">
          <Icon className="h-4 w-4 text-white/70 transition group-hover:text-white" />
          {category.name}
        </span>
        {hasChildren ? (
          <span className="inline-flex items-center gap-1 text-xs text-white/45">
            {category.children?.length}
            <ChevronDown className={cn("h-3.5 w-3.5 transition", open ? "rotate-180" : "")} />
          </span>
        ) : null}
      </button>
      {hasChildren && open ? (
        <ul className="mt-2 space-y-2 border-l border-white/10 pl-2">
          {(category.children ?? []).map((child) => (
            <CategoryItem key={child.id} category={child} level={level + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function CategoriesMenu() {
  const [categoryQuery, setCategoryQuery] = useState("");
  const locale = useUiStore((state) => state.locale);
  const trending = categories.filter((category) => category.trending);
  const selectedCategory = useFiltersStore((state) => state.selectedCategory);
  const setSelectedCategory = useFiltersStore((state) => state.setSelectedCategory);

  const quickAccess = useMemo(
    () => ["Electronics", "Phones", "Gaming", "Home", "Kitchen", "Fashion"],
    []
  );

  const filteredCategories = useMemo(() => {
    const q = categoryQuery.trim().toLowerCase();
    if (!q) return categories;
    const recursiveFilter = (nodes: CategoryNode[]): CategoryNode[] =>
      nodes
        .map((node) => ({
          ...node,
          children: node.children ? recursiveFilter(node.children) : undefined
        }))
        .filter((node) => node.name.toLowerCase().includes(q) || (node.children && node.children.length > 0));
    return recursiveFilter(categories);
  }, [categoryQuery]);

  return (
    <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-3xl border border-white/15 bg-black/25 p-4 shadow-soft backdrop-blur-xl">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-white/70">{t(locale, "allCategories")}</h3>
          {selectedCategory ? (
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="rounded-lg border border-white/15 px-2.5 py-1 text-xs text-white/80 hover:bg-white/10"
            >
              {t(locale, "clearFilter")}
            </button>
          ) : null}
        </div>
        <Input
          value={categoryQuery}
          onChange={(event) => setCategoryQuery(event.target.value)}
          placeholder={locale === "tr" ? "Kategori ara..." : "Search category..."}
          className="mb-3 h-9 text-xs"
        />
        <div className="mb-3">
          <p className="mb-2 text-xs uppercase tracking-[0.08em] text-white/50">{t(locale, "quickCategories")}</p>
          <div className="flex flex-wrap gap-2">
            {quickAccess.map((name) => (
              <button key={name} type="button" onClick={() => setSelectedCategory(name)}>
                <Badge className="hover:bg-white/20">{name}</Badge>
              </button>
            ))}
          </div>
        </div>
        <ul className="max-h-[24rem] space-y-2 overflow-auto pr-2">
          {filteredCategories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </ul>
      </section>

      <aside className="space-y-4">
        <section className="rounded-3xl border border-white/15 bg-black/20 p-4 shadow-glass backdrop-blur-xl">
          <h3 className="mb-3 text-sm font-medium text-white/70">{t(locale, "trendingCategories")}</h3>
          <ul className="space-y-2">
            {trending.map((category) => (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(category.name)}
                  className={cn(
                    "w-full rounded-xl border px-3 py-2 text-left text-sm transition",
                    selectedCategory === category.name
                      ? "border-white/30 bg-white/15 text-white"
                      : "border-white/10 bg-white/5 text-white/90 hover:bg-white/10"
                  )}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-white/15 bg-black/20 p-4 shadow-glass backdrop-blur-xl">
          <h3 className="mb-3 text-sm font-medium text-white/70">{t(locale, "recentlyVisited")}</h3>
          <ul className="flex flex-wrap gap-2">
            {recentlyVisitedCategories.map((name) => (
              <li key={name}>
                <button type="button" onClick={() => setSelectedCategory(name)}>
                  <Badge>{name}</Badge>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
}
