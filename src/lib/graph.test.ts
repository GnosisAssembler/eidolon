import { describe, expect, it } from "vitest";

import {
  addChild,
  countSteps,
  edgePath,
  findStep,
  insertionSlots,
  parentForInsertion,
  removeStep,
  updateStep,
  withLayout,
} from "@/lib/graph";
import { createStep } from "@/lib/steps";
import type { Step } from "@/lib/types";

function tree(): Step {
  return {
    id: "root",
    type: "trigger",
    name: "Start",
    summary: "Opens the flow.",
    config: { event: "manual" },
    position: { x: 0, y: 0 },
    children: [
      {
        id: "finish",
        type: "end",
        name: "Done",
        summary: "Stops the path.",
        config: { outcome: "Complete" },
        position: { x: 320, y: 0 },
        children: [],
      },
    ],
  };
}

describe("workflow graph", () => {
  it("counts every step in the tree", () => {
    expect(countSteps(tree())).toBe(2);
  });

  it("adds a child under a step that can branch", () => {
    const action = createStep("action", "notify");
    const next = addChild(tree(), "root", action);

    expect(next.children.map((step) => step.id)).toEqual(["finish", "notify"]);
    expect(findStep(next, "notify")?.type).toBe("action");
  });

  it("leaves the tree unchanged when the parent cannot hold children", () => {
    const root = tree();
    const next = addChild(root, "finish", createStep("action", "late"));

    expect(next).toBe(root);
  });

  it("updates a nested step without dropping its config", () => {
    const next = updateStep(tree(), "finish", {
      name: "Closed",
      config: { outcome: "Archived" },
    });

    expect(findStep(next, "finish")).toMatchObject({
      name: "Closed",
      config: { outcome: "Archived" },
    });
  });

  it("removes a branch and refuses to remove the trigger", () => {
    const root = tree();

    expect(removeStep(root, "root")).toBe(root);
    expect(countSteps(removeStep(root, "finish"))).toBe(1);
  });

  it("inserts under the parent when the selection is an end step", () => {
    const parent = parentForInsertion(tree(), "finish");

    expect(parent?.id).toBe("root");
  });

  it("offers a landing spot beside every step that can branch", () => {
    const root = tree();
    const slots = insertionSlots(root);
    const child = root.children[0];

    expect(slots.map((slot) => slot.parentId)).toEqual(["root"]);
    expect(slots[0]?.position.x).toBe(child?.position.x);
    expect(slots[0]?.position.y).toBeGreaterThan(child?.position.y ?? 0);
  });

  it("lays steps out from left to right and draws a curve between them", () => {
    const laid = withLayout(tree());
    const child = laid.children[0];

    expect(child && laid.position.x).toBeLessThan(child?.position.x ?? 0);
    expect(edgePath(laid, child!)).toContain("C ");
  });
});
