"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { t } from "@/lib/i18n";
import { useUiStore } from "@/store/ui-store";

export function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();
  const locale = useUiStore((state) => state.locale);

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={toggleTheme}
      aria-label={t(locale, "toggleTheme")}
      title={mode === "dark" ? t(locale, "switchLightMode") : t(locale, "switchDarkMode")}
    >
      {mode === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
    </Button>
  );
}
