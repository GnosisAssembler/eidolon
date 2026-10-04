"use client";

import * as Popover from "@radix-ui/react-popover";

import { Button } from "@/components/atoms/button";
import { Textarea } from "@/components/atoms/textarea";
import { Field } from "@/components/molecules/field";
import { StatusSwitch } from "@/components/molecules/status-switch";
import { formatRevision } from "@/lib/format";
import type { WorkflowStatus } from "@/lib/types";

export function EditorHeader({
  name,
  description,
  status,
  revision,
  dirty,
  saving,
  onNameChange,
  onDescriptionChange,
  onStatusChange,
  onSave,
  onBack,
  onDiscard,
}: {
  name: string;
  description: string;
  status: WorkflowStatus;
  revision: number;
  dirty: boolean;
  saving: boolean;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onStatusChange: (status: WorkflowStatus) => void;
  onSave: () => void;
  onBack: () => void;
  onDiscard: () => void;
}) {
  return (
    <div className="border-line bg-paper flex shrink-0 flex-wrap items-center gap-3 border-b px-4 py-3 sm:px-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        Library
      </Button>
      <label className="w-full min-w-0 sm:w-auto sm:min-w-48 sm:flex-1">
        <span className="sr-only">Workflow name</span>
        <input
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          className="font-display text-ink w-full bg-transparent text-2xl outline-none"
        />
      </label>
      <p className="text-muted font-mono text-xs" aria-live="polite">
        {formatRevision(revision)}
        {dirty ? " · Unsaved" : ""}
      </p>
      <StatusSwitch value={status} onChange={onStatusChange} />
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button variant="outline" size="sm">
            Details
          </Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            sideOffset={8}
            className="border-line bg-sand z-30 w-80 rounded-2xl border p-4 shadow-xl"
          >
            <Field label="Description" htmlFor="workflow-description">
              <Textarea
                id="workflow-description"
                value={description}
                onChange={(event) => onDescriptionChange(event.target.value)}
              />
            </Field>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDiscard}
        disabled={!dirty || saving}
      >
        Discard
      </Button>
      <Button size="sm" onClick={onSave} disabled={!dirty || saving}>
        {saving ? "Saving" : "Save revision"}
      </Button>
    </div>
  );
}
