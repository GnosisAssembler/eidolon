import { StepCard } from "@/components/molecules/step-card";
import { StepDropZone } from "@/components/molecules/step-drop-zone";
import { acceptsChildren } from "@/lib/steps";
import type { Step, StepType } from "@/lib/types";

export function StepTree({
  step,
  selectedId,
  onSelect,
  onAdd,
}: {
  step: Step;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: (parentId: string, type: StepType) => void;
}) {
  const open = acceptsChildren(step.type);

  return (
    <div className="flex flex-col items-center">
      <StepCard
        step={step}
        selected={selectedId === step.id}
        onSelect={onSelect}
      />
      {open ? (
        <>
          <div className="bg-ink/20 h-6 w-px" />
          <div className="flex items-start gap-8">
            {step.children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="bg-ink/20 mb-2 h-4 w-px" />
                <StepTree
                  step={child}
                  selectedId={selectedId}
                  onSelect={onSelect}
                  onAdd={onAdd}
                />
              </div>
            ))}
            <div className="flex flex-col items-center">
              <div className="bg-ink/15 mb-2 h-4 w-px" />
              <StepDropZone parentId={step.id} onAdd={onAdd} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
