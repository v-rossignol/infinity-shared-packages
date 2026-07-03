import type {
  UnitCategory,
  UnitRuleRange,
  UnitSize,
} from "@infinity/shared-config";

export type { UnitRuleRange };

export interface UnitRule {
  range: UnitRuleRange;
  value: number;
}

/** Maximum total cargo quantity the unit can carry. */
export interface UnitCargoCapability {
  size: number;
}

/**
 * Resource extraction on planet surface.
 * `speed` is a multiplier applied to biome resource quantity per tick.
 * `types` lists allowed terrain resource ids; `"*"` matches any type.
 */
export interface UnitExtractionCapability {
  speed: number;
  types: string[];
}

/** What a "building" capability may construct, for one unit category. */
export interface UnitBuildTarget {
  /** Allowed sizes (explicit list). */
  sizes: UnitSize[];
  /** Allowed unit type ids; `"*"` matches any unit of this category. */
  units: string[];
}

/**
 * Ability to construct other units on planet surface.
 * `speed` is a multiplier applied to build progress per tick.
 */
export interface UnitBuildingCapability {
  speed: number;
  vehicules?: UnitBuildTarget;
  buildings?: UnitBuildTarget;
}

/** Optional capability blocks attached to a unit type definition. */
export interface UnitCapabilities {
  cargo?: UnitCargoCapability;
  extraction?: UnitExtractionCapability;
  building?: UnitBuildingCapability;
}

/** Resource id → quantity required to build this unit type. */
export type UnitRecipeIngredients = Record<string, number>;

export interface UnitRecipe {
  /** Resources consumed from the builder cargo when the build starts. May be empty. */
  ingredients: UnitRecipeIngredients;
  /** Arbitrary work units; not derived from ingredient quantities. */
  work: number;
}

export interface UnitTypeDefinition {
  id: string;
  name: string;
  type: UnitCategory;
  size: UnitSize;
  mobility: boolean;
  speed: number | null;
  environments: string[];
  rules: UnitRule[];
  capabilities: UnitCapabilities;
  description: string | null;
  metadata: Record<string, unknown>;
  /** When absent, the unit type cannot be built through the build system. */
  recipe?: UnitRecipe;
}

/** Unit type a builder may construct, including estimated build duration. */
export interface BuildableUnitType extends UnitTypeDefinition {
  buildDurationMs: number;
}
