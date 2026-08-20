import type { ReasonCategory } from "@/lib/domain";
import { REASON_META } from "@/lib/reasons";
import { cn } from "@/lib/utils";

type Props = { category: ReasonCategory; className?: string; showLabel?: boolean };

// the reference's code square, outlined so colour stays reserved for status
export function ReasonChip({ category, className, showLabel = true }: Props) {
  const meta = REASON_META[category];

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="border-border flex size-7 shrink-0 items-center justify-center rounded-lg border text-[0.5625rem] font-extrabold tracking-wider"
      >
        {meta.code}
      </span>
      <span className={cn("text-xs whitespace-nowrap", !showLabel && "sr-only")}>{meta.label}</span>
    </span>
  );
}
