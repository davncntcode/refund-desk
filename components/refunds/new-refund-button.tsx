"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { NewRefundForm } from "./new-refund-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function NewRefundButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="border-border border font-bold">
          <Plus className="size-4" aria-hidden />
          <span className="hidden sm:inline">New request</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Log a refund request</DialogTitle>
          <DialogDescription>
            It lands in the pending queue for someone to review.
          </DialogDescription>
        </DialogHeader>
        <NewRefundForm onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
