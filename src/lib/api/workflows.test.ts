import { beforeEach, describe, expect, it } from "vitest";

import {
  createWorkflow,
  getWorkflow,
  listWorkflows,
  resetMockWorkflows,
  saveWorkflow,
  WorkflowNotFoundError,
} from "@/lib/api/workflows";

describe("workflow mock api", () => {
  beforeEach(() => {
    resetMockWorkflows();
  });

  it("lists the sample workflows", async () => {
    const workflows = await listWorkflows();

    expect(workflows).toHaveLength(3);
    expect(workflows.map((workflow) => workflow.id)).toContain("wf_approval");
    expect(workflows[0]?.stepCount).toBeGreaterThan(1);
  });

  it("rejects an unknown workflow", async () => {
    await expect(getWorkflow("missing")).rejects.toBeInstanceOf(
      WorkflowNotFoundError,
    );
  });

  it("saves a new revision", async () => {
    const current = await getWorkflow("wf_digest");
    const saved = await saveWorkflow({
      id: current.id,
      name: "Weekly digest",
      description: current.description,
      status: "published",
      root: current.root,
      note: "Promote the digest",
    });

    expect(saved.version).toBe(current.version + 1);
    expect(saved.status).toBe("published");
    expect(saved.versions[0]?.note).toBe("Promote the digest");
  });

  it("creates a draft with a trigger", async () => {
    const created = await createWorkflow();
    const listed = await listWorkflows();

    expect(created.root.type).toBe("trigger");
    expect(created.version).toBe(1);
    expect(listed[0]?.id).toBe(created.id);
  });
});
