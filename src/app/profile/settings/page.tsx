"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { t } from "@/lib/i18n";
import { useUiStore } from "@/store/ui-store";
import { useUserStore } from "@/store/user-store";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const profile = useUserStore((state) => state.profile);
  const points = useUserStore((state) => state.points);
  const rank = useUserStore((state) => state.rank);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const locale = useUiStore((state) => state.locale);

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [city, setCity] = useState(profile.city);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    updateProfile({ name, email, city });
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden px-2 pb-10 pt-4 sm:px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <Navbar />
      <div className="mx-auto mt-5 w-[min(760px,calc(100%-0.5rem))] space-y-4">
        {!isLoggedIn ? (
          <Card className="p-5 text-sm text-white/80">
            {t(locale, "profileNeedLogin")}
            <div className="mt-3">
              <Button onClick={() => router.push("/login")} variant="primary">
                {t(locale, "goToLogin")}
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <Card elevated className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div className="flex items-center gap-3">
                <Avatar name={profile.name} className="h-12 w-12 text-sm" />
                <div>
                  <p className="text-base font-semibold text-white">{profile.name}</p>
                  <p className="text-sm text-white/65">{profile.email}</p>
                </div>
              </div>
              <Badge className="h-10 items-center px-4 text-sm">
                {points} {t(locale, "points")} - {rank}
              </Badge>
            </Card>

            <Card className="p-5">
              <h1 className="mb-3 text-xl font-semibold text-white">{t(locale, "profileOverview")}</h1>
              <form className="space-y-3" onSubmit={onSubmit}>
                <Input value={name} onChange={(event) => setName(event.target.value)} placeholder={t(locale, "name")} />
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t(locale, "email")}
                />
                <Input value={city} onChange={(event) => setCity(event.target.value)} placeholder={t(locale, "city")} />
                <Button type="submit" variant="primary">
                  {t(locale, "saveChanges")}
                </Button>
              </form>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
