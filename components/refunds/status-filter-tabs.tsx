import Link from "next/link";
import { REFUND_STATUSES } from "@/lib/domain";
import type { StatusCounts } from "@/lib/db/queries";
import { buildRefundsHref, type RefundQuery } from "@/lib/refund-filters";
import { STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";

const TABS = [{ value: "all" as const }, ...REFUND_STATUSES.map((value) => ({ value }))];

export function StatusFilterTabs({ query, counts }: { query: RefundQuery; counts: StatusCounts }) {
  const current = query.status ?? "all";

  return (
    <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filter by status">
      {TABS.map(({ value }) => {
        const active = current === value;
        const label = value === "all" ? "All" : STATUS_META[value].label;

        return (
          <Link
            key={value}
            role="tab"
            aria-selected={active}
            href={buildRefundsHref(query, {
              status: value === "all" ? undefined : value,
              page: 1,
            })}
            className={cn(
              "focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none",
              active
                ? "border-border bg-primary text-primary-foreground"
                : "border-divider bg-card-alt text-muted-foreground hover:text-foreground hover:border-border",
            )}
          >
            {label}
            <span className="numeric">{counts[value]}</span>
          </Link>
        );
      })}
    </div>
  );
}
