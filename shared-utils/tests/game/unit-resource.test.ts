import { describe, expect, it } from "vitest";
import {
  computeExtractionYield,
  computeExtractionYieldPerTick,
} from "../../src/game/unit-resource";

describe("computeExtractionYieldPerTick", () => {
  it("multiplies hex resource abundance by unit extraction speed", () => {
    expect(computeExtractionYieldPerTick(10, 5)).toBe(50);
  });

  it("returns zero when abundance is zero", () => {
    expect(computeExtractionYieldPerTick(0, 5)).toBe(0);
  });

  it("floors fractional single-tick yields", () => {
    expect(computeExtractionYieldPerTick(5, 0.5)).toBe(2);
  });
});

describe("computeExtractionYield", () => {
  it("accumulates over ticks before flooring", () => {
    expect(computeExtractionYield(2.5, 1, 2)).toBe(5);
  });

  it("floors the accumulated total", () => {
    expect(computeExtractionYield(5, 0.5, 3)).toBe(7);
  });

  it("returns zero for non-positive inputs", () => {
    expect(computeExtractionYield(10, 5, 0)).toBe(0);
    expect(computeExtractionYield(0, 5, 3)).toBe(0);
    expect(computeExtractionYield(10, 0, 3)).toBe(0);
  });
});
