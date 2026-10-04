"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createWorkflow,
  getWorkflow,
  listWorkflows,
  saveWorkflow,
} from "@/lib/api/workflows";
import { workflowKeys } from "@/lib/query-keys";
import type { SaveWorkflowInput } from "@/lib/types";

export function useWorkflowList() {
  return useQuery({
    queryKey: workflowKeys.all,
    queryFn: listWorkflows,
  });
}

export function useWorkflow(id: string) {
  return useQuery({
    queryKey: workflowKeys.detail(id),
    queryFn: () => getWorkflow(id),
  });
}

export function useSaveWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveWorkflowInput) => saveWorkflow(input),
    onSuccess: (workflow) => {
      queryClient.setQueryData(workflowKeys.detail(workflow.id), workflow);
      void queryClient.invalidateQueries({ queryKey: workflowKeys.all });
    },
  });
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkflow,
    onSuccess: (workflow) => {
      queryClient.setQueryData(workflowKeys.detail(workflow.id), workflow);
      void queryClient.invalidateQueries({ queryKey: workflowKeys.all });
    },
  });
}
