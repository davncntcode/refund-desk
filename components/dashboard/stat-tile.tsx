import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
};

export function StatTile({ label, value, hint, icon: Icon }: Props) {
  return (
    <div className="bg-ink-tile rounded-[10px] p-3.5">
      <div className="flex items-start justify-between gap-2">
        <p className="micro text-on-ink-muted">{label}</p>
        <Icon className="text-on-ink-muted size-3.5 shrink-0" aria-hidden />
      </div>
      <p className="display text-lime mt-2 text-2xl">{value}</p>
      <p className="text-on-ink-muted mt-1 text-xs">{hint}</p>
    </div>
  );
}
