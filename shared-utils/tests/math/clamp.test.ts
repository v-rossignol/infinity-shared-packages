import { describe, expect, it } from "vitest";
import { clamp } from "../../src/math";

describe("clamp", () => {
  it("returns the value when it is within bounds", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("returns the minimum when the value is below bounds", () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it("returns the maximum when the value is above bounds", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});
