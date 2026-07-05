/** Resource id → quantity carried by a unit. */
export type UnitCargo = Record<string, number>;

/** Total quantity currently stored across all resources in the cargo. */
export function getCargoUsed(cargo: UnitCargo): number {
  return Object.values(cargo).reduce((total, quantity) => total + quantity, 0);
}

/** True when the cargo has reached (or exceeded) its capacity. */
export function isCargoFull(cargo: UnitCargo, capacity: number): boolean {
  return getCargoUsed(cargo) >= capacity;
}

/** Clamps a prospective yield to the remaining free space in the cargo. */
export function clampYieldToCargoCapacity(
  yieldAmount: number,
  cargo: UnitCargo,
  capacity: number,
): number {
  if (yieldAmount <= 0) {
    return 0;
  }

  const remainingCapacity = capacity - getCargoUsed(cargo);
  if (remainingCapacity <= 0) {
    return 0;
  }

  return Math.min(yieldAmount, remainingCapacity);
}

/** True when `cargo` contains at least every resource quantity in `ingredients`. */
export function hasEnoughCargoForRecipe(
  cargo: UnitCargo,
  ingredients: Record<string, number>,
): boolean {
  for (const [resourceId, required] of Object.entries(ingredients)) {
    if ((cargo[resourceId] ?? 0) < required) {
      return false;
    }
  }

  return true;
}

/** Returns a new cargo with `amount` of `resourceType` added (no-op for amount ≤ 0). */
export function addYieldToCargo(
  cargo: UnitCargo,
  resourceType: string,
  amount: number,
): UnitCargo {
  if (amount <= 0) {
    return cargo;
  }

  return {
    ...cargo,
    [resourceType]: (cargo[resourceType] ?? 0) + amount,
  };
}
