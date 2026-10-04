import {
  Flag,
  GitBranch,
  Play,
  Timer,
  Webhook,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { formatRule, readRules } from "@/lib/operators";
import type { Step, StepType } from "@/lib/types";

export type StepCategory = "event" | "action";

export type StepFieldKind =
  "text" | "textarea" | "select" | "checkbox" | "options" | "rules";

export type FieldChoice = {
  value: string;
  label: string;
};

export type StepField = {
  key: string;
  label: string;
  kind: StepFieldKind;
  placeholder?: string;
  choices?: FieldChoice[];
  defaultValue?: string;
};

export type StepDefinition = {
  type: StepType;
  category: StepCategory;
  label: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  fields: StepField[];
};

export type PaletteEntry = {
  type: StepType;
  addable: boolean;
};

const SOURCE_CHOICES: FieldChoice[] = [
  { value: "record", label: "Record event" },
  { value: "schedule", label: "Schedule" },
  { value: "manual", label: "Manual" },
];

const MATCH_CHOICES: FieldChoice[] = [
  { value: "all", label: "All rules" },
  { value: "any", label: "Any rule" },
];

const UNIT_CHOICES: FieldChoice[] = [
  { value: "minutes", label: "Minutes" },
  { value: "hours", label: "Hours" },
  { value: "days", label: "Days" },
];

const METHOD_CHOICES: FieldChoice[] = [
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "PATCH", label: "PATCH" },
];

const STATUS_CHOICES: FieldChoice[] = [
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
];

export const STEP_CATALOG: Record<StepType, StepDefinition> = {
  trigger: {
    type: "trigger",
    category: "event",
    label: "Trigger",
    description: "Starts the workflow when an event arrives.",
    icon: Zap,
    accent: "bg-[#5c4d8a]",
    fields: [
      {
        key: "event",
        label: "Event",
        kind: "text",
        placeholder: "record.created",
      },
      {
        key: "source",
        label: "Source",
        kind: "select",
        choices: SOURCE_CHOICES,
      },
      { key: "repeat", label: "Allow repeats", kind: "checkbox" },
    ],
  },
  action: {
    type: "action",
    category: "action",
    label: "Action",
    description: "Runs a task before the flow continues.",
    icon: Play,
    accent: "bg-[#3d6ea8]",
    fields: [
      {
        key: "task",
        label: "Task",
        kind: "textarea",
        placeholder: "Notify the owner",
      },
      { key: "choices", label: "Options", kind: "options" },
      {
        key: "notify",
        label: "Notify when finished",
        kind: "checkbox",
      },
    ],
  },
  condition: {
    type: "condition",
    category: "event",
    label: "Condition",
    description: "Splits the flow when a rule matches.",
    icon: GitBranch,
    accent: "bg-[#c48a12]",
    fields: [
      { key: "rules", label: "Rules", kind: "rules" },
      {
        key: "match",
        label: "Match",
        kind: "select",
        choices: MATCH_CHOICES,
        defaultValue: "all",
      },
    ],
  },
  delay: {
    type: "delay",
    category: "action",
    label: "Delay",
    description: "Waits before the next step runs.",
    icon: Timer,
    accent: "bg-[#5c6b7a]",
    fields: [
      {
        key: "duration",
        label: "Duration",
        kind: "text",
        placeholder: "15",
      },
      {
        key: "unit",
        label: "Unit",
        kind: "select",
        choices: UNIT_CHOICES,
      },
      {
        key: "businessHours",
        label: "Only during business hours",
        kind: "checkbox",
      },
    ],
  },
  webhook: {
    type: "webhook",
    category: "action",
    label: "Webhook",
    description: "Sends the current record to an external URL.",
    icon: Webhook,
    accent: "bg-[#2f7d6d]",
    fields: [
      {
        key: "url",
        label: "URL",
        kind: "text",
        placeholder: "https://example.com/hooks/flow",
      },
      {
        key: "method",
        label: "Method",
        kind: "select",
        choices: METHOD_CHOICES,
      },
      { key: "retry", label: "Retry on failure", kind: "checkbox" },
    ],
  },
  end: {
    type: "end",
    category: "action",
    label: "End",
    description: "Marks a path as finished.",
    icon: Flag,
    accent: "bg-[#8b93a0]",
    fields: [
      {
        key: "outcome",
        label: "Outcome",
        kind: "text",
        placeholder: "Completed",
      },
      {
        key: "status",
        label: "Status",
        kind: "select",
        choices: STATUS_CHOICES,
      },
    ],
  },
};

export const STEP_GROUPS: {
  id: StepCategory;
  label: string;
  hint: string;
  entries: PaletteEntry[];
}[] = [
  {
    id: "event",
    label: "Events",
    hint: "Triggers and branches",
    entries: [
      { type: "trigger", addable: false },
      { type: "condition", addable: true },
    ],
  },
  {
    id: "action",
    label: "Actions",
    hint: "Tasks the flow runs",
    entries: [
      { type: "action", addable: true },
      { type: "delay", addable: true },
      { type: "webhook", addable: true },
      { type: "end", addable: true },
    ],
  },
];

export function categoryLabel(category: StepCategory) {
  return category === "event" ? "Event" : "Action";
}

export function acceptsChildren(type: StepType) {
  return type !== "end";
}

export function isStepType(value: string): value is StepType {
  return value in STEP_CATALOG;
}

export function readOptionList(value: string | undefined) {
  if (!value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function writeOptionList(options: string[]) {
  return JSON.stringify(options);
}

function defaultFieldValue(field: StepField) {
  if (field.kind === "checkbox") {
    return "false";
  }

  if (field.kind === "options") {
    return writeOptionList([]);
  }

  if (field.kind === "rules") {
    return "[]";
  }

  return field.defaultValue ?? "";
}

export function stepPreview(step: Step) {
  const definition = STEP_CATALOG[step.type];

  for (const field of definition.fields) {
    const raw = step.config[field.key]?.trim() ?? "";
    if (!raw || raw === "false" || raw === "[]") {
      continue;
    }

    if (field.kind === "checkbox") {
      return field.label;
    }

    if (field.kind === "select") {
      return (
        field.choices?.find((choice) => choice.value === raw)?.label ?? raw
      );
    }

    if (field.kind === "options") {
      const first = readOptionList(raw).find((item) => item.trim().length > 0);
      if (first) {
        return first;
      }
      continue;
    }

    if (field.kind === "rules") {
      const first = readRules(raw)[0];
      if (first) {
        return formatRule(first);
      }
      continue;
    }

    return raw;
  }

  return step.summary;
}

export function createStep(type: StepType, id = crypto.randomUUID()): Step {
  const definition = STEP_CATALOG[type];
  const config: Record<string, string> = {};

  for (const field of definition.fields) {
    config[field.key] = defaultFieldValue(field);
  }

  return {
    id,
    type,
    name: definition.label,
    summary: definition.description,
    config,
    position: { x: 48, y: 48 },
    children: [],
  };
}
