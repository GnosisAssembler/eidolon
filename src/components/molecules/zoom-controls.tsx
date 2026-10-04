import { Maximize2, Minus, Plus } from "lucide-react";

import { IconButton } from "@/components/atoms/icon-button";
import { MAX_ZOOM, MIN_ZOOM } from "@/lib/editor-reducer";

export function ZoomControls({
  zoom,
  onZoom,
}: {
  zoom: number;
  onZoom: (zoom: number) => void;
}) {
  return (
    <div className="border-line bg-sand flex items-center gap-1 rounded-2xl border p-1 shadow-[0_12px_30px_rgba(46,32,18,0.08)]">
      <IconButton
        label="Zoom out"
        onClick={() => onZoom(zoom - 0.1)}
        disabled={zoom <= MIN_ZOOM}
      >
        <Minus className="size-4" />
      </IconButton>
      <span className="text-muted w-12 text-center font-mono text-xs">
        {Math.round(zoom * 100)}%
      </span>
      <IconButton
        label="Zoom in"
        onClick={() => onZoom(zoom + 0.1)}
        disabled={zoom >= MAX_ZOOM}
      >
        <Plus className="size-4" />
      </IconButton>
      <IconButton label="Reset zoom" onClick={() => onZoom(1)}>
        <Maximize2 className="size-4" />
      </IconButton>
    </div>
  );
}
