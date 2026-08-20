import Link from "next/link";
import { StatusPill } from "@/components/refunds/status-pill";
import type { RefundRequest } from "@/lib/db/schema";
import { formatRelative } from "@/lib/format";

export function RecentActivity({ rows }: { rows: RefundRequest[] }) {
  return (
    <section className="bg-card border-border shadow-card overflow-hidden rounded-xl border">
      <div className="p-5 pb-3">
        <h2 className="font-heading text-base font-semibold">Latest movement</h2>
        <p className="text-muted-foreground text-xs">Most recently updated requests</p>
      </div>

      <ul className="divide-border divide-y">
        {rows.map((row) => (
          <li key={row.id}>
            <Link
              href={`/refunds/${row.id}`}
              className="hover:bg-muted/60 focus-visible:ring-ring flex items-center justify-between gap-3 px-5 py-3 focus-visible:ring-2 focus-visible:outline-none"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{row.customerName}</p>
                <p className="numeric text-muted-foreground text-xs">{row.reference}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
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
