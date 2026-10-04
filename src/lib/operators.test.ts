import { describe, expect, it } from "vitest";

import { OPERATORS, formatRule, readRules, writeRules } from "@/lib/operators";

describe("operators", () => {
  it("gives every operator a distinct symbol", () => {
    const symbols = OPERATORS.map((operator) => operator.symbol);

    expect(new Set(symbols).size).toBe(symbols.length);
    expect(symbols).toContain("≠");
    expect(symbols).toContain("∃");
  });

  it("hides the comparison value for existence checks", () => {
    expect(
      formatRule({ left: "owner", operator: "exist", right: "ignored" }),
    ).toBe("owner ∃");
    expect(
      formatRule({ left: "amount", operator: "greater", right: "1000" }),
    ).toBe("amount > 1000");
  });

  it("drops rules that are not comparisons", () => {
    const stored = writeRules([
      { left: "role", operator: "equal", right: "owner" },
    ]);

    expect(readRules(stored)).toEqual([
      { left: "role", operator: "equal", right: "owner" },
    ]);
    expect(readRules('[{"left":"role","operator":"nope"}]')).toEqual([]);
    expect(readRules("not-json")).toEqual([]);
  });
});
