import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export function Card({ className, elevated = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl",
        elevated ? "shadow-soft" : "shadow-glass",
        className
      )}
      {...props}
    />
  );
}
