import { countSteps, withLayout } from "@/lib/graph";
import type {
  Step,
  Workflow,
  WorkflowSummary,
  WorkflowVersion,
} from "@/lib/types";

function step(
  id: string,
  type: Step["type"],
  name: string,
  summary: string,
  config: Record<string, string>,
  children: Step[] = [],
): Step {
  return {
    id,
    type,
    name,
    summary,
    config,
    position: { x: 0, y: 0 },
    children,
  };
}

function version(
  workflow: Omit<Workflow, "versions" | "version">,
  versionNumber: number,
  note: string,
  root: Step = workflow.root,
): WorkflowVersion {
  return {
    id: `${workflow.id}-v${versionNumber}`,
    version: versionNumber,
    savedAt: workflow.updatedAt,
    note,
    name: workflow.name,
    description: workflow.description,
    status: workflow.status,
    root,
  };
}

const approvalRoot = withLayout(
  step(
    "approval-start",
    "trigger",
    "Record submitted",
    "Runs when a record is sent for processing.",
    { event: "record.submitted" },
    [
      step(
        "approval-check",
        "condition",
        "Needs review",
        "Route high-value records to a person.",
        { expression: "amount > 1000" },
        [
          step(
            "approval-assign",
            "action",
            "Assign reviewer",
            "Add the record to the review queue.",
            { task: "Assign on-call reviewer" },
            [
              step(
                "approval-review-end",
                "end",
                "Sent for review",
                "Waiting on a person.",
                {
                  outcome: "In review",
                },
              ),
            ],
          ),
          step(
            "approval-auto",
            "action",
            "Auto approve",
            "Mark the record approved.",
            { task: "Set status to approved" },
            [
              step(
                "approval-hook",
                "webhook",
                "Notify ledger",
                "Post the decision to the ledger.",
                { url: "https://example.com/hooks/ledger" },
                [
                  step(
                    "approval-done",
                    "end",
                    "Approved",
                    "The record is complete.",
                    {
                      outcome: "Approved",
                    },
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  ),
);

const digestRoot = withLayout(
  step(
    "digest-start",
    "trigger",
    "Weekly schedule",
    "Runs every Monday morning.",
    { event: "schedule.weekly" },
    [
      step(
        "digest-wait",
        "delay",
        "Quiet period",
        "Wait for late updates before sending.",
        { duration: "15 minutes" },
        [
          step(
            "digest-hook",
            "webhook",
            "Send digest",
            "Deliver the compiled summary.",
            { url: "https://example.com/hooks/digest" },
            [
              step("digest-end", "end", "Delivered", "The digest was sent.", {
                outcome: "Sent",
              }),
            ],
          ),
        ],
      ),
    ],
  ),
);

const handoffRoot = withLayout(
  step(
    "handoff-start",
    "trigger",
    "Member joined",
    "Runs when someone is added to a workspace.",
    { event: "member.joined" },
    [
      step(
        "handoff-checklist",
        "action",
        "Create checklist",
        "Open the standard onboarding list.",
        { task: "Create onboarding checklist" },
        [
          step(
            "handoff-role",
            "condition",
            "Owner role",
            "Owners need extra access.",
            { expression: "role == owner" },
            [
              step(
                "handoff-access",
                "webhook",
                "Provision access",
                "Ask the access service to grant tools.",
                { url: "https://example.com/hooks/access" },
                [
                  step(
                    "handoff-granted",
                    "end",
                    "Access granted",
                    "Tools are ready.",
                    {
                      outcome: "Provisioned",
                    },
                  ),
                ],
              ),
              step(
                "handoff-welcome",
                "end",
                "Welcome sent",
                "A standard welcome is enough.",
                {
                  outcome: "Welcomed",
                },
              ),
            ],
          ),
        ],
      ),
    ],
  ),
);

function buildWorkflow(
  id: string,
  name: string,
  description: string,
  status: Workflow["status"],
  updatedAt: string,
  root: Step,
  earlierNote: string,
): Workflow {
  const base = {
    id,
    name,
    description,
    status,
    updatedAt,
    root,
  };
  const earlierRoot = structuredClone(root);
  earlierRoot.summary = "Earlier draft of the opening step.";

  return {
    ...base,
    version: 2,
    versions: [
      version(base, 2, "Published the current branch structure."),
      version(
        { ...base, updatedAt: "2026-02-12T15:00:00.000Z" },
        1,
        earlierNote,
        earlierRoot,
      ),
    ],
  };
}

export const SEED_WORKFLOWS: Workflow[] = [
  buildWorkflow(
    "wf_approval",
    "Approval routing",
    "Send high-value records to a reviewer and approve the rest automatically.",
    "published",
    "2026-03-18T14:30:00.000Z",
    approvalRoot,
    "First pass with a single approval path.",
  ),
  buildWorkflow(
    "wf_digest",
    "Weekly digest",
    "Wait for a quiet period, then deliver a scheduled summary.",
    "draft",
    "2026-03-02T09:15:00.000Z",
    digestRoot,
    "Started from a manual send step.",
  ),
  buildWorkflow(
    "wf_handoff",
    "Member handoff",
    "Open a checklist and provision extra access for owners.",
    "published",
    "2026-01-28T18:05:00.000Z",
    handoffRoot,
    "Welcome path only, before the owner branch.",
  ),
];

export function findSeed(id: string) {
  return SEED_WORKFLOWS.find((workflow) => workflow.id === id) ?? null;
}

export function toSummary(workflow: Workflow): WorkflowSummary {
  return {
    id: workflow.id,
    name: workflow.name,
    description: workflow.description,
    status: workflow.status,
    updatedAt: workflow.updatedAt,
    version: workflow.version,
    stepCount: countSteps(workflow.root),
  };
}

export function cloneSeed() {
  return structuredClone(SEED_WORKFLOWS);
}
