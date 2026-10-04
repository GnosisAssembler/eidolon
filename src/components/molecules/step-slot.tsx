"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import { NODE_H, NODE_W } from "@/lib/graph";
import { isStepType } from "@/lib/steps";
import type { Point, StepType } from "@/lib/types";

export function StepSlot({
  parentId,
  parentName,
  position,
  fallbackType,
  onDrop,
}: {
  parentId: string;
  parentName: string;
  position: Point;
  fallbackType: StepType | null;
  onDrop: (type: StepType, parentId: string, position: Point) => void;
}) {
  const [over, setOver] = useState(false);

  return (
    <div
      data-testid={`drop-slot-${parentId}`}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = "copy";
        }
        setOver(true);
      }}
      onDragLeave={(event) => {
        const next = event.relatedTarget;
        if (next instanceof Node && event.currentTarget.contains(next)) {
          return;
        }
        setOver(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setOver(false);
        const raw =
          event.dataTransfer?.getData("application/eidolon-step") ||
          event.dataTransfer?.getData("text/plain") ||
          "";
        if (isStepType(raw)) {
          if (raw !== "trigger") {
            onDrop(raw, parentId, position);
          }
          return;
        }
        if (fallbackType && fallbackType !== "trigger") {
          onDrop(fallbackType, parentId, position);
        }
      }}
      className={cn(
        "border-copper text-copper-deep absolute z-30 flex flex-col items-center justify-center rounded-md border-2 border-dotted px-3 text-center transition-all",
        over ? "bg-copper/15 shadow-sm" : "bg-sand/95",
      )}
      style={{
        left: position.x,
        top: position.y,
        width: NODE_W,
        height: over ? NODE_H + 10 : NODE_H,
      }}
    >
      <span className="pointer-events-none text-[11px] font-semibold">
        Drop step
      </span>
      <span className="pointer-events-none max-w-full truncate text-[10px]">
        under {parentName}
      </span>
    </div>
  );
}
