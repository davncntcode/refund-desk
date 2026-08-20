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
    const classes = "inline-flex size-8 items-center justify-center rounded-lg border";

    if (disabled) {
      return (
        <span aria-disabled className={cn(classes, "border-divider text-muted-foreground/50")}>
          <Icon className="size-4" aria-hidden />
        </span>
      );
    }

    return (
      <Link
        href={buildRefundsHref(query, { page })}
        aria-label={label}
        className={cn(
          classes,
          "border-border bg-card-alt hover:bg-primary focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
        )}
      >
        <Icon className="size-4" aria-hidden />
      </Link>
    );
  };

  return (
    <div className="border-divider flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
      <p className="text-muted-foreground text-xs">
        Showing{" "}
        <span className="numeric text-foreground font-bold">
          {from}&ndash;{to}
        </span>{" "}
        of <span className="numeric text-foreground font-bold">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <span className="micro text-muted-foreground mr-1">
          Page {query.page} / {pageCount}
        </span>
        {step(query.page - 1, "Previous page", ChevronLeft, query.page <= 1)}
        {step(query.page + 1, "Next page", ChevronRight, query.page >= pageCount)}
      </div>
    </div>
  );
}
