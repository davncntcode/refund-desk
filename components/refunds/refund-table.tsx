import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { RefundRequest } from "@/lib/db/schema";
import { formatMoney, formatRelative } from "@/lib/format";
import { ReasonChip } from "./reason-chip";
import { StatusPill } from "./status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RefundTable({ rows }: { rows: RefundRequest[] }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <Table>
        <TableHeader>
          <TableRow className="border-divider hover:bg-transparent">
            <TableHead className="micro text-muted-foreground w-[124px]">Ref</TableHead>
            <TableHead className="micro text-muted-foreground">Customer</TableHead>
            <TableHead className="micro text-muted-foreground text-right">Amount</TableHead>
            <TableHead className="micro text-muted-foreground">Reason</TableHead>
            <TableHead className="micro text-muted-foreground">Status</TableHead>
            <TableHead className="micro text-muted-foreground text-right">Opened</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="border-divider hover:bg-muted">
              <TableCell className="numeric text-sm font-bold">
                <Link
                  href={"/refunds/" + row.id}
                  className="focus-visible:ring-ring rounded-sm hover:underline focus-visible:ring-2 focus-visible:outline-none"
                >
                  {row.reference}
                </Link>
              </TableCell>
              <TableCell>
                <span className="block text-sm font-semibold">{row.customerName}</span>
                <span className="text-muted-foreground block text-xs">{row.customerEmail}</span>
              </TableCell>
              <TableCell className="numeric text-right text-sm font-bold">
                {formatMoney(row.amountCents)}
              </TableCell>
              <TableCell>
                <ReasonChip category={row.reasonCategory} />
              </TableCell>
              <TableCell>
                <StatusPill status={row.status} />
              </TableCell>
              <TableCell className="text-muted-foreground text-right text-xs whitespace-nowrap">
                {formatRelative(row.createdAt)}
              </TableCell>
              <TableCell>
                <Link
                  href={"/refunds/" + row.id}
                  aria-label={"Open " + row.reference}
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex rounded-md p-1 focus-visible:ring-2 focus-visible:outline-none"
                >
                  <ChevronRight className="size-4" aria-hidden />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
