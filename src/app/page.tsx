"use client";

import { HomeAds } from "@/components/ads/home-ads";
import { HomeFeed } from "@/components/feed/home-feed";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { useSupabaseProducts } from "@/hooks/use-supabase-products";

export default function Home() {
  const { loading } = useSupabaseProducts();

  return (
    <main className="relative min-h-screen overflow-x-hidden px-2 pb-10 pt-4 sm:px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(84,112,255,0.25),transparent_35%),radial-gradient(circle_at_80%_100%,rgba(18,184,134,0.2),transparent_40%)]" />

      <Navbar />
      <div className="mx-auto w-[min(1200px,calc(100%-0.5rem))]">
        <HomeAds />
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
