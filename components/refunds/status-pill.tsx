import type { RefundStatus } from "@/lib/domain";
import { STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";

export function StatusPill({ status, className }: { status: RefundStatus; className?: string }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;

  return (
    <span
      className={cn(
        "border-border inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-xs font-bold whitespace-nowrap",
        meta.tint,
        className,
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      {meta.label}
    </span>
  );
}
