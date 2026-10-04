import { Button } from "@/components/atoms/button";
import { formatRevision, formatUpdated } from "@/lib/format";
import type { WorkflowVersion } from "@/lib/types";

export function VersionRow({
  version,
  current,
  onRestore,
}: {
  version: WorkflowVersion;
  current: boolean;
  onRestore: (version: WorkflowVersion) => void;
}) {
  return (
    <li className="border-line bg-paper rounded-2xl border px-3 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-ink text-sm font-medium">
            {formatRevision(version.version)}
            {current ? (
              <span className="text-copper ml-2 text-xs">Current</span>
            ) : null}
          </p>
          <p className="text-muted mt-1 text-xs">
            {formatUpdated(version.savedAt)}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => onRestore(version)}>
          Restore
        </Button>
      </div>
      <p className="text-ink-soft mt-2 text-sm">{version.note}</p>
    </li>
  );
}
