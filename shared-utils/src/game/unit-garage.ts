/** Parked vehicle reference stored on a garage building instance. */
export interface UnitGarageEntry {
  id: string;
  typeId: string;
}

/** Parked unit instances keyed by unit instance id. */
export type UnitGarage = Record<string, UnitGarageEntry>;

export function normalizeGarage(garage: UnitGarage | null | undefined): UnitGarage {
  return garage ?? {};
}

export function addToGarage(garage: UnitGarage, entry: UnitGarageEntry): UnitGarage {
  return {
    ...normalizeGarage(garage),
    [entry.id]: entry,
  };
}

export function removeFromGarage(garage: UnitGarage, unitId: string): UnitGarage {
  const next = { ...normalizeGarage(garage) };
  delete next[unitId];
  return next;
}
