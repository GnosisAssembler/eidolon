import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Checkbox({
  label,
  className,
  compact = false,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  compact?: boolean;
}) {
  return (
    <label
      className={cn(
        "text-ink flex items-start gap-2 leading-5",
        compact ? "text-xs" : "text-[13px]",
      )}
    >
      <input
        type="checkbox"
        className={cn("accent-copper mt-0.5 size-3.5 shrink-0", className)}
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}
