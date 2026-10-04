import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "border-line bg-sand text-ink focus:border-copper h-8 w-full rounded-md border px-2 text-[13px] outline-none",
        className,
      )}
      {...props}
    />
  );
}
