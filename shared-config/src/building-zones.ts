/**
 * Planet hex building zones — 15 equal-sized squares (9 central + 6 side).
 * Source of truth: okf/places/planets/hexagons/building-zones.md
 */

/** Normalized local position inside a planet hex bounding box (0–1). */
export interface Vec2Local {
  x: number;
  y: number;
}

/** Side length of every building zone square in normalized hex space. */
export const HEX_SQUARE_SIZE = 0.175;

/** Central gameplay grid spans this many zones per axis. */
export const HEX_BUILDING_CENTRAL_GRID_SIZE = 3;

export const HEX_BUILDING_CENTRAL_ZONE_COUNT = 9;
export const HEX_BUILDING_SIDE_ZONE_COUNT = 6;
export const HEX_BUILDING_ZONE_COUNT = 15;

export const BUILDING_ZONE_KINDS = ["central", "side"] as const;

export type BuildingZoneKind = (typeof BUILDING_ZONE_KINDS)[number];

/** Neighbor-facing side zones — one per hex edge midpoint. */
export const BUILDING_ZONE_SIDES = [
  "upper-right",
  "right",
  "lower-right",
  "lower-left",
  "left",
  "upper-left",
] as const;

export type BuildingZoneSide = (typeof BUILDING_ZONE_SIDES)[number];

export type CentralBuildingZoneId =
  | "central-0-0"
  | "central-1-0"
  | "central-2-0"
  | "central-0-1"
  | "central-1-1"
  | "central-2-1"
  | "central-0-2"
  | "central-1-2"
  | "central-2-2";

export type BuildingZoneId = CentralBuildingZoneId | BuildingZoneSide;

export interface BuildingZone {
  id: BuildingZoneId;
  kind: BuildingZoneKind;
  center: Vec2Local;
  /** Clockwise rotation in degrees. */
  rotationDeg: number;
  /** Column in the 3×3 central grid (0 = left). Present when kind is `central`. */
  col?: 0 | 1 | 2;
  /** Row in the 3×3 central grid (0 = top). Present when kind is `central`. */
  row?: 0 | 1 | 2;
  /** Neighbor direction. Present when kind is `side`. */
  side?: BuildingZoneSide;
}

const CENTRAL_ZONE_CENTERS: readonly (readonly [0 | 1 | 2, 0 | 1 | 2, number, number])[] =
  [
    [0, 0, 0.325, 0.325],
    [1, 0, 0.5, 0.325],
    [2, 0, 0.675, 0.325],
    [0, 1, 0.325, 0.5],
    [1, 1, 0.5, 0.5],
    [2, 1, 0.675, 0.5],
    [0, 2, 0.325, 0.675],
    [1, 2, 0.5, 0.675],
    [2, 2, 0.675, 0.675],
  ];

const SIDE_ZONE_DEFINITIONS: readonly (readonly [
  BuildingZoneSide,
  number,
  number,
  number,
])[] = [
  ["upper-right", 0.75, 0.125, 29.88],
  ["right", 1.0, 0.5, 90],
  ["lower-right", 0.75, 0.875, -29.88],
  ["lower-left", 0.25, 0.875, 29.88],
  ["left", 0.0, 0.5, 90],
  ["upper-left", 0.25, 0.125, -29.88],
];

function centralZoneId(col: 0 | 1 | 2, row: 0 | 1 | 2): CentralBuildingZoneId {
  return `central-${col}-${row}` as CentralBuildingZoneId;
}

const CENTRAL_BUILDING_ZONES: readonly BuildingZone[] = CENTRAL_ZONE_CENTERS.map(
  ([col, row, x, y]) => ({
    id: centralZoneId(col, row),
    kind: "central" as const,
    center: { x, y },
    rotationDeg: 0,
    col,
    row,
  }),
);

const SIDE_BUILDING_ZONES: readonly BuildingZone[] = SIDE_ZONE_DEFINITIONS.map(
  ([side, x, y, rotationDeg]) => ({
    id: side,
    kind: "side" as const,
    center: { x, y },
    rotationDeg,
    side,
  }),
);

/** All 15 building zones in stable order: central grid (row-major), then sides. */
export const BUILDING_ZONES: readonly BuildingZone[] = [
  ...CENTRAL_BUILDING_ZONES,
  ...SIDE_BUILDING_ZONES,
];

export const CENTRAL_BUILDING_ZONES_BY_ID: Readonly<
  Record<CentralBuildingZoneId, BuildingZone>
> = Object.fromEntries(
  CENTRAL_BUILDING_ZONES.map((zone) => [zone.id, zone]),
) as Record<CentralBuildingZoneId, BuildingZone>;

export const SIDE_BUILDING_ZONES_BY_ID: Readonly<
  Record<BuildingZoneSide, BuildingZone>
> = Object.fromEntries(
  SIDE_BUILDING_ZONES.map((zone) => [zone.side!, zone]),
) as Record<BuildingZoneSide, BuildingZone>;

export const BUILDING_ZONES_BY_ID: Readonly<Record<BuildingZoneId, BuildingZone>> =
  Object.fromEntries(BUILDING_ZONES.map((zone) => [zone.id, zone])) as Record<
    BuildingZoneId,
    BuildingZone
  >;

/** All valid building zone ids in stable order (for API validation). */
export const BUILDING_ZONE_IDS: readonly BuildingZoneId[] = BUILDING_ZONES.map(
  (zone) => zone.id,
);
