"use client";

import { useState } from "react";

import { Button } from "@/components/atoms/button";
import { Skeleton } from "@/components/atoms/skeleton";
import { EmptyState } from "@/components/molecules/empty-state";
import { SearchField } from "@/components/molecules/search-field";
import { WorkflowCard } from "@/components/molecules/workflow-card";
import { filterWorkflows } from "@/lib/format";
import type { WorkflowSummary } from "@/lib/types";

export function WorkflowLibrary({
  workflows,
  loading,
  error,
  creating,
  onRetry,
  onCreate,
}: {
  workflows: WorkflowSummary[];
  loading: boolean;
  error: boolean;
  creating: boolean;
  onRetry: () => void;
  onCreate: () => void;
}) {
  const [query, setQuery] = useState("");
  const visible = filterWorkflows(workflows, query);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-copper font-mono text-xs tracking-[0.2em] uppercase">
            Workflow editor template
          </p>
          <h1 className="font-display text-ink mt-2 text-4xl sm:text-5xl">
            Workflows
          </h1>
          <p className="text-ink-soft mt-3 text-base leading-7">
            Arrange triggers, actions, conditions, and endings on a canvas.
            Sample flows are included so the editor can be tried without a
            backend.
          </p>
        </div>
        <Button onClick={onCreate} disabled={creating}>
          {creating ? "Creating" : "New workflow"}
        </Button>
      </div>
      <SearchField value={query} onChange={setQuery} />
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-52" />
          <Skeleton className="h-52" />
          <Skeleton className="h-52" />
        </div>
      ) : null}
      {error ? (
        <EmptyState
          title="Workflows could not be loaded"
          body="The sample library failed to respond. Try the request again."
        />
      ) : null}
      {error ? (
        <Button variant="outline" onClick={onRetry} className="self-start">
          Retry
        </Button>
      ) : null}
      {!loading && !error && visible.length === 0 ? (
        <EmptyState
          title="No matching workflows"
          body="Try another name, or create a blank workflow and build the first step."
        />
      ) : null}
      {!loading && !error && visible.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((workflow) => (
            <li key={workflow.id}>
              <WorkflowCard workflow={workflow} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
