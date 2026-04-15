import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BuildVersionPill } from "@/components/layout/build-version-pill";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "SmartShopAI - Deal Discovery & Price Intelligence",
    template: "%s | SmartShopAI"
  },
  description: "Community-powered deal discovery and price comparison platform. Find the best deals, track prices, and share bargains.",
  keywords: ["deals", "price comparison", "price tracking", "bargains", "community deals", "SmartShopAI"],
  openGraph: {
    type: "website",
    siteName: "SmartShopAI",
    title: "SmartShopAI - Deal Discovery & Price Intelligence",
    description: "Community-powered deal discovery and price comparison platform."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-white/20 focus:px-4 focus:py-2 focus:text-white focus:backdrop-blur-xl">
          Skip to content
        </a>
        <BuildVersionPill />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
