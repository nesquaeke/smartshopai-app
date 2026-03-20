"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { priceHistoryByProduct } from "@/data/price-history";

const ranges = [
  { key: "7d", label: "7 Days", size: 7 },
  { key: "30d", label: "30 Days", size: 30 },
  { key: "90d", label: "90 Days", size: 90 },
  { key: "1y", label: "1 Year", size: 365 }
] as const;

interface PriceHistoryChartProps {
  productId: string;
}

export function PriceHistoryChart({ productId }: PriceHistoryChartProps) {
  const [range, setRange] = useState<(typeof ranges)[number]["key"]>("30d");

  const filteredData = useMemo(() => {
    const allData = priceHistoryByProduct[productId] ?? [];
    const selected = ranges.find((item) => item.key === range);
    if (!selected) return allData;
    return allData.slice(-Math.min(selected.size, allData.length));
  }, [productId, range]);

  return (
    <section className="space-y-3 rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-white">Price History</h3>
        <div className="flex flex-wrap gap-2">
          {ranges.map((item) => (
            <Button
              key={item.key}
              size="sm"
              variant={range === item.key ? "primary" : "secondary"}
              onClick={() => setRange(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(99,102,241,0.9)" stopOpacity={0.9} />
                <stop offset="95%" stopColor="rgba(99,102,241,0.05)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 11 }} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: "rgba(3,7,18,0.9)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 16
              }}
            />
            <Area dataKey="price" type="monotone" stroke="rgba(129,140,248,1)" fill="url(#priceGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
