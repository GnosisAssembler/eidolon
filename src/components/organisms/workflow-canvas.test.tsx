import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { WorkflowCanvas } from "@/components/organisms/workflow-canvas";
import { createStep } from "@/lib/steps";

function renderCanvas(dragging: "action" | null) {
  const onDrop = vi.fn();
  render(
    <WorkflowCanvas
      root={createStep("trigger", "start")}
      selectedId={null}
      zoom={1}
      dragging={dragging}
      onSelect={vi.fn()}
      onZoom={vi.fn()}
      onMove={vi.fn()}
      onChange={vi.fn()}
      onDrop={onDrop}
    />,
  );
  return { onDrop };
}

describe("WorkflowCanvas", () => {
  it("shows a dotted landing space while a step is dragged", () => {
    renderCanvas("action");

    expect(screen.getByTestId("drop-slot-start")).toBeInTheDocument();
    expect(screen.getByText("Drop step")).toBeInTheDocument();
  });

  it("hides landing spaces when nothing is being dragged", () => {
    renderCanvas(null);

    expect(screen.queryByTestId("drop-slot-start")).not.toBeInTheDocument();
  });

  it("adds the dragged step under the highlighted parent", () => {
    const { onDrop } = renderCanvas("action");

    fireEvent.drop(screen.getByTestId("drop-slot-start"));

    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(onDrop.mock.calls[0]?.[0]).toBe("action");
    expect(onDrop.mock.calls[0]?.[2]).toBe("start");
  });
});
