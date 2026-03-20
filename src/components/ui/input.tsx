import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none ring-0 placeholder:text-white/55 transition focus:border-white/30 focus:bg-white/15",
        className
      )}
      {...props}
    />
  );
});
