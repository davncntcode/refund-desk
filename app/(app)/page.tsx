import { CheckCircle2, Clock, Timer, Wallet } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { OldestWaiting } from "@/components/dashboard/oldest-waiting";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatTile } from "@/components/dashboard/stat-tile";
import { StatusBreakdown } from "@/components/dashboard/status-breakdown";
import { VolumeChart } from "@/components/dashboard/volume-chart";
import {
  getDailyVolume,
  getDashboardStats,
  getOldestOpen,
  getRecentActivity,
  getStatusCounts,
} from "@/lib/db/queries";
import { formatDuration, formatMoney } from "@/lib/format";

export default async function DashboardPage() {
  const [stats, counts, volume, oldest, recent] = await Promise.all([
    getDashboardStats(),
    getStatusCounts(),
    getDailyVolume(14),
    getOldestOpen(5),
    getRecentActivity(5),
  ]);

  return (
    <>
      <PageHeader
        title="Refund desk"
        description="Where the queue stands right now, and how quickly it is moving."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Awaiting decision"
          value={String(stats.openCount)}
          hint={`${formatMoney(stats.openCents)} waiting on a call`}
          icon={Clock}
          tint="bg-sky text-sky-fg"
          emphasis={stats.openCount > 0}
        />
        <StatTile
          label="Approved, not paid"
          value={String(stats.approvedCount)}
          hint={`${formatMoney(stats.approvedCents)} queued for payout`}
          icon={CheckCircle2}
          tint="bg-mint text-mint-fg"
        />
        <StatTile
          label="Refunded, 30 days"
          value={formatMoney(stats.refundedCents30d)}
          hint={`${stats.refundedCount30d} requests paid back`}
          icon={Wallet}
          tint="bg-lilac text-lilac-fg"
        />
        <StatTile
          label="Average resolution"
          value={stats.avgResolutionMs === null ? "—" : formatDuration(stats.avgResolutionMs)}
          hint={`Across ${stats.resolvedCount} resolved requests`}
          icon={Timer}
          tint="bg-butter text-butter-fg"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VolumeChart data={volume} />
        </div>
        <OldestWaiting rows={oldest} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity rows={recent} />
        </div>
        <StatusBreakdown counts={counts} />
      </div>
    </>
  );
}
