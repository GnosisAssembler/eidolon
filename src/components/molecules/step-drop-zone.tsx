"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import { isStepType } from "@/lib/steps";
import type { StepType } from "@/lib/types";

export function StepDropZone({
  parentId,
  onAdd,
}: {
  parentId: string;
  onAdd: (parentId: string, type: StepType) => void;
}) {
  const [over, setOver] = useState(false);

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        const raw =
          event.dataTransfer.getData("application/eidolon-step") ||
          event.dataTransfer.getData("text/plain");
        if (isStepType(raw) && raw !== "trigger") {
          onAdd(parentId, raw);
        }
        setOver(false);
      }}
      className={cn(
        "text-muted flex h-24 w-40 items-center justify-center rounded-2xl border border-dashed px-3 text-center text-xs",
        over
          ? "border-copper bg-copper/10 text-copper-deep"
          : "border-ink/15 bg-sand/40",
      )}
    >
      Drop a step
    </div>
  );
}
