import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  tint: string;
  emphasis?: boolean;
};

export function StatTile({ label, value, hint, icon: Icon, tint, emphasis }: Props) {
  return (
    <div
      className={cn(
        "bg-card border-border shadow-card rounded-xl border p-5",
        emphasis && "ring-amber-mark/40 ring-1",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</p>
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", tint)}>
          <Icon className="size-4.5" aria-hidden />
        </span>
      </div>
      <p className="numeric mt-3 text-2xl font-bold sm:text-3xl">{value}</p>
      <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
    </div>
  );
}
