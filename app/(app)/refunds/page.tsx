import Link from "next/link";
import { Inbox, SearchX, X } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
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
        <SortSelect query={query} />
      </div>

      {query.q && (
        <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
          <span>
            Matching <span className="text-foreground font-medium">“{query.q}”</span>
          </span>
          <Link
            href={buildRefundsHref(query, { q: "", page: 1 })}
            className="border-border hover:bg-muted focus-visible:ring-ring inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs focus-visible:ring-2 focus-visible:outline-none"
          >
            <X className="size-3" aria-hidden />
            Clear
          </Link>
        </div>
      )}

      <div className="bg-card border-border shadow-card overflow-hidden rounded-xl border">
        {rows.length === 0 ? (
          isFiltered ? (
            <EmptyState
              icon={SearchX}
              title="No requests match this view"
              description="Nothing here with that status or search term. Widen the filter and try again."
            >
              <Link
                href="/refunds"
                className="bg-primary text-primary-foreground focus-visible:ring-ring rounded-full px-4 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
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
