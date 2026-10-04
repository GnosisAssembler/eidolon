import { describe, expect, it } from "vitest";

import {
  filterWorkflows,
  formatRevision,
  formatUpdated,
  formatVersion,
} from "@/lib/format";

describe("formatters", () => {
  it("formats app and workflow versions", () => {
    expect(formatVersion(3)).toBe("v3");
    expect(formatRevision(3)).toBe("Rev 3");
  });

  it("formats dates in UTC", () => {
    expect(formatUpdated("2026-03-02T00:00:00.000Z")).toBe("Mar 2, 2026");
  });

  it("filters workflows by name or description", () => {
    const workflows = [
      { name: "Approval routing", description: "Review high-value records" },
      { name: "Weekly digest", description: "Send a summary" },
    ];

    expect(filterWorkflows(workflows, "digest")).toEqual([workflows[1]]);
    expect(filterWorkflows(workflows, "   ")).toEqual(workflows);
  });
});
