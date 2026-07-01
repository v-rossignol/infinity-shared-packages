/**
 * Resource quantity added to unit cargo on each planet-surface extraction tick.
 *
 * Matches `contracts/game-api.yaml` (`POST …/extract`): per tick the server adds
 * `resourceAbundance × extractionSpeed`, where abundance comes from the hex
 * biome resource and extractionSpeed from the unit type capability.
 */
export function computeExtractionYieldPerTick(
  resourceAbundance: number,
  extractionSpeed: number,
): number {
  return resourceAbundance * extractionSpeed;
}
