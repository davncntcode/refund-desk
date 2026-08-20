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
    <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter by status">
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
              "focus-visible:ring-ring inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
              active
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            {label}
            <span
              className={cn(
                "numeric text-xs",
                active ? "text-primary-foreground/80" : "text-muted-foreground",
              )}
            >
              {counts[value]}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
