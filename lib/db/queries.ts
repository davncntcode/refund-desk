import { and, count, desc, eq, gte, inArray, or, sql, sum } from "drizzle-orm";
import { REFUND_STATUSES, type RefundStatus } from "@/lib/domain";
import { OPEN_STATUSES, TERMINAL_STATUSES } from "@/lib/status";
import { PER_PAGE, type RefundQuery } from "@/lib/refund-filters";
import { db } from "./index";
import { refundRequests, refundStatusEvents } from "./schema";

const DAY = 24 * 60 * 60 * 1000;

export type StatusCounts = Record<RefundStatus, number> & { all: number };

export async function getStatusCounts(): Promise<StatusCounts> {
  const rows = await db
    .select({ status: refundRequests.status, total: count() })
    .from(refundRequests)
    .groupBy(refundRequests.status);

  const counts = Object.fromEntries(REFUND_STATUSES.map((status) => [status, 0])) as StatusCounts;
  counts.all = 0;

  for (const row of rows) {
    counts[row.status] = row.total;
    counts.all += row.total;
  }

  return counts;
}

export type DashboardStats = {
  openCount: number;
  openCents: number;
  approvedCount: number;
  approvedCents: number;
  refundedCount30d: number;
  refundedCents30d: number;
  avgResolutionMs: number | null;
  resolvedCount: number;
  totalCount: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const since = new Date(Date.now() - 30 * DAY);

  const [open, approved, refunded, resolution, totals] = await Promise.all([
    db
      .select({ total: count(), cents: sum(refundRequests.amountCents) })
      .from(refundRequests)
      .where(inArray(refundRequests.status, [...OPEN_STATUSES])),
    db
      .select({ total: count(), cents: sum(refundRequests.amountCents) })
      .from(refundRequests)
      .where(eq(refundRequests.status, "approved")),
    db
      .select({ total: count(), cents: sum(refundRequests.amountCents) })
      .from(refundRequests)
      .where(and(eq(refundRequests.status, "refunded"), gte(refundRequests.updatedAt, since))),
    db
      .select({
        avgMs: sql<number | null>`avg(${refundRequests.updatedAt} - ${refundRequests.createdAt})`,
        total: count(),
      })
      .from(refundRequests)
      .where(inArray(refundRequests.status, [...TERMINAL_STATUSES])),
    db.select({ total: count() }).from(refundRequests),
  ]);

  return {
    openCount: open[0]?.total ?? 0,
    openCents: Number(open[0]?.cents ?? 0),
    approvedCount: approved[0]?.total ?? 0,
    approvedCents: Number(approved[0]?.cents ?? 0),
    refundedCount30d: refunded[0]?.total ?? 0,
    refundedCents30d: Number(refunded[0]?.cents ?? 0),
    avgResolutionMs: resolution[0]?.avgMs != null ? Number(resolution[0].avgMs) : null,
    resolvedCount: resolution[0]?.total ?? 0,
    totalCount: totals[0]?.total ?? 0,
  };
}

export type DailyVolume = { date: string; total: number; cents: number };

export async function getDailyVolume(days = 14): Promise<DailyVolume[]> {
  const since = new Date(Date.now() - (days - 1) * DAY);

  const rows = await db
    .select({
      date: sql<string>`date(${refundRequests.createdAt} / 1000, 'unixepoch')`,
      total: count(),
      cents: sum(refundRequests.amountCents),
    })
    .from(refundRequests)
    .where(gte(refundRequests.createdAt, since))
    .groupBy(sql`date(${refundRequests.createdAt} / 1000, 'unixepoch')`);

  const byDate = new Map(rows.map((row) => [row.date, row]));

  return Array.from({ length: days }, (_, index) => {
    const day = new Date(since.getTime() + index * DAY).toISOString().slice(0, 10);
    const row = byDate.get(day);
    return { date: day, total: row?.total ?? 0, cents: Number(row?.cents ?? 0) };
  });
}

export async function getOldestOpen(limit = 5) {
  return db
    .select()
    .from(refundRequests)
    .where(inArray(refundRequests.status, [...OPEN_STATUSES]))
    .orderBy(refundRequests.createdAt)
    .limit(limit);
}

export async function getRecentActivity(limit = 6) {
  return db.select().from(refundRequests).orderBy(desc(refundRequests.updatedAt)).limit(limit);
}

// $ escapes the like wildcards so a customer typing % matches literally
function searchClause(term: string) {
  const pattern = `%${term.replace(/[%_$]/g, (char) => `$${char}`)}%`;

  return or(
    sql`${refundRequests.customerName} like ${pattern} escape '$'`,
    sql`${refundRequests.customerEmail} like ${pattern} escape '$'`,
    sql`${refundRequests.reference} like ${pattern} escape '$'`,
  );
}

const ORDER_BY = {
  newest: desc(refundRequests.createdAt),
  oldest: refundRequests.createdAt,
  updated: desc(refundRequests.updatedAt),
  amount_desc: desc(refundRequests.amountCents),
  amount_asc: refundRequests.amountCents,
} as const;

export async function listRefunds(query: RefundQuery) {
  const where = and(
    query.status ? eq(refundRequests.status, query.status) : undefined,
    query.q ? searchClause(query.q) : undefined,
  );

  const [rows, totals] = await Promise.all([
    db
      .select()
      .from(refundRequests)
      .where(where)
      .orderBy(ORDER_BY[query.sort], desc(refundRequests.id))
      .limit(PER_PAGE)
      .offset((query.page - 1) * PER_PAGE),
    db.select({ total: count() }).from(refundRequests).where(where),
  ]);

  const total = totals[0]?.total ?? 0;

  return { rows, total, pageCount: Math.max(1, Math.ceil(total / PER_PAGE)) };
}

export async function getRefund(id: string) {
  const [request] = await db.select().from(refundRequests).where(eq(refundRequests.id, id)).limit(1);
  if (!request) return null;

  const events = await db
    .select()
    .from(refundStatusEvents)
    .where(eq(refundStatusEvents.refundId, id))
    .orderBy(refundStatusEvents.createdAt);

  return { request, events };
}
