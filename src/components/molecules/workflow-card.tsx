import Link from "next/link";

import { Badge } from "@/components/atoms/badge";
import { formatRevision, formatUpdated } from "@/lib/format";
import type { WorkflowSummary } from "@/lib/types";

export function WorkflowCard({ workflow }: { workflow: WorkflowSummary }) {
  return (
    <Link
      href={`/workflows/${workflow.id}`}
      className="group border-line bg-sand hover:border-copper/40 flex h-full flex-col rounded-3xl border p-5 shadow-[0_16px_36px_rgba(46,32,18,0.05)] transition hover:-translate-y-0.5"
    >
      <span className="flex items-center justify-between gap-3">
        <Badge tone={workflow.status === "published" ? "sage" : "muted"}>
          {workflow.status}
        </Badge>
        <span className="text-muted font-mono text-xs">
          {formatRevision(workflow.version)}
        </span>
      </span>
      <span className="font-display text-ink group-hover:text-copper-deep mt-4 text-2xl">
        {workflow.name}
      </span>
      <span className="text-ink-soft mt-2 line-clamp-3 flex-1 text-sm leading-6">
        {workflow.description}
      </span>
      <span className="text-muted mt-5 flex items-center justify-between text-xs">
        <span>
          {workflow.stepCount} {workflow.stepCount === 1 ? "step" : "steps"}
        </span>
        <span>{formatUpdated(workflow.updatedAt)}</span>
      </span>
    </Link>
  );
}
