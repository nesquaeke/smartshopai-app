import { HomeAds } from "@/components/ads/home-ads";
import { HomeFeed } from "@/components/feed/home-feed";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden px-2 pb-10 pt-4 sm:px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(84,112,255,0.25),transparent_35%),radial-gradient(circle_at_80%_100%,rgba(18,184,134,0.2),transparent_40%)]" />

      <Navbar />
      <div className="mx-auto w-[min(1200px,calc(100%-0.5rem))]">
        <HomeAds />
        <HomeFeed />
      </div>
    </main>
  );
}
