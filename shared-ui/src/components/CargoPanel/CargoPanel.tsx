import React from "react";
import type { CargoResource } from "@infinity/shared-types";
import { CargoGauge } from "../CargoGauge";
import { theme } from "../../theme";

export type UnitCargo = Record<string, number>;

export type { CargoResource };
export interface CargoPanelProps {
  /** Unit or container label shown as the panel title. */
  title?: string;
  /** Resource id → quantity map. */
  cargo: UnitCargo;
  /** Maximum cargo capacity (from unit capabilities.cargo.size). When provided, used and remaining space are shown. */
  capacity?: number;
  /** Optional display names keyed by resource id. */
  resourceNames?: Record<string, string>;
  emptyMessage?: string;
  /** Called when the user clicks Drop on a cargo entry. Omit to hide drop buttons. */
  onDrop?: (resource: CargoResource) => void;
  /** Resource id currently being dropped; disables that entry's Drop button. */
  droppingResourceId?: string | null;
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
  alignItems: "center",
  gap: theme.spacing.md,
  padding: `${theme.spacing.xs} 0`,
  color: theme.colors.textPrimary,
};

const itemActionsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.sm,
  flexShrink: 0,
};

const quantityStyle: React.CSSProperties = {
  color: theme.colors.textSecondary,
  fontVariantNumeric: "tabular-nums",
};

const dropButtonStyle: React.CSSProperties = {
  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
  borderRadius: theme.borderRadius.sm,
  border: `1px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.surfaceAlt,
  color: theme.colors.textPrimary,
  fontSize: theme.typography.fontSizeSm,
  lineHeight: 1.2,
  cursor: "pointer",
};

const dropButtonDisabledStyle: React.CSSProperties = {
  opacity: 0.55,
  cursor: "not-allowed",
};

const mutedStyle: React.CSSProperties = {
  margin: 0,
  color: theme.colors.textSecondary,
};

export function CargoPanel({
  title,
  cargo,
  capacity,
  resourceNames,
  emptyMessage = "No cargo.",
  onDrop,
  droppingResourceId = null,
  className,
  style,
}: CargoPanelProps): React.ReactElement {
  const entries = Object.entries(cargo)
    .filter(([, quantity]) => quantity > 0)
    .map(([id, quantity]) => ({
      id,
      name: resolveResourceName(id, resourceNames),
      quantity,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const used = entries.reduce((sum, e) => sum + e.quantity, 0);

  return (
    <aside
      className={className}
      style={{ ...panelStyle, ...style }}
      aria-label={title != null ? `${title} cargo` : "Cargo"}
    >
      {title != null ? <p style={titleStyle}>{title}</p> : null}

      {capacity != null ? <CargoGauge capacity={capacity} used={used} /> : null}

      {entries.length === 0 ? (
        <p style={mutedStyle}>{emptyMessage}</p>
      ) : (
        <ul style={listStyle}>
          {entries.map((entry) => {
            const isDropping = droppingResourceId === entry.id;

            return (
              <li key={entry.id} style={itemStyle}>
                <span>{entry.name}</span>
                <span style={itemActionsStyle}>
                  <span style={quantityStyle}>{entry.quantity}</span>
                  {onDrop != null ? (
                    <button
                      type="button"
                      style={
                        isDropping
                          ? { ...dropButtonStyle, ...dropButtonDisabledStyle }
                          : dropButtonStyle
                      }
                      disabled={isDropping}
                      aria-label={`Drop ${entry.name}`}
                      onClick={() => onDrop({ id: entry.id, quantity: entry.quantity })}
                    >
                      Drop
                    </button>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
