import { describe, expect, it } from "vitest";
import { createRefundSchema, updateStatusSchema } from "./refund";

const valid = {
  customerName: "Amara Okafor",
  customerEmail: "amara.okafor@example.com",
  amount: "129.99",
  reasonCategory: "duplicate_charge" as const,
  reason: "Charged twice for the same order within a minute.",
};

function errorsFor(input: Record<string, unknown>) {
  const result = createRefundSchema.safeParse(input);
  if (result.success) return {};
  return Object.fromEntries(
    result.error.issues.map((issue) => [String(issue.path[0]), issue.message]),
  );
}

describe("createRefundSchema", () => {
  it("accepts a well formed request and returns cents", () => {
    const result = createRefundSchema.parse(valid);
    expect(result.amount).toBe(12999);
    expect(result.customerName).toBe("Amara Okafor");
  });

  it("normalises the email", () => {
    const result = createRefundSchema.parse({ ...valid, customerEmail: "  Amara@Example.COM " });
    expect(result.customerEmail).toBe("amara@example.com");
  });

  it("trims whitespace off text fields", () => {
    const result = createRefundSchema.parse({ ...valid, customerName: "  Amara Okafor  " });
    expect(result.customerName).toBe("Amara Okafor");
  });

  it("rejects an amount below the floor", () => {
    expect(errorsFor({ ...valid, amount: "0" }).amount).toMatch(/minimum/i);
    expect(errorsFor({ ...valid, amount: "0.99" }).amount).toMatch(/minimum/i);
  });

  it("rejects an amount above the ceiling", () => {
    expect(errorsFor({ ...valid, amount: "50000.01" }).amount).toMatch(/maximum/i);
  });

  it("rejects fractions of a cent", () => {
    expect(errorsFor({ ...valid, amount: "129.999" }).amount).toMatch(/plain amount/i);
  });

  it("rejects a negative amount", () => {
    expect(errorsFor({ ...valid, amount: "-20" }).amount).toMatch(/plain amount/i);
  });

  it("asks for an amount when the field is blank", () => {
    expect(errorsFor({ ...valid, amount: "" }).amount).toMatch(/enter the amount/i);
  });

  it("rejects a malformed email", () => {
    expect(errorsFor({ ...valid, customerEmail: "amara@" }).customerEmail).toMatch(/valid email/i);
    expect(errorsFor({ ...valid, customerEmail: "amara" }).customerEmail).toMatch(/valid email/i);
  });

  it("wants a real name", () => {
    expect(errorsFor({ ...valid, customerName: "A" }).customerName).toMatch(/name/i);
  });

  it("wants a sentence of context", () => {
    expect(errorsFor({ ...valid, reason: "twice" }).reason).toMatch(/sentence/i);
  });

  it("caps the reason length", () => {
    expect(errorsFor({ ...valid, reason: "x".repeat(1001) }).reason).toMatch(/1000/);
  });

  it("rejects a category it does not know", () => {
    expect(errorsFor({ ...valid, reasonCategory: "vibes" }).reasonCategory).toMatch(/category/i);
  });
});

describe("updateStatusSchema", () => {
  it("accepts a status change without a note", () => {
    const result = updateStatusSchema.parse({ id: "abc123", status: "in_review", note: "" });
    expect(result.status).toBe("in_review");
    expect(result.note).toBe("");
  });

  it("defaults the note to empty when absent", () => {
    const result = updateStatusSchema.parse({ id: "abc123", status: "approved" });
    expect(result.note).toBe("");
  });

  it("insists on a reason when rejecting", () => {
    const result = updateStatusSchema.safeParse({ id: "abc123", status: "rejected", note: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["note"]);
    expect(result.error?.issues[0].message).toMatch(/why/i);
  });

  it("rejects a note that is too short to mean anything", () => {
    const result = updateStatusSchema.safeParse({ id: "abc123", status: "rejected", note: "no" });
    expect(result.success).toBe(false);
  });

  it("accepts a rejection with a reason", () => {
    const result = updateStatusSchema.parse({
      id: "abc123",
      status: "rejected",
      note: "Outside the 30 day window.",
    });
    expect(result.note).toBe("Outside the 30 day window.");
  });

  it("caps the note length", () => {
    const result = updateStatusSchema.safeParse({
      id: "abc123",
      status: "approved",
      note: "x".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("needs an id", () => {
    expect(updateStatusSchema.safeParse({ id: "", status: "approved" }).success).toBe(false);
  });
});
