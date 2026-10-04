import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { StepCard } from "@/components/molecules/step-card";
import { writeRules } from "@/lib/operators";
import { createStep } from "@/lib/steps";

describe("StepCard", () => {
  it("selects the step when clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const step = createStep("condition", "rule");

    render(<StepCard step={step} selected={false} onSelect={onSelect} />);
    await user.click(screen.getByTestId("step-rule"));

    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
    expect(onSelect).toHaveBeenCalledWith("rule");
    expect(screen.queryByLabelText("Rule")).not.toBeInTheDocument();
  });

  it("edits a menu and a checkbox on the selected step", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const step = createStep("delay", "wait");

    render(
      <StepCard step={step} selected onSelect={vi.fn()} onChange={onChange} />,
    );

    await user.selectOptions(screen.getByLabelText("Unit"), "Hours");
    expect(onChange).toHaveBeenCalledWith({ config: { unit: "hours" } });

    await user.click(
      screen.getByRole("checkbox", { name: "Only during business hours" }),
    );
    expect(onChange).toHaveBeenCalledWith({
      config: { businessHours: "true" },
    });
  });

  it("adds an option on an action step", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <StepCard
        step={createStep("action", "task")}
        selected
        onSelect={vi.fn()}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Add option" }));

    expect(onChange).toHaveBeenCalledWith({ config: { choices: '[""]' } });
  });

  it("shows the operator symbol for a condition rule", () => {
    const step = createStep("condition", "rule");
    step.config.rules = writeRules([
      { left: "amount", operator: "greater", right: "1000" },
    ]);

    render(<StepCard step={step} selected={false} onSelect={vi.fn()} />);

    expect(
      screen.getByRole("img", { name: "Greater than" }),
    ).toBeInTheDocument();
    expect(screen.getByText("amount")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
  });
});
