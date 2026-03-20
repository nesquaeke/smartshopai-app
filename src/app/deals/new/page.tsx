"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDealsStore } from "@/store/deals-store";
import { ProductDeal } from "@/types/domain";

export default function NewDealPage() {
  const addDeal = useDealsStore((state) => state.addDeal);
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    price: "",
    oldPrice: "",
    storeName: "",
    category: "",
    description: "",
    imageUrl: "",
    dealType: "online",
    city: ""
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const slug = form.title.toLowerCase().replace(/\s+/g, "-");

    const nextDeal: ProductDeal = {
      id: crypto.randomUUID(),
      title: form.title,
      slug,
      imageUrl:
        form.imageUrl ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
      storeName: form.storeName,
      storeLogos: [form.storeName.slice(0, 2).toUpperCase()],
      currentPrice: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      discountPercent:
        form.oldPrice && Number(form.oldPrice) > Number(form.price)
          ? Math.round(((Number(form.oldPrice) - Number(form.price)) / Number(form.oldPrice)) * 100)
          : undefined,
      upvotes: 1,
      downvotes: 0,
      engagement: 1,
      postedAt: new Date().toISOString(),
      dealType: form.dealType as "online" | "local",
      city: form.dealType === "local" ? form.city : undefined,
      categoryPath: form.category.split(">").map((item) => item.trim()),
      postedBy: {
        username: "you",
        rank: "Fresh Poster",
        badge: "Starter"
      }
    };

    addDeal(nextDeal);
    router.push("/");
  };

  return (
    <main className="relative min-h-screen px-2 pb-10 pt-4 sm:px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <Navbar />
      <div className="mx-auto w-[min(900px,calc(100%-0.5rem))] pt-4">
        <Card elevated className="p-5">
          <h1 className="mb-4 text-2xl font-semibold text-white">Post New Deal</h1>
          <form className="grid gap-3 md:grid-cols-2" onSubmit={submit}>
            <Input
              placeholder="Title"
              required
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />
            <Input
              placeholder="Store"
              required
              value={form.storeName}
              onChange={(event) => setForm((prev) => ({ ...prev, storeName: event.target.value }))}
            />
            <Input
              type="number"
              placeholder="Price"
              required
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
            />
            <Input
              type="number"
              placeholder="Old Price (optional)"
              value={form.oldPrice}
              onChange={(event) => setForm((prev) => ({ ...prev, oldPrice: event.target.value }))}
            />
            <Input
              placeholder="Category path (e.g. Electronics > Phones > Samsung)"
              required
              className="md:col-span-2"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            />
            <Input
              placeholder="Product URL or image URL"
              className="md:col-span-2"
              value={form.imageUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
            />
            <textarea
              placeholder="Description"
              className="h-32 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-white outline-none placeholder:text-white/55 md:col-span-2"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />

            <div className="flex items-center gap-2 md:col-span-2">
              <Button
                variant={form.dealType === "online" ? "primary" : "secondary"}
                onClick={() => setForm((prev) => ({ ...prev, dealType: "online" }))}
              >
                Online Deal
              </Button>
              <Button
                variant={form.dealType === "local" ? "primary" : "secondary"}
                onClick={() => setForm((prev) => ({ ...prev, dealType: "local" }))}
              >
                Local Deal
              </Button>
              <Input
                placeholder="City (for local)"
                disabled={form.dealType !== "local"}
                value={form.city}
                onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" variant="primary">
                Submit Deal
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
