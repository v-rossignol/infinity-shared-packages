export function isResourceTypeAllowed(types: string[], resourceType: string): boolean {
  return types.includes("*") || types.includes(resourceType);
}
