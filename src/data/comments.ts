import { ProductComment } from "@/types/domain";

export const commentsByProductSlug: Record<string, ProductComment[]> = {
  "samsung-galaxy-s25-ultra-512gb": [
    {
      id: "c1",
      productSlug: "samsung-galaxy-s25-ultra-512gb",
      author: "buraktech",
      authorBadge: "Deal Veteran",
      content: "Bu fiyat son 90 günün en düşük seviyesi gibi duruyor.",
      upvotes: 34,
      createdAt: "2h ago",
      replies: [
        {
          id: "c1-r1",
          productSlug: "samsung-galaxy-s25-ultra-512gb",
          author: "locallegend",
          authorBadge: "City Hero",
          content: "Aynen, geçen hafta 52k altına inmemişti.",
          upvotes: 12,
          createdAt: "1h ago"
        }
      ]
    },
    {
      id: "c2",
      productSlug: "samsung-galaxy-s25-ultra-512gb",
      author: "fps_deals",
      authorBadge: "Power User",
      content: "Bankaya göre ekstra taksit kampanyası var, kontrol edin.",
      upvotes: 21,
      createdAt: "45m ago"
    }
  ]
};
