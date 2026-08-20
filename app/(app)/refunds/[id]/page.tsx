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

export default async function RefundDetailPage({ params }: PageProps<"/refunds/[id]">) {
  const { id } = await params;
  const record = await getRefund(id);

  if (!record) notFound();

  const { request, events } = record;
  const next = nextStatuses(request.status);

  return (
    <>
      <Link
        href="/refunds"
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring mb-4 inline-flex items-center gap-1.5 rounded-md text-sm focus-visible:ring-2 focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All requests
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="numeric font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              {request.reference}
            </h1>
            <StatusPill status={request.status} />
          </div>
          <p className="text-muted-foreground text-sm">{STATUS_META[request.status].hint}</p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Requested
          </p>
          <p className="numeric text-2xl font-bold sm:text-3xl">
            {formatMoney(request.amountCents)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <section className="bg-card border-border shadow-card rounded-xl border p-5">
            <h2 className="font-heading mb-4 text-base font-semibold">The request</h2>

            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Customer
                </dt>
                <dd className="mt-1 text-sm font-medium">{request.customerName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Email
                </dt>
                <dd className="mt-1 text-sm">
                  <a
                    href={`mailto:${request.customerEmail}`}
                    className="focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-sm hover:underline focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <Mail className="text-muted-foreground size-3.5" aria-hidden />
                    {request.customerEmail}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Category
                </dt>
                <dd className="mt-1">
                  <ReasonChip category={request.reasonCategory} />
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Opened
                </dt>
                <dd className="mt-1 text-sm">
                  <time dateTime={request.createdAt.toISOString()}>
                    {formatDateTime(request.createdAt)}
                  </time>
                  <span className="text-muted-foreground"> · {formatRelative(request.createdAt)}</span>
                </dd>
              </div>
            </dl>

            <div className="border-border mt-5 border-t pt-5">
              <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                In the customer&rsquo;s words
              </dt>
              <p className="mt-2 text-sm leading-relaxed">{request.reason}</p>
            </div>
          </section>

          <section className="bg-card border-border shadow-card rounded-xl border p-5">
            <h2 className="font-heading mb-4 text-base font-semibold">Move it forward</h2>
            <StatusUpdateForm id={request.id} current={request.status} next={next} />
          </section>
        </div>

        <section className="bg-card border-border shadow-card h-fit rounded-xl border p-5">
          <h2 className="font-heading mb-5 text-base font-semibold">History</h2>
          <StatusTimeline events={events} />
        </section>
      </div>
    </>
  );
}
