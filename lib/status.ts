import { CheckCircle2, Clock, Search, Wallet, XCircle, type LucideIcon } from "lucide-react";
import { REFUND_STATUSES, type RefundStatus } from "./domain";

type StatusMeta = {
  label: string;
  tint: string;
  icon: LucideIcon;
  hint: string;
};

export const STATUS_META: Record<RefundStatus, StatusMeta> = {
  pending: {
    label: "Pending",
    tint: "bg-butter text-butter-fg",
    icon: Clock,
    hint: "Waiting for someone to pick it up",
  },
  in_review: {
    label: "In review",
    tint: "bg-sky text-sky-fg",
    icon: Search,
    hint: "Being checked against the payment record",
  },
  approved: {
    label: "Approved",
    tint: "bg-mint text-mint-fg",
    icon: CheckCircle2,
    hint: "Decided, waiting for the money to move",
  },
  rejected: {
    label: "Rejected",
    tint: "bg-rose text-rose-fg",
    icon: XCircle,
    hint: "Declined with a reason on the record",
  },
  refunded: {
    label: "Refunded",
    tint: "bg-lilac text-lilac-fg",
    icon: Wallet,
    hint: "Money returned to the customer",
  },
};

export const STATUS_TRANSITIONS: Record<RefundStatus, readonly RefundStatus[]> = {
  pending: ["in_review", "rejected"],
  in_review: ["approved", "rejected"],
  approved: ["refunded"],
  rejected: [],
  refunded: [],
};

// declining always needs a reason on the record
export const NOTE_REQUIRED_FOR: readonly RefundStatus[] = ["rejected"];

export const OPEN_STATUSES: readonly RefundStatus[] = ["pending", "in_review"];
export const TERMINAL_STATUSES: readonly RefundStatus[] = ["rejected", "refunded"];

export function canTransition(from: RefundStatus, to: RefundStatus) {
  return STATUS_TRANSITIONS[from].includes(to);
}

export function nextStatuses(from: RefundStatus) {
  return STATUS_TRANSITIONS[from];
}

export function requiresNote(to: RefundStatus) {
  return NOTE_REQUIRED_FOR.includes(to);
}

export function isRefundStatus(value: unknown): value is RefundStatus {
  return typeof value === "string" && (REFUND_STATUSES as readonly string[]).includes(value);
}
