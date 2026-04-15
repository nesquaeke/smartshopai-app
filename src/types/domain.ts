export type DealType = "online" | "local";
export type VoteDirection = "up" | "down" | null;

export interface CategoryNode {
  id: string;
  name: string;
  /** Polish label from Supabase when available */
  namePl?: string | null;
  slug: string;
  icon: string;
  trending?: boolean;
  children?: CategoryNode[];
}

export interface ProductDeal {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  storeName: string;
  storeLogos: string[];
  currentPrice: number;
  oldPrice?: number;
  discountPercent?: number;
  upvotes: number;
  downvotes: number;
  engagement: number;
  postedAt: string;
  dealType: DealType;
  city?: string;
  categoryPath: string[];
  /** Leaf category id from Supabase (matches categories.id) */
  categoryId?: string | null;
  description?: string;
  sourceUrl?: string;
  postedBy: {
    username: string;
    rank: string;
    badge: string;
  };
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export interface StoreOffer {
  id: string;
  storeName: string;
  price: number;
  inStock: boolean;
  url: string;
}

export interface ProductComment {
  id: string;
  productSlug: string;
  author: string;
  authorBadge: string;
  content: string;
  upvotes: number;
  createdAt: string;
  replies?: ProductComment[];
}

export interface PriceAlert {
  id: string;
  productId: string;
  targetPrice: number;
  createdAt: string;
}
