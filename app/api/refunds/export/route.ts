import { listRefundsForExport } from "@/lib/db/queries";
import { parseRefundQuery } from "@/lib/refund-filters";
import { toCsv } from "@/lib/csv";
import { centsToAmountInput } from "@/lib/format";
import { REASON_META } from "@/lib/reasons";
import { STATUS_META } from "@/lib/status";

const HEADERS = [
  "Reference",
  "Customer name",
  "Customer email",
  "Amount",
  "Currency",
  "Reason category",
  "Reason",
  "Status",
  "Opened (UTC)",
  "Last updated (UTC)",
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = parseRefundQuery(Object.fromEntries(searchParams));
  const rows = await listRefundsForExport(query);

  const csv = toCsv([
    HEADERS,
    ...rows.map((row) => [
      row.reference,
      row.customerName,
      row.customerEmail,
      centsToAmountInput(row.amountCents),
      row.currency,
      REASON_META[row.reasonCategory].label,
      row.reason,
      STATUS_META[row.status].label,
      row.createdAt.toISOString(),
      row.updatedAt.toISOString(),
    ]),
  ]);

  const stamp = new Date().toISOString().slice(0, 10);
  const scope = query.status ? `-${query.status}` : "";

  return new Response(`\ufeff${csv}`, {
    headers: {
      // the bom keeps excel from mangling accented names
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="refund-requests${scope}-${stamp}.csv"`,
      "cache-control": "no-store",
    },
  });
}
