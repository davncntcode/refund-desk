import { formatDuration, formatMoney } from "@/lib/format";

type Props = {
  openCents: number;
  openCount: number;
  avgResolutionMs: number | null;
};

// the reference's hero figure, in this product's terms
export function ExposureBand({ openCents, openCount, avgResolutionMs }: Props) {
  return (
    <section className="border-border bg-lime text-chip-ink rounded-2xl border p-6 sm:p-8">
      <p className="micro">Open refund exposure</p>
      <p className="display mt-2 text-[2.75rem] sm:text-6xl">{formatMoney(openCents)}</p>
      <p className="mt-3 text-sm font-bold">
        <span className="numeric">{openCount}</span> awaiting a decision
        {avgResolutionMs !== null && (
          <>
            <span className="mx-1.5" aria-hidden>
              ·
            </span>
            <span className="numeric">{formatDuration(avgResolutionMs)}</span> to resolve on average
          </>
        )}
      </p>
    </section>
  );
}
