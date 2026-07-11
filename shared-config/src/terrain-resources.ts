import type { ResourceRarity } from "./constants";

/** Hex surface biomes — matches contracts/resources.md and game-rules.md. */
export const HEX_BIOMES = [
  "desert",
  "forest",
  "ocean",
  "mountain",
  "ice",
  "volcanic",
  "plain",
] as const;

export type HexBiome = (typeof HEX_BIOMES)[number];

export interface TerrainResourceEntry {
  id: string;
  name: string;
  quantity: number;
  rarity: ResourceRarity;
}

export interface OccasionalTerrainResourceEntry extends TerrainResourceEntry {
  terrains: readonly HexBiome[];
}

/** Permanent resources on every hex of matching terrain (contracts/resources.md). */
export const PERMANENT_TERRAIN_RESOURCES: Record<
  HexBiome,
  readonly TerrainResourceEntry[]
> = {
  plain: [
    { id: "food", name: "Food", quantity: 10, rarity: "common" },
    { id: "fresh-water", name: "Fresh water", quantity: 10, rarity: "common" },
  ],
  forest: [
    { id: "wood", name: "Wood", quantity: 50, rarity: "common" },
    { id: "food", name: "Food", quantity: 5, rarity: "common" },
  ],
  mountain: [
    { id: "stone", name: "Stone", quantity: 75, rarity: "common" },
    { id: "iron-ore", name: "Iron ore", quantity: 10, rarity: "common" },
    { id: "copper-ore", name: "Copper ore", quantity: 10, rarity: "common" },
    { id: "coal", name: "Coal", quantity: 5, rarity: "common" },
  ],
  desert: [
    { id: "silica", name: "Silica", quantity: 100, rarity: "common" },
    {
      id: "alkaline-minerals",
      name: "Alkaline minerals",
      quantity: 5,
      rarity: "common",
    },
  ],
  ocean: [
    { id: "food", name: "Food", quantity: 30, rarity: "common" },
    { id: "salt-water", name: "Salt water", quantity: 100, rarity: "common" },
  ],
  ice: [
    { id: "ice", name: "Ice", quantity: 100, rarity: "common" },
    {
      id: "cryogenic-materials",
      name: "Cryogenic materials",
      quantity: 5,
      rarity: "common",
    },
  ],
  volcanic: [
    { id: "obsidian", name: "Obsidian", quantity: 10, rarity: "common" },
    { id: "sulfur", name: "Sulfur", quantity: 10, rarity: "common" },
    { id: "basalt", name: "Basalt", quantity: 10, rarity: "common" },
  ],
};

/** Occasional resources — planned; not yet wired in server generation. */
export const OCCASIONAL_TERRAIN_RESOURCES: readonly OccasionalTerrainResourceEntry[] =
  [
    {
      id: "rare-earths",
      name: "Rare earths",
      terrains: ["plain"],
      quantity: 5,
      rarity: "occasional",
    },
    {
      id: "uranium",
      name: "Uranium",
      terrains: ["plain"],
      quantity: 2,
      rarity: "occasional",
    },
    {
      id: "bauxite",
      name: "Bauxite",
      terrains: ["forest"],
      quantity: 7,
      rarity: "occasional",
    },
    {
      id: "gold",
      name: "Gold",
      terrains: ["mountain"],
      quantity: 1,
      rarity: "occasional",
    },
    {
      id: "silver",
      name: "Silver",
      terrains: ["mountain"],
      quantity: 2,
      rarity: "occasional",
    },
    {
      id: "oil",
      name: "Oil",
      terrains: ["desert", "ocean"],
      quantity: 10,
      rarity: "occasional",
    },
    {
      id: "nitre",
      name: "Nitre",
      terrains: ["desert"],
      quantity: 5,
      rarity: "occasional",
    },
    {
      id: "lithium",
      name: "Lithium",
      terrains: ["desert"],
      quantity: 5,
      rarity: "occasional",
    },
    {
      id: "polymetallic-nodules",
      name: "Polymetallic nodules",
      terrains: ["ocean"],
      quantity: 10,
      rarity: "occasional",
    },
    {
      id: "tritium",
      name: "Tritium",
      terrains: ["ice"],
      quantity: 1,
      rarity: "occasional",
    },
    {
      id: "methane-ice",
      name: "Methane ice",
      terrains: ["ice"],
      quantity: 2,
      rarity: "occasional",
    },
    {
      id: "industrial-diamonds",
      name: "Industrial diamonds",
      terrains: ["volcanic"],
      quantity: 2,
      rarity: "occasional",
    },
  ];

export interface TransformedResourceEntry {
  id: string;
  name: string;
  /** Terrain resource ids and quantities consumed. */
  inputs: Record<string, number>;
  /** Suggested output quantity per transformation. */
  quantity: number;
  /** Arbitrary work units; not derived from input quantities. */
  work: number;
  rarity: ResourceRarity;
  notes?: string;
}

/**
 * Transformed resources — planned; products from resource transformations,
 * not harvested from terrain (contracts/resources.md).
 */
export const TRANSFORMED_RESOURCES: readonly TransformedResourceEntry[] = [
  {
    id: "copper-ingot",
    name: "Copper ingot",
    inputs: { "copper-ore": 10, coal: 3 },
    quantity: 7,
    work: 5,
    rarity: "transformed",
    notes: "Intermediate step for alloys.",
  },
  {
    id: "iron-ingot",
    name: "Iron ingot",
    inputs: { "iron-ore": 10, coal: 5 },
    quantity: 8,
    work: 10,
    rarity: "transformed",
    notes: "Intermediate step for alloys.",
  },
  {
    id: "gunpowder",
    name: "Gunpowder",
    inputs: { coal: 5, sulfur: 5, nitre: 5 },
    quantity: 3,
    work: 15,
    rarity: "transformed",
    notes: "Requires at least one occasional terrain resource as input (nitre).",
  },
];

type PermanentResourceId =
  (typeof PERMANENT_TERRAIN_RESOURCES)[HexBiome][number]["id"];

type OccasionalResourceId =
  (typeof OCCASIONAL_TERRAIN_RESOURCES)[number]["id"];

type TransformedResourceId = (typeof TRANSFORMED_RESOURCES)[number]["id"];

/** Terrain resource ids (permanent + occasional). */
export type ResourceType = PermanentResourceId | OccasionalResourceId;

/** Transformed product ids (not harvested from terrain). */
export type TransformedResourceType = TransformedResourceId;

function collectUniqueResourceIds(): ResourceType[] {
  const ids = new Set<ResourceType>();

  for (const entries of Object.values(PERMANENT_TERRAIN_RESOURCES)) {
    for (const entry of entries) {
      ids.add(entry.id as ResourceType);
    }
  }

  for (const entry of OCCASIONAL_TERRAIN_RESOURCES) {
    ids.add(entry.id);
  }

  return [...ids].sort();
}

/** All terrain resource ids (permanent + occasional), sorted. */
export const RESOURCE_TYPES = collectUniqueResourceIds();

/** Permanent and occasional resource ids for a single biome. */
export function getResourceIdsForBiome(biome: HexBiome): ResourceType[] {
  const ids = new Set<ResourceType>();

  for (const entry of PERMANENT_TERRAIN_RESOURCES[biome]) {
    ids.add(entry.id as ResourceType);
  }

  for (const entry of OCCASIONAL_TERRAIN_RESOURCES) {
    if (entry.terrains.includes(biome)) {
      ids.add(entry.id);
    }
  }

  return [...ids].sort();
}
