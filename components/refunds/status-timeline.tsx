import { FilePlus2 } from "lucide-react";
import type { RefundStatusEvent } from "@/lib/db/schema";
import { formatDateTime, formatRelative } from "@/lib/format";
import { STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";

export function StatusTimeline({ events }: { events: RefundStatusEvent[] }) {
  return (
    <ol className="relative space-y-6">
      <span className="bg-border absolute top-3 bottom-3 left-[15px] w-px" aria-hidden />

      {events.map((event) => {
        const meta = STATUS_META[event.toStatus];
        const isCreation = event.fromStatus === null;
        const Icon = isCreation ? FilePlus2 : meta.icon;

        return (
          <li key={event.id} className="relative flex gap-3">
            <span
              className={cn(
                "z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
                isCreation ? "bg-brand-50 text-brand-700" : meta.tint,
              )}
            >
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1 space-y-1 pt-1">
              <p className="text-sm font-medium">
                {isCreation ? "Request logged" : `Moved to ${meta.label.toLowerCase()}`}
              </p>
              {event.note && (
                <p className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
                  {event.note}
                </p>
              )}
              <p className="text-muted-foreground text-xs">
                <time dateTime={event.createdAt.toISOString()}>
                  {formatDateTime(event.createdAt)}
                </time>
                <span aria-hidden> · </span>
                {formatRelative(event.createdAt)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
