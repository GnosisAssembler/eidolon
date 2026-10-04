import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WorkflowCard } from "@/components/molecules/workflow-card";
import type { WorkflowSummary } from "@/lib/types";

const workflow: WorkflowSummary = {
  id: "wf_approval",
  name: "Approval routing",
  description: "Route records through review.",
  status: "published",
  updatedAt: "2026-03-18T14:30:00.000Z",
  version: 2,
  stepCount: 6,
};

describe("WorkflowCard", () => {
  it("links to the editor", () => {
    render(<WorkflowCard workflow={workflow} />);

    expect(
      screen.getByRole("link", { name: /Approval routing/ }),
    ).toHaveAttribute("href", "/workflows/wf_approval");
    expect(screen.getByText("Rev 2")).toBeInTheDocument();
  });
});
