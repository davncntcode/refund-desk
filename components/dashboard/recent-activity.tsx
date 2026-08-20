import Link from "next/link";
import { StatusPill } from "@/components/refunds/status-pill";
import type { RefundRequest } from "@/lib/db/schema";
import { formatMoney, formatRelative } from "@/lib/format";

export function RecentActivity({ rows }: { rows: RefundRequest[] }) {
  return (
    <section className="bg-card border-border h-full overflow-hidden rounded-2xl border">
      <div className="p-5 pb-3">
        <p className="micro text-muted-foreground">Latest movement</p>
        <p className="mt-1 text-base font-bold">Most recently updated</p>
      </div>

      <ul className="divide-divider divide-y">
        {rows.map((row) => (
          <li key={row.id}>
            <Link
              href={`/refunds/${row.id}`}
              className="hover:bg-muted focus-visible:ring-ring flex items-center justify-between gap-3 px-5 py-3 focus-visible:ring-2 focus-visible:outline-none"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{row.customerName}</p>
                <p className="numeric text-muted-foreground text-xs">{row.reference}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="numeric hidden text-sm font-bold sm:block">
                  {formatMoney(row.amountCents)}
                </span>
                <StatusPill status={row.status} />
                <span className="text-muted-foreground w-14 text-right text-xs">
                  {formatRelative(row.updatedAt)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
