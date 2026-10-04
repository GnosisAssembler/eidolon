"use client";

import * as Dialog from "@radix-ui/react-dialog";

import { Button } from "@/components/atoms/button";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  pending,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  pending?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-ink/45 fixed inset-0 z-40" />
        <Dialog.Content className="border-line bg-sand fixed top-1/2 left-1/2 z-50 w-[min(100%-2rem,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border p-6 shadow-2xl">
          <Dialog.Title className="font-display text-ink text-2xl">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-ink-soft mt-2 text-sm leading-6">
            {description}
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="ghost">Cancel</Button>
            </Dialog.Close>
            <Button variant="danger" onClick={onConfirm} disabled={pending}>
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
