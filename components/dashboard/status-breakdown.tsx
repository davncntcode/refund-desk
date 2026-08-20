import Link from "next/link";
import { REFUND_STATUSES } from "@/lib/domain";
import type { StatusCounts } from "@/lib/db/queries";
import { STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";

const BAR_TINT: Record<string, string> = {
  pending: "bg-butter-fg/70",
  in_review: "bg-sky-fg/70",
  approved: "bg-mint-fg/70",
  rejected: "bg-rose-fg/70",
  refunded: "bg-lilac-fg/70",
};

export function StatusBreakdown({ counts }: { counts: StatusCounts }) {
  return (
    <section className="bg-card border-border shadow-card rounded-xl border p-5">
      <h2 className="font-heading text-base font-semibold">Where the queue sits</h2>
      <p className="text-muted-foreground text-xs">Every request by status</p>

      <ul className="mt-5 space-y-4">
        {REFUND_STATUSES.map((status) => {
          const total = counts[status];
          const percent = counts.all === 0 ? 0 : Math.round((total / counts.all) * 100);

          return (
            <li key={status}>
              <Link
                href={`/refunds?status=${status}`}
                className="focus-visible:ring-ring group block rounded-md focus-visible:ring-2 focus-visible:outline-none"
              >
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium group-hover:underline">
                    {STATUS_META[status].label}
                  </span>
                  <span className="numeric text-muted-foreground text-xs">
                    {total} ({percent}%)
                  </span>
                </div>
                <div className="bg-muted mt-1.5 h-2 overflow-hidden rounded-full">
                  <div
                    className={cn("h-full rounded-full", BAR_TINT[status])}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
