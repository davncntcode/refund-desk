import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { EmptyState } from "@/components/refunds/empty-state";
import { StatusPill } from "@/components/refunds/status-pill";
import type { RefundRequest } from "@/lib/db/schema";
import { formatMoney, formatRelative } from "@/lib/format";

export function OldestWaiting({ rows }: { rows: RefundRequest[] }) {
  return (
    <section className="bg-card border-border overflow-hidden rounded-2xl border">
      <div className="flex items-baseline justify-between gap-2 p-5 pb-3">
        <div>
          <p className="micro text-muted-foreground">Waiting longest</p>
          <p className="mt-1 text-base font-bold">Clear these first</p>
        </div>
        <Link
          href="/refunds?status=pending"
          className="focus-visible:ring-ring rounded-sm text-xs font-bold underline decoration-1 underline-offset-2 focus-visible:ring-2 focus-visible:outline-none"
        >
          View all
        </Link>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={PartyPopper}
          title="Queue is empty"
          description="Nothing is waiting on a decision right now."
        />
      ) : (
        <ul className="divide-divider divide-y">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                href={`/refunds/${row.id}`}
                className="hover:bg-muted focus-visible:ring-ring block px-5 py-3 focus-visible:ring-2 focus-visible:outline-none"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-semibold">{row.customerName}</span>
                  <span className="numeric shrink-0 text-sm font-bold">
                    {formatMoney(row.amountCents)}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <StatusPill status={row.status} />
                  <span className="text-muted-foreground text-xs">
                    opened {formatRelative(row.createdAt)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
