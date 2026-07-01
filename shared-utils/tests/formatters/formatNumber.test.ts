import { describe, expect, it } from "vitest";
import { formatNumber } from "../../src/formatters";

describe("formatNumber", () => {
  it("formats integers with grouping separators", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("formats decimals when requested", () => {
    expect(formatNumber(12.345, 2)).toBe("12.35");
  });
});
