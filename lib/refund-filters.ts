import type { RefundStatus } from "./domain";
import { isRefundStatus } from "./status";

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "updated", label: "Recently updated" },
  { value: "amount_desc", label: "Largest amount" },
  { value: "amount_asc", label: "Smallest amount" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export const PER_PAGE = 15;

export type RefundQuery = {
  status?: RefundStatus;
  q: string;
  sort: SortKey;
  page: number;
};

export const DEFAULT_QUERY: RefundQuery = { q: "", sort: "newest", page: 1 };

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseRefundQuery(params: RawParams): RefundQuery {
  const status = first(params.status);
  const sort = first(params.sort);
  const page = Number(first(params.page));

  return {
    status: isRefundStatus(status) ? status : undefined,
    q: (first(params.q) ?? "").trim().slice(0, 120),
    sort: SORT_OPTIONS.some((option) => option.value === sort) ? (sort as SortKey) : "newest",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

export function buildRefundsHref(current: RefundQuery, patch: Partial<RefundQuery>) {
  const next = { ...current, ...patch };
  const params = new URLSearchParams();

  if (next.status) params.set("status", next.status);
  if (next.q) params.set("q", next.q);
  if (next.sort !== DEFAULT_QUERY.sort) params.set("sort", next.sort);
  if (next.page > 1) params.set("page", String(next.page));

  const query = params.toString();
  return query ? `/refunds?${query}` : "/refunds";
}

export function buildExportHref(current: RefundQuery) {
  const params = new URLSearchParams();

  if (current.status) params.set("status", current.status);
  if (current.q) params.set("q", current.q);
  if (current.sort !== DEFAULT_QUERY.sort) params.set("sort", current.sort);

  const query = params.toString();
  return query ? `/api/refunds/export?${query}` : "/api/refunds/export";
}
