import { describe, expect, it } from "vitest";
import {
  centsToAmountInput,
  formatDuration,
  formatMoney,
  formatRelative,
  parseAmountToCents,
} from "./format";

describe("formatMoney", () => {
  it("renders cents as dollars", () => {
    expect(formatMoney(0)).toBe("$0.00");
    expect(formatMoney(12345)).toBe("$123.45");
    expect(formatMoney(100000000)).toBe("$1,000,000.00");
  });
});

describe("parseAmountToCents", () => {
  it("reads whole and fractional amounts", () => {
    expect(parseAmountToCents("129.99")).toBe(12999);
    expect(parseAmountToCents("129.9")).toBe(12990);
    expect(parseAmountToCents("129")).toBe(12900);
    expect(parseAmountToCents("0.05")).toBe(5);
  });

  it("tolerates the way people actually type money", () => {
    expect(parseAmountToCents(" 1,299.99 ")).toBe(129999);
    expect(parseAmountToCents("$45.00")).toBe(4500);
  });

  it("refuses anything it cannot represent exactly", () => {
    expect(parseAmountToCents("129.999")).toBeNull();
    expect(parseAmountToCents("-5")).toBeNull();
    expect(parseAmountToCents("abc")).toBeNull();
    expect(parseAmountToCents("")).toBeNull();
    expect(parseAmountToCents("1e3")).toBeNull();
    expect(parseAmountToCents("12.")).toBeNull();
  });

  it("round trips through the input format", () => {
    for (const cents of [1, 99, 100, 12345, 5000000]) {
      expect(parseAmountToCents(centsToAmountInput(cents))).toBe(cents);
    }
  });
});

describe("formatRelative", () => {
  const now = Date.UTC(2026, 7, 20, 12, 0, 0);

  it("describes recent moments", () => {
    expect(formatRelative(new Date(now - 30_000), now)).toBe("just now");
    expect(formatRelative(new Date(now - 5 * 60_000), now)).toBe("5m ago");
    expect(formatRelative(new Date(now - 3 * 3_600_000), now)).toBe("3h ago");
    expect(formatRelative(new Date(now - 4 * 86_400_000), now)).toBe("4d ago");
  });

  it("falls back to a date once it is a month old", () => {
    expect(formatRelative(new Date(Date.UTC(2026, 5, 10)), now)).toBe("Jun 10, 2026");
  });
});

describe("formatDuration", () => {
  it("picks a readable unit", () => {
    expect(formatDuration(45 * 60_000)).toBe("45 min");
    expect(formatDuration(5.5 * 3_600_000)).toBe("5.5 hrs");
    expect(formatDuration(3.2 * 86_400_000)).toBe("3.2 days");
  });
});
