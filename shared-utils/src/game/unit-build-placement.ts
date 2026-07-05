import {
  PLANET_HEX_BUILD_GRID_DIVISIONS,
  type UnitSize,
} from "@infinity/shared-config";
import { isPointInPlanetHexLocal } from "./hex-local";

export interface Vec2Local {
  x: number;
  y: number;
}

export interface BuildGridCell {
  col: number;
  row: number;
}

export interface NormalizedRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Side length in grid cells for a unit build footprint. */
export function getBuildFootprintCells(size: UnitSize): number {
  switch (size) {
    case "small":
      return 1;
    case "medium":
      return 2;
    case "large":
      return 3;
  }
}

function cellSize(divisions: number): number {
  return 1 / divisions;
}

/** Top-left grid anchor for a footprint that contains `point`. */
export function normalizedPointToBuildGridAnchor(
  point: Vec2Local,
  footprintCells: number,
  divisions: number = PLANET_HEX_BUILD_GRID_DIVISIONS,
): BuildGridCell {
  const cs = cellSize(divisions);
  const maxAnchor = divisions - footprintCells;
  const col = Math.floor(point.x / cs) - Math.floor(footprintCells / 2);
  const row = Math.floor(point.y / cs) - Math.floor(footprintCells / 2);

  return {
    col: Math.max(0, Math.min(maxAnchor, col)),
    row: Math.max(0, Math.min(maxAnchor, row)),
  };
}

export function buildGridAnchorToNormalizedRect(
  anchor: BuildGridCell,
  footprintCells: number,
  divisions: number = PLANET_HEX_BUILD_GRID_DIVISIONS,
): NormalizedRect {
  const cs = cellSize(divisions);

  return {
    left: anchor.col * cs,
    top: anchor.row * cs,
    width: footprintCells * cs,
    height: footprintCells * cs,
  };
}

/** Center of the footprint in normalized hex coordinates (API `targetPosition`). */
export function buildGridAnchorToPosition(
  anchor: BuildGridCell,
  footprintCells: number,
  divisions: number = PLANET_HEX_BUILD_GRID_DIVISIONS,
): Vec2Local {
  const rect = buildGridAnchorToNormalizedRect(anchor, footprintCells, divisions);

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export function isBuildFootprintInsideHex(
  anchor: BuildGridCell,
  footprintCells: number,
  divisions: number = PLANET_HEX_BUILD_GRID_DIVISIONS,
): boolean {
  const rect = buildGridAnchorToNormalizedRect(anchor, footprintCells, divisions);
  const corners: Vec2Local[] = [
    { x: rect.left, y: rect.top },
    { x: rect.left + rect.width, y: rect.top },
    { x: rect.left + rect.width, y: rect.top + rect.height },
    { x: rect.left, y: rect.top + rect.height },
  ];

  return corners.every((corner) => isPointInPlanetHexLocal(corner.x, corner.y));
}

/** Resolves a click inside the hex to a valid build position, or null if invalid. */
export function resolveBuildTargetPosition(
  point: Vec2Local,
  footprintCells: number,
  divisions: number = PLANET_HEX_BUILD_GRID_DIVISIONS,
): Vec2Local | null {
  const anchor = normalizedPointToBuildGridAnchor(point, footprintCells, divisions);

  if (!isBuildFootprintInsideHex(anchor, footprintCells, divisions)) {
    return null;
  }

  return buildGridAnchorToPosition(anchor, footprintCells, divisions);
}
