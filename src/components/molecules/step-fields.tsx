import { X } from "lucide-react";

import { Button } from "@/components/atoms/button";
import { Checkbox } from "@/components/atoms/checkbox";
import { IconButton } from "@/components/atoms/icon-button";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/select";
import { Textarea } from "@/components/atoms/textarea";
import { ConditionRules } from "@/components/molecules/condition-rules";
import { Field } from "@/components/molecules/field";
import { cn } from "@/lib/cn";
import {
  readOptionList,
  STEP_CATALOG,
  writeOptionList,
  type StepField,
} from "@/lib/steps";
import type { Step } from "@/lib/types";

export function StepFields({
  step,
  idPrefix,
  compact = false,
  onChange,
}: {
  step: Step;
  idPrefix: string;
  compact?: boolean;
  onChange: (patch: { config: Record<string, string> }) => void;
}) {
  const definition = STEP_CATALOG[step.type];

  return (
    <div className={cn("flex flex-col", compact ? "gap-2" : "gap-4")}>
      {definition.fields.map((field) => {
        const value = step.config[field.key] ?? "";
        const onValue = (next: string) =>
          onChange({ config: { [field.key]: next } });

        if (field.kind === "rules") {
          return (
            <ConditionRules
              key={field.key}
              id={`${idPrefix}-${field.key}`}
              label={field.label}
              value={value}
              match={step.config.match}
              compact={compact}
              onValue={onValue}
            />
          );
        }

        return (
          <FieldControl
            key={field.key}
            field={field}
            id={`${idPrefix}-${field.key}`}
            value={value}
            compact={compact}
            onValue={onValue}
          />
        );
      })}
    </div>
  );
}

function FieldControl({
  field,
  id,
  value,
  compact,
  onValue,
}: {
  field: StepField;
  id: string;
  value: string;
  compact: boolean;
  onValue: (value: string) => void;
}) {
  const controlClass = compact ? "h-7 text-xs" : undefined;

  if (field.kind === "checkbox") {
    return (
      <Checkbox
        id={id}
        compact={compact}
        label={field.label}
        checked={value === "true"}
        onChange={(event) => onValue(event.target.checked ? "true" : "false")}
      />
    );
  }

  if (field.kind === "options") {
    return (
      <OptionsEditor
        id={id}
        label={field.label}
        value={value}
        compact={compact}
        onValue={onValue}
      />
    );
  }

  if (field.kind === "select") {
    return (
      <Field label={field.label} htmlFor={id} compact={compact}>
        <Select
          id={id}
          className={controlClass}
          value={value}
          onChange={(event) => onValue(event.target.value)}
        >
          <option value="">Select</option>
          {field.choices?.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </Select>
      </Field>
    );
  }

  if (field.kind === "textarea") {
    return (
      <Field label={field.label} htmlFor={id} compact={compact}>
        <Textarea
          id={id}
          className={compact ? "min-h-14 text-xs" : undefined}
          value={value}
          placeholder={field.placeholder}
          onChange={(event) => onValue(event.target.value)}
        />
      </Field>
    );
  }

  return (
    <Field label={field.label} htmlFor={id} compact={compact}>
      <Input
        id={id}
        className={controlClass}
        value={value}
        placeholder={field.placeholder}
        onChange={(event) => onValue(event.target.value)}
      />
    </Field>
  );
}

function OptionsEditor({
  id,
  label,
  value,
  compact,
  onValue,
}: {
  id: string;
  label: string;
  value: string;
  compact: boolean;
  onValue: (value: string) => void;
}) {
  const items = readOptionList(value);

  return (
    <div className={cn("flex flex-col", compact ? "gap-1" : "gap-1.5")}>
      <p
        className={cn(
          "text-muted font-medium tracking-wide uppercase",
          compact ? "text-[10px]" : "text-xs",
        )}
      >
        {label}
      </p>
      {items.length === 0 ? (
        <p className="text-muted text-[11px]">No options yet.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {items.map((item, index) => (
            <li key={`${id}-${index}`} className="flex items-center gap-1">
              <Input
                aria-label={`Option ${index + 1}`}
                className={compact ? "h-7 text-xs" : undefined}
                value={item}
                onChange={(event) => {
                  const next = [...items];
                  next[index] = event.target.value;
                  onValue(writeOptionList(next));
                }}
              />
              <IconButton
                label={`Remove option ${index + 1}`}
                onClick={() =>
                  onValue(
                    writeOptionList(
                      items.filter((_, itemIndex) => itemIndex !== index),
                    ),
                  )
                }
              >
                <X className="size-3.5" />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="self-start px-1.5"
        onClick={() => onValue(writeOptionList([...items, ""]))}
      >
        Add option
      </Button>
    </div>
  );
}
