import { describe, expect, it } from "vitest";
import {
  addYieldToCargo,
  clampYieldToCargoCapacity,
  getCargoUsed,
  isCargoFull,
} from "../../src/game/unit-cargo";

describe("getCargoUsed", () => {
  it("sums all resource quantities", () => {
    expect(getCargoUsed({ wood: 3, stone: 7 })).toBe(10);
  });

  it("returns zero for empty cargo", () => {
    expect(getCargoUsed({})).toBe(0);
  });
});

describe("isCargoFull", () => {
  it("is true at or above capacity", () => {
    expect(isCargoFull({ wood: 10 }, 10)).toBe(true);
    expect(isCargoFull({ wood: 11 }, 10)).toBe(true);
  });

  it("is false below capacity", () => {
    expect(isCargoFull({ wood: 9 }, 10)).toBe(false);
  });
});

describe("clampYieldToCargoCapacity", () => {
  it("limits the yield to remaining free space", () => {
    expect(clampYieldToCargoCapacity(8, { wood: 5 }, 10)).toBe(5);
  });

  it("returns the full yield when it fits", () => {
    expect(clampYieldToCargoCapacity(3, { wood: 5 }, 10)).toBe(3);
  });

  it("returns zero when full or given non-positive yield", () => {
    expect(clampYieldToCargoCapacity(4, { wood: 10 }, 10)).toBe(0);
    expect(clampYieldToCargoCapacity(0, { wood: 1 }, 10)).toBe(0);
  });
});

describe("addYieldToCargo", () => {
  it("adds to an existing resource without mutating the input", () => {
    const cargo = { wood: 2 };
    const next = addYieldToCargo(cargo, "wood", 3);
    expect(next).toEqual({ wood: 5 });
    expect(cargo).toEqual({ wood: 2 });
  });

  it("introduces a new resource key", () => {
    expect(addYieldToCargo({ wood: 2 }, "stone", 4)).toEqual({
      wood: 2,
      stone: 4,
    });
  });

  it("is a no-op for non-positive amounts", () => {
    const cargo = { wood: 2 };
    expect(addYieldToCargo(cargo, "wood", 0)).toBe(cargo);
  });
});
