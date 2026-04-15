"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { t } from "@/lib/i18n";
import { useToastStore } from "@/store/toast-store";
import { useUiStore } from "@/store/ui-store";
import { ProductDeal } from "@/types/domain";

interface AiInsightBoxProps {
  deal: ProductDeal;
}

export function AiInsightBox({ deal }: AiInsightBoxProps) {
  const locale = useUiStore((state) => state.locale);
  const discount = deal.discountPercent ?? 0;
  const score = deal.upvotes - deal.downvotes;
  const hasSignals = discount > 0 || score !== 0 || deal.engagement > 0;
  const confidence = hasSignals
    ? Math.min(98, Math.max(52, Math.round((score + discount * 3 + deal.engagement / 22) / 4)))
    : 0;
  const isGoodPrice = discount >= 15 || score > 90;
  const recommendation = isGoodPrice ? t(locale, "buyNow") : t(locale, "waitForDrop");
  const explanation = isGoodPrice
    ? t(locale, "insightStrong")
    : t(locale, "insightAverage");

  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-base font-semibold text-white">{t(locale, "aiInsightTitle")}</h3>
        <Badge variant={isGoodPrice ? "success" : "warning"}>{isGoodPrice ? t(locale, "goodPrice") : t(locale, "averagePrice")}</Badge>
      </div>
      <p className="text-sm text-white/75">
        {t(locale, "recommendation")}: {recommendation}
      </p>
      <p className="mt-2 text-xs text-white/60">{explanation}</p>
      <div className="mt-3 flex items-center gap-2">
        <Badge variant="info">
          {t(locale, "confidenceLabel")} {confidence}%
        </Badge>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => useToastStore.getState().addToast(t(locale, "alertCreated"), "success")}
        >
          {t(locale, "planAlert")}
        </Button>
      </div>
    </Card>
  );
}
