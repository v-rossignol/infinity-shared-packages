export const APP_NAME = "Infinity";

// ---------------------------------------------------------------------------
// Planet hex layout
// Pointy-top odd-r layout. Both the server (planet-surface-travel) and
// terra-view (hexLayout DEFAULT_HEX_LAYOUT) must use the same dimensions.
// ---------------------------------------------------------------------------

/** Width of one hex cell in pixels. */
export const PLANET_HEX_LAYOUT_WIDTH = 80;

/** Height of one hex cell in pixels. */
export const PLANET_HEX_LAYOUT_HEIGHT = 92;

// ---------------------------------------------------------------------------
// Unit movement speed calibration
// speed=1 means 1 hex per 2 minutes (calibrated as the time to cross the
// largest distance within a single hex at standard speed).
// ---------------------------------------------------------------------------

/** Base travel time in milliseconds for a unit with speed=1 crossing one hex. */
export const PLANET_BASE_MOVEMENT_MS_PER_HEX = 120_000;

/** Interval between resource extraction ticks on a planet surface (1 minute). */
export const PLANET_EXTRACTION_TICK_MS = 60_000;

/** Base build time in milliseconds for work=1 at building.speed=1 on planet surface. */
export const PLANET_BASE_BUILD_MS = 1_000;

// ---------------------------------------------------------------------------
// Unit taxonomy
// Shared by server unit catalog and game clients.
// ---------------------------------------------------------------------------

export const UNIT_CATEGORIES = ["vehicule", "building"] as const;

export type UnitCategory = (typeof UNIT_CATEGORIES)[number];

export const UNIT_SIZES = ["small", "medium", "large"] as const;

export type UnitSize = (typeof UNIT_SIZES)[number];

/** Shapes a unit rule can span on the planet hex grid. */
export const UNIT_RULE_RANGES = ["hexagon"] as const;

export type UnitRuleRange = (typeof UNIT_RULE_RANGES)[number];

// ---------------------------------------------------------------------------
// Unit instance lifecycle
// Shared by server REST/WebSocket payloads and game clients.
// ---------------------------------------------------------------------------

export const UNIT_INSTANCE_STATUSES = [
  "idle",
  "moving",
  "inactive",
  "active",
  "destroyed",
  "extracting",
  "building",
] as const;

export type UnitInstanceStatus = (typeof UNIT_INSTANCE_STATUSES)[number];

// ---------------------------------------------------------------------------
// Celestial taxonomy
// Shared by server generation/schemas and game clients.
// ---------------------------------------------------------------------------

export const STAR_TYPES = ["yellow", "red", "blue", "white"] as const;

export type StarType = (typeof STAR_TYPES)[number];

export const PLANET_TYPES = ["rocky", "gas", "ice", "lava"] as const;

export type PlanetType = (typeof PLANET_TYPES)[number];

/** Planet types a player can enter/colonize (gas giants are not enterable). */
export type EnterablePlanetType = Exclude<PlanetType, "gas">;

export const ENTERABLE_PLANET_TYPES: readonly EnterablePlanetType[] =
  PLANET_TYPES.filter((type): type is EnterablePlanetType => type !== "gas");

export const RESOURCE_RARITIES = [
  "common",
  "rare",
  "epic",
  "legendary",
] as const;

export type ResourceRarity = (typeof RESOURCE_RARITIES)[number];

export const API_PREFIX = "/infinity";

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const XP_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 1000,
};
