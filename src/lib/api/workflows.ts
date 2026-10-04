import { countSteps } from "@/lib/graph";
import { cloneSeed, toSummary } from "@/lib/mock/workflows";
import { createStep } from "@/lib/steps";
import type { SaveWorkflowInput, Workflow, WorkflowSummary } from "@/lib/types";

const wait = () =>
  new Promise((resolve) => {
    setTimeout(resolve, process.env.VITEST ? 0 : 160);
  });

let workflows = cloneSeed();

export class WorkflowNotFoundError extends Error {
  constructor(id: string) {
    super(`Workflow ${id} was not found.`);
    this.name = "WorkflowNotFoundError";
  }
}

export function resetMockWorkflows() {
  workflows = cloneSeed();
}

export async function listWorkflows(): Promise<WorkflowSummary[]> {
  await wait();
  return workflows.map(toSummary);
}

export async function getWorkflow(id: string): Promise<Workflow> {
  await wait();
  const workflow = workflows.find((item) => item.id === id);
  if (!workflow) {
    throw new WorkflowNotFoundError(id);
  }
  return structuredClone(workflow);
}

export async function saveWorkflow(
  input: SaveWorkflowInput,
): Promise<Workflow> {
  await wait();
  const index = workflows.findIndex((item) => item.id === input.id);
  if (index === -1) {
    throw new WorkflowNotFoundError(input.id);
  }

  const current = workflows[index];
  const savedAt = new Date().toISOString();
  const nextVersion = current.version + 1;
  const root = structuredClone(input.root);
  const archivedRoot = structuredClone(input.root);
  const next: Workflow = {
    ...current,
    name: input.name.trim() || "Untitled workflow",
    description: input.description.trim(),
    status: input.status,
    updatedAt: savedAt,
    version: nextVersion,
    root,
    versions: [
      {
        id: `${current.id}-v${nextVersion}`,
        version: nextVersion,
        savedAt,
        note: input.note?.trim() || "Saved revision",
        name: input.name.trim() || "Untitled workflow",
        description: input.description.trim(),
        status: input.status,
        root: archivedRoot,
      },
      ...current.versions,
    ],
  };

  workflows[index] = next;
  return structuredClone(next);
}

export async function createWorkflow(): Promise<Workflow> {
  await wait();
  const root = createStep("trigger");
  root.name = "Start";
  root.summary = "Workflow starts here.";
  root.config.event = "manual";
  const savedAt = new Date().toISOString();
  const id = `wf_${crypto.randomUUID().slice(0, 8)}`;
  const workflow: Workflow = {
    id,
    name: "Untitled workflow",
    description: "Describe what this flow is for.",
    status: "draft",
    updatedAt: savedAt,
    version: 1,
    root,
    versions: [
      {
        id: `${id}-v1`,
        version: 1,
        savedAt,
        note: "Created the workflow.",
        name: "Untitled workflow",
        description: "Describe what this flow is for.",
        status: "draft",
        root: structuredClone(root),
      },
    ],
  };

  workflows = [workflow, ...workflows];
  return structuredClone(workflow);
}

export function stepCount(workflow: Workflow) {
  return countSteps(workflow.root);
}
