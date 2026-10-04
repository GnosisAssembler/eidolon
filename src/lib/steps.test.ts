import { describe, expect, it } from "vitest";

import { writeRules } from "@/lib/operators";
import {
  STEP_CATALOG,
  STEP_GROUPS,
  createStep,
  readOptionList,
  stepPreview,
  writeOptionList,
} from "@/lib/steps";

describe("step catalog", () => {
  it("groups triggers and branches as events, and the rest as actions", () => {
    expect(STEP_GROUPS.map((group) => group.label)).toEqual([
      "Events",
      "Actions",
    ]);
    expect(STEP_CATALOG.trigger.category).toBe("event");
    expect(STEP_CATALOG.condition.category).toBe("event");
    expect(STEP_CATALOG.webhook.category).toBe("action");

    const events = STEP_GROUPS.find((group) => group.id === "event");
    expect(
      events?.entries.find((entry) => entry.type === "trigger")?.addable,
    ).toBe(false);
    expect(
      events?.entries.find((entry) => entry.type === "condition")?.addable,
    ).toBe(true);
  });

  it("stores checkbox and option defaults as strings", () => {
    const step = createStep("action", "notify");

    expect(step.config.notify).toBe("false");
    expect(step.config.choices).toBe("[]");
    expect(readOptionList(step.config.choices)).toEqual([]);
    expect(readOptionList("not-json")).toEqual([]);
    expect(readOptionList(writeOptionList(["Yes", "No"]))).toEqual([
      "Yes",
      "No",
    ]);
  });

  it("previews the first filled setting", () => {
    const step = createStep("webhook", "hook");
    step.config.url = "https://example.com/hooks/flow";

    expect(stepPreview(step)).toBe("https://example.com/hooks/flow");
  });

  it("previews a condition with its operator symbol", () => {
    const step = createStep("condition", "rule");
    step.config.rules = writeRules([
      { left: "amount", operator: "greater", right: "1000" },
    ]);

    expect(stepPreview(step)).toBe("amount > 1000");
    expect(step.config.match).toBe("all");
  });
});
