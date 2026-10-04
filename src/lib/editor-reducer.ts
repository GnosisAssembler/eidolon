import {
  addChild,
  findParent,
  findStep,
  removeStep,
  updateStep,
  withLayout,
} from "@/lib/graph";
import type {
  Step,
  StepPatch,
  Workflow,
  WorkflowStatus,
  WorkflowVersion,
} from "@/lib/types";

export type EditorState = {
  name: string;
  description: string;
  status: WorkflowStatus;
  root: Step | null;
  selectedId: string | null;
  zoom: number;
  baseline: string;
  ready: boolean;
};

export type EditorAction =
  | { type: "hydrate"; workflow: Workflow }
  | { type: "apply-saved"; workflow: Workflow }
  | { type: "rename"; name: string }
  | { type: "describe"; description: string }
  | { type: "set-status"; status: WorkflowStatus }
  | { type: "select"; id: string | null }
  | { type: "zoom"; zoom: number }
  | { type: "update-step"; id: string; patch: StepPatch }
  | { type: "add-step"; parentId: string; step: Step }
  | { type: "remove-step"; id: string }
  | { type: "restore"; version: WorkflowVersion }
  | { type: "layout" };

export const MIN_ZOOM = 0.4;
export const MAX_ZOOM = 1.4;

export function clampZoom(zoom: number) {
  const stepped = Math.round(zoom * 10) / 10;
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, stepped));
}

export function fingerprint(
  state: Pick<EditorState, "name" | "description" | "status" | "root">,
) {
  return JSON.stringify({
    name: state.name,
    description: state.description,
    status: state.status,
    root: state.root,
  });
}

export function isDirty(state: EditorState) {
  if (!state.ready) {
    return false;
  }

  return fingerprint(state) !== state.baseline;
}

export const emptyEditorState: EditorState = {
  name: "",
  description: "",
  status: "draft",
  root: null,
  selectedId: null,
  zoom: 1,
  baseline: "",
  ready: false,
};

function fromWorkflow(
  workflow: Workflow,
  zoom: number,
  selectedId: string | null,
): EditorState {
  const next: EditorState = {
    name: workflow.name,
    description: workflow.description,
    status: workflow.status,
    root: structuredClone(workflow.root),
    selectedId,
    zoom,
    baseline: "",
    ready: true,
  };
  next.baseline = fingerprint(next);
  return next;
}

export function editorReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  switch (action.type) {
    case "hydrate":
      return fromWorkflow(action.workflow, 1, action.workflow.root.id);
    case "apply-saved": {
      const selectedStillExists =
        state.selectedId && findStep(action.workflow.root, state.selectedId);
      return fromWorkflow(
        action.workflow,
        state.zoom,
        selectedStillExists ? state.selectedId : action.workflow.root.id,
      );
    }
    case "rename":
      return { ...state, name: action.name };
    case "describe":
      return { ...state, description: action.description };
    case "set-status":
      return { ...state, status: action.status };
    case "select":
      return { ...state, selectedId: action.id };
    case "zoom":
      return { ...state, zoom: clampZoom(action.zoom) };
    case "update-step": {
      if (!state.root) {
        return state;
      }
      return {
        ...state,
        root: updateStep(state.root, action.id, action.patch),
      };
    }
    case "add-step": {
      if (!state.root) {
        return state;
      }
      const root = addChild(state.root, action.parentId, action.step);
      if (root === state.root) {
        return state;
      }
      return { ...state, root, selectedId: action.step.id };
    }
    case "remove-step": {
      if (!state.root || action.id === state.root.id) {
        return state;
      }
      const parent = findParent(state.root, action.id);
      const root = removeStep(state.root, action.id);
      if (root === state.root) {
        return state;
      }
      const selectedId =
        state.selectedId === action.id
          ? (parent?.id ?? root.id)
          : state.selectedId;
      return { ...state, root, selectedId };
    }
    case "layout":
      if (!state.root) {
        return state;
      }
      return { ...state, root: withLayout(state.root) };
    case "restore":
      return {
        ...state,
        name: action.version.name,
        description: action.version.description,
        status: action.version.status,
        root: structuredClone(action.version.root),
        selectedId: action.version.root.id,
      };
    default:
      return state;
  }
}
