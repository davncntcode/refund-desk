import { describe, expect, it } from "vitest";
import { REFUND_STATUSES, type RefundStatus } from "./domain";
import {
  canTransition,
  isRefundStatus,
  nextStatuses,
  requiresNote,
  STATUS_META,
  STATUS_TRANSITIONS,
  TERMINAL_STATUSES,
} from "./status";

const LEGAL: [RefundStatus, RefundStatus][] = [
  ["pending", "in_review"],
  ["pending", "rejected"],
  ["in_review", "approved"],
  ["in_review", "rejected"],
  ["approved", "refunded"],
];

describe("status transitions", () => {
  it.each(LEGAL)("allows %s to %s", (from, to) => {
    expect(canTransition(from, to)).toBe(true);
  });

  it("rejects every pair that is not explicitly allowed", () => {
    const legal = new Set(LEGAL.map(([from, to]) => `${from}>${to}`));

    for (const from of REFUND_STATUSES) {
      for (const to of REFUND_STATUSES) {
        if (legal.has(`${from}>${to}`)) continue;
        expect(canTransition(from, to)).toBe(false);
      }
    }
  });

  it("never allows a status to move to itself", () => {
    for (const status of REFUND_STATUSES) {
      expect(canTransition(status, status)).toBe(false);
    }
  });

  it("skips the review step, so pending cannot be approved or refunded directly", () => {
    expect(canTransition("pending", "approved")).toBe(false);
    expect(canTransition("pending", "refunded")).toBe(false);
  });

  it("cannot walk back from a decision", () => {
    expect(canTransition("approved", "in_review")).toBe(false);
    expect(canTransition("rejected", "pending")).toBe(false);
    expect(canTransition("refunded", "approved")).toBe(false);
  });

  it("leaves terminal statuses with nowhere to go", () => {
    for (const status of TERMINAL_STATUSES) {
      expect(nextStatuses(status)).toHaveLength(0);
    }
  });

  it("only ever offers reachable statuses", () => {
    for (const status of REFUND_STATUSES) {
      for (const next of nextStatuses(status)) {
        expect(REFUND_STATUSES).toContain(next);
      }
    }
  });
});

describe("notes", () => {
  it("requires one when rejecting", () => {
    expect(requiresNote("rejected")).toBe(true);
  });

  it("leaves the rest optional", () => {
    for (const status of REFUND_STATUSES.filter((value) => value !== "rejected")) {
      expect(requiresNote(status)).toBe(false);
    }
  });
});

describe("presentation and guards", () => {
  it("describes every status", () => {
    for (const status of REFUND_STATUSES) {
      expect(STATUS_META[status].label).toBeTruthy();
      expect(STATUS_META[status].tint).toMatch(/^bg-\S+ text-\S+$/);
    }
  });

  it("maps a transition list for every status", () => {
    expect(Object.keys(STATUS_TRANSITIONS).sort()).toEqual([...REFUND_STATUSES].sort());
  });

  it("recognises only real statuses", () => {
    expect(isRefundStatus("pending")).toBe(true);
    expect(isRefundStatus("Pending")).toBe(false);
    expect(isRefundStatus("paid")).toBe(false);
    expect(isRefundStatus(undefined)).toBe(false);
  });
});
