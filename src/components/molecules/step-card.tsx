import { RuleSummary } from "@/components/molecules/condition-rules";
import { StepFields } from "@/components/molecules/step-fields";
import { cn } from "@/lib/cn";
import { readRules } from "@/lib/operators";
import { categoryLabel, STEP_CATALOG, stepPreview } from "@/lib/steps";
import type { Step } from "@/lib/types";

export function StepCard({
  step,
  selected,
  onSelect,
  onChange,
}: {
  step: Step;
  selected: boolean;
  onSelect: (id: string) => void;
  onChange?: (patch: { config: Record<string, string> }) => void;
}) {
  const definition = STEP_CATALOG[step.type];
  const Icon = definition.icon;
  const showFields = selected && onChange;

  return (
    <div
      className={cn(
        "bg-sand w-full overflow-hidden rounded-md border text-left shadow-[0_1px_2px_rgba(22,28,40,0.06),0_8px_20px_rgba(22,28,40,0.04)]",
        selected
          ? "border-gold ring-gold/30 ring-2"
          : "border-[#d9dee7] hover:border-[#b7c0ce]",
      )}
    >
      <button
        type="button"
        data-testid={`step-${step.id}`}
        aria-pressed={selected}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(step.id);
        }}
        className="w-full text-left"
      >
        <span className={cn("flex h-1.5 w-full", definition.accent)} />
        <span className="flex items-start gap-2 px-2.5 py-2">
          <span
            className={cn(
              "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded text-white",
              definition.accent,
            )}
          >
            <Icon className="size-3.5" />
          </span>
          <span className="min-w-0">
            <span className="text-muted block font-mono text-[10px] tracking-wide uppercase">
              {definition.label}
              <span className="text-copper ml-1.5 tracking-normal normal-case">
                {categoryLabel(definition.category)}
              </span>
            </span>
            <span className="text-ink block truncate text-[13px] font-semibold">
              {step.name}
            </span>
            {showFields ? null : <CardPreview step={step} />}
          </span>
        </span>
      </button>
      {showFields ? (
        <div
          data-step-fields=""
          className="border-line max-h-72 overflow-y-auto border-t px-2.5 py-2"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
          onWheel={(event) => event.stopPropagation()}
        >
          <StepFields
            step={step}
            idPrefix={`canvas-${step.id}`}
            compact
            onChange={onChange}
          />
        </div>
      ) : null}
    </div>
  );
}

function CardPreview({ step }: { step: Step }) {
  const rules = step.type === "condition" ? readRules(step.config.rules) : [];

  if (rules.length > 0) {
    return <RuleSummary rules={rules.slice(0, 2)} match={step.config.match} />;
  }

  return (
    <span className="text-ink-soft mt-0.5 block truncate text-[11px]">
      {stepPreview(step)}
    </span>
  );
}
