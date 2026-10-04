"use client";

import { useState } from "react";

import { Button } from "@/components/atoms/button";
import { Skeleton } from "@/components/atoms/skeleton";
import { ConfirmDialog } from "@/components/organisms/confirm-dialog";
import { EditorHeader } from "@/components/organisms/editor-header";
import { Inspector } from "@/components/organisms/inspector";
import { AppShell } from "@/components/organisms/app-shell";
import { SiteHeader } from "@/components/organisms/site-header";
import { StepPalette } from "@/components/organisms/step-palette";
import { WorkflowCanvas } from "@/components/organisms/workflow-canvas";
import { useEditorSession } from "@/hooks/use-editor-session";
import type { StepType } from "@/lib/types";

export function EditorScreen({ workflowId }: { workflowId: string }) {
  const session = useEditorSession(workflowId);
  const [dragging, setDragging] = useState<StepType | null>(null);
  const workflow = session.query.data;

  if (session.query.isError) {
    return (
      <div className="bg-paper min-h-dvh">
        <SiteHeader eyebrow="Missing workflow" />
        <div className="mx-auto max-w-lg px-6 py-16">
          <h1 className="font-display text-ink text-4xl">
            This workflow is not in the library
          </h1>
          <p className="text-ink-soft mt-3 text-sm leading-6">
            The sample data does not include that id. Return to the library and
            open another flow.
          </p>
          <Button className="mt-6" onClick={session.leave}>
            Back to library
          </Button>
        </div>
      </div>
    );
  }

  if (
    session.query.isPending ||
    !session.state.ready ||
    !session.state.root ||
    !workflow
  ) {
    return (
      <div className="bg-paper min-h-dvh">
        <SiteHeader eyebrow="Loading workflow" />
        <div className="space-y-4 p-6">
          <Skeleton className="h-14" />
          <Skeleton className="h-[32rem]" />
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <EditorHeader
        name={session.state.name}
        description={session.state.description}
        status={session.state.status}
        revision={workflow.version}
        dirty={session.dirty}
        saving={session.saving}
        onNameChange={(name) => session.dispatch({ type: "rename", name })}
        onDescriptionChange={(description) =>
          session.dispatch({ type: "describe", description })
        }
        onStatusChange={(status) =>
          session.dispatch({ type: "set-status", status })
        }
        onSave={session.save}
        onBack={session.requestLeave}
        onDiscard={session.discard}
      />
      {session.saveError ? (
        <p className="bg-danger/10 text-danger px-6 py-2 text-sm">
          The revision could not be saved.
        </p>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <StepPalette
          notice={session.notice}
          onAdd={(type) => session.addStep(type)}
          onDragStart={setDragging}
          onDragEnd={() => setDragging(null)}
        />
        <WorkflowCanvas
          root={session.state.root}
          selectedId={session.state.selectedId}
          zoom={session.state.zoom}
          dragging={dragging}
          onSelect={(id) => session.dispatch({ type: "select", id })}
          onZoom={(zoom) => session.dispatch({ type: "zoom", zoom })}
          onMove={(id, position) =>
            session.dispatch({ type: "update-step", id, patch: { position } })
          }
          onChange={(id, patch) =>
            session.dispatch({ type: "update-step", id, patch })
          }
          onDrop={(type, position, parentId) =>
            session.addStep(type, parentId, position)
          }
        />
        <Inspector
          step={session.selected}
          versions={workflow.versions}
          currentVersion={workflow.version}
          canDelete={
            session.selected
              ? session.selected.id !== session.state.root.id
              : false
          }
          onChange={(patch) => {
            if (!session.selected) {
              return;
            }
            session.dispatch({
              type: "update-step",
              id: session.selected.id,
              patch,
            });
          }}
          onDelete={() => session.setDeleteOpen(true)}
          onRestore={session.restore}
        />
      </div>
      <ConfirmDialog
        open={session.deleteOpen}
        title="Delete this step?"
        description="The step and every path under it will leave the draft. Save a revision if you want to keep a copy."
        confirmLabel="Delete step"
        onOpenChange={session.setDeleteOpen}
        onConfirm={session.confirmDelete}
      />
      <ConfirmDialog
        open={session.leaveOpen}
        title="Leave unsaved changes?"
        description="This draft has edits that are not stored as a revision."
        confirmLabel="Leave"
        onOpenChange={session.setLeaveOpen}
        onConfirm={session.leave}
      />
    </AppShell>
  );
}
