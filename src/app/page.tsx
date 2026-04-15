"use client";

import { HomeAds } from "@/components/ads/home-ads";
import { HomeFeed } from "@/components/feed/home-feed";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { useSupabaseProducts } from "@/hooks/use-supabase-products";
import { t } from "@/lib/i18n";
import { useUiStore } from "@/store/ui-store";

export default function Home() {
  const { loading, error, productsCount, lastFetchedAt } = useSupabaseProducts();
  const locale = useUiStore((s) => s.locale);

  return (
    <main className="relative min-h-screen overflow-x-hidden px-2 pb-10 pt-4 sm:px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(84,112,255,0.25),transparent_35%),radial-gradient(circle_at_80%_100%,rgba(18,184,134,0.2),transparent_40%)]" />

      <Navbar />
      <div className="mx-auto w-[min(1200px,calc(100%-0.5rem))]">
        <HomeAds />
        {error ? (
          <p className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-100">
            {t(locale, "feedLoadError")}
            <span className="mt-1 block font-mono text-xs text-red-200/80">{error}</span>
          </p>
        ) : null}
        {!loading && !error ? (
          <p className="mt-2 text-center text-[11px] text-white/45">
            {t(locale, "feedAutoRefresh")}
            {lastFetchedAt ? (
              <>
                {" · "}
                {t(locale, "feedLastSync")}: {new Date(lastFetchedAt).toLocaleString(locale === "tr" ? "tr-TR" : "en-GB")} · {productsCount}{" "}
                {t(locale, "feedProductsCount")}
              </>
            ) : null}
          </p>
        ) : null}
        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
            ))}
          </div>
        ) : (
          <HomeFeed />
        )}
      </div>
      <Footer />
    </main>
  );
}
