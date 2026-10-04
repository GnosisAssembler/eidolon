"use client";

import { useEffect, useRef, useState } from "react";

import { StepCard } from "@/components/molecules/step-card";
import { StepSlot } from "@/components/molecules/step-slot";
import { ZoomControls } from "@/components/molecules/zoom-controls";
import { cn } from "@/lib/cn";
import {
  NODE_H,
  NODE_W,
  collectEdges,
  edgePath,
  flattenSteps,
  insertionSlots,
  worldSize,
} from "@/lib/graph";
import { isStepType } from "@/lib/steps";
import type { Point, Step, StepPatch, StepType } from "@/lib/types";

export function WorkflowCanvas({
  root,
  selectedId,
  zoom,
  dragging,
  onSelect,
  onZoom,
  onMove,
  onChange,
  onDrop,
}: {
  root: Step;
  selectedId: string | null;
  zoom: number;
  dragging: StepType | null;
  onSelect: (id: string | null) => void;
  onZoom: (zoom: number) => void;
  onMove: (id: string, position: Point) => void;
  onChange: (id: string, patch: StepPatch) => void;
  onDrop: (type: StepType, position: Point, parentId?: string) => void;
}) {
  const frameRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const fitted = useRef(false);
  const [pan, setPan] = useState({ x: 24, y: 16 });
  const size = worldSize(root);
  const showSlots = dragging !== null && dragging !== "trigger";

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || fitted.current) {
      return;
    }
    fitted.current = true;
    const fit = Math.min(1, (frame.clientWidth - 48) / size.width);
    onZoom(fit);
  }, [onZoom, size.width]);
  const edges = collectEdges(root);
  const nodes = flattenSteps(root);

  function startPan(event: React.PointerEvent<HTMLElement>) {
    if (event.button !== 0) {
      return;
    }
    const startX = event.clientX;
    const startY = event.clientY;
    const origin = pan;
    const move = (next: PointerEvent) => {
      setPan({
        x: origin.x + next.clientX - startX,
        y: origin.y + next.clientY - startY,
      });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startDrag(event: React.PointerEvent<HTMLDivElement>, step: Step) {
    if (event.button !== 0) {
      return;
    }
    const target = event.target;
    if (target instanceof HTMLElement && target.closest("[data-step-fields]")) {
      return;
    }
    event.stopPropagation();
    onSelect(step.id);
    const startX = event.clientX;
    const startY = event.clientY;
    const origin = step.position;
    const move = (next: PointerEvent) => {
      onMove(step.id, {
        x: Math.max(8, origin.x + (next.clientX - startX) / zoom),
        y: Math.max(8, origin.y + (next.clientY - startY) / zoom),
      });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  return (
    <section
      ref={frameRef}
      className="canvas-dots relative min-h-80 min-w-0 flex-1 overflow-hidden"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          onSelect(null);
          startPan(event);
        }
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const raw =
          event.dataTransfer.getData("application/eidolon-step") ||
          event.dataTransfer.getData("text/plain");
        const world = worldRef.current?.getBoundingClientRect();
        if (!world || !isStepType(raw) || raw === "trigger") {
          return;
        }
        onDrop(raw, {
          x: Math.max(8, (event.clientX - world.left) / zoom - NODE_W / 2),
          y: Math.max(8, (event.clientY - world.top) / zoom - NODE_H / 2),
        });
      }}
      onWheel={(event) => {
        onZoom(zoom + (event.deltaY > 0 ? -0.1 : 0.1));
      }}
    >
      <div
        ref={worldRef}
        className="absolute top-0 left-0"
        style={{
          width: size.width,
          height: size.height,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) {
            onSelect(null);
            startPan(event);
          }
        }}
      >
        <svg
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={size.width}
          height={size.height}
        >
          {edges.map((edge) => {
            const path = edgePath(edge.from, edge.to);
            return (
              <g key={edge.id}>
                <path d={path} fill="none" stroke="#e7c56a" strokeWidth="2" />
                <path
                  d={path}
                  fill="none"
                  stroke="#f6c445"
                  strokeWidth="2.4"
                  className="edge-flow"
                />
              </g>
            );
          })}
        </svg>
        {nodes.map((step) => (
          <div
            key={step.id}
            className={cn(
              "absolute cursor-grab active:cursor-grabbing",
              selectedId === step.id ? "z-20" : "z-10",
            )}
            style={{
              left: step.position.x,
              top: step.position.y,
              width: NODE_W,
            }}
            onPointerDown={(event) => startDrag(event, step)}
          >
            <span
              className="border-gold bg-sand absolute -left-1.5 size-3 -translate-y-1/2 rounded-full border-2"
              style={{ top: NODE_H / 2 }}
            />
            <span
              className="border-gold bg-sand absolute -right-1.5 size-3 -translate-y-1/2 rounded-full border-2"
              style={{ top: NODE_H / 2 }}
            />
            <StepCard
              step={step}
              selected={selectedId === step.id}
              onSelect={onSelect}
              onChange={(patch) => onChange(step.id, patch)}
            />
          </div>
        ))}
        {showSlots
          ? insertionSlots(root).map((slot) => (
              <StepSlot
                key={slot.parentId}
                parentId={slot.parentId}
                parentName={slot.parentName}
                position={slot.position}
                fallbackType={dragging}
                onDrop={(type, parentId, position) =>
                  onDrop(type, position, parentId)
                }
              />
            ))
          : null}
      </div>
      <div className="pointer-events-none absolute right-3 bottom-3 left-3 flex items-end justify-between gap-3">
        <p className="border-line bg-sand/95 text-muted hidden rounded-md border px-2.5 py-1 text-[11px] shadow-sm sm:block">
          Drag a step to move it. Drag from the palette to see a dotted space
          where it can land.
        </p>
        <div className="pointer-events-auto ml-auto">
          <ZoomControls zoom={zoom} onZoom={onZoom} />
        </div>
      </div>
    </section>
  );
}
