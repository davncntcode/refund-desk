import { Suspense } from "react";
import Link from "next/link";
import { SidebarNav } from "./sidebar-nav";
import type { StatusCounts } from "@/lib/db/queries";

type Props = {
  counts: StatusCounts;
  resolved: number;
  total: number;
  onNavigate?: () => void;
};

export function SidebarPanel({ counts, resolved, total, onNavigate }: Props) {
  const percent = total === 0 ? 0 : Math.round((resolved / total) * 100);

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link
        href="/"
        onClick={onNavigate}
        className="focus-visible:ring-ring flex items-baseline gap-1.5 rounded-lg px-1 py-1 focus-visible:ring-2 focus-visible:outline-none"
      >
        <span className="text-xl font-extrabold tracking-tight uppercase">Refund</span>
        <span className="micro text-muted-foreground">/ desk</span>
      </Link>

      <Suspense fallback={<div className="h-56" />}>
        <SidebarNav counts={counts} onNavigate={onNavigate} />
      </Suspense>

      <div className="bg-ink mt-auto rounded-2xl p-4">
        <p className="micro text-on-ink-muted">Queue cleared</p>
        <p className="display text-lime mt-1 text-2xl">{percent}%</p>
        <div className="bg-on-ink/15 mt-3 h-1.5 overflow-hidden rounded-full">
          <div className="bg-lime h-full rounded-full" style={{ width: `${percent}%` }} />
        </div>
        <p className="numeric text-on-ink-muted mt-2 text-xs">
          {resolved} of {total} refunded or rejected
        </p>
      </div>
    </div>
  );
}
