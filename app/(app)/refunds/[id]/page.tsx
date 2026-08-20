import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { ReasonChip } from "@/components/refunds/reason-chip";
import { StatusPill } from "@/components/refunds/status-pill";
import { StatusTimeline } from "@/components/refunds/status-timeline";
import { StatusUpdateForm } from "@/components/refunds/status-update-form";
import { getRefund } from "@/lib/db/queries";
import { formatDateTime, formatMoney, formatRelative } from "@/lib/format";
import { nextStatuses, STATUS_META } from "@/lib/status";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="micro text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}

export default async function RefundDetailPage({ params }: PageProps<"/refunds/[id]">) {
  const { id } = await params;
  const record = await getRefund(id);

  if (!record) notFound();

  const { request, events } = record;
  const next = nextStatuses(request.status);

  return (
    <div className="space-y-4">
      <Link
        href="/refunds"
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-md text-xs font-bold uppercase tracking-wide focus-visible:ring-2 focus-visible:outline-none"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        All requests
      </Link>

      <section className="border-border bg-lime text-chip-ink rounded-2xl border p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="micro">Requested</p>
            <p className="display mt-2 text-[2.75rem] sm:text-5xl">
              {formatMoney(request.amountCents)}
            </p>
            <h1 className="numeric mt-2 text-sm font-bold">{request.reference}</h1>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <StatusPill status={request.status} />
            <p className="max-w-[16rem] text-xs font-semibold sm:text-right">
              {STATUS_META[request.status].hint}
            </p>
          </div>
        </div>
      </section>

      <div className="grid items-start gap-4 lg:grid-cols-3">
        <section className="bg-card border-border rounded-2xl border p-5 lg:col-span-2">
          <p className="micro text-muted-foreground">The request</p>

          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Customer">
              <span className="font-semibold">{request.customerName}</span>
            </Field>
            <Field label="Email">
              <a
                href={`mailto:${request.customerEmail}`}
                className="focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-sm hover:underline focus-visible:ring-2 focus-visible:outline-none"
              >
                <Mail className="text-muted-foreground size-3.5" aria-hidden />
                {request.customerEmail}
              </a>
            </Field>
            <Field label="Category">
              <ReasonChip category={request.reasonCategory} />
            </Field>
            <Field label="Opened">
              <time dateTime={request.createdAt.toISOString()}>
                {formatDateTime(request.createdAt)}
              </time>
              <span className="text-muted-foreground"> · {formatRelative(request.createdAt)}</span>
            </Field>
          </dl>

          <div className="border-divider mt-5 border-t pt-5">
            <h2 className="micro text-muted-foreground">In the customer&rsquo;s words</h2>
            <p className="mt-2 text-sm leading-relaxed">{request.reason}</p>
          </div>
        </section>

        <div className="space-y-4">
          <section className="bg-card border-border rounded-2xl border p-5">
            <p className="micro text-muted-foreground">Move it forward</p>
            <p className="mt-1 mb-4 text-xs">
              Only the steps allowed from {STATUS_META[request.status].label.toLowerCase()} are
              offered.
            </p>
            <StatusUpdateForm id={request.id} current={request.status} next={next} />
          </section>

          <section className="bg-card border-border rounded-2xl border p-5">
            <p className="micro text-muted-foreground mb-5">History</p>
            <StatusTimeline events={events} />
          </section>
        </div>
      </div>
    </div>
  );
}
