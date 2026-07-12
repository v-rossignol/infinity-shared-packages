export { isResourceTypeAllowed } from "./resource-types";
export { isPointInPlanetHexLocal } from "./hex-local";
export {
  computeExtractionYield,
  computeExtractionYieldPerTick,
} from "./unit-resource";
export {
  addYieldToCargo,
  clampYieldToCargoCapacity,
  getCargoUsed,
  hasEnoughCargoForRecipe,
  isCargoFull,
  type UnitCargo,
} from "./unit-cargo";
export {
  addToGarage,
  normalizeGarage,
  removeFromGarage,
  type UnitGarage,
  type UnitGarageEntry,
} from "./unit-garage";
export {
  buildPlacementAnchorToBuildingZoneId,
  buildPlacementToNormalizedFootprint,
  buildPlacementToPosition,
  buildPositionFromBuildingZoneId,
  buildingZoneIdToBuildPlacementAnchor,
  getBuildFootprintCells,
  isBuildPlacementValid,
  isPointInBuildFootprint,
  normalizedPointToBuildPlacementAnchor,
  positionToBuildPlacementAnchor,
  resolveBuildTargetPosition,
  type BuildPlacementAnchor,
  type BuildPlacementOrientation,
  type NormalizedFootprint,
  type Vec2Local as BuildPlacementVec2Local,
} from "./unit-build-placement";
