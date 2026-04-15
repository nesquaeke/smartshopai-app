"use client";

import { Bell, TrendingUp, MessageCircle, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Card } from "@/components/ui/card";
import { t } from "@/lib/i18n";
import { useUiStore } from "@/store/ui-store";
import { useUserStore } from "@/store/user-store";

const mockNotifications = [
  { id: "1", icon: TrendingUp, text: "Samsung Galaxy S25 Ultra got 50+ upvotes!", time: "2h ago", type: "success" as const },
  { id: "2", icon: MessageCircle, text: "New reply on Sony WH-1000XM6 discussion", time: "4h ago", type: "info" as const },
  { id: "3", icon: AlertTriangle, text: "Price drop alert: iPhone 16 Pro is now under target!", time: "6h ago", type: "warning" as const },
  { id: "4", icon: Bell, text: "Welcome to SmartShopAI! Start exploring deals.", time: "1d ago", type: "info" as const },
];

export default function NotificationsPage() {
  const locale = useUiStore((state) => state.locale);
  const alerts = useUserStore((state) => state.alerts);

  return (
    <main className="relative min-h-screen px-2 pb-10 pt-4 sm:px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <div className="mx-auto w-[min(800px,calc(100%-0.5rem))] space-y-4">
        <Navbar />
        <h1 className="text-2xl font-semibold text-white">{t(locale, "notifications")}</h1>
        <div className="space-y-2">
          {mockNotifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <Card key={notif.id} className="flex items-start gap-3 p-4">
                <div className={`mt-0.5 rounded-xl p-2 ${notif.type === "success" ? "bg-emerald-500/20 text-emerald-400" : notif.type === "warning" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white/90">{notif.text}</p>
                  <p className="mt-1 text-xs text-white/50">{notif.time}</p>
                </div>
              </Card>
            );
          })}
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <Card key={alert.id} className="flex items-start gap-3 p-4">
                <div className="mt-0.5 rounded-xl bg-amber-500/20 p-2 text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white/90">Price alert set for {alert.targetPrice} TL</p>
                  <p className="mt-1 text-xs text-white/50">{new Date(alert.createdAt).toLocaleDateString()}</p>
                </div>
              </Card>
            ))
          ) : null}
        </div>
      </div>
    </main>
  );
}
