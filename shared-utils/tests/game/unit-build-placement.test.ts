import { BUILDING_ZONE_IDS } from "@infinity/shared-config";
import { describe, expect, it } from "vitest";
import {
  buildPlacementAnchorToBuildingZoneId,
  buildPlacementToNormalizedFootprint,
  buildPlacementToPosition,
  buildPositionFromBuildingZoneId,
  buildingZoneIdToBuildPlacementAnchor,
  getBuildFootprintCells,
  isBuildPlacementValid,
  isPointInBuildFootprint,
  normalizedPointToBuildPlacementAnchor,
  resolveBuildTargetPosition,
} from "../../src/game/unit-build-placement";

describe("unit-build-placement", () => {
  describe("getBuildFootprintCells", () => {
    it("maps unit sizes to zone spans", () => {
      expect(getBuildFootprintCells("small")).toBe(1);
      expect(getBuildFootprintCells("medium")).toBe(2);
      expect(getBuildFootprintCells("large")).toBe(3);
    });

    it("fits the largest footprint within the central grid", () => {
      expect(getBuildFootprintCells("large")).toBeLessThanOrEqual(3);
    });
  });

  describe("normalizedPointToBuildPlacementAnchor", () => {
    it("snaps a click at the hex center to central-1-1 for a small footprint", () => {
      expect(normalizedPointToBuildPlacementAnchor({ x: 0.5, y: 0.5 }, 1)).toEqual({
        kind: "central",
        col: 1,
        row: 1,
      });
    });

    it("snaps a click near the right side zone for a small footprint", () => {
      expect(normalizedPointToBuildPlacementAnchor({ x: 0.98, y: 0.5 }, 1)).toEqual({
        kind: "side",
        side: "right",
      });
    });

    it("centers a medium footprint on the nearest 2-zone block", () => {
      expect(normalizedPointToBuildPlacementAnchor({ x: 0.42, y: 0.5 }, 2)).toEqual({
        kind: "central",
        col: 0,
        row: 1,
        orientation: "horizontal",
      });
    });

    it("centers a large footprint on the nearest full row or column", () => {
      expect(normalizedPointToBuildPlacementAnchor({ x: 0.5, y: 0.5 }, 3)).toEqual({
        kind: "central",
        col: 0,
        row: 1,
        orientation: "horizontal",
      });
    });
  });

  describe("buildPlacementToNormalizedFootprint", () => {
    it("applies rotation for side zones", () => {
      const footprint = buildPlacementToNormalizedFootprint(
        { kind: "side", side: "right" },
        1,
      );

      expect(footprint.rotationDeg).toBe(90);
      expect(footprint.center).toEqual({ x: 1, y: 0.5 });
    });

    it("spans two central zones horizontally for medium footprints", () => {
      const footprint = buildPlacementToNormalizedFootprint(
        { kind: "central", col: 0, row: 1, orientation: "horizontal" },
        2,
      );

      expect(footprint.width).toBeCloseTo(0.35);
      expect(footprint.height).toBeCloseTo(0.175);
      expect(footprint.center).toEqual({ x: 0.4125, y: 0.5 });
    });
  });

  describe("isBuildPlacementValid", () => {
    it("accepts a medium footprint centered in the hex", () => {
      expect(
        isBuildPlacementValid(
          { kind: "central", col: 0, row: 1, orientation: "horizontal" },
          2,
        ),
      ).toBe(true);
    });

    it("accepts a large footprint centered in the hex", () => {
      expect(
        isBuildPlacementValid(
          { kind: "central", col: 0, row: 1, orientation: "horizontal" },
          3,
        ),
      ).toBe(true);
    });

    it("accepts side zones for small footprints", () => {
      for (const side of ["upper-right", "right", "lower-right", "lower-left", "left", "upper-left"] as const) {
        expect(isBuildPlacementValid({ kind: "side", side }, 1)).toBe(true);
      }
    });

    it("rejects side zones for multi-zone footprints", () => {
      expect(isBuildPlacementValid({ kind: "side", side: "right" }, 2)).toBe(false);
    });
  });

  describe("resolveBuildTargetPosition", () => {
    it("returns the footprint center for a valid click", () => {
      const anchor = normalizedPointToBuildPlacementAnchor({ x: 0.5, y: 0.5 }, 1);
      const position = resolveBuildTargetPosition({ x: 0.5, y: 0.5 }, 1);

      expect(position).toEqual(buildPlacementToPosition(anchor, 1));
    });

    it("returns a valid position for a large unit at the hex center", () => {
      const position = resolveBuildTargetPosition({ x: 0.5, y: 0.5 }, 3);

      expect(position).toEqual(
        buildPlacementToPosition(
          { kind: "central", col: 0, row: 1, orientation: "horizontal" },
          3,
        ),
      );
    });

    it("returns a valid position for a side zone click", () => {
      const position = resolveBuildTargetPosition({ x: 0.98, y: 0.5 }, 1);

      expect(position).toEqual(buildPlacementToPosition({ kind: "side", side: "right" }, 1));
    });
  });

  describe("buildingZoneId helpers", () => {
    it("maps central zone ids to anchors", () => {
      expect(buildingZoneIdToBuildPlacementAnchor("central-1-1")).toEqual({
        kind: "central",
        col: 1,
        row: 1,
      });
    });

    it("maps side zone ids to anchors", () => {
      expect(buildingZoneIdToBuildPlacementAnchor("right")).toEqual({
        kind: "side",
        side: "right",
      });
    });

    it("round-trips all zone ids through anchor conversion", () => {
      for (const zoneId of BUILDING_ZONE_IDS) {
        const anchor = buildingZoneIdToBuildPlacementAnchor(zoneId);
        expect(buildPlacementAnchorToBuildingZoneId(anchor)).toBe(zoneId);
      }
    });

    it("derives spawn position from zone id", () => {
      expect(buildPositionFromBuildingZoneId("central-1-1")).toEqual({ x: 0.5, y: 0.5 });
      expect(buildPositionFromBuildingZoneId("right")).toEqual({ x: 1, y: 0.5 });
    });
  });

  describe("isPointInBuildFootprint", () => {
    it("detects points inside a central building footprint", () => {
      const position = buildPlacementToPosition(
        { kind: "central", col: 1, row: 1 },
        1,
      );

      expect(isPointInBuildFootprint(position, position, 1)).toBe(true);
      expect(isPointInBuildFootprint({ x: 0.1, y: 0.1 }, position, 1)).toBe(false);
    });
  });
});
