import { CheckCircle2, Clock, Inbox, LayoutDashboard, Search, type LucideIcon } from "lucide-react";
import type { RefundStatus } from "@/lib/domain";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  status?: RefundStatus | "all";
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "All requests", href: "/refunds", icon: Inbox, status: "all" },
  { label: "Pending", href: "/refunds?status=pending", icon: Clock, status: "pending" },
  { label: "In review", href: "/refunds?status=in_review", icon: Search, status: "in_review" },
  { label: "Approved", href: "/refunds?status=approved", icon: CheckCircle2, status: "approved" },
];
