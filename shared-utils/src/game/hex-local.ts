import { PLANET_HEX_VERTEX_FRACTIONS } from "@infinity/shared-config";

/** True when normalized `(x, y)` lies inside the pointy-top hex polygon. */
export function isPointInPlanetHexLocal(x: number, y: number): boolean {
  let inside = false;

  for (
    let i = 0, j = PLANET_HEX_VERTEX_FRACTIONS.length - 1;
    i < PLANET_HEX_VERTEX_FRACTIONS.length;
    j = i, i += 1
  ) {
    const xi = PLANET_HEX_VERTEX_FRACTIONS[i].x;
    const yi = PLANET_HEX_VERTEX_FRACTIONS[i].y;
    const xj = PLANET_HEX_VERTEX_FRACTIONS[j].x;
    const yj = PLANET_HEX_VERTEX_FRACTIONS[j].y;

    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}
