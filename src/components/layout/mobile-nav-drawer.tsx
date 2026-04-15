"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Bookmark,
  House,
  LogOut,
  Menu,
  Settings,
  UserRound,
  X
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { useUiStore } from "@/store/ui-store";
import { useUserStore } from "@/store/user-store";

export function MobileNavDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useUiStore((state) => state.locale);
  const accentTheme = useUiStore((state) => state.accentTheme);
  const setAccentTheme = useUiStore((state) => state.setAccentTheme);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const profile = useUserStore((state) => state.profile);
  const points = useUserStore((state) => state.points);
  const logout = useUserStore((state) => state.logout);
  const savedDealIds = useUserStore((state) => state.savedDealIds);

  return (
    <div className="sm:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 z-[85] flex h-full w-72 flex-col gap-2 border-l border-white/10 bg-[#0a0e1a]/95 p-5 backdrop-blur-2xl"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close menu">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {isLoggedIn ? (
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <Avatar name={profile.name} className="h-10 w-10" />
                  <div>
                    <p className="text-sm font-medium text-white">{profile.name}</p>
                    <p className="text-xs text-white/60">{points} {t(locale, "points")}</p>
                  </div>
                </div>
              ) : null}

              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/85 hover:bg-white/10">
                <House className="h-4 w-4" />
                {t(locale, "home")}
              </Link>

              <Link href="/notifications" onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/85 hover:bg-white/10">
                <Bell className="h-4 w-4" />
                {t(locale, "notifications")}
              </Link>

              <Link href="/watchlist" onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/85 hover:bg-white/10">
                <Bookmark className="h-4 w-4" />
                {t(locale, "watchlist")}
                {savedDealIds.length > 0 ? (
                  <Badge className="ml-auto h-5 min-w-5 justify-center px-1 text-[10px]">{savedDealIds.length}</Badge>
                ) : null}
              </Link>

              {isLoggedIn ? (
                <>
                  <Link href="/profile/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/85 hover:bg-white/10">
                    <Settings className="h-4 w-4" />
                    {t(locale, "profileSettings")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-300 hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    {t(locale, "logout")}
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/85 hover:bg-white/10">
                  <UserRound className="h-4 w-4" />
                  {t(locale, "login")}
                </Link>
              )}

              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="mb-2 text-xs text-white/50">{t(locale, "theme")}</p>
                <div className="flex gap-2">
                  {(["default", "ocean", "emerald"] as const).map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => setAccentTheme(theme)}
                      className={cn(
                        "flex-1 rounded-xl px-2 py-1.5 text-xs font-medium capitalize",
                        accentTheme === theme ? "bg-white/20 text-white" : "text-white/60 hover:bg-white/10"
                      )}
                    >
                      {theme === "default" ? t(locale, "defaultTheme") : theme === "ocean" ? t(locale, "oceanTheme") : t(locale, "emeraldTheme")}
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
