import React from "react";
import { formatDuration } from "@infinity/shared-utils";
import type { BuildableUnitType } from "@infinity/shared-types";
import { HammerIcon } from "../../icons/HammerIcon";
import { NoEntryIcon } from "../../icons/NoEntryIcon";
import { theme } from "../../theme";

export interface BuildableUnitsPanelProps {
  /** Panel title (e.g. unit name + "Building"). */
  title?: string;
  /** Buildable unit types to list. Ignored while loading. */
  units?: BuildableUnitType[];
  /** Optional display names keyed by recipe resource id. */
  resourceNames?: Record<string, string>;
  /** Called when the user clicks the build button for a unit. */
  onBuild?: (unit: BuildableUnitType) => void;
  /** When provided, only units for which this returns true can be built. */
  isBuildable?: (unit: BuildableUnitType) => boolean;
  isLoading?: boolean;
  loadError?: string | null;
  emptyMessage?: string;
  className?: string;
  style?: React.CSSProperties;
}

function humanizeResourceId(id: string): string {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function resolveResourceName(
  id: string,
  resourceNames?: Record<string, string>,
): string {
  return resourceNames?.[id] ?? humanizeResourceId(id);
}

function formatNeededResourcesTooltip(
  unit: BuildableUnitType,
  resourceNames?: Record<string, string>,
): string | undefined {
  const ingredients = unit.recipe?.ingredients;
  if (ingredients == null) {
    return undefined;
  }

  const entries = Object.entries(ingredients).filter(([, quantity]) => quantity > 0);
  if (entries.length === 0) {
    return "Needed: none";
  }

  const parts = entries
    .map(([id, quantity]) => `${resolveResourceName(id, resourceNames)} ${quantity}`)
    .sort((a, b) => a.localeCompare(b));

  return `Needed: ${parts.join(", ")}`;
}

const panelStyle: React.CSSProperties = {
  padding: theme.spacing.md,
  borderRadius: theme.borderRadius.md,
  border: `1px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.surface,
  fontSize: theme.typography.fontSizeMd,
  lineHeight: 1.45,
};

const titleStyle: React.CSSProperties = {
  margin: `0 0 ${theme.spacing.sm}`,
  fontSize: theme.typography.fontSizeLg,
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.colors.primary,
};

const listStyle: React.CSSProperties = {
  margin: 0,
  padding: 0,
  listStyle: "none",
};

const itemStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: theme.spacing.md,
  padding: `${theme.spacing.xs} 0`,
  color: theme.colors.textPrimary,
};

const itemLabelStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing.xs,
};

const notBuildableIconStyle: React.CSSProperties = {
  display: "inline-flex",
  flexShrink: 0,
  color: theme.colors.danger,
};

const detailStyle: React.CSSProperties = {
  color: theme.colors.textSecondary,
  fontVariantNumeric: "tabular-nums",
  textAlign: "right",
};

const itemActionsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.sm,
  flexShrink: 0,
};

const buildButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "1.5rem",
  height: "1.5rem",
  margin: 0,
  padding: 0,
  borderRadius: theme.borderRadius.sm,
  border: `1px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.surfaceAlt,
  color: theme.colors.textPrimary,
  cursor: "pointer",
};

const buildButtonDisabledStyle: React.CSSProperties = {
  opacity: 0.55,
  cursor: "not-allowed",
};

const mutedStyle: React.CSSProperties = {
  margin: 0,
  color: theme.colors.textSecondary,
};

const errorStyle: React.CSSProperties = {
  margin: `${theme.spacing.sm} 0 0`,
  color: theme.colors.danger,
  fontSize: theme.typography.fontSizeSm,
  lineHeight: 1.35,
};

function formatUnitCategory(type: BuildableUnitType): string {
  return type.type === "building" ? "Building" : "Vehicule";
}

export function BuildableUnitsPanel({
  title,
  units = [],
  resourceNames,
  onBuild,
  isBuildable,
  isLoading = false,
  loadError = null,
  emptyMessage = "No buildable units on this hex.",
  className,
  style,
}: BuildableUnitsPanelProps): React.ReactElement {
  return (
    <aside
      className={className}
      style={{ ...panelStyle, ...style }}
      aria-label={title ?? "Building"}
    >
      {title != null ? <p style={titleStyle}>{title}</p> : null}
      {isLoading ? <p style={mutedStyle}>Loading buildable units…</p> : null}
      {!isLoading && loadError != null ? (
        <p style={errorStyle} role="alert">
          {loadError}
        </p>
      ) : null}
      {!isLoading && loadError == null && units.length === 0 ? (
        <p style={mutedStyle}>{emptyMessage}</p>
      ) : null}
      {!isLoading && loadError == null && units.length > 0 ? (
        <ul style={listStyle}>
          {units.map((buildableUnit) => {
            const canBuild = isBuildable?.(buildableUnit) ?? true;

            return (
            <li
              key={buildableUnit.id}
              style={itemStyle}
              title={formatNeededResourcesTooltip(buildableUnit, resourceNames)}
            >
              <span style={itemLabelStyle}>
                {!canBuild ? (
                  <span style={notBuildableIconStyle} aria-label="Cannot build">
                    <NoEntryIcon />
                  </span>
                ) : null}
                {buildableUnit.name}
                <span style={{ ...detailStyle, marginLeft: theme.spacing.sm }}>
                  ({formatUnitCategory(buildableUnit)}, {buildableUnit.size})
                </span>
              </span>
              <span style={itemActionsStyle}>
                <span style={detailStyle}>{formatDuration(buildableUnit.buildDurationMs)}</span>
                {onBuild != null ? (
                  <button
                    type="button"
                    style={
                      canBuild
                        ? buildButtonStyle
                        : { ...buildButtonStyle, ...buildButtonDisabledStyle }
                    }
                    disabled={!canBuild}
                    aria-label={`Build ${buildableUnit.name}`}
                    onClick={() => onBuild(buildableUnit)}
                  >
                    <HammerIcon />
                  </button>
                ) : null}
              </span>
            </li>
            );
          })}
        </ul>
      ) : null}
    </aside>
  );
}
