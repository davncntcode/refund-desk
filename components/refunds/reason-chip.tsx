import type { ReasonCategory } from "@/lib/domain";
import { REASON_META } from "@/lib/reasons";
import { cn } from "@/lib/utils";

export function ReasonChip({ category, className }: { category: ReasonCategory; className?: string }) {
  const meta = REASON_META[category];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        meta.tint,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}
