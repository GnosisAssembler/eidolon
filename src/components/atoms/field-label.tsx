import * as Label from "@radix-ui/react-label";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

export function FieldLabel({
  className,
  ...props
}: ComponentProps<typeof Label.Root>) {
  return (
    <Label.Root
      className={cn(
        "text-muted text-xs font-medium tracking-wide uppercase",
        className,
      )}
      {...props}
    />
  );
}
