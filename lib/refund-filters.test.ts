import { describe, expect, it } from "vitest";
import { buildExportHref, buildRefundsHref, DEFAULT_QUERY, parseRefundQuery } from "./refund-filters";

describe("parseRefundQuery", () => {
  it("falls back to sensible defaults", () => {
    expect(parseRefundQuery({})).toEqual({ status: undefined, q: "", sort: "newest", page: 1 });
  });

  it("reads a full query", () => {
    expect(parseRefundQuery({ status: "approved", q: " kofi ", sort: "amount_desc", page: "4" })).toEqual(
      { status: "approved", q: "kofi", sort: "amount_desc", page: 4 },
    );
  });

  it("drops values it does not recognise", () => {
    const parsed = parseRefundQuery({ status: "paid", sort: "sideways", page: "0" });
    expect(parsed.status).toBeUndefined();
    expect(parsed.sort).toBe("newest");
    expect(parsed.page).toBe(1);
  });

  it("refuses a negative or fractional page", () => {
    expect(parseRefundQuery({ page: "-3" }).page).toBe(1);
    expect(parseRefundQuery({ page: "1.5" }).page).toBe(1);
    expect(parseRefundQuery({ page: "abc" }).page).toBe(1);
  });

  it("takes the first value when a param repeats", () => {
    expect(parseRefundQuery({ status: ["pending", "approved"] }).status).toBe("pending");
  });

  it("caps a very long search term", () => {
    expect(parseRefundQuery({ q: "x".repeat(400) }).q).toHaveLength(120);
  });
});

describe("buildRefundsHref", () => {
  it("omits defaults so the plain url stays clean", () => {
    expect(buildRefundsHref(DEFAULT_QUERY, {})).toBe("/refunds");
  });

  it("keeps the rest of the query when one part changes", () => {
    const current = { status: "pending" as const, q: "kofi", sort: "oldest" as const, page: 3 };
    expect(buildRefundsHref(current, { page: 4 })).toBe(
      "/refunds?status=pending&q=kofi&sort=oldest&page=4",
    );
  });

  it("clears the status filter when asked", () => {
    const current = { status: "pending" as const, q: "", sort: "newest" as const, page: 2 };
    expect(buildRefundsHref(current, { status: undefined, page: 1 })).toBe("/refunds");
  });

  it("encodes a search term with spaces", () => {
    expect(buildRefundsHref(DEFAULT_QUERY, { q: "amara okafor" })).toBe(
      "/refunds?q=amara+okafor",
    );
  });
});

describe("buildExportHref", () => {
  it("carries the filters but never the page", () => {
    const current = { status: "refunded" as const, q: "kofi", sort: "oldest" as const, page: 7 };
    expect(buildExportHref(current)).toBe(
      "/api/refunds/export?status=refunded&q=kofi&sort=oldest",
    );
  });

  it("exports everything when nothing is filtered", () => {
    expect(buildExportHref(DEFAULT_QUERY)).toBe("/api/refunds/export");
  });
});
