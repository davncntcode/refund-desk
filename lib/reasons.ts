import { REASON_CATEGORIES, type ReasonCategory } from "./domain";

// the code is what fits the square badge, the label is what people read
type ReasonMeta = { label: string; code: string };

export const REASON_META: Record<ReasonCategory, ReasonMeta> = {
  duplicate_charge: { label: "Duplicate charge", code: "DUP" },
  item_not_received: { label: "Item not received", code: "NRC" },
  damaged_item: { label: "Damaged item", code: "DMG" },
  cancelled_order: { label: "Cancelled order", code: "CXL" },
  billing_error: { label: "Billing error", code: "BIL" },
  other: { label: "Other", code: "OTH" },
};

export function isReasonCategory(value: unknown): value is ReasonCategory {
  return typeof value === "string" && (REASON_CATEGORIES as readonly string[]).includes(value);
}
