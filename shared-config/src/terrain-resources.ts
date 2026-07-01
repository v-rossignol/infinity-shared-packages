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
    { id: "food", name: "Food", quantity: 10 },
    { id: "fresh-water", name: "Fresh water", quantity: 10 },
  ],
  forest: [
    { id: "wood", name: "Wood", quantity: 50 },
    { id: "food", name: "Food", quantity: 5 },
  ],
  mountain: [
    { id: "stone", name: "Stone", quantity: 75 },
    { id: "iron-ore", name: "Iron ore", quantity: 10 },
    { id: "copper-ore", name: "Copper ore", quantity: 10 },
    { id: "coal", name: "Coal", quantity: 5 },
  ],
  desert: [
    { id: "silica", name: "Silica", quantity: 100 },
    { id: "alkaline-minerals", name: "Alkaline minerals", quantity: 5 },
  ],
  ocean: [
    { id: "food", name: "Food", quantity: 30 },
    { id: "salt-water", name: "Salt water", quantity: 100 },
  ],
  ice: [
    { id: "ice", name: "Ice", quantity: 100 },
    { id: "cryogenic-materials", name: "Cryogenic materials", quantity: 5 },
  ],
  volcanic: [
    { id: "obsidian", name: "Obsidian", quantity: 10 },
    { id: "sulfur", name: "Sulfur", quantity: 10 },
    { id: "basalt", name: "Basalt", quantity: 10 },
  ],
};

/** Occasional resources — planned; not yet wired in server generation. */
export const OCCASIONAL_TERRAIN_RESOURCES: readonly OccasionalTerrainResourceEntry[] =
  [
    { id: "rare-earths", name: "Rare earths", terrains: ["plain"], quantity: 100 },
    { id: "uranium", name: "Uranium", terrains: ["plain"], quantity: 100 },
    { id: "bauxite", name: "Bauxite deposits", terrains: ["forest"], quantity: 100 },
    { id: "gold", name: "Gold", terrains: ["mountain"], quantity: 100 },
    { id: "silver", name: "Silver", terrains: ["mountain"], quantity: 100 },
    {
      id: "crude-oil",
      name: "Crude oil",
      terrains: ["desert", "ocean"],
      quantity: 100,
    },
    { id: "nitre", name: "Nitre", terrains: ["desert"], quantity: 100 },
    {
      id: "brine-lithium",
      name: "Brine lithium",
      terrains: ["desert"],
      quantity: 100,
    },
    {
      id: "polymetallic-nodules",
      name: "Polymetallic nodules",
      terrains: ["ocean"],
      quantity: 100,
    },
    { id: "tritium", name: "Tritium", terrains: ["ice"], quantity: 100 },
    { id: "methane-ice", name: "Methane ice", terrains: ["ice"], quantity: 100 },
    {
      id: "industrial-diamonds",
      name: "Industrial diamonds",
      terrains: ["volcanic"],
      quantity: 100,
    },
  ];

type PermanentResourceId =
  (typeof PERMANENT_TERRAIN_RESOURCES)[HexBiome][number]["id"];

type OccasionalResourceId =
  (typeof OCCASIONAL_TERRAIN_RESOURCES)[number]["id"];

export type ResourceType = PermanentResourceId | OccasionalResourceId;

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
