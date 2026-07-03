// ---------------------------------------------------------------------------
// Socket.IO event names — single source of truth for the real-time protocol.
// Mirrors contracts/asyncapi.yaml and the server gateway. Both the server
// (src/modules/socket/events/*) and clients import these; do not define
// parallel event-name maps.
// ---------------------------------------------------------------------------

/** Galaxy-scope events (cube/star navigation). */
export const GALAXY_EVENTS = {
  MOVE: "GALAXY_MOVE",
  UPDATE: "GALAXY_UPDATE",
  REQUEST_CUBE: "REQUEST_CUBE",
  REQUEST_STAR: "REQUEST_STAR",
  CUBE_DATA: "CUBE_DATA",
  STAR_DATA: "STAR_DATA",
  ERROR: "GALAXY_ERROR",
} as const;

/** Star-system-scope events. */
export const SYSTEM_EVENTS = {
  JOIN: "SYSTEM_JOIN",
  LEAVE: "SYSTEM_LEAVE",
  MOVE: "SYSTEM_MOVE",
  UPDATE: "SYSTEM_UPDATE",
  ERROR: "SYSTEM_ERROR",
} as const;

/** Planet-surface-scope events. */
export const PLANET_EVENTS = {
  MOVE: "PLANET_MOVE",
  UPDATE: "PLANET_UPDATE",
  JOIN: "PLANET_JOIN",
  LEAVE: "PLANET_LEAVE",
  ERROR: "PLANET_ERROR",
} as const;

/** Unit-instance events (broadcast on the planet room). */
export const UNIT_EVENTS = {
  UPDATE: "UNIT_UPDATE",
  ERROR: "UNIT_ERROR",
} as const;

export type GalaxyEvent = (typeof GALAXY_EVENTS)[keyof typeof GALAXY_EVENTS];
export type SystemEvent = (typeof SYSTEM_EVENTS)[keyof typeof SYSTEM_EVENTS];
export type PlanetEvent = (typeof PLANET_EVENTS)[keyof typeof PLANET_EVENTS];
export type UnitEvent = (typeof UNIT_EVENTS)[keyof typeof UNIT_EVENTS];
