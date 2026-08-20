import { Suspense } from "react";
import Link from "next/link";
import { Receipt } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";
import type { StatusCounts } from "@/lib/db/queries";
import { Progress } from "@/components/ui/progress";

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
        className="focus-visible:ring-ring flex items-center gap-2.5 rounded-lg px-2 py-1 focus-visible:ring-2 focus-visible:outline-none"
      >
        <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg">
          <Receipt className="size-5" aria-hidden />
        </span>
        <span className="font-heading text-base font-semibold tracking-tight">Refund Desk</span>
      </Link>

      <Suspense fallback={<div className="h-56" />}>
        <SidebarNav counts={counts} onNavigate={onNavigate} />
      </Suspense>

      <div className="mt-auto">
        <div className="bg-brand-50 rounded-xl p-4">
          <p className="text-brand-700 font-heading text-sm font-semibold">Queue cleared</p>
          <p className="text-brand-700/80 mt-1 text-xs">
            Requests closed out, refunded or rejected.
          </p>
          <Progress value={percent} className="mt-3 h-2" />
          <p className="numeric text-brand-700 mt-2 text-xs font-medium">
            {resolved}/{total} ({percent}%)
          </p>
        </div>
      </div>
    </div>
  );
}
