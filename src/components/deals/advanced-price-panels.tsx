import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function AdvancedPricePanels() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Card className="p-3">
        <p className="text-xs uppercase tracking-[0.08em] text-white/55">Best time to buy</p>
        <p className="mt-1 text-sm text-white/85">Likely in 2-3 weeks</p>
        <Badge variant="info" className="mt-2">AI predictive mode</Badge>
      </Card>
      <Card className="p-3">
        <p className="text-xs uppercase tracking-[0.08em] text-white/55">AI comment summary</p>
        <p className="mt-1 text-sm text-white/85">
          Users praise stock reliability and delivery speed. Main concern is campaign ending soon.
        </p>
      </Card>
      <Card className="p-3">
        <p className="text-xs uppercase tracking-[0.08em] text-white/55">Why is this cheap?</p>
        <p className="mt-1 text-sm text-white/85">
          Likely combination of stock-clearance, competitive dynamic pricing and timed coupon stack.
        </p>
      </Card>
    </div>
  );
}
