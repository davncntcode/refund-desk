import { describe, expect, it } from "vitest";
import { toCsv } from "./csv";

describe("toCsv", () => {
  it("joins plain cells", () => {
    expect(toCsv([["a", "b"], [1, 2]])).toBe("a,b\r\n1,2");
  });

  it("quotes a cell containing a comma", () => {
    expect(toCsv([["Charged twice, twice over"]])).toBe('"Charged twice, twice over"');
  });

  it("doubles quotes inside a quoted cell", () => {
    expect(toCsv([['He said "lost in transit"']])).toBe('"He said ""lost in transit"""');
  });

  it("quotes a cell containing a newline", () => {
    expect(toCsv([["line one\nline two"]])).toBe('"line one\nline two"');
  });

  it("writes nothing for null and undefined", () => {
    expect(toCsv([[null, undefined, ""]])).toBe(",,");
  });

  it("neutralises a cell a spreadsheet would run as a formula", () => {
    expect(toCsv([["=1+1"]])).toBe("'=1+1");
    expect(toCsv([["+44 7700 900000"]])).toBe("'+44 7700 900000");
    expect(toCsv([["@handle"]])).toBe("'@handle");
    expect(toCsv([["-5"]])).toBe("'-5");
  });

  it("still quotes a formula cell that also holds a comma", () => {
    expect(toCsv([["=SUM(A1,A2)"]])).toBe("\"'=SUM(A1,A2)\"");
  });
});
