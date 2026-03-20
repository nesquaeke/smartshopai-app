import { Locale } from "@/store/ui-store";

type Dict = Record<string, { tr: string; en: string }>;

const dict: Dict = {
  home: { tr: "Ana Sayfa", en: "Home" },
  categories: { tr: "Kategoriler", en: "Categories" },
  notifications: { tr: "Bildirimler", en: "Notifications" },
  profile: { tr: "Profil", en: "Profile" },
  logout: { tr: "Cikis Yap", en: "Logout" },
  profileSettings: { tr: "Profil Ayarlari", en: "Profile Settings" },
  watchlist: { tr: "Izleme Listesi", en: "Watchlist" },
  postDeal: { tr: "Firsat Paylas", en: "Post Deal" },
  theme: { tr: "Tema", en: "Theme" },
  defaultTheme: { tr: "Default", en: "Default" },
  oceanTheme: { tr: "Ocean", en: "Ocean" },
  emeraldTheme: { tr: "Emerald", en: "Emerald" },
  searchPlaceholder: { tr: "Firsat, marka veya kategori ara...", en: "Search deals, brands, categories..." },
  smartFeed: { tr: "Akilli Akis", en: "Smart Feed" },
  trendingDiscovery: { tr: "Trend Urun Kesfi", en: "Trending Product Discovery" },
  rankingHint: { tr: "Vote + etkilesim + tazelik", en: "Ranked by votes + engagement + recency" },
  allDeals: { tr: "Tum Firsatlar", en: "All Deals" },
  online: { tr: "Online", en: "Online" },
  local: { tr: "Yerel", en: "Local" },
  filterByCity: { tr: "Sehre gore filtrele...", en: "Filter by city..." },
  category: { tr: "Kategori", en: "Category" },
  noDeals: { tr: "Bu filtrelerle eslesen firsat yok.", en: "No deals match this filter set yet." },
  allCategories: { tr: "Tum Kategoriler", en: "All Categories" },
  trendingCategories: { tr: "Trend Kategoriler", en: "Trending Categories" },
  recentlyVisited: { tr: "Son Ziyaretler", en: "Recently Visited" },
  clearFilter: { tr: "Filtreyi Temizle", en: "Clear Filter" },
  quickCategories: { tr: "Hizli Erisim", en: "Quick Access" }
};

export function t(locale: Locale, key: keyof typeof dict): string {
  return dict[key][locale];
}
