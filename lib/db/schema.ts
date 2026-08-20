import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { CURRENCY, REASON_CATEGORIES, REFUND_STATUSES } from "../domain";

export const refundRequests = sqliteTable(
  "refund_requests",
  {
    id: text("id").primaryKey(),
    reference: text("reference").notNull().unique(),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").notNull().default(CURRENCY),
    reasonCategory: text("reason_category", { enum: REASON_CATEGORIES }).notNull(),
    reason: text("reason").notNull(),
    status: text("status", { enum: REFUND_STATUSES }).notNull().default("pending"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("refund_requests_status_idx").on(table.status),
    index("refund_requests_created_at_idx").on(table.createdAt),
    index("refund_requests_email_idx").on(table.customerEmail),
  ],
);

export const refundStatusEvents = sqliteTable(
  "refund_status_events",
  {
    id: text("id").primaryKey(),
    refundId: text("refund_id")
      .notNull()
      .references(() => refundRequests.id, { onDelete: "cascade" }),
    fromStatus: text("from_status", { enum: REFUND_STATUSES }),
    toStatus: text("to_status", { enum: REFUND_STATUSES }).notNull(),
    note: text("note"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("refund_status_events_refund_idx").on(table.refundId, table.createdAt)],
);

export type RefundRequest = typeof refundRequests.$inferSelect;
export type RefundStatusEvent = typeof refundStatusEvents.$inferSelect;
