import Link from "next/link";
import type { RefundRequest } from "@/lib/db/schema";
import { formatMoney, formatRelative } from "@/lib/format";
import { ReasonChip } from "./reason-chip";
import { StatusPill } from "./status-pill";

export function RefundCardList({ rows }: { rows: RefundRequest[] }) {
  return (
    <ul className="divide-divider divide-y md:hidden">
      {rows.map((row) => (
        <li key={row.id}>
          <Link
            href={"/refunds/" + row.id}
            className="hover:bg-muted focus-visible:ring-ring block space-y-2.5 p-4 focus-visible:ring-2 focus-visible:outline-none"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{row.customerName}</p>
                <p className="text-muted-foreground truncate text-xs">{row.customerEmail}</p>
              </div>
              <p className="display shrink-0 text-lg">{formatMoney(row.amountCents)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill status={row.status} />
              <ReasonChip category={row.reasonCategory} />
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span className="numeric font-bold">{row.reference}</span>
              <span>{formatRelative(row.createdAt)}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
