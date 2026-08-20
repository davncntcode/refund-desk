import { CheckCircle2, Clock, Timer, Wallet } from "lucide-react";
import { ExposureBand } from "@/components/dashboard/exposure-band";
import { OldestWaiting } from "@/components/dashboard/oldest-waiting";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { SignalPanel } from "@/components/dashboard/signal-panel";
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
import { formatDuration, formatMoney, formatMoneyCompact } from "@/lib/format";

export default async function DashboardPage() {
  const [stats, counts, volume, oldest, recent] = await Promise.all([
    getDashboardStats(),
    getStatusCounts(),
    getDailyVolume(14),
    getOldestOpen(5),
    getRecentActivity(5),
  ]);

  const cleared = stats.totalCount === 0 ? 0 : Math.round((stats.resolvedCount / stats.totalCount) * 100);

  return (
    <div className="space-y-4">
      <h1 className="sr-only">Refund desk overview</h1>
      <ExposureBand
        openCents={stats.openCents}
        openCount={stats.openCount}
        avgResolutionMs={stats.avgResolutionMs}
      />

      <SignalPanel
        title="Where the queue stands"
        note={`${cleared}% of everything logged has been closed out, refunded or rejected.`}
      >
        <StatTile
          label="Awaiting decision"
          value={String(stats.openCount)}
          hint={`${formatMoneyCompact(stats.openCents)} on a call`}
          icon={Clock}
        />
        <StatTile
          label="Approved, not paid"
          value={String(stats.approvedCount)}
          hint={`${formatMoneyCompact(stats.approvedCents)} queued`}
          icon={CheckCircle2}
        />
        <StatTile
          label="Refunded, 30 days"
          value={formatMoneyCompact(stats.refundedCents30d)}
          hint={`${stats.refundedCount30d} requests paid back`}
          icon={Wallet}
        />
        <StatTile
          label="Average resolution"
          value={stats.avgResolutionMs === null ? "—" : formatDuration(stats.avgResolutionMs)}
          hint={`Across ${stats.resolvedCount} resolved`}
          icon={Timer}
        />
      </SignalPanel>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VolumeChart data={volume} />
        </div>
        <OldestWaiting rows={oldest} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity rows={recent} />
        </div>
        <StatusBreakdown counts={counts} />
      </div>

      <p className="text-muted-foreground text-xs">
        Exposure is the total of every request still awaiting a decision, currently{" "}
        <span className="numeric font-bold">{formatMoney(stats.openCents)}</span>.
      </p>
    </div>
  );
}
