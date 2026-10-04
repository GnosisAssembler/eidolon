"use client";

import { useEffect, useReducer, useState } from "react";
import { useRouter } from "next/navigation";

import { useSaveWorkflow, useWorkflow } from "@/hooks/use-workflows";
import { editorReducer, emptyEditorState, isDirty } from "@/lib/editor-reducer";
import { childPosition, findStep, parentForInsertion } from "@/lib/graph";
import { createStep } from "@/lib/steps";
import type { Point, StepType, WorkflowVersion } from "@/lib/types";
import { APP_NAME } from "@/lib/version";

export function useEditorSession(workflowId: string) {
  const router = useRouter();
  const query = useWorkflow(workflowId);
  const saveMutation = useSaveWorkflow();
  const [state, dispatch] = useReducer(editorReducer, emptyEditorState);
  const [notice, setNotice] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const dirty = isDirty(state);

  useEffect(() => {
    if (!query.data || state.ready) {
      return;
    }
    dispatch({ type: "hydrate", workflow: query.data });
  }, [query.data, state.ready]);

  useEffect(() => {
    if (!state.ready) {
      return;
    }
    document.title = `${state.name.trim() || "Untitled workflow"} · ${APP_NAME}`;
  }, [state.name, state.ready]);

  useEffect(() => {
    if (!dirty) {
      return;
    }

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }

      if (event.key === "Escape" && !deleteOpen && !leaveOpen) {
        dispatch({ type: "select", id: null });
      }

      if (
        (event.key === "Delete" || event.key === "Backspace") &&
        state.selectedId &&
        state.root
      ) {
        if (state.selectedId === state.root.id) {
          return;
        }
        event.preventDefault();
        setDeleteOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deleteOpen, leaveOpen, state.root, state.selectedId]);

  const selected =
    state.root && state.selectedId
      ? findStep(state.root, state.selectedId)
      : null;

  function addStep(type: StepType, parentId?: string, position?: Point) {
    if (!state.root) {
      return;
    }

    const parent = parentId
      ? findStep(state.root, parentId)
      : parentForInsertion(state.root, state.selectedId);

    if (!parent) {
      setNotice("Select a step that can hold children.");
      return;
    }

    const step = createStep(type);
    step.position = position ?? childPosition(parent);
    setNotice(null);
    dispatch({ type: "add-step", parentId: parent.id, step });
  }

  function save() {
    if (!state.root || !dirty) {
      return;
    }

    saveMutation.mutate(
      {
        id: workflowId,
        name: state.name,
        description: state.description,
        status: state.status,
        root: state.root,
        note: "Saved revision",
      },
      {
        onSuccess: (workflow) => {
          dispatch({ type: "apply-saved", workflow });
        },
      },
    );
  }

  function requestLeave() {
    if (dirty) {
      setLeaveOpen(true);
      return;
    }
    router.push("/");
  }

  function confirmDelete() {
    if (!state.selectedId) {
      return;
    }
    dispatch({ type: "remove-step", id: state.selectedId });
    setDeleteOpen(false);
  }

  function restore(version: WorkflowVersion) {
    dispatch({ type: "restore", version });
  }

  function discard() {
    if (query.data) {
      dispatch({ type: "hydrate", workflow: query.data });
    }
  }

  return {
    query,
    state,
    dispatch,
    selected,
    dirty,
    notice,
    deleteOpen,
    leaveOpen,
    setDeleteOpen,
    setLeaveOpen,
    saving: saveMutation.isPending,
    saveError: saveMutation.isError,
    addStep,
    save,
    requestLeave,
    confirmDelete,
    restore,
    discard,
    leave: () => router.push("/"),
  };
}
