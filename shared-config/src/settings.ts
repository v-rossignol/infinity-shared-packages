export const timings = {
  /** Debounce delay for search inputs (ms) */
  searchDebounce: 300,
  /** Polling interval for server health checks (ms) */
  healthCheckInterval: 30_000,
  /** Duration of UI transitions (ms) */
  transitionDefault: 200,
  transitionSlow: 400,
} as const;

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

export const zIndex = {
  base: 0,
  overlay: 10,
  modal: 100,
  tooltip: 200,
  notification: 300,
} as const;
