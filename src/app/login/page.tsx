"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/user-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    login({
      name: name.trim() || "Smart User",
      email: email.trim() || "user@smartshopai.app"
    });
    router.push("/");
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden px-2 pb-10 pt-4 sm:px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <Navbar />
      <div className="mx-auto mt-5 w-[min(560px,calc(100%-0.5rem))]">
        <Card elevated className="p-6">
          <h1 className="text-2xl font-semibold text-white">Login to SmartShopAI</h1>
          <p className="mt-1 text-sm text-white/70">Visual demo login (mock). No backend required.</p>
          <form className="mt-5 space-y-3" onSubmit={onSubmit}>
            <Input placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button type="submit" variant="primary" className="w-full">
              Continue
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
