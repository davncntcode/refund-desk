import type { ReactNode } from "react";

type Props = { title: string; note: string; children: ReactNode };

// the reference's inverted impact block
export function SignalPanel({ title, note, children }: Props) {
  return (
    <section className="border-border bg-ink rounded-2xl border p-4 sm:p-5">
      <p className="text-on-ink text-sm font-bold">{title}</p>
      <div className="mt-4 grid grid-cols-2 gap-2.5 xl:grid-cols-4">{children}</div>
      <p className="text-on-ink-muted mt-4 text-xs">{note}</p>
    </section>
  );
}
