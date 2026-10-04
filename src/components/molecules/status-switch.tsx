import { cn } from "@/lib/cn";
import type { WorkflowStatus } from "@/lib/types";

const options: WorkflowStatus[] = ["draft", "published"];

export function StatusSwitch({
  value,
  onChange,
}: {
  value: WorkflowStatus;
  onChange: (status: WorkflowStatus) => void;
}) {
  return (
    <div
      className="border-line bg-paper flex rounded-full border p-1"
      role="group"
      aria-label="Status"
    >
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={cn(
              "rounded px-2 py-1 text-[11px] font-medium capitalize",
              selected ? "bg-ink text-sand" : "text-muted hover:text-ink",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
