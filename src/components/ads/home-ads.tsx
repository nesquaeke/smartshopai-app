import Link from "next/link";
import { Megaphone, Sparkles, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

export function HomeAds() {
  return (
    <section className="mt-5 grid gap-3 md:grid-cols-[1.35fr_1fr]">
      <Card elevated className="overflow-hidden p-0">
        <div className="relative bg-gradient-to-r from-indigo-500/35 via-violet-500/30 to-sky-500/30 p-5">
          <div className="absolute -right-7 -top-7 h-24 w-24 rounded-full bg-white/15 blur-2xl" />
          <p className="mb-1 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-white/70">
            <Megaphone className="h-3.5 w-3.5" />
            Sponsored
          </p>
          <h2 className="text-xl font-semibold text-white">Flash Deals Weekend - up to 45% off</h2>
          <p className="mt-2 text-sm text-white/80">Premium campaign slot for marketplace and brand partners.</p>
          <Link
            href="/campaigns/flash-weekend"
            className="mt-4 inline-flex rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white/90 hover:bg-white/20"
          >
            Explore Campaign
          </Link>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
        <Card className="p-4">
          <p className="mb-1 inline-flex items-center gap-1 text-xs text-white/65">
            <Sparkles className="h-3.5 w-3.5" />
            Promo Slot
          </p>
          <h3 className="text-sm font-medium text-white">AI-picked daily gadgets</h3>
          <p className="mt-1 text-xs text-white/70">Curated by top community trend score.</p>
          <Link href="/ai-lab" className="mt-3 inline-flex text-xs text-accent-from underline">
            Open AI picks
          </Link>
        </Card>
        <Card className="p-4">
          <p className="mb-1 inline-flex items-center gap-1 text-xs text-white/65">
            <Zap className="h-3.5 w-3.5" />
            Native Ad
          </p>
          <h3 className="text-sm font-medium text-white">Store partner highlight card</h3>
          <p className="mt-1 text-xs text-white/70">Designed to blend with feed without breaking UX.</p>
        </Card>
      </div>
    </section>
  );
}
