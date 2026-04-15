"use client";

import {
  Apple,
  Baby,
  Bath,
  BookOpen,
  Briefcase,
  Camera,
  Car,
  ChefHat,
  ChevronDown,
  Cpu,
  Disc3,
  Dumbbell,
  Flame,
  Flower2,
  Footprints,
  Gamepad2,
  Gem,
  Headphones,
  Heart,
  House,
  Laptop,
  Lightbulb,
  LucideIcon,
  Monitor,
  MonitorSmartphone,
  PaintBucket,
  Phone,
  Refrigerator,
  Shirt,
  ShoppingCart,
  Smartphone,
  Sparkles,
  SprayCan,
  Tablet,
  Tv,
  Wrench,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSupabaseCategories } from "@/hooks/use-supabase-categories";
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
  Gem,
  Tablet,
  Tv,
  Camera,
  Monitor,
  Dumbbell,
  Baby,
  Car,
  ShoppingCart,
  BookOpen,
  Heart,
  Bath,
  Flower2,
  Wrench,
  Lightbulb,
  PaintBucket,
  Refrigerator,
  Briefcase,
  Disc3,
  Headphones,
};

function CategoryItem({
  category,
  level = 0,
  onCategoryPick,
  locale,
}: {
  category: CategoryNode;
  level?: number;
  onCategoryPick?: () => void;
  locale: "tr" | "en";
}) {
  const [open, setOpen] = useState(level === 0);
  const Icon = iconMap[category.icon] ?? Sparkles;
  const selectedCategoryId = useFiltersStore((state) => state.selectedCategoryId);
  const setSelectedCategoryId = useFiltersStore((state) => state.setSelectedCategoryId);
  const label = locale === "tr" && category.namePl ? category.namePl : category.name;
  const isSelected = selectedCategoryId === category.id;
  const hasChildren = Boolean(category.children?.length);

  return (
    <li>
      <button
        type="button"
        onClick={() => {
          setSelectedCategoryId(isSelected ? null : category.id);
          onCategoryPick?.();
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
          <span className="min-w-0 truncate">{label}</span>
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
            <CategoryItem key={child.id} category={child} level={level + 1} onCategoryPick={onCategoryPick} locale={locale} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

interface CategoriesMenuProps {
  onCategoryPick?: () => void;
}

export function CategoriesMenu({ onCategoryPick }: CategoriesMenuProps) {
  const [categoryQuery, setCategoryQuery] = useState("");
  const locale = useUiStore((state) => state.locale);
  const { tree, rows } = useSupabaseCategories();
  const selectedCategoryId = useFiltersStore((state) => state.selectedCategoryId);
  const setSelectedCategoryId = useFiltersStore((state) => state.setSelectedCategoryId);

  const trending = useMemo(() => rows.filter((r) => r.trending).slice(0, 12), [rows]);

  const quickAccess = useMemo(() => {
    const ids = ["electronics", "phones", "gaming", "home-garden", "kitchen", "fashion"];
    return ids
      .map((id) => rows.find((r) => r.id === id))
      .filter(Boolean) as typeof rows;
  }, [rows]);

  const filteredTree = useMemo(() => {
    const q = categoryQuery.trim().toLowerCase();
    if (!q) return tree;
    const filterNodes = (nodes: CategoryNode[]): CategoryNode[] =>
      nodes
        .map((node) => ({
          ...node,
          children: node.children ? filterNodes(node.children) : undefined,
        }))
        .filter((node) => {
          const en = node.name.toLowerCase().includes(q);
          const pl = (node.namePl || "").toLowerCase().includes(q);
          const hasKids = node.children && node.children.length > 0;
          return en || pl || hasKids;
        });
    return filterNodes(tree);
  }, [categoryQuery, tree]);

  return (
    <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-3xl border border-white/15 bg-black/25 p-4 shadow-soft backdrop-blur-xl">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-white/70">{t(locale, "allCategories")}</h3>
          {selectedCategoryId ? (
            <button
              type="button"
              onClick={() => setSelectedCategoryId(null)}
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
            {quickAccess.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => {
                  setSelectedCategoryId(row.id);
                  onCategoryPick?.();
                }}
              >
                <Badge
                  className={cn(
                    "hover:bg-white/20",
                    selectedCategoryId === row.id && "border-white/35 bg-white/20 text-white"
                  )}
                >
                  {locale === "tr" && row.name_pl ? row.name_pl : row.name}
                </Badge>
              </button>
            ))}
          </div>
        </div>
        <ul className="max-h-[24rem] space-y-2 overflow-auto pr-2">
          {filteredTree.map((category) => (
            <CategoryItem key={category.id} category={category} onCategoryPick={onCategoryPick} locale={locale} />
          ))}
        </ul>
      </section>

      <aside className="space-y-4">
        <section className="rounded-3xl border border-white/15 bg-black/20 p-4 shadow-glass backdrop-blur-xl">
          <h3 className="mb-3 text-sm font-medium text-white/70">{t(locale, "trendingCategories")}</h3>
          <ul className="space-y-2">
            {trending.map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId(row.id);
                    onCategoryPick?.();
                  }}
                  className={cn(
                    "w-full rounded-xl border px-3 py-2 text-left text-sm transition",
                    selectedCategoryId === row.id
                      ? "border-white/30 bg-white/15 text-white"
                      : "border-white/10 bg-white/5 text-white/90 hover:bg-white/10"
                  )}
                >
                  {locale === "tr" && row.name_pl ? row.name_pl : row.name}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-white/15 bg-black/20 p-4 shadow-glass backdrop-blur-xl">
          <h3 className="mb-3 text-sm font-medium text-white/70">{t(locale, "recentlyVisited")}</h3>
          <ul className="flex flex-wrap gap-2">
            {["samsung", "gaming-laptops", "kitchen", "sneakers", "headphones", "consoles"].map((id) => {
              const row = rows.find((r) => r.id === id);
              if (!row) return null;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategoryId(row.id);
                      onCategoryPick?.();
                    }}
                  >
                    <Badge className={cn(selectedCategoryId === row.id && "border-white/35 bg-white/20 text-white")}>
                      {locale === "tr" && row.name_pl ? row.name_pl : row.name}
                    </Badge>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </aside>
    </div>
  );
}
