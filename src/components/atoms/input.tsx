import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "border-line bg-sand text-ink placeholder:text-muted focus:border-copper h-10 w-full rounded-xl border px-3 text-sm outline-none",
        className,
      )}
      {...props}
    />
  );
}
