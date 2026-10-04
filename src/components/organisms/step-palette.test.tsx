import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TooltipProvider } from "@/components/atoms/tooltip";
import { StepPalette } from "@/components/organisms/step-palette";

function renderPalette() {
  const onDragStart = vi.fn();
  const onDragEnd = vi.fn();
  render(
    <TooltipProvider>
      <StepPalette
        notice={null}
        onAdd={vi.fn()}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    </TooltipProvider>,
  );
  return { onDragStart, onDragEnd };
}

describe("StepPalette", () => {
  it("lists events and actions", () => {
    renderPalette();

    expect(screen.getByRole("heading", { name: "Events" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Actions" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Already on the canvas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Webhook/ })).toBeEnabled();
  });

  it("marks the dragged step so the canvas can show landing spaces", () => {
    const { onDragStart, onDragEnd } = renderPalette();
    const setData = vi.fn();
    const delay = screen.getByRole("button", { name: /Delay/ });

    fireEvent.dragStart(delay, {
      dataTransfer: { setData, effectAllowed: "none" },
    });
    fireEvent.dragEnd(delay);

    expect(setData).toHaveBeenCalledWith("application/eidolon-step", "delay");
    expect(onDragStart).toHaveBeenCalledWith("delay");
    expect(onDragEnd).toHaveBeenCalled();
  });
});
