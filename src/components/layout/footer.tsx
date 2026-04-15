import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto w-[min(1200px,calc(100%-1.25rem))] px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2 text-white">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">SmartShopAI</span>
            </div>
            <p className="text-xs text-white/50">
              Community-powered deal discovery and price intelligence platform.
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/40">Platform</p>
            <nav className="flex flex-col gap-1.5">
              <Link href="/" className="text-xs text-white/65 hover:text-white">Home</Link>
              <Link href="/deals/new" className="text-xs text-white/65 hover:text-white">Post Deal</Link>
              <Link href="/local" className="text-xs text-white/65 hover:text-white">Local Deals</Link>
              <Link href="/campaigns" className="text-xs text-white/65 hover:text-white">Campaigns</Link>
            </nav>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/40">Account</p>
            <nav className="flex flex-col gap-1.5">
              <Link href="/login" className="text-xs text-white/65 hover:text-white">Login</Link>
              <Link href="/watchlist" className="text-xs text-white/65 hover:text-white">Watchlist</Link>
              <Link href="/profile/settings" className="text-xs text-white/65 hover:text-white">Settings</Link>
              <Link href="/notifications" className="text-xs text-white/65 hover:text-white">Notifications</Link>
            </nav>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/40">Legal</p>
            <nav className="flex flex-col gap-1.5">
              <span className="text-xs text-white/50">About Us</span>
              <span className="text-xs text-white/50">Contact</span>
              <span className="text-xs text-white/50">Terms of Use</span>
              <span className="text-xs text-white/50">Privacy Policy</span>
            </nav>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-4 text-center text-xs text-white/35">
          &copy; {new Date().getFullYear()} SmartShopAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
