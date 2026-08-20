"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createRefund } from "@/app/actions/refunds";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { REASON_CATEGORIES } from "@/lib/domain";
import { REASON_META } from "@/lib/reasons";
import {
  createRefundSchema,
  type CreateRefundInput,
  type CreateRefundValues,
} from "@/lib/validation/refund";
import { cn } from "@/lib/utils";

const EMPTY: CreateRefundInput = {
  customerName: "",
  customerEmail: "",
  amount: "",
  reasonCategory: "duplicate_charge",
  reason: "",
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-destructive text-xs">
      {message}
    </p>
  );
}

export function NewRefundForm({ onDone }: { onDone: () => void }) {
  const form = useForm<CreateRefundInput, unknown, CreateRefundValues>({
    resolver: zodResolver(createRefundSchema),
    defaultValues: EMPTY,
  });

  const { errors, isSubmitting } = form.formState;
  const control = form.control;
  const reason = useWatch({ control, name: "reason" });
  const reasonCategory = useWatch({ control, name: "reasonCategory" });
  const reasonLength = reason?.length ?? 0;

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await createRefund(values);

    if (!result.ok) {
      for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(field as keyof CreateRefundInput, { message: messages[0] });
      }
      toast.error(result.message);
      return;
    }

    toast.success(`${result.reference} logged`, { description: "Added to the pending queue." });
    form.reset(EMPTY);
    onDone();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer name</Label>
          <Input
            id="customerName"
            autoComplete="off"
            aria-invalid={Boolean(errors.customerName)}
            {...form.register("customerName")}
          />
          <FieldError message={errors.customerName?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerEmail">Customer email</Label>
          <Input
            id="customerEmail"
            type="email"
            autoComplete="off"
            aria-invalid={Boolean(errors.customerEmail)}
            {...form.register("customerEmail")}
          />
          <FieldError message={errors.customerEmail?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Refund amount</Label>
          <div className="relative">
            <span
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm"
              aria-hidden
            >
              $
            </span>
            <Input
              id="amount"
              inputMode="decimal"
              placeholder="129.99"
              className="numeric pl-7"
              aria-invalid={Boolean(errors.amount)}
              {...form.register("amount")}
            />
          </div>
          <FieldError message={errors.amount?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reasonCategory">Reason category</Label>
          <Select
            value={reasonCategory}
            onValueChange={(value) =>
              form.setValue("reasonCategory", value as CreateRefundInput["reasonCategory"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="reasonCategory" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REASON_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {REASON_META[category].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.reasonCategory?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="reason">What happened</Label>
          <span
            className={cn(
              "numeric text-xs",
              reasonLength > 1000 ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {reasonLength}/1000
          </span>
        </div>
        <Textarea
          id="reason"
          rows={4}
          placeholder="Charged twice for the same order, only one confirmation email arrived."
          aria-invalid={Boolean(errors.reason)}
          {...form.register("reason")}
        />
        <FieldError message={errors.reason?.message} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onDone} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
          Log request
        </Button>
      </div>
    </form>
  );
}
