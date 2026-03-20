import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "neutral" | "success" | "warning" | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "border-white/15 bg-white/10 text-white/80",
  success: "border-emerald-300/25 bg-emerald-400/12 text-emerald-100",
  warning: "border-orange-300/25 bg-orange-400/12 text-orange-100",
  info: "border-sky-300/25 bg-sky-400/12 text-sky-100"
};

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
