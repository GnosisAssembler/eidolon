import { describe, expect, it } from "vitest";

import {
  editorReducer,
  emptyEditorState,
  isDirty,
  MAX_ZOOM,
  MIN_ZOOM,
} from "@/lib/editor-reducer";
import { createStep } from "@/lib/steps";
import type { Workflow } from "@/lib/types";

function workflow(): Workflow {
  const root = createStep("trigger", "start");
  return {
    id: "wf_test",
    name: "Sample",
    description: "A sample flow.",
    status: "draft",
    updatedAt: "2026-03-01T00:00:00.000Z",
    version: 1,
    root,
    versions: [
      {
        id: "wf_test-v1",
        version: 1,
        savedAt: "2026-03-01T00:00:00.000Z",
        note: "Created",
        name: "Sample",
        description: "A sample flow.",
        status: "draft",
        root,
      },
    ],
  };
}

describe("editor reducer", () => {
  it("hydrates a clean draft", () => {
    const state = editorReducer(emptyEditorState, {
      type: "hydrate",
      workflow: workflow(),
    });

    expect(state.ready).toBe(true);
    expect(state.selectedId).toBe("start");
    expect(isDirty(state)).toBe(false);
  });

  it("marks a rename as unsaved and clears it after save", () => {
    const hydrated = editorReducer(emptyEditorState, {
      type: "hydrate",
      workflow: workflow(),
    });
    const renamed = editorReducer(hydrated, {
      type: "rename",
      name: "Renamed",
    });

    expect(isDirty(renamed)).toBe(true);

    const saved = editorReducer(renamed, {
      type: "apply-saved",
      workflow: { ...workflow(), name: "Renamed", version: 2 },
    });

    expect(saved.name).toBe("Renamed");
    expect(isDirty(saved)).toBe(false);
  });

  it("selects a newly added step and keeps the trigger", () => {
    const hydrated = editorReducer(emptyEditorState, {
      type: "hydrate",
      workflow: workflow(),
    });
    const added = editorReducer(hydrated, {
      type: "add-step",
      parentId: "start",
      step: createStep("delay", "wait"),
    });

    expect(added.selectedId).toBe("wait");
    expect(editorReducer(added, { type: "remove-step", id: "start" })).toBe(
      added,
    );
  });

  it("clamps zoom and restores an older revision into the draft", () => {
    const hydrated = editorReducer(emptyEditorState, {
      type: "hydrate",
      workflow: workflow(),
    });
    const zoomed = editorReducer(hydrated, { type: "zoom", zoom: 4 });
    const source = workflow();
    const restored = editorReducer(zoomed, {
      type: "restore",
      version: {
        ...source.versions[0],
        name: "Earlier",
        root: createStep("trigger", "earlier"),
      },
    });

    expect(zoomed.zoom).toBe(MAX_ZOOM);
    expect(editorReducer(hydrated, { type: "zoom", zoom: 0 }).zoom).toBe(
      MIN_ZOOM,
    );
    expect(restored.name).toBe("Earlier");
    expect(restored.selectedId).toBe("earlier");
    expect(isDirty(restored)).toBe(true);
  });
});
