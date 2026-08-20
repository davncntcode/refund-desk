import type { DailyVolume } from "@/lib/db/queries";
import { formatDayShort, formatMoneyCompact } from "@/lib/format";
import { cn } from "@/lib/utils";

export function VolumeChart({ data }: { data: DailyVolume[] }) {
  const peak = Math.max(1, ...data.map((day) => day.total));
  const busiest = data.reduce((best, day) => (day.total > best.total ? day : best), data[0]);
  const requests = data.reduce((sum, day) => sum + day.total, 0);
  const value = data.reduce((sum, day) => sum + day.cents, 0);

  return (
    <section className="bg-card border-border shadow-card flex h-full flex-col rounded-xl border p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-heading text-base font-semibold">Requests coming in</h2>
          <p className="text-muted-foreground text-xs">Last {data.length} days</p>
        </div>
        <div className="text-right">
          <p className="numeric text-2xl font-bold">{requests}</p>
          <p className="text-muted-foreground text-xs">{formatMoneyCompact(value)} requested</p>
        </div>
      </div>

      <ol className="mt-6 flex min-h-36 flex-1 items-end gap-1.5" aria-label="Refund requests per day">
        {data.map((day) => {
          const isBusiest = day.total === busiest.total && day.total > 0;

          return (
            <li key={day.date} className="flex h-full flex-1 flex-col justify-end gap-2">
              <div
                className={cn(
                  "w-full rounded-t-md transition-colors",
                  day.total === 0
                    ? "bg-muted"
                    : isBusiest
                      ? "bg-amber-mark"
                      : "bg-brand-200",
                )}
                style={{ height: `${Math.max(day.total === 0 ? 2 : 8, (day.total / peak) * 100)}%` }}
              >
                <span className="sr-only">
                  {formatDayShort(day.date)}: {day.total} requests
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="text-muted-foreground mt-2 flex justify-between text-xs">
        <span>{formatDayShort(data[0].date)}</span>
        <span>{formatDayShort(data[data.length - 1].date)}</span>
      </div>

      {busiest.total > 0 && (
        <p className="text-muted-foreground mt-4 text-xs">
          Busiest day was{" "}
          <span className="text-amber-fg font-medium">{formatDayShort(busiest.date)}</span> with{" "}
          <span className="numeric font-medium">{busiest.total}</span> requests.
        </p>
      )}
    </section>
  );
}
