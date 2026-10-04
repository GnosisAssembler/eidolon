"use client";

import { useRouter } from "next/navigation";

import { AppShell } from "@/components/organisms/app-shell";
import { SiteHeader } from "@/components/organisms/site-header";
import { WorkflowLibrary } from "@/components/organisms/workflow-library";
import { useCreateWorkflow, useWorkflowList } from "@/hooks/use-workflows";

export function LibraryScreen() {
  const router = useRouter();
  const list = useWorkflowList();
  const create = useCreateWorkflow();

  return (
    <AppShell>
      <SiteHeader eyebrow="Editor template" />
      <WorkflowLibrary
        workflows={list.data ?? []}
        loading={list.isPending}
        error={list.isError}
        creating={create.isPending}
        onRetry={() => {
          void list.refetch();
        }}
        onCreate={() => {
          create.mutate(undefined, {
            onSuccess: (workflow) => {
              router.push(`/workflows/${workflow.id}`);
            },
          });
        }}
      />
    </AppShell>
  );
}
