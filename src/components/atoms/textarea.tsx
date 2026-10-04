import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "border-line bg-sand text-ink placeholder:text-muted focus:border-copper min-h-24 w-full resize-y rounded-xl border px-3 py-2 text-sm outline-none",
        className,
      )}
      {...props}
    />
  );
}
