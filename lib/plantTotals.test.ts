import { describe, expect, it } from "vitest";
import {
  calculateTotalCost,
  formatCurrency,
  parseAmount,
  parsePrice,
} from "./plantTotals";

describe("parsePrice", () => {
  it("parses formatted and plain prices", () => {
    expect(parsePrice("$250.00")).toBe(250);
    expect(parsePrice("$2,500.50")).toBe(2500.5);
    expect(parsePrice("99")).toBe(99);
  });

  it("returns null for empty or invalid values", () => {
    expect(parsePrice("")).toBeNull();
    expect(parsePrice("free")).toBeNull();
    expect(parsePrice("1.2.3")).toBeNull();
  });
});

describe("parseAmount", () => {
  it("parses numeric amounts", () => {
    expect(parseAmount("2")).toBe(2);
    expect(parseAmount(" 3 ")).toBe(3);
  });

  it("returns null for empty, invalid, or negative values", () => {
    expect(parseAmount("")).toBeNull();
    expect(parseAmount("a few")).toBeNull();
    expect(parseAmount("-1")).toBeNull();
  });
});

describe("calculateTotalCost", () => {
  it("sums price × amount", () => {
    expect(
      calculateTotalCost([
        { price: "$250.00", amount: "1" },
        { price: "$150.00", amount: "2" },
      ])
    ).toBe(550);
  });

  it("skips plants with an invalid price or amount", () => {
    expect(
      calculateTotalCost([
        { price: "$100.00", amount: "2" },
        { price: "", amount: "3" },
        { price: "$50.00", amount: "many" },
      ])
    ).toBe(200);
  });

  it("returns 0 for an empty list", () => {
    expect(calculateTotalCost([])).toBe(0);
  });
});

describe("formatCurrency", () => {
  it("formats as USD", () => {
    expect(formatCurrency(2500)).toBe("$2,500.00");
  });
});
