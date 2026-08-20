import Link from "next/link";
import { Inbox, SearchX, X } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { ExportButton } from "@/components/refunds/export-button";
import { EmptyState } from "@/components/refunds/empty-state";
import { ListPagination } from "@/components/refunds/list-pagination";
import { RefundCardList } from "@/components/refunds/refund-card-list";
import { RefundTable } from "@/components/refunds/refund-table";
import { SortSelect } from "@/components/refunds/sort-select";
import { StatusFilterTabs } from "@/components/refunds/status-filter-tabs";
import { getStatusCounts, listRefunds } from "@/lib/db/queries";
import { buildRefundsHref, parseRefundQuery } from "@/lib/refund-filters";

export default async function RefundsPage({ searchParams }: PageProps<"/refunds">) {
  const query = parseRefundQuery(await searchParams);
  const [counts, { rows, total, pageCount }] = await Promise.all([
    getStatusCounts(),
    listRefunds(query),
  ]);

  const isFiltered = Boolean(query.status || query.q);

  return (
    <>
      <PageHeader
        title="Refund requests"
        description="Every request the team has taken in, newest first unless you say otherwise."
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <StatusFilterTabs query={query} counts={counts} />
        <div className="flex items-center gap-2">
          <ExportButton query={query} disabled={rows.length === 0} />
          <SortSelect query={query} />
        </div>
      </div>

      {query.q && (
        <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
          <span>
            Matching <span className="text-foreground font-medium">“{query.q}”</span>
          </span>
          <Link
            href={buildRefundsHref(query, { q: "", page: 1 })}
            className="border-border hover:bg-muted focus-visible:ring-ring inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-bold focus-visible:ring-2 focus-visible:outline-none"
          >
            <X className="size-3" aria-hidden />
            Clear
          </Link>
        </div>
      )}

      <div className="bg-card border-border overflow-hidden rounded-2xl border">
        {rows.length === 0 ? (
          isFiltered ? (
            <EmptyState
              icon={SearchX}
              title="No requests match this view"
              description="Nothing here with that status or search term. Widen the filter and try again."
            >
              <Link
                href="/refunds"
                className="border-border bg-primary text-primary-foreground focus-visible:ring-ring rounded-lg border px-4 py-2 text-sm font-bold focus-visible:ring-2 focus-visible:outline-none"
              >
                Clear filters
              </Link>
            </EmptyState>
          ) : (
            <EmptyState
              icon={Inbox}
              title="No refund requests yet"
              description="When a customer asks for their money back, log it here and the queue starts tracking it."
            />
          )
        ) : (
          <>
            <RefundTable rows={rows} />
            <RefundCardList rows={rows} />
            <ListPagination query={query} total={total} pageCount={pageCount} />
          </>
        )}
      </div>
    </>
  );
}
