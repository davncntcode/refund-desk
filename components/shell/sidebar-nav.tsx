"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";
import type { StatusCounts } from "@/lib/db/queries";
import { cn } from "@/lib/utils";

export function SidebarNav({ counts, onNavigate }: { counts: StatusCounts; onNavigate?: () => void }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const currentStatus = params.get("status") ?? "all";

  return (
    <nav className="space-y-1" aria-label="Sections">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isRefundList = pathname === "/refunds";
        const active = item.status
          ? isRefundList && currentStatus === item.status
          : pathname === item.href;
        const total = item.status ? counts[item.status] : undefined;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "focus-visible:ring-ring flex items-center gap-2.5 rounded-lg border px-2.5 py-2 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none",
              active
                ? "border-border bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted border-transparent",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="flex-1 truncate">{item.label}</span>
            {total !== undefined && total > 0 && (
              <span className={cn("numeric text-xs font-bold", !active && "text-muted-foreground")}>
                {total}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
