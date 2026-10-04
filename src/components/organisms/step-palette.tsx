import { PaletteItem } from "@/components/molecules/palette-item";
import { STEP_GROUPS } from "@/lib/steps";
import type { StepType } from "@/lib/types";

export function StepPalette({
  notice,
  onAdd,
  onDragStart,
  onDragEnd,
}: {
  notice: string | null;
  onAdd: (type: StepType) => void;
  onDragStart: (type: StepType) => void;
  onDragEnd: () => void;
}) {
  return (
    <aside className="border-line bg-sand flex w-60 shrink-0 flex-col gap-3 overflow-auto border-r p-3">
      <div>
        <p className="text-copper font-mono text-[11px] tracking-[0.18em] uppercase">
          Palette
        </p>
        <h2 className="text-ink mt-1 text-sm font-semibold">Add a step</h2>
        <p className="text-muted mt-1 text-[11px] leading-4">
          Drag a step and a dotted space shows where it can land.
        </p>
      </div>
      {STEP_GROUPS.map((group) => (
        <section key={group.id} className="flex flex-col gap-1.5">
          <div>
            <h3 className="text-muted font-mono text-[10px] tracking-[0.16em] uppercase">
              {group.label}
            </h3>
            <p className="text-muted text-[11px]">{group.hint}</p>
          </div>
          <ul className="flex flex-col gap-1.5">
            {group.entries.map((entry) => (
              <li key={entry.type}>
                <PaletteItem
                  type={entry.type}
                  locked={!entry.addable}
                  onAdd={onAdd}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
      {notice ? <p className="text-copper-deep text-xs">{notice}</p> : null}
    </aside>
  );
}
