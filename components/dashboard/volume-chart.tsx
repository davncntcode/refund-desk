import type { DailyVolume } from "@/lib/db/queries";
import { formatDayShort, formatMoneyCompact } from "@/lib/format";
import { cn } from "@/lib/utils";

export function VolumeChart({ data }: { data: DailyVolume[] }) {
  const peak = Math.max(1, ...data.map((day) => day.total));
  const busiest = data.reduce((best, day) => (day.total > best.total ? day : best), data[0]);
  const requests = data.reduce((sum, day) => sum + day.total, 0);
  const value = data.reduce((sum, day) => sum + day.cents, 0);

  return (
    <section className="bg-card border-border flex h-full flex-col rounded-2xl border p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="micro text-muted-foreground">Requests coming in</p>
          <p className="mt-1 text-base font-bold">Last {data.length} days</p>
        </div>
        <div className="text-right">
          <p className="display text-3xl">{requests}</p>
          <p className="numeric text-muted-foreground text-xs">
            {formatMoneyCompact(value)} requested
          </p>
        </div>
      </div>

      <ol className="mt-6 flex min-h-36 flex-1 items-end gap-1.5" aria-label="Refund requests per day">
        {data.map((day) => {
          const isBusiest = day.total === busiest.total && day.total > 0;

          return (
            <li key={day.date} className="flex h-full flex-1 flex-col justify-end">
              <div
                className={cn(
                  "w-full",
                  day.total === 0
                    ? "bg-divider"
                    : isBusiest
                      ? "border-border bg-lime rounded-t-md border-x border-t"
                      : "border-border bg-foreground/15 rounded-t-md border-x border-t",
                )}
                style={{ height: day.total === 0 ? "2px" : `${Math.max(10, (day.total / peak) * 88)}%` }}
              >
                <span className="sr-only">
                  {formatDayShort(day.date)}: {day.total} requests
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="border-divider text-muted-foreground mt-2 flex justify-between border-t pt-2 text-xs">
        <span>{formatDayShort(data[0].date)}</span>
        {busiest.total > 0 && (
          <span className="text-foreground font-bold">
            Busiest {formatDayShort(busiest.date)} · {busiest.total}
          </span>
        )}
        <span>{formatDayShort(data[data.length - 1].date)}</span>
      </div>
    </section>
  );
}
