import { z } from "zod";
import { MAX_AMOUNT_CENTS, MIN_AMOUNT_CENTS, REASON_CATEGORIES, REFUND_STATUSES } from "../domain";
import { formatMoney, parseAmountToCents } from "../format";
import { requiresNote } from "../status";

const amountCents = z
  .string()
  .trim()
  .min(1, "Enter the amount to refund")
  .transform((value, ctx) => {
    const cents = parseAmountToCents(value);

    if (cents === null) {
      ctx.addIssue({ code: "custom", message: "Use a plain amount such as 129.99" });
      return z.NEVER;
    }
    if (cents < MIN_AMOUNT_CENTS) {
      ctx.addIssue({ code: "custom", message: `Minimum refund is ${formatMoney(MIN_AMOUNT_CENTS)}` });
      return z.NEVER;
    }
    if (cents > MAX_AMOUNT_CENTS) {
      ctx.addIssue({ code: "custom", message: `Maximum refund is ${formatMoney(MAX_AMOUNT_CENTS)}` });
      return z.NEVER;
    }

    return cents;
  });

export const createRefundSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Enter the customer's name")
    .max(120, "Keep the name under 120 characters"),
  customerEmail: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Enter a valid email address"))
    .pipe(z.string().max(200, "Keep the email under 200 characters")),
  amount: amountCents,
  reasonCategory: z.enum(REASON_CATEGORIES, { message: "Pick a reason category" }),
  reason: z
    .string()
    .trim()
    .min(10, "Give at least a sentence of context")
    .max(1000, "Keep the reason under 1000 characters"),
});

export type CreateRefundInput = z.input<typeof createRefundSchema>;
export type CreateRefundValues = z.output<typeof createRefundSchema>;

export const updateStatusSchema = z
  .object({
    id: z.string().trim().min(1, "Missing refund request"),
    status: z.enum(REFUND_STATUSES, { message: "Pick a status" }),
    note: z.string().trim().max(500, "Keep the note under 500 characters").default(""),
  })
  .superRefine((value, ctx) => {
    if (requiresNote(value.status) && value.note.length < 5) {
      ctx.addIssue({
        code: "custom",
        path: ["note"],
        message: "Say why it was rejected — the customer may ask",
      });
    }
  });

export type UpdateStatusInput = z.input<typeof updateStatusSchema>;
