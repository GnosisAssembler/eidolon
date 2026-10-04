"use client";

import { Tooltip } from "@/components/atoms/tooltip";
import { cn } from "@/lib/cn";
import { STEP_CATALOG } from "@/lib/steps";
import type { StepType } from "@/lib/types";

export function PaletteItem({
  type,
  locked = false,
  onAdd,
  onDragStart,
  onDragEnd,
}: {
  type: StepType;
  locked?: boolean;
  onAdd: (type: StepType) => void;
  onDragStart: (type: StepType) => void;
  onDragEnd: () => void;
}) {
  const definition = STEP_CATALOG[type];
  const Icon = definition.icon;
  const hint = locked ? "Already on the canvas" : "Drag or click";

  const body = (
    <>
      <span
        className={cn(
          "text-sand flex size-8 shrink-0 items-center justify-center rounded-xl",
          definition.accent,
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="text-ink block text-sm font-medium">
          {definition.label}
        </span>
        <span className="text-muted block text-xs">{hint}</span>
      </span>
    </>
  );

  if (locked) {
    return (
      <Tooltip label={definition.description}>
        <div
          aria-disabled="true"
          className="border-line bg-paper flex w-full cursor-default items-center gap-2.5 rounded-md border px-2.5 py-2 text-left"
        >
          {body}
        </div>
      </Tooltip>
    );
  }

  return (
    <Tooltip label={definition.description}>
      <button
        type="button"
        draggable
        onClick={() => onAdd(type)}
        onDragStart={(event) => {
          event.dataTransfer.setData("application/eidolon-step", type);
          event.dataTransfer.setData("text/plain", type);
          event.dataTransfer.effectAllowed = "copy";
          onDragStart(type);
        }}
        onDragEnd={onDragEnd}
        className="border-line bg-sand hover:border-copper/60 flex w-full items-center gap-2.5 rounded-md border px-2.5 py-2 text-left transition"
      >
        {body}
      </button>
    </Tooltip>
  );
}
