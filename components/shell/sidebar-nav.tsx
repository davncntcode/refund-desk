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
              "flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium transition-colors",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="flex-1 truncate">{item.label}</span>
            {total !== undefined && total > 0 && (
              <span
                className={cn(
                  "numeric rounded-full px-1.5 py-0.5 text-xs",
                  active ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground",
                )}
              >
                {total}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
