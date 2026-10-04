"use client";

import * as Tabs from "@radix-ui/react-tabs";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Field } from "@/components/molecules/field";
import { VersionRow } from "@/components/molecules/version-row";
import { STEP_CATALOG } from "@/lib/steps";
import type { Step, WorkflowVersion } from "@/lib/types";

export function Inspector({
  step,
  versions,
  currentVersion,
  canDelete,
  onChange,
  onDelete,
  onRestore,
}: {
  step: Step | null;
  versions: WorkflowVersion[];
  currentVersion: number;
  canDelete: boolean;
  onChange: (patch: {
    name?: string;
    summary?: string;
    config?: Record<string, string>;
  }) => void;
  onDelete: () => void;
  onRestore: (version: WorkflowVersion) => void;
}) {
  return (
    <aside className="border-line bg-sand flex max-h-[32rem] flex-col border-t lg:max-h-none lg:w-80 lg:border-t-0 lg:border-l">
      <Tabs.Root
        defaultValue="configure"
        className="flex min-h-0 flex-1 flex-col"
      >
        <Tabs.List className="border-line flex border-b px-3">
          <Tabs.Trigger
            value="configure"
            className="text-muted data-[state=active]:border-copper data-[state=active]:text-ink border-b-2 border-transparent px-3 py-3 text-sm"
          >
            Configure
          </Tabs.Trigger>
          <Tabs.Trigger
            value="revisions"
            className="text-muted data-[state=active]:border-copper data-[state=active]:text-ink border-b-2 border-transparent px-3 py-3 text-sm"
          >
            Revisions
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="configure" className="flex-1 overflow-auto p-4">
          {step ? (
            <StepForm
              step={step}
              canDelete={canDelete}
              onChange={onChange}
              onDelete={onDelete}
            />
          ) : (
            <p className="text-muted text-sm leading-6">
              Select a step on the canvas to edit its name, summary, and
              settings.
            </p>
          )}
        </Tabs.Content>
        <Tabs.Content value="revisions" className="flex-1 overflow-auto p-4">
          {versions.length === 0 ? (
            <p className="text-muted text-sm">No revisions yet.</p>
          ) : (
            <ol className="flex flex-col gap-3">
              {versions.map((version) => (
                <VersionRow
                  key={version.id}
                  version={version}
                  current={version.version === currentVersion}
                  onRestore={onRestore}
                />
              ))}
            </ol>
          )}
        </Tabs.Content>
      </Tabs.Root>
    </aside>
  );
}

function StepForm({
  step,
  canDelete,
  onChange,
  onDelete,
}: {
  step: Step;
  canDelete: boolean;
  onChange: (patch: {
    name?: string;
    summary?: string;
    config?: Record<string, string>;
  }) => void;
  onDelete: () => void;
}) {
  const definition = STEP_CATALOG[step.type];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-copper font-mono text-[11px] tracking-[0.16em] uppercase">
          {definition.label}
        </p>
        <h2 className="font-display text-ink mt-1 text-2xl">{step.name}</h2>
      </div>
      <Field label="Name" htmlFor="step-name">
        <Input
          id="step-name"
          value={step.name}
          onChange={(event) => onChange({ name: event.target.value })}
        />
      </Field>
      <Field label="Summary" htmlFor="step-summary">
        <Textarea
          id="step-summary"
          value={step.summary}
          onChange={(event) => onChange({ summary: event.target.value })}
        />
      </Field>
      {definition.fields.map((field) => (
        <Field
          key={field.key}
          label={field.label}
          htmlFor={`step-${field.key}`}
        >
          <Input
            id={`step-${field.key}`}
            value={step.config[field.key] ?? ""}
            placeholder={field.placeholder}
            onChange={(event) =>
              onChange({ config: { [field.key]: event.target.value } })
            }
          />
        </Field>
      ))}
      {canDelete ? (
        <Button variant="danger" onClick={onDelete}>
          Delete step
        </Button>
      ) : (
        <p className="text-muted text-xs leading-5">
          The trigger stays at the start of the flow.
        </p>
      )}
    </div>
  );
}
