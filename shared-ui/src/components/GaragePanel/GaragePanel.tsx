import React from "react";
import { theme } from "../../theme";

export interface GarageVehicle {
  id: string;
  name: string;
  size: string | null;
}

export interface GarageSlotUsage {
  size: string;
  used: number;
  capacity: number;
}

export interface GaragePanelProps {
  /** Used in the panel title (e.g. Sawmill → Sawmill Garage). */
  buildingName: string;
  vehicles: GarageVehicle[];
  slots?: GarageSlotUsage[];
  emptyMessage?: string;
  /** Called when the user clicks Unpark for a parked vehicle. Omit to hide unpark buttons. */
  onUnpark?: (unitId: string) => void;
  /** Vehicle unit id currently being unparked; disables that entry's Unpark button. */
  unparkingVehicleId?: string | null;
  /** Called when the user clicks Transfer for a parked vehicle. Omit to hide transfer buttons. */
  onTransfer?: (unitId: string) => void;
  className?: string;
  style?: React.CSSProperties;
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

const metaStyle: React.CSSProperties = {
  margin: `0 0 ${theme.spacing.sm}`,
  color: theme.colors.textSecondary,
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

const sizeStyle: React.CSSProperties = {
  color: theme.colors.textSecondary,
};

const actionButtonStyle: React.CSSProperties = {
  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
  borderRadius: theme.borderRadius.sm,
  border: `1px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.surfaceAlt,
  color: theme.colors.textPrimary,
  fontSize: theme.typography.fontSizeSm,
  lineHeight: 1.2,
  cursor: "pointer",
};

const actionButtonDisabledStyle: React.CSSProperties = {
  opacity: 0.55,
  cursor: "not-allowed",
};

const mutedStyle: React.CSSProperties = {
  margin: 0,
  color: theme.colors.textSecondary,
};

function formatSizeLabel(size: string | null): string {
  if (size == null) {
    return "Unknown size";
  }

  return size.charAt(0).toUpperCase() + size.slice(1);
}

function formatSlotLabel(slots: GarageSlotUsage[]): string {
  return slots.map((slot) => `${slot.used}/${slot.capacity} ${slot.size}`).join(", ");
}

export function GaragePanel({
  buildingName,
  vehicles,
  slots = [],
  emptyMessage = "No vehicles parked.",
  onUnpark,
  unparkingVehicleId = null,
  onTransfer,
  className,
  style,
}: GaragePanelProps): React.ReactElement {
  const slotLabel = formatSlotLabel(slots);

  return (
    <aside
      className={className}
      style={{ ...panelStyle, ...style }}
      aria-label={`${buildingName} garage`}
    >
      <p style={titleStyle}>{buildingName} Garage</p>
      {slotLabel.length > 0 ? <p style={metaStyle}>Slots: {slotLabel}</p> : null}
      {vehicles.length === 0 ? (
        <p style={mutedStyle}>{emptyMessage}</p>
      ) : (
        <ul style={listStyle}>
          {vehicles.map((vehicle) => (
            <li key={vehicle.id} style={itemStyle}>
              <span>{vehicle.name}</span>
              <span style={itemActionsStyle}>
                <span style={sizeStyle}>{formatSizeLabel(vehicle.size)}</span>
                {onUnpark != null ? (
                  <button
                    type="button"
                    style={
                      unparkingVehicleId === vehicle.id
                        ? { ...actionButtonStyle, ...actionButtonDisabledStyle }
                        : actionButtonStyle
                    }
                    disabled={unparkingVehicleId === vehicle.id}
                    aria-label={`Unpark ${vehicle.name}`}
                    onClick={() => onUnpark(vehicle.id)}
                  >
                    Unpark
                  </button>
                ) : null}
                {onTransfer != null ? (
                  <button
                    type="button"
                    style={actionButtonStyle}
                    aria-label={`Transfer ${vehicle.name}`}
                    onClick={() => onTransfer(vehicle.id)}
                  >
                    Transfer
                  </button>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
