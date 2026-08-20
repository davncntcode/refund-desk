import Link from "next/link";
import { REFUND_STATUSES, type RefundStatus } from "@/lib/domain";
import type { StatusCounts } from "@/lib/db/queries";
import { STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";

const BAR: Record<RefundStatus, string> = {
  pending: "bg-chip-amber",
  in_review: "bg-chip-peri",
  approved: "bg-chip-sage",
  rejected: "bg-chip-clay",
  refunded: "bg-chip-teal",
};

export function StatusBreakdown({ counts }: { counts: StatusCounts }) {
  return (
    <section className="bg-card border-border rounded-2xl border p-5">
      <p className="micro text-muted-foreground">Where the queue sits</p>
      <p className="mt-1 text-base font-bold">Every request by status</p>

      <ul className="mt-5 space-y-3.5">
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
                  <span className="font-semibold group-hover:underline">
                    {STATUS_META[status].label}
                  </span>
                  <span className="numeric text-xs font-bold">
                    {total}
                    <span className="text-muted-foreground ml-1.5 font-normal">{percent}%</span>
                  </span>
                </div>
                <div className="border-divider bg-muted mt-1.5 h-2.5 overflow-hidden rounded-md border">
                  <div
                    className={cn("h-full", BAR[status])}
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
