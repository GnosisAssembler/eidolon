import { acceptsChildren } from "@/lib/steps";
import type { Point, Step, StepPatch } from "@/lib/types";

export const NODE_W = 228;
export const NODE_H = 78;
const GAP_X = 92;
const GAP_Y = 28;

export function findStep(root: Step, id: string): Step | null {
  if (root.id === id) {
    return root;
  }

  for (const child of root.children) {
    const match = findStep(child, id);
    if (match) {
      return match;
    }
  }

  return null;
}

export function findParent(root: Step, id: string): Step | null {
  for (const child of root.children) {
    if (child.id === id) {
      return root;
    }

    const nested = findParent(child, id);
    if (nested) {
      return nested;
    }
  }

  return null;
}

export function countSteps(root: Step): number {
  return root.children.reduce((total, child) => total + countSteps(child), 1);
}

export function parentForInsertion(root: Step, selectedId: string | null) {
  if (!selectedId) {
    return acceptsChildren(root.type) ? root : null;
  }

  const selected = findStep(root, selectedId);
  if (!selected) {
    return acceptsChildren(root.type) ? root : null;
  }

  if (acceptsChildren(selected.type)) {
    return selected;
  }

  return findParent(root, selected.id);
}

export function addChild(root: Step, parentId: string, child: Step): Step {
  if (root.id === parentId) {
    if (!acceptsChildren(root.type)) {
      return root;
    }

    return { ...root, children: [...root.children, child] };
  }

  let changed = false;
  const children = root.children.map((node) => {
    const next = addChild(node, parentId, child);
    if (next !== node) {
      changed = true;
    }
    return next;
  });

  return changed ? { ...root, children } : root;
}

export function flattenSteps(root: Step): Step[] {
  return [root, ...root.children.flatMap((child) => flattenSteps(child))];
}

export function collectEdges(
  root: Step,
): { id: string; from: Step; to: Step }[] {
  return root.children.flatMap((child) => [
    { id: `${root.id}->${child.id}`, from: root, to: child },
    ...collectEdges(child),
  ]);
}

export function edgePath(from: Step, to: Step) {
  const x1 = from.position.x + NODE_W;
  const y1 = from.position.y + NODE_H / 2;
  const x2 = to.position.x;
  const y2 = to.position.y + NODE_H / 2;
  const bend = Math.max(56, Math.abs(x2 - x1) / 2);

  return `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`;
}

export type InsertionSlot = {
  parentId: string;
  parentName: string;
  position: Point;
};

export function insertionSlots(root: Step): InsertionSlot[] {
  return flattenSteps(root)
    .filter((step) => acceptsChildren(step.type))
    .map((step) => ({
      parentId: step.id,
      parentName: step.name,
      position: childPosition(step),
    }));
}

export function worldSize(root: Step) {
  const positions = [
    ...flattenSteps(root).map((step) => step.position),
    ...insertionSlots(root).map((slot) => slot.position),
  ];

  return positions.reduce(
    (size, position) => ({
      width: Math.max(size.width, position.x + NODE_W + 180),
      height: Math.max(size.height, position.y + NODE_H + 280),
    }),
    { width: 1280, height: 760 },
  );
}

function place(
  node: Step,
  x: number,
  y: number,
): { node: Step; height: number } {
  if (node.children.length === 0) {
    return {
      node: { ...node, position: { x, y } },
      height: NODE_H + GAP_Y,
    };
  }

  let cursor = y;
  const children: Step[] = [];
  let total = 0;

  for (const child of node.children) {
    const laid = place(child, x + NODE_W + GAP_X, cursor);
    children.push(laid.node);
    cursor += laid.height;
    total += laid.height;
  }

  const first = children[0]?.position.y ?? y;
  const last = children[children.length - 1]?.position.y ?? y;

  return {
    node: { ...node, position: { x, y: (first + last) / 2 }, children },
    height: Math.max(total, NODE_H + GAP_Y),
  };
}

export function withLayout(root: Step): Step {
  return place(root, 56, 56).node;
}

export function childPosition(parent: Step): Point {
  const x = parent.position.x + NODE_W + GAP_X;
  if (parent.children.length === 0) {
    return { x, y: parent.position.y };
  }

  const lowest = parent.children.reduce((bottom, child) =>
    child.position.y > bottom.position.y ? child : bottom,
  );

  return {
    x,
    y: lowest.position.y + NODE_H + GAP_Y,
  };
}

export function updateStep(root: Step, id: string, patch: StepPatch): Step {
  if (root.id === id) {
    return {
      ...root,
      ...patch,
      id: root.id,
      type: root.type,
      children: root.children,
      config: patch.config ? { ...root.config, ...patch.config } : root.config,
    };
  }

  let changed = false;
  const children = root.children.map((node) => {
    const next = updateStep(node, id, patch);
    if (next !== node) {
      changed = true;
    }
    return next;
  });

  return changed ? { ...root, children } : root;
}

export function removeStep(root: Step, id: string): Step {
  if (root.id === id) {
    return root;
  }

  let changed = false;
  const children = root.children.flatMap((node) => {
    if (node.id === id) {
      changed = true;
      return [];
    }

    const next = removeStep(node, id);
    if (next !== node) {
      changed = true;
    }
    return [next];
  });

  return changed ? { ...root, children } : root;
}
