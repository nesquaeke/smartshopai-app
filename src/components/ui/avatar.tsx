import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  className?: string;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part.slice(0, 1).toUpperCase())
    .join("")
    .slice(0, 2);

export function Avatar({ name, className }: AvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-accent-from/45 to-accent-to/55 text-xs font-semibold text-white shadow-glass",
        className
      )}
      aria-label={name}
    >
      {initials || <UserRound className="h-4 w-4" />}
    </div>
  );
}
