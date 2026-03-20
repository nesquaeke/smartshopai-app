import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductDeal } from "@/types/domain";

interface AiInsightBoxProps {
  deal: ProductDeal;
}

export function AiInsightBox({ deal }: AiInsightBoxProps) {
  const discount = deal.discountPercent ?? 0;
  const score = deal.upvotes - deal.downvotes;
  const confidence = Math.min(98, Math.max(52, Math.round((score + discount * 3 + deal.engagement / 22) / 4)));
  const isGoodPrice = discount >= 15 || score > 90;
  const recommendation = isGoodPrice ? "Buy now" : "Wait for better drop";
  const explanation = isGoodPrice
    ? "Strong deal pressure detected from high upvotes, healthy engagement and discount depth."
    : "Price looks average compared to recent trend. Watch this item for a stronger drop.";

  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-base font-semibold text-white">AI Price Insight</h3>
        <Badge variant={isGoodPrice ? "success" : "warning"}>{isGoodPrice ? "Good Price" : "Bad Price"}</Badge>
      </div>
      <p className="text-sm text-white/75">Recommendation: {recommendation}</p>
      <p className="mt-2 text-xs text-white/60">{explanation}</p>
      <div className="mt-3 flex items-center gap-2">
        <Badge variant="info">Confidence {confidence}%</Badge>
        <Button size="sm" variant="secondary">
          Simulate Alert Strategy
        </Button>
      </div>
    </Card>
  );
}
