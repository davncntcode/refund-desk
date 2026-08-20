"use server";

import { revalidatePath } from "next/cache";
import { like, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "@/lib/db";
import { refundRequests, refundStatusEvents } from "@/lib/db/schema";
import { createRefundSchema, updateStatusSchema } from "@/lib/validation/refund";
import { canTransition } from "@/lib/status";

export type ActionResult<T = undefined> =
  | ({ ok: true } & (T extends undefined ? object : T))
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

// RF-2026-0001, the handle the team says out loud
async function nextReference(tx: Tx, at: Date) {
  const prefix = `RF-${at.getUTCFullYear()}-`;

  const [row] = await tx
    .select({ latest: sql<string | null>`max(${refundRequests.reference})` })
    .from(refundRequests)
    .where(like(refundRequests.reference, `${prefix}%`));

  const sequence = row?.latest ? Number(row.latest.slice(prefix.length)) + 1 : 1;
  return `${prefix}${String(sequence).padStart(4, "0")}`;
}

function invalid(error: z.ZodError) {
  return {
    ok: false as const,
    message: "Check the highlighted fields and try again.",
    fieldErrors: z.flattenError(error).fieldErrors as Record<string, string[]>,
  };
}

export async function createRefund(
  input: unknown,
): Promise<ActionResult<{ id: string; reference: string }>> {
  const parsed = createRefundSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const { customerName, customerEmail, amount, reasonCategory, reason } = parsed.data;
  const id = nanoid(12);
  const now = new Date();

  const reference = await db.transaction(async (tx) => {
    const next = await nextReference(tx, now);

    await tx.insert(refundRequests).values({
      id,
      reference: next,
      customerName,
      customerEmail,
      amountCents: amount,
      reasonCategory,
      reason,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    await tx.insert(refundStatusEvents).values({
      id: nanoid(12),
      refundId: id,
      fromStatus: null,
      toStatus: "pending",
      note: null,
      createdAt: now,
    });

    return next;
  });

  revalidatePath("/");
  revalidatePath("/refunds");

  return { ok: true, id, reference };
}

export async function updateRefundStatus(input: unknown): Promise<ActionResult> {
  const parsed = updateStatusSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const { id, status, note } = parsed.data;
  const now = new Date();

  const result = await db.transaction(async (tx) => {
    const [current] = await tx
      .select({ status: refundRequests.status })
      .from(refundRequests)
      .where(sql`${refundRequests.id} = ${id}`)
      .limit(1);

    if (!current) return { ok: false as const, message: "That refund request no longer exists." };

    // the dropdown is not the gate, this is
    if (!canTransition(current.status, status)) {
      return {
        ok: false as const,
        message: `A ${current.status.replace("_", " ")} request cannot move to ${status.replace("_", " ")}.`,
      };
    }

    await tx
      .update(refundRequests)
      .set({ status, updatedAt: now })
      .where(sql`${refundRequests.id} = ${id}`);

    await tx.insert(refundStatusEvents).values({
      id: nanoid(12),
      refundId: id,
      fromStatus: current.status,
      toStatus: status,
      note: note || null,
      createdAt: now,
    });

    return { ok: true as const };
  });

  if (!result.ok) return result;

  revalidatePath("/");
  revalidatePath("/refunds");
  revalidatePath(`/refunds/${id}`);

  return { ok: true };
}
