import type { RefundStatus } from "@/lib/domain";
import { STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";

export function StatusPill({ status, className }: { status: RefundStatus; className?: string }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        meta.tint,
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
      {meta.label}
    </span>
  );
}
