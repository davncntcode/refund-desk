import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildRefundsHref, PER_PAGE, type RefundQuery } from "@/lib/refund-filters";
import { cn } from "@/lib/utils";

type Props = { query: RefundQuery; total: number; pageCount: number };

export function ListPagination({ query, total, pageCount }: Props) {
  const from = (query.page - 1) * PER_PAGE + 1;
  const to = Math.min(query.page * PER_PAGE, total);

  const step = (page: number, label: string, icon: typeof ChevronLeft, disabled: boolean) => {
    const Icon = icon;
    const classes =
      "border-border inline-flex size-9 items-center justify-center rounded-full border transition-colors";

    if (disabled) {
      return (
        <span aria-disabled className={cn(classes, "text-muted-foreground/50 bg-card")}>
          <Icon className="size-4" aria-hidden />
        </span>
      );
    }

    return (
      <Link
        href={buildRefundsHref(query, { page })}
        aria-label={label}
        className={cn(classes, "bg-card hover:bg-muted focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none")}
      >
        <Icon className="size-4" aria-hidden />
      </Link>
    );
  };

  return (
    <div className="border-border flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
      <p className="text-muted-foreground text-xs">
        Showing <span className="numeric font-medium">{from}</span>–
        <span className="numeric font-medium">{to}</span> of{" "}
        <span className="numeric font-medium">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground mr-1 text-xs">
          Page <span className="numeric">{query.page}</span> of{" "}
          <span className="numeric">{pageCount}</span>
        </span>
        {step(query.page - 1, "Previous page", ChevronLeft, query.page <= 1)}
        {step(query.page + 1, "Next page", ChevronRight, query.page >= pageCount)}
      </div>
    </div>
  );
}
