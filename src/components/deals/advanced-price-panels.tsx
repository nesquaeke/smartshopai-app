"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { t } from "@/lib/i18n";
import { useUiStore } from "@/store/ui-store";

export function AdvancedPricePanels() {
  const locale = useUiStore((state) => state.locale);

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Card className="p-3">
        <p className="text-xs uppercase tracking-[0.08em] text-white/55">{t(locale, "bestTimeBuy")}</p>
        <p className="mt-1 text-sm text-white/85">{t(locale, "likelySoon")}</p>
        <Badge variant="info" className="mt-2">
          {t(locale, "trendSignal")}
        </Badge>
      </Card>
      <Card className="p-3">
        <p className="text-xs uppercase tracking-[0.08em] text-white/55">{t(locale, "commentSummary")}</p>
        <p className="mt-1 text-sm text-white/85">{t(locale, "commentSummaryText")}</p>
      </Card>
      <Card className="p-3">
        <p className="text-xs uppercase tracking-[0.08em] text-white/55">{t(locale, "whyAffordable")}</p>
        <p className="mt-1 text-sm text-white/85">{t(locale, "whyAffordableText")}</p>
      </Card>
    </div>
  );
}
