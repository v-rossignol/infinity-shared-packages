# packages/AGENTS.md — Shared npm workspace

Agent guide for the `packages/` workspace. These packages are shared across all Infinity clients (and the server for config/types). Each is built independently with `tsup` and imported under the `@infinity` scope.

**Parent guide:** [AGENTS.md](../AGENTS.md)

---

## Overview

| Package | Import name | Role | Used today |
|---------|-------------|------|------------|
| [`shared-config/`](shared-config/) | `@infinity/shared-config` | Constants, colors, terrain resources, socket event names | Yes — server + terra-view |
| [`shared-ui/`](shared-ui/) | `@infinity/shared-ui` | Presentation-only React components, hooks, theme | Scaffolded — not yet imported by any app |
| [`shared-utils/`](shared-utils/) | `@infinity/shared-utils` | Pure utility functions (formatters, math, random, helpers) | Scaffolded — not yet imported by any app |
| [`shared-types/`](shared-types/) | `@infinity/shared-types` | Cross-app TypeScript interfaces (Player, Item, events) | Scaffolded — not yet imported by any app |

---

## Commands

Run from the **package directory** (`packages/<name>/`), not the monorepo root.

| Command | What it does |
|---------|--------------|
| `npm run build` | Compile TypeScript → `dist/` via tsup |
| `npm run dev` | Watch mode build |
| `npm run typecheck` | Type-check without emitting |
| `npm run test` | Run unit tests once (shared-ui, shared-utils) |
| `npm run test:watch` | Watch mode tests |

From the **monorepo root:**

```
npm run test:packages   # runs tests for shared-ui + shared-utils
```

**Always build a package before consuming it in an app** — apps import from `dist/`, not `src/`.

---

## Package constraints

### `shared-config`
- Zero runtime dependencies.
- Constants must stay stable across server and all clients — changes can be breaking.
- `terrain-resources.ts` is the source of truth for biome and resource ids used throughout the game. Match it against `contracts/resources.md` when updating.

### `shared-ui`
- **Presentation-only** — no routing, no Zustand, no API calls, no Socket.IO.
- React and ReactDOM are **peer dependencies** — do not add them to `dependencies`.
- Use inline styles keyed from `theme` (in `src/theme/index.ts`) for all styling — no external CSS or CSS-in-JS library.
- Components must accept an optional `style` and/or `className` prop to let the host app control layout.
- Icons live in `src/icons/` as SVG React components — add them there, not inside component directories.

### `shared-utils`
- Zero framework dependencies — pure TypeScript only.
- No side effects, no global state.

### `shared-types`
- Zero runtime dependencies — compile-time interfaces only, no classes or constants.
- Currently scaffolded but **not yet consumed** by any app. Local types in each sub-project take precedence.
- When a type here and a local sub-project type diverge, treat the sub-project type as the source of truth until a deliberate migration is agreed on.

---

## Current exports

### `shared-config`
`colors` · `theme` (colors, spacing, typography, borderRadius, animation) · `APP_NAME` · `API_PREFIX` · `SOCKET_EVENTS` · `PAGINATION` · `XP_THRESHOLDS` · `PLANET_HEX_LAYOUT_WIDTH/HEIGHT` · `PLANET_BASE_MOVEMENT_MS_PER_HEX` · `timings` · `breakpoints` · `zIndex` · `HEX_BIOMES` · `HexBiome` · `TerrainResourceEntry` · `PERMANENT_TERRAIN_RESOURCES` · `OCCASIONAL_TERRAIN_RESOURCES` · `ResourceType` · `RESOURCE_TYPES` · `getResourceIdsForBiome`

### `shared-ui`
Components: `Button` · `Spinner` · `HealthBar` · `PlayerAvatar` · `CargoPanel`
Hooks: `useDebounce` · `useKeyboard` · `useResize`
Theme: `theme` (re-exported from `src/theme/index.ts`)
Icons: none yet

### `shared-utils`
`formatters/`: `formatNumber` · `formatDuration` · `formatDate`
`math/`: `clamp` · `lerp` · `distance2D` · `toRadians` · `toDegrees`
`random/`: (see `src/random/index.ts`)
`helpers/`: `slugify` · `capitalize` · `omit` · `groupBy` · `debounce`

### `shared-types`
`Player` · `PlayerSummary` · `Item` · `InventorySlot` · `ItemRarity` · `Packet` · `ErrorPacket` · `GameEvent` · `GameEventName` · `ChatMessageEvent` · `PlayerMoveEvent`

---

## Testing

Tests exist for `shared-ui` and `shared-utils`. The framework is **Vitest**.

- `shared-ui` uses jsdom + `@testing-library/react` — see `packages/shared-ui/tests/`
- `shared-utils` uses node environment — see `packages/shared-utils/tests/`
- `shared-config` and `shared-types` have no tests (constants and types respectively)

---

## When to add something here vs. in a sub-project

Add to a shared package when:
- More than one client or the server needs the same thing.
- The logic is genuinely framework-agnostic (utils) or presentation-only (ui).

Keep in a sub-project when:
- It is specific to that client's domain (e.g. hex-grid logic in terra-view).
- It depends on app-level state, routing, or socket connections.
