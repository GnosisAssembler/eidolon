import type { Metadata } from "next";

import { EditorScreen } from "@/components/templates/editor-screen";
import { findSeed } from "@/lib/mock/workflows";

export async function generateMetadata({
  params,
}: PageProps<"/workflows/[workflowId]">): Promise<Metadata> {
  const { workflowId } = await params;
  const workflow = findSeed(workflowId);

  return {
    title: workflow?.name ?? "Workflow",
  };
}

export default async function WorkflowPage({
  params,
}: PageProps<"/workflows/[workflowId]">) {
  const { workflowId } = await params;
  return <EditorScreen key={workflowId} workflowId={workflowId} />;
}
