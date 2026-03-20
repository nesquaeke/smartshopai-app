import { ProductDeal } from "@/types/domain";

const toHours = (isoDate: string) => {
  const ageMs = Date.now() - new Date(isoDate).getTime();
  return ageMs / (1000 * 60 * 60);
};

export const scoreDeal = (deal: ProductDeal) => {
  const voteScore = deal.upvotes - deal.downvotes;
  const engagementWeight = Math.log10(deal.engagement + 10) * 26;
  const recencyBoost = Math.max(0, 42 - toHours(deal.postedAt) * 1.45);
  const localBonus = deal.dealType === "local" ? 8 : 0;

  return voteScore * 1.8 + engagementWeight + recencyBoost + localBonus;
};

export const rankDeals = (deals: ProductDeal[]) =>
  [...deals].sort((a, b) => scoreDeal(b) - scoreDeal(a));

export const getCardSize = (index: number) => {
  if (index === 0) return "lg";
  if (index <= 2) return "md";
  return "sm";
};
