"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  Grid2x2,
  House,
  LogOut,
  Medal,
  Settings,
  Plus,
  Search,
  Sparkles,
  UserRound
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CategoriesMenu } from "@/components/categories/categories-menu";
import { MobileNavDrawer } from "@/components/layout/mobile-nav-drawer";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { useDealsStore } from "@/store/deals-store";
import { useFiltersStore } from "@/store/filters-store";
import { useUiStore } from "@/store/ui-store";
import { useUserStore } from "@/store/user-store";

export function Navbar() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isProfileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileMenuOpen]);

  const { query, setQuery } = useFiltersStore();
  const locale = useUiStore((state) => state.locale);
  const setLocale = useUiStore((state) => state.setLocale);
  const accentTheme = useUiStore((state) => state.accentTheme);
  const setAccentTheme = useUiStore((state) => state.setAccentTheme);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const profile = useUserStore((state) => state.profile);
  const points = useUserStore((state) => state.points);
  const logout = useUserStore((state) => state.logout);
  const savedDealIds = useUserStore((state) => state.savedDealIds);
  const deals = useDealsStore((state) => state.deals);
  const suggestions = query && query.length >= 2
    ? deals
        .filter((d) =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.storeName.toLowerCase().includes(query.toLowerCase()) ||
          d.categoryPath.some((c) => c.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-4 z-50 mx-auto w-[min(1200px,calc(100%-1.25rem))]">
      <nav className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-black/25">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3 xl:flex-1">
            <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent-from/80 to-accent-to/80 px-3 py-2 text-white shadow-glass">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold tracking-wide">{t(locale, "brandName")}</span>
            </div>

            <MobileNavDrawer />

            <Link href="/" className="hidden sm:inline-flex">
              <Button variant="secondary" className="gap-2">
                <House className="h-4 w-4" />
                {t(locale, "home")}
              </Button>
            </Link>

            <label htmlFor="search-input" className="group relative w-full min-w-0 xl:flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45 transition group-focus-within:text-white/70" />
              <Input
                id="search-input"
                type="text"
                placeholder={t(locale, "searchPlaceholder")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-10 pr-4"
              />
              {suggestions.length ? (
                <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-20 rounded-2xl border border-white/15 bg-black/60 p-2 backdrop-blur-xl">
                  {suggestions.map((deal) => (
                    <Link
                      key={deal.id}
                      href={`/deals/${deal.slug}`}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-white/80 hover:bg-white/10"
                      onClick={() => setQuery("")}
                    >
                      <span className="truncate font-medium">{deal.title}</span>
                      <span className="ml-auto shrink-0 text-white/50">{deal.storeName}</span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </label>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:flex-wrap xl:justify-end xl:gap-3 xl:overflow-visible xl:pb-0">
            <Button
              onClick={() => setIsCategoryOpen((prev) => !prev)}
              aria-expanded={isCategoryOpen}
              aria-controls="categories-panel"
              className={cn(
                "min-w-fit shrink-0 px-4",
                isCategoryOpen
                  ? "border-white/30 bg-white/20"
                  : "border-white/15 bg-white/10 hover:border-white/25 hover:bg-white/15"
              )}
            >
              <Grid2x2 className="h-4 w-4" />
              {t(locale, "categories")}
              <ChevronDown className={cn("h-4 w-4 transition", isCategoryOpen && "rotate-180")} />
            </Button>

            <div className="inline-flex h-11 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-1">
              <button
                type="button"
                onClick={() => setLocale("tr")}
                aria-pressed={locale === "tr"}
                className={cn(
                  "rounded-xl px-3 text-xs font-medium",
                  locale === "tr" ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
                )}
              >
                TR
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                aria-pressed={locale === "en"}
                className={cn(
                  "rounded-xl px-3 text-xs font-medium",
                  locale === "en" ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
                )}
              >
                EN
              </button>
            </div>

            <div className="hidden h-11 items-center gap-1 overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-1 lg:inline-flex">
              <span className="px-2 text-[11px] text-white/60">{t(locale, "theme")}</span>
              <button
                type="button"
                onClick={() => setAccentTheme("default")}
                className={cn(
                  "rounded-xl px-2 py-1 text-[11px] font-medium",
                  accentTheme === "default" ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
                )}
              >
                {t(locale, "defaultTheme")}
              </button>
              <button
                type="button"
                onClick={() => setAccentTheme("ocean")}
                className={cn(
                  "rounded-xl px-2 py-1 text-[11px] font-medium",
                  accentTheme === "ocean" ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
                )}
              >
                {t(locale, "oceanTheme")}
              </button>
              <button
                type="button"
                onClick={() => setAccentTheme("emerald")}
                className={cn(
                  "rounded-xl px-2 py-1 text-[11px] font-medium",
                  accentTheme === "emerald" ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
                )}
              >
                {t(locale, "emeraldTheme")}
              </button>
            </div>

            <ThemeToggle />

            <Link href="/notifications" className="hidden sm:inline-flex">
              <Button variant="secondary">
                <Bell className="h-4 w-4" />
                <span>{t(locale, "notifications")}</span>
              </Button>
            </Link>

            {isLoggedIn ? (
              <div className="relative" ref={profileMenuRef}>
                <Button
                  variant="secondary"
                  className="hidden sm:inline-flex"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                >
                  <Avatar name={profile.name} className="h-7 w-7" />
                  <span>{t(locale, "profile")}</span>
                  <UserRound className="h-4 w-4" />
                </Button>
                {isProfileMenuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.45rem)] z-30 w-56 rounded-2xl border border-white/15 bg-black/70 p-2 backdrop-blur-xl">
                    <p className="px-2 py-1 text-xs text-white/55">{profile.email}</p>
                    <Link href="/profile/settings" className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm text-white/85 hover:bg-white/10">
                      <Settings className="h-4 w-4" />
                      {t(locale, "profileSettings")}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-red-200 hover:bg-red-500/15"
                    >
                      <LogOut className="h-4 w-4" />
                      {t(locale, "logout")}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link href="/login" className="hidden sm:inline-flex">
                <Button variant="secondary">
                  <UserRound className="h-4 w-4" />
                  {t(locale, "login")}
                </Button>
              </Link>
            )}
            <Link href="/watchlist" className="hidden sm:inline-flex">
              <Badge className="h-11 rounded-2xl px-3 text-xs">
                {t(locale, "watchlist")}
                {savedDealIds.length > 0 ? (
                  <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1 text-[10px]">
                    {savedDealIds.length}
                  </span>
                ) : null}
              </Badge>
            </Link>
            {isLoggedIn ? (
              <Badge className="hidden h-11 items-center gap-1 rounded-2xl px-3 sm:inline-flex">
                <Avatar name={profile.name} className="h-6 w-6 border-white/30 text-[10px]" />
                <Medal className="h-4 w-4" />
                {points} {t(locale, "points")}
              </Badge>
            ) : null}

            <Link
              href="/deals/new"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-accent-from to-accent-to px-4 text-sm font-medium text-white shadow-glass transition hover:scale-[1.02] active:scale-[0.99]"
            >
              <Plus className="h-4 w-4" />
              {t(locale, "postDeal")}
            </Link>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isCategoryOpen ? (
            <motion.div
              id="categories-panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-3 rounded-3xl border border-white/15 bg-black/25 p-4 backdrop-blur-2xl"
            >
              <CategoriesMenu onCategoryPick={() => setIsCategoryOpen(false)} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </nav>
    </header>
  );
}
