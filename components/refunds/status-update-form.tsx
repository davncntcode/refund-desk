"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { updateRefundStatus } from "@/app/actions/refunds";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RefundStatus } from "@/lib/domain";
import { requiresNote, STATUS_META } from "@/lib/status";
import { updateStatusSchema } from "@/lib/validation/refund";
import { cn } from "@/lib/utils";

const ACTION_LABEL: Record<RefundStatus, string> = {
  pending: "Send back to pending",
  in_review: "Start review",
  approved: "Approve",
  rejected: "Reject",
  refunded: "Mark refunded",
};

type Props = { id: string; current: RefundStatus; next: readonly RefundStatus[] };

export function StatusUpdateForm({ id, current, next }: Props) {
  const [target, setTarget] = useState<RefundStatus | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const close = () => {
    setTarget(null);
    setNote("");
    setError(null);
  };

  const submit = () => {
    if (!target) return;

    const parsed = updateStatusSchema.safeParse({ id, status: target, note });
    if (!parsed.success) {
      setError(z.prettifyError(parsed.error).split("\n")[0].replace(/^✖\s*/, ""));
      return;
    }

    startTransition(async () => {
      const result = await updateRefundStatus(parsed.data);

      if (!result.ok) {
        setError(result.message);
        return;
      }

      toast.success(`Moved to ${STATUS_META[target].label.toLowerCase()}`);
      close();
    });
  };

  if (next.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        {STATUS_META[current].label} is final — nothing left to change.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {next.map((status) => (
          <Button
            key={status}
            variant={status === "rejected" ? "secondary" : "default"}
            className={cn("border-border border font-bold", status === "rejected" && "bg-chip-clay text-chip-ink hover:bg-chip-clay/80")}
            onClick={() => {
              setTarget(status);
              setNote("");
              setError(null);
            }}
          >
            {ACTION_LABEL[status]}
          </Button>
        ))}
      </div>

      <Dialog open={target !== null} onOpenChange={(open) => (open ? undefined : close())}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{target ? ACTION_LABEL[target] : ""}</DialogTitle>
            <DialogDescription>
              {target && requiresNote(target)
                ? "A rejection needs a reason on the record."
                : "Add a note if it helps whoever picks this up next."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="note">
              Note {target && requiresNote(target) ? "" : "(optional)"}
            </Label>
            <Textarea
              id="note"
              rows={3}
              value={note}
              onChange={(event) => {
                setNote(event.target.value);
                setError(null);
              }}
              aria-invalid={Boolean(error)}
            />
            {error && (
              <p role="alert" className="text-destructive text-xs">
                {error}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={close} disabled={pending}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
