export const REFUND_STATUSES = ["pending", "in_review", "approved", "rejected", "refunded"] as const;

export type RefundStatus = (typeof REFUND_STATUSES)[number];

export const REASON_CATEGORIES = [
  "duplicate_charge",
  "item_not_received",
  "damaged_item",
  "cancelled_order",
  "billing_error",
  "other",
] as const;

export type ReasonCategory = (typeof REASON_CATEGORIES)[number];

export const CURRENCY = "USD";
export const TIME_ZONE = "UTC";

// one dollar to fifty thousand, in cents
export const MIN_AMOUNT_CENTS = 100;
export const MAX_AMOUNT_CENTS = 5_000_000;
