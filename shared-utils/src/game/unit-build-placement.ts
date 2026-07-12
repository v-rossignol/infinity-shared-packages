import {
  BUILDING_ZONES,
  BUILDING_ZONES_BY_ID,
  BUILDING_ZONE_SIDES,
  CENTRAL_BUILDING_ZONES_BY_ID,
  HEX_BUILDING_CENTRAL_GRID_SIZE,
  HEX_SQUARE_SIZE,
  type BuildingZone,
  type BuildingZoneId,
  type BuildingZoneSide,
  type CentralBuildingZoneId,
  type UnitSize,
} from "@infinity/shared-config";
import { isPointInPlanetHexLocal } from "./hex-local";

export interface Vec2Local {
  x: number;
  y: number;
}

export type BuildPlacementOrientation = "horizontal" | "vertical";

export interface BuildPlacementAnchor {
  kind: "central" | "side";
  col?: 0 | 1 | 2;
  row?: 0 | 1 | 2;
  side?: BuildingZoneSide;
  orientation?: BuildPlacementOrientation;
}

export interface NormalizedFootprint {
  left: number;
  top: number;
  width: number;
  height: number;
  rotationDeg: number;
  center: Vec2Local;
}

const HALF_SQUARE = HEX_SQUARE_SIZE / 2;
const CENTRAL_ORIGIN = 0.325;

type CentralCoord = 0 | 1 | 2;

function distanceSquared(a: Vec2Local, b: Vec2Local): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function rotatePointAroundCenter(
  point: Vec2Local,
  center: Vec2Local,
  rotationDeg: number,
): Vec2Local {
  if (rotationDeg === 0) {
    return point;
  }

  const radians = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const dx = point.x - center.x;
  const dy = point.y - center.y;

  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
}

function footprintCorners(footprint: NormalizedFootprint): Vec2Local[] {
  const { left, top, width, height, center, rotationDeg } = footprint;
  const localCorners: Vec2Local[] = [
    { x: left, y: top },
    { x: left + width, y: top },
    { x: left + width, y: top + height },
    { x: left, y: top + height },
  ];

  return localCorners.map((corner) => rotatePointAroundCenter(corner, center, rotationDeg));
}

function centralAnchor(
  col: CentralCoord,
  row: CentralCoord,
  orientation?: BuildPlacementOrientation,
): BuildPlacementAnchor {
  return orientation == null
    ? { kind: "central", col, row }
    : { kind: "central", col, row, orientation };
}

function sideAnchor(side: BuildingZoneSide): BuildPlacementAnchor {
  return { kind: "side", side };
}

function centralZoneId(col: CentralCoord, row: CentralCoord): CentralBuildingZoneId {
  return `central-${col}-${row}` as CentralBuildingZoneId;
}

function zoneToAnchor(zone: BuildingZone): BuildPlacementAnchor {
  if (zone.kind === "side" && zone.side != null) {
    return sideAnchor(zone.side);
  }

  return centralAnchor(zone.col!, zone.row!);
}

function enumerateSmallAnchors(): BuildPlacementAnchor[] {
  return BUILDING_ZONES.map(zoneToAnchor);
}

function enumerateMediumAnchors(): BuildPlacementAnchor[] {
  const anchors: BuildPlacementAnchor[] = [];

  for (let row = 0; row < HEX_BUILDING_CENTRAL_GRID_SIZE; row += 1) {
    for (let col = 0; col < HEX_BUILDING_CENTRAL_GRID_SIZE - 1; col += 1) {
      anchors.push(
        centralAnchor(col as CentralCoord, row as CentralCoord, "horizontal"),
      );
    }
  }

  for (let col = 0; col < HEX_BUILDING_CENTRAL_GRID_SIZE; col += 1) {
    for (let row = 0; row < HEX_BUILDING_CENTRAL_GRID_SIZE - 1; row += 1) {
      anchors.push(
        centralAnchor(col as CentralCoord, row as CentralCoord, "vertical"),
      );
    }
  }

  return anchors;
}

function enumerateLargeAnchors(): BuildPlacementAnchor[] {
  const anchors: BuildPlacementAnchor[] = [];

  for (let row = 0; row < HEX_BUILDING_CENTRAL_GRID_SIZE; row += 1) {
    anchors.push(centralAnchor(0, row as CentralCoord, "horizontal"));
  }

  for (let col = 0; col < HEX_BUILDING_CENTRAL_GRID_SIZE; col += 1) {
    anchors.push(centralAnchor(col as CentralCoord, 0, "vertical"));
  }

  return anchors;
}

function enumerateAnchors(footprintCells: number): BuildPlacementAnchor[] {
  switch (footprintCells) {
    case 1:
      return enumerateSmallAnchors();
    case 2:
      return enumerateMediumAnchors();
    case 3:
      return enumerateLargeAnchors();
    default:
      return [];
  }
}

function nearestAnchor(point: Vec2Local, footprintCells: number): BuildPlacementAnchor {
  const anchors = enumerateAnchors(footprintCells);
  let best = anchors[0];
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const anchor of anchors) {
    const center = buildPlacementToPosition(anchor, footprintCells);
    const distance = distanceSquared(point, center);

    if (distance < bestDistance) {
      best = anchor;
      bestDistance = distance;
    }
  }

  return best;
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

/** Snaps a click to the nearest valid building-zone anchor. */
export function normalizedPointToBuildPlacementAnchor(
  point: Vec2Local,
  footprintCells: number,
): BuildPlacementAnchor {
  return nearestAnchor(point, footprintCells);
}

export function buildPlacementToNormalizedFootprint(
  anchor: BuildPlacementAnchor,
  footprintCells: number,
): NormalizedFootprint {
  if (anchor.kind === "side") {
    const zone = BUILDING_ZONES_BY_ID[anchor.side!];

    return {
      left: zone.center.x - HALF_SQUARE,
      top: zone.center.y - HALF_SQUARE,
      width: HEX_SQUARE_SIZE,
      height: HEX_SQUARE_SIZE,
      rotationDeg: zone.rotationDeg,
      center: { ...zone.center },
    };
  }

  const col = anchor.col!;
  const row = anchor.row!;
  const left = CENTRAL_ORIGIN + col * HEX_SQUARE_SIZE - HALF_SQUARE;
  const top = CENTRAL_ORIGIN + row * HEX_SQUARE_SIZE - HALF_SQUARE;

  if (footprintCells === 1 || anchor.orientation == null) {
    const zone = CENTRAL_BUILDING_ZONES_BY_ID[centralZoneId(col, row)];

    return {
      left: zone.center.x - HALF_SQUARE,
      top: zone.center.y - HALF_SQUARE,
      width: HEX_SQUARE_SIZE,
      height: HEX_SQUARE_SIZE,
      rotationDeg: zone.rotationDeg,
      center: { ...zone.center },
    };
  }

  if (anchor.orientation === "horizontal") {
    return {
      left,
      top,
      width: footprintCells * HEX_SQUARE_SIZE,
      height: HEX_SQUARE_SIZE,
      rotationDeg: 0,
      center: {
        x: left + (footprintCells * HEX_SQUARE_SIZE) / 2,
        y: top + HEX_SQUARE_SIZE / 2,
      },
    };
  }

  return {
    left,
    top,
    width: HEX_SQUARE_SIZE,
    height: footprintCells * HEX_SQUARE_SIZE,
    rotationDeg: 0,
    center: {
      x: left + HEX_SQUARE_SIZE / 2,
      y: top + (footprintCells * HEX_SQUARE_SIZE) / 2,
    },
  };
}

/** Maps a building zone id to its placement anchor (footprint 1). */
export function buildingZoneIdToBuildPlacementAnchor(
  zoneId: BuildingZoneId,
): BuildPlacementAnchor {
  const zone = BUILDING_ZONES_BY_ID[zoneId];
  return zoneToAnchor(zone);
}

/** Maps a single-zone placement anchor to its building zone id. */
export function buildPlacementAnchorToBuildingZoneId(
  anchor: BuildPlacementAnchor,
): BuildingZoneId {
  if (anchor.kind === "side") {
    return anchor.side!;
  }

  return centralZoneId(anchor.col!, anchor.row!);
}

/** Center of a single-zone build in normalized hex coordinates (spawn position). */
export function buildPositionFromBuildingZoneId(zoneId: BuildingZoneId): Vec2Local {
  return buildPlacementToPosition(buildingZoneIdToBuildPlacementAnchor(zoneId), 1);
}

/** Center of the footprint in normalized hex coordinates. */
export function buildPlacementToPosition(
  anchor: BuildPlacementAnchor,
  footprintCells: number,
): Vec2Local {
  return buildPlacementToNormalizedFootprint(anchor, footprintCells).center;
}

export function isBuildPlacementValid(
  anchor: BuildPlacementAnchor,
  footprintCells: number,
): boolean {
  if (anchor.kind === "side") {
    return footprintCells === 1 && BUILDING_ZONE_SIDES.includes(anchor.side!);
  }

  const footprint = buildPlacementToNormalizedFootprint(anchor, footprintCells);

  return footprintCorners(footprint).every((corner) =>
    isPointInPlanetHexLocal(corner.x, corner.y),
  );
}

/** Resolves a stored build position back to the nearest matching anchor. */
export function positionToBuildPlacementAnchor(
  position: Vec2Local,
  footprintCells: number,
): BuildPlacementAnchor {
  return nearestAnchor(position, footprintCells);
}

function pointInConvexQuad(point: Vec2Local, corners: Vec2Local[]): boolean {
  let hasPositive = false;
  let hasNegative = false;

  for (let index = 0; index < corners.length; index += 1) {
    const current = corners[index];
    const next = corners[(index + 1) % corners.length];
    const cross =
      (next.x - current.x) * (point.y - current.y) -
      (next.y - current.y) * (point.x - current.x);

    if (cross > 0) {
      hasPositive = true;
    } else if (cross < 0) {
      hasNegative = true;
    }

    if (hasPositive && hasNegative) {
      return false;
    }
  }

  return true;
}

export function isPointInBuildFootprint(
  point: Vec2Local,
  position: Vec2Local,
  footprintCells: number,
): boolean {
  const anchor = positionToBuildPlacementAnchor(position, footprintCells);
  const footprint = buildPlacementToNormalizedFootprint(anchor, footprintCells);

  return pointInConvexQuad(point, footprintCorners(footprint));
}

/** Resolves a click inside the hex to a valid build position, or null if invalid. */
export function resolveBuildTargetPosition(
  point: Vec2Local,
  footprintCells: number,
): Vec2Local | null {
  const anchor = normalizedPointToBuildPlacementAnchor(point, footprintCells);

  if (!isBuildPlacementValid(anchor, footprintCells)) {
    return null;
  }

  return buildPlacementToPosition(anchor, footprintCells);
}
