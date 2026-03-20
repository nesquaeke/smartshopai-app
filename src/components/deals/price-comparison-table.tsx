import { storeOffersByProduct } from "@/data/store-offers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PriceComparisonTableProps {
  productSlug: string;
}

export function PriceComparisonTable({ productSlug }: PriceComparisonTableProps) {
  const offers = storeOffersByProduct[productSlug] ?? [];

  return (
    <section className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-2xl">
      <h3 className="mb-3 text-base font-semibold text-white">Price Comparison</h3>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm text-white/85">
          <thead className="bg-black/20 text-xs uppercase tracking-[0.08em] text-white/60">
            <tr>
              <th className="px-3 py-2">Store</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Availability</th>
              <th className="px-3 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {offers.length ? (
              offers.map((offer) => (
                <tr key={offer.id} className="border-t border-white/10 bg-white/[0.03]">
                  <td className="px-3 py-2">{offer.storeName}</td>
                  <td className="px-3 py-2 font-semibold">{new Intl.NumberFormat("tr-TR").format(offer.price)} TL</td>
                  <td className="px-3 py-2">
                    <Badge variant={offer.inStock ? "success" : "warning"}>{offer.inStock ? "In Stock" : "Limited"}</Badge>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <a href={offer.url} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="secondary">
                        Visit
                      </Button>
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-white/10 bg-white/[0.03]">
                <td className="px-3 py-4 text-sm text-white/60" colSpan={4}>
                  No live store offers yet for this product. AI will update this slot soon.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
