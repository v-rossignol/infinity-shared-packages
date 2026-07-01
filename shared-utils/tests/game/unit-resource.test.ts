import { describe, expect, it } from "vitest";
import { computeExtractionYieldPerTick } from "../../src/game/unit-resource";

describe("computeExtractionYieldPerTick", () => {
  it("multiplies hex resource abundance by unit extraction speed", () => {
    expect(computeExtractionYieldPerTick(10, 5)).toBe(50);
  });

  it("returns zero when abundance is zero", () => {
    expect(computeExtractionYieldPerTick(0, 5)).toBe(0);
  });
});
