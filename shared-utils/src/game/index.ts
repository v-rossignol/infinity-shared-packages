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
  buildGridAnchorToNormalizedRect,
  buildGridAnchorToPosition,
  getBuildFootprintCells,
  isBuildFootprintInsideHex,
  normalizedPointToBuildGridAnchor,
  resolveBuildTargetPosition,
  type BuildGridCell,
  type NormalizedRect,
  type Vec2Local as BuildPlacementVec2Local,
} from "./unit-build-placement";
