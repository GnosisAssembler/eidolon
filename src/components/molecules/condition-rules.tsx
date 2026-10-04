"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { X } from "lucide-react";

import { Button } from "@/components/atoms/button";
import { IconButton } from "@/components/atoms/icon-button";
import { Input } from "@/components/atoms/input";
import { OperatorMark } from "@/components/atoms/operator-mark";
import { cn } from "@/lib/cn";
import {
  OPERATORS,
  emptyRule,
  operatorById,
  readRules,
  writeRules,
  type ConditionRule,
  type OperatorId,
} from "@/lib/operators";

export function RuleSummary({
  rules,
  match,
}: {
  rules: ConditionRule[];
  match?: string;
}) {
  const joiner = match === "any" ? "OR" : "AND";

  return (
    <span className="mt-1 flex flex-col gap-1">
      {rules.map((rule, index) => {
        const operator = operatorById(rule.operator);
        return (
          <span key={`${rule.left}-${rule.operator}-${index}`}>
            {index > 0 ? (
              <span className="text-copper my-0.5 block text-[9px] font-semibold tracking-wide">
                {joiner}
              </span>
            ) : null}
            <span className="flex min-w-0 items-center gap-1 text-[11px]">
              <span className="text-ink-soft max-w-16 truncate">
                {rule.left || "Value"}
              </span>
              <OperatorMark
                symbol={operator.symbol}
                label={operator.label}
                size="sm"
              />
              {operator.needsValue ? (
                <span className="text-ink-soft max-w-16 truncate">
                  {rule.right || "…"}
                </span>
              ) : null}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function ConditionRules({
  id,
  label,
  value,
  match,
  compact,
  onValue,
}: {
  id: string;
  label: string;
  value: string;
  match?: string;
  compact: boolean;
  onValue: (value: string) => void;
}) {
  const rules = readRules(value);
  const joiner = match === "any" ? "OR" : "AND";

  function commit(next: ConditionRule[]) {
    onValue(writeRules(next));
  }

  return (
    <div className={cn("flex flex-col", compact ? "gap-1.5" : "gap-2")}>
      <p
        className={cn(
          "text-muted font-medium tracking-wide uppercase",
          compact ? "text-[10px]" : "text-xs",
        )}
      >
        {label}
      </p>
      {rules.length === 0 ? (
        <p className="text-muted text-[11px]">No rules yet.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {rules.map((rule, index) => (
            <li key={`${id}-${index}`} className="flex flex-col gap-1.5">
              {index > 0 ? (
                <span className="text-copper text-center font-mono text-[10px] font-semibold tracking-[0.14em]">
                  {joiner}
                </span>
              ) : null}
              <RuleRow
                id={id}
                index={index}
                rule={rule}
                compact={compact}
                onChange={(next) => {
                  const rulesNext = [...rules];
                  rulesNext[index] = next;
                  commit(rulesNext);
                }}
                onRemove={() =>
                  commit(rules.filter((_, itemIndex) => itemIndex !== index))
                }
              />
            </li>
          ))}
        </ul>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="self-start px-1.5"
        onClick={() => commit([...rules, emptyRule()])}
      >
        Add rule
      </Button>
    </div>
  );
}

function RuleRow({
  id,
  index,
  rule,
  compact,
  onChange,
  onRemove,
}: {
  id: string;
  index: number;
  rule: ConditionRule;
  compact: boolean;
  onChange: (rule: ConditionRule) => void;
  onRemove: () => void;
}) {
  const operator = operatorById(rule.operator);
  const controlClass = compact ? "h-7 px-1.5 text-xs" : undefined;

  return (
    <div className="flex items-center gap-1">
      <Input
        aria-label={`Rule ${index + 1} value`}
        className={cn("min-w-0 flex-1", controlClass)}
        value={rule.left}
        placeholder="amount"
        onChange={(event) => onChange({ ...rule, left: event.target.value })}
      />
      <OperatorPicker
        id={`${id}-operator-${index}`}
        value={rule.operator}
        onChange={(operatorId) => onChange({ ...rule, operator: operatorId })}
      />
      {operator.needsValue ? (
        <Input
          aria-label={`Rule ${index + 1} comparison`}
          className={cn("min-w-0 flex-1", controlClass)}
          value={rule.right}
          placeholder="1000"
          onChange={(event) => onChange({ ...rule, right: event.target.value })}
        />
      ) : (
        <span className="text-muted min-w-0 flex-1 truncate text-[10px]">
          {operator.label}
        </span>
      )}
      <IconButton label={`Remove rule ${index + 1}`} onClick={onRemove}>
        <X className="size-3.5" />
      </IconButton>
    </div>
  );
}

function OperatorPicker({
  id,
  value,
  onChange,
}: {
  id: string;
  value: OperatorId;
  onChange: (operator: OperatorId) => void;
}) {
  const current = operatorById(value);
  const [hint, setHint] = useState(current.label);

  return (
    <Popover.Root
      onOpenChange={(open) => {
        if (open) {
          setHint(current.label);
        }
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          id={id}
          aria-label={`Operator: ${current.label}`}
          className="focus-visible:outline-copper shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <OperatorMark
            symbol={current.symbol}
            label={current.label}
            decorative
          />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          sideOffset={6}
          className="border-line bg-sand z-50 w-56 rounded-lg border p-2 shadow-lg"
        >
          <div className="grid grid-cols-5 gap-1">
            {OPERATORS.map((operator) => (
              <Popover.Close asChild key={operator.id}>
                <button
                  type="button"
                  aria-label={operator.label}
                  aria-pressed={operator.id === value}
                  title={operator.label}
                  className="focus-visible:outline-copper flex items-center justify-center rounded-md focus-visible:outline-2"
                  onMouseEnter={() => setHint(operator.label)}
                  onFocus={() => setHint(operator.label)}
                  onClick={() => onChange(operator.id)}
                >
                  <OperatorMark
                    symbol={operator.symbol}
                    label={operator.label}
                    decorative
                    active={operator.id === value}
                  />
                </button>
              </Popover.Close>
            ))}
          </div>
          <p className="text-muted mt-2 text-center text-[11px]">{hint}</p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
