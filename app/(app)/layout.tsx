import { SidebarPanel } from "@/components/shell/sidebar-panel";
import { Topbar } from "@/components/shell/topbar";
import { getDashboardStats, getStatusCounts } from "@/lib/db/queries";

// every screen reads live queue data
export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const [counts, stats] = await Promise.all([getStatusCounts(), getDashboardStats()]);
  const panel = (
    <SidebarPanel counts={counts} resolved={stats.resolvedCount} total={stats.totalCount} />
  );

  return (
    <div className="lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-border bg-card hidden lg:sticky lg:top-0 lg:block lg:h-dvh lg:border-r">
        {panel}
      </aside>
      <div className="flex min-h-dvh flex-col">
        <Topbar mobilePanel={panel} />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
