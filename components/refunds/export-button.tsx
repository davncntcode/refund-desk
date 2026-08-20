import { Download } from "lucide-react";
import { buildExportHref, type RefundQuery } from "@/lib/refund-filters";

export function ExportButton({ query, disabled }: { query: RefundQuery; disabled?: boolean }) {
  if (disabled) return null;

  return (
    <a
      href={buildExportHref(query)}
      className="border-border bg-card hover:bg-muted focus-visible:ring-ring inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
    >
      <Download className="size-4" aria-hidden />
      Export CSV
    </a>
  );
}
