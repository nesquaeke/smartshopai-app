import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <Card elevated className="max-w-md p-8 text-center">
        <SearchX className="mx-auto mb-4 h-12 w-12 text-white/40" />
        <h1 className="text-2xl font-semibold text-white">Page not found</h1>
        <p className="mt-2 text-sm text-white/65">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button variant="primary">Go to Home</Button>
        </Link>
      </Card>
    </main>
  );
}
