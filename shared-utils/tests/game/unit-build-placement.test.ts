import { PLANET_HEX_BUILD_GRID_DIVISIONS } from "@infinity/shared-config";
import { describe, expect, it } from "vitest";
import {
  buildGridAnchorToPosition,
  getBuildFootprintCells,
  isBuildFootprintInsideHex,
  normalizedPointToBuildGridAnchor,
  resolveBuildTargetPosition,
} from "../../src/game/unit-build-placement";

describe("unit-build-placement", () => {
  describe("getBuildFootprintCells", () => {
    it("maps unit sizes to grid cell spans", () => {
      expect(getBuildFootprintCells("small")).toBe(1);
      expect(getBuildFootprintCells("medium")).toBe(2);
      expect(getBuildFootprintCells("large")).toBe(3);
    });

    it("fits the largest footprint within the build grid", () => {
      expect(getBuildFootprintCells("large")).toBeLessThanOrEqual(
        PLANET_HEX_BUILD_GRID_DIVISIONS,
      );
    });
  });

  describe("normalizedPointToBuildGridAnchor", () => {
    it("snaps a click to the containing cell for a small footprint", () => {
      expect(normalizedPointToBuildGridAnchor({ x: 0.5, y: 0.5 }, 1)).toEqual({
        col: 3,
        row: 3,
      });
    });

    it("centers a medium footprint on the clicked cell", () => {
      expect(normalizedPointToBuildGridAnchor({ x: 0.5, y: 0.5 }, 2)).toEqual({
        col: 2,
        row: 2,
      });
    });

    it("centers a large 3×3 footprint on the clicked cell", () => {
      expect(normalizedPointToBuildGridAnchor({ x: 0.5, y: 0.5 }, 3)).toEqual({
        col: 2,
        row: 2,
      });
    });
  });

  describe("isBuildFootprintInsideHex", () => {
    it("accepts a medium footprint centered in the hex", () => {
      expect(isBuildFootprintInsideHex({ col: 2, row: 2 }, 2)).toBe(true);
    });

    it("accepts a large 3×3 footprint centered in the hex", () => {
      expect(isBuildFootprintInsideHex({ col: 2, row: 2 }, 3)).toBe(true);
    });

    it("rejects a footprint that extends outside the hex polygon", () => {
      expect(isBuildFootprintInsideHex({ col: 0, row: 0 }, 2)).toBe(false);
    });
  });

  describe("resolveBuildTargetPosition", () => {
    it("returns the footprint center for a valid click", () => {
      const anchor = normalizedPointToBuildGridAnchor({ x: 0.5, y: 0.5 }, 1);
      const position = resolveBuildTargetPosition({ x: 0.5, y: 0.5 }, 1);

      expect(position).toEqual(buildGridAnchorToPosition(anchor, 1));
    });

    it("returns a valid position for a large unit at the hex center", () => {
      const position = resolveBuildTargetPosition({ x: 0.5, y: 0.5 }, 3);

      expect(position).toEqual(buildGridAnchorToPosition({ col: 2, row: 2 }, 3));
    });

    it("returns null when the footprint would leave the hex", () => {
      expect(resolveBuildTargetPosition({ x: 0.05, y: 0.05 }, 2)).toBeNull();
    });
  });
});
