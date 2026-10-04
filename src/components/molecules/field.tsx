import type { ReactNode } from "react";

import { FieldLabel } from "@/components/atoms/field-label";
import { cn } from "@/lib/cn";

export function Field({
  label,
  htmlFor,
  children,
  compact = false,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex flex-col", compact ? "gap-1" : "gap-1.5")}>
      <FieldLabel
        htmlFor={htmlFor}
        className={compact ? "text-[10px]" : undefined}
      >
        {label}
      </FieldLabel>
      {children}
    </div>
  );
}
