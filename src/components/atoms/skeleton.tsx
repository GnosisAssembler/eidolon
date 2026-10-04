import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-ink/8 animate-pulse rounded-2xl", className)} />
  );
}
