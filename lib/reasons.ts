import { REASON_CATEGORIES, type ReasonCategory } from "./domain";

type ReasonMeta = { label: string; tint: string };

export const REASON_META: Record<ReasonCategory, ReasonMeta> = {
  duplicate_charge: { label: "Duplicate charge", tint: "bg-sky text-sky-fg" },
  item_not_received: { label: "Item not received", tint: "bg-peach text-peach-fg" },
  damaged_item: { label: "Damaged item", tint: "bg-rose text-rose-fg" },
  cancelled_order: { label: "Cancelled order", tint: "bg-lilac text-lilac-fg" },
  billing_error: { label: "Billing error", tint: "bg-butter text-butter-fg" },
  other: { label: "Other", tint: "bg-muted text-muted-foreground" },
};

export function isReasonCategory(value: unknown): value is ReasonCategory {
  return typeof value === "string" && (REASON_CATEGORIES as readonly string[]).includes(value);
}
