"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertOctagon } from "lucide-react";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4">
      <div className="mesh-bg pointer-events-none absolute inset-0 -z-20" />
      <Card elevated className="max-w-md p-8 text-center">
        <AlertOctagon className="mx-auto mb-4 h-12 w-12 text-red-400/60" />
        <h1 className="text-2xl font-semibold text-white">Something went wrong</h1>
        <p className="mt-2 text-sm text-white/65">
          An unexpected error occurred. Please try again.
        </p>
        <Button variant="primary" className="mt-6" onClick={reset}>
          Try Again
        </Button>
      </Card>
    </main>
  );
}
