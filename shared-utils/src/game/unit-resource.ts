/**
 * Resource quantity added to unit cargo over `ticks` planet-surface extraction ticks.
 *
 * Matches `contracts/game-api.yaml` (`POST …/extract`) and the authoritative
 * server implementation: yield accumulates as `abundance × speed × ticks` and is
 * floored to an integer. Abundance comes from the hex biome resource and speed
 * from the unit type extraction capability.
 *
 * This is the single source of truth for extraction yield — the server credits
 * cargo with it and clients use it to predict/display yields.
 */
export function computeExtractionYield(
  resourceAbundance: number,
  extractionSpeed: number,
  ticks: number,
): number {
  if (ticks <= 0 || resourceAbundance <= 0 || extractionSpeed <= 0) {
    return 0;
  }

  return Math.floor(resourceAbundance * extractionSpeed * ticks);
}

/** Integer resource quantity added to unit cargo on a single extraction tick. */
export function computeExtractionYieldPerTick(
  resourceAbundance: number,
  extractionSpeed: number,
): number {
  return computeExtractionYield(resourceAbundance, extractionSpeed, 1);
}
