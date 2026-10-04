export const STEP_TYPES = [
  "trigger",
  "action",
  "condition",
  "delay",
  "webhook",
  "end",
] as const;

export type StepType = (typeof STEP_TYPES)[number];

export type Point = {
  x: number;
  y: number;
};

export type Step = {
  id: string;
  type: StepType;
  name: string;
  summary: string;
  config: Record<string, string>;
  position: Point;
  children: Step[];
};

export type StepPatch = Partial<Pick<Step, "name" | "summary" | "position">> & {
  config?: Record<string, string>;
};

export type WorkflowStatus = "draft" | "published";

export type WorkflowVersion = {
  id: string;
  version: number;
  savedAt: string;
  note: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  root: Step;
};

export type Workflow = {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  updatedAt: string;
  version: number;
  root: Step;
  versions: WorkflowVersion[];
};

export type WorkflowSummary = Omit<Workflow, "root" | "versions"> & {
  stepCount: number;
};

export type SaveWorkflowInput = {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  root: Step;
  note?: string;
};
