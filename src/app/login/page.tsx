"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signIn, signUp } from "@/lib/supabase-auth";
import { t } from "@/lib/i18n";
import { useUiStore } from "@/store/ui-store";
import { useUserStore } from "@/store/user-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const locale = useUiStore((state) => state.locale);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const { error: signUpError } = await signUp(email, password, name || "User");
        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }
      }

      const { data, error: signInError } = await signIn(email, password);
      if (signInError) {
        if (mode === "register" && signInError.message.includes("Email not confirmed")) {
          setError(locale === "tr" ? "Kayıt başarılı! E-posta onayı gerekebilir." : "Registered! Email confirmation may be required.");
          login({ name: name || email.split("@")[0], email });
          setTimeout(() => router.push("/"), 1500);
          return;
        }
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        login({
          name: data.user.user_metadata?.display_name || name || email.split("@")[0],
          email: data.user.email || email,
        });
        router.push("/");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden px-2 pb-10 pt-4 sm:px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <Navbar />
      <div className="mx-auto mt-5 w-[min(560px,calc(100%-0.5rem))]">
        <Card elevated className="p-6">
          <h1 className="text-2xl font-semibold text-white">
            {mode === "login" ? t(locale, "loginTitle") : (locale === "tr" ? "Hesap Oluştur" : "Create Account")}
          </h1>
          <p className="mt-1 text-sm text-white/70">
            {mode === "login"
              ? (locale === "tr" ? "E-posta ve şifre ile giriş yap" : "Sign in with email and password")
              : (locale === "tr" ? "Yeni hesap oluştur" : "Create a new account")}
          </p>

          {error ? (
            <div className="mt-3 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          <form className="mt-5 space-y-3" onSubmit={onSubmit}>
            {mode === "register" ? (
              <Input
                placeholder={t(locale, "name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : null}
            <Input
              type="email"
              required
              placeholder={t(locale, "email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              required
              minLength={6}
              placeholder={locale === "tr" ? "Şifre (min 6 karakter)" : "Password (min 6 chars)"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading
                ? "..."
                : mode === "login"
                  ? t(locale, "continue")
                  : (locale === "tr" ? "Kayıt Ol" : "Sign Up")}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              className="text-sm text-accent-from hover:underline"
            >
              {mode === "login"
                ? (locale === "tr" ? "Hesabın yok mu? Kayıt ol" : "Don't have an account? Sign up")
                : (locale === "tr" ? "Zaten hesabın var mı? Giriş yap" : "Already have an account? Sign in")}
            </button>
          </div>
        </Card>
      </div>
    </main>
  );
}
