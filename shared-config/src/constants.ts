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

export const API_PREFIX = "/infinity";

export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  PLAYER_JOIN: "player:join",
  PLAYER_LEAVE: "player:leave",
  PLAYER_MOVE: "player:move",
  CHAT_MESSAGE: "chat:message",
  RESOURCE_HARVEST: "resource:harvest",
  PLANET_COLONIZE: "planet:colonize",
} as const;

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
