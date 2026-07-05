import React, { useState } from "react";
import { CargoGauge } from "../CargoGauge";
import { theme } from "../../theme";
import type { CargoResource } from "@infinity/shared-types";
import type { UnitCargo } from "../CargoPanel";

export interface TransferPanelProps {
  /** Garage building label (e.g. Sawmill). */
  buildingName: string;
  /** Parked vehicle label (e.g. Scout-X1). */
  vehicleName: string;
  buildingCargo: UnitCargo;
  vehicleCargo: UnitCargo;
  buildingCapacity?: number;
  vehicleCapacity?: number;
  resourceNames?: Record<string, string>;
  emptyMessage?: string;
  /** Called when the user moves cargo from the building to the vehicle. */
  onTransferToVehicle?: (resource: CargoResource) => void;
  /** Called when the user moves cargo from the vehicle to the garage. */
  onTransferToGarage?: (resource: CargoResource) => void;
  /** Resource id currently being transferred; disables matching transfer buttons. */
  transferringResourceId?: string | null;
  transferError?: string | null;
  onBack?: () => void;
  onClose?: () => void;
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

function listCargoEntries(
  cargo: UnitCargo,
  resourceNames?: Record<string, string>,
): Array<{ id: string; name: string; quantity: number }> {
  return Object.entries(cargo)
    .filter(([, quantity]) => quantity > 0)
    .map(([id, quantity]) => ({
      id,
      name: resolveResourceName(id, resourceNames),
      quantity,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function sumCargo(cargo: UnitCargo): number {
  return Object.values(cargo).reduce((sum, quantity) => sum + quantity, 0);
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
  margin: 0,
  fontSize: theme.typography.fontSizeLg,
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.colors.primary,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing.sm,
  marginBottom: theme.spacing.sm,
};

const headerActionsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.sm,
  flexShrink: 0,
};

const metaStyle: React.CSSProperties = {
  margin: `0 0 ${theme.spacing.md}`,
  color: theme.colors.textSecondary,
};

const columnsStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
  gap: theme.spacing.md,
};

const columnStyle: React.CSSProperties = {
  minWidth: 0,
};

const columnTitleStyle: React.CSSProperties = {
  margin: `0 0 ${theme.spacing.xs}`,
  fontSize: theme.typography.fontSizeSm,
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.colors.textPrimary,
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
  gap: theme.spacing.sm,
  padding: `${theme.spacing.xs} 0`,
  color: theme.colors.textPrimary,
};

const itemActionsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.xs,
  flexShrink: 0,
};

const quantityStyle: React.CSSProperties = {
  color: theme.colors.textSecondary,
  fontVariantNumeric: "tabular-nums",
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

const headerButtonStyle: React.CSSProperties = {
  ...actionButtonStyle,
};

const mutedStyle: React.CSSProperties = {
  margin: 0,
  color: theme.colors.textSecondary,
};

const errorStyle: React.CSSProperties = {
  margin: `0 0 ${theme.spacing.md}`,
  color: theme.colors.danger,
  fontSize: theme.typography.fontSizeSm,
  lineHeight: 1.35,
};

const resourceNameButtonStyle: React.CSSProperties = {
  padding: 0,
  border: "none",
  background: "none",
  color: theme.colors.textPrimary,
  font: "inherit",
  lineHeight: "inherit",
  textAlign: "left",
  cursor: "pointer",
};

const resourceNameSelectedStyle: React.CSSProperties = {
  color: theme.colors.primary,
  fontWeight: theme.typography.fontWeightMedium,
};

const footerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: theme.spacing.sm,
  marginTop: theme.spacing.md,
  paddingTop: theme.spacing.sm,
  borderTop: `1px solid ${theme.colors.border}`,
};

const footerNameStyle: React.CSSProperties = {
  margin: 0,
  color: theme.colors.textPrimary,
  fontWeight: theme.typography.fontWeightMedium,
  flexShrink: 0,
};

const footerLabelStyle: React.CSSProperties = {
  margin: 0,
  color: theme.colors.textSecondary,
  flexShrink: 0,
};

const unitSelectStyle: React.CSSProperties = {
  minWidth: 0,
  flex: "1 1 8rem",
  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
  borderRadius: theme.borderRadius.sm,
  border: `1px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.surfaceAlt,
  color: theme.colors.textPrimary,
  fontSize: theme.typography.fontSizeSm,
  lineHeight: 1.2,
};

const quantityInputStyle: React.CSSProperties = {
  width: "4.5rem",
  flexShrink: 0,
  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
  borderRadius: theme.borderRadius.sm,
  border: `1px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.surfaceAlt,
  color: theme.colors.textPrimary,
  fontSize: theme.typography.fontSizeSm,
  lineHeight: 1.2,
  fontVariantNumeric: "tabular-nums",
};

const transferButtonStyle: React.CSSProperties = {
  ...actionButtonStyle,
  flexShrink: 0,
};

type TransferUnit = "building" | "vehicle";

function getResourceQuantity(cargo: UnitCargo, resourceId: string): number {
  return cargo[resourceId] ?? 0;
}

function getOppositeUnit(unit: TransferUnit): TransferUnit {
  return unit === "building" ? "vehicle" : "building";
}

function getCargoForUnit(
  unit: TransferUnit,
  buildingCargo: UnitCargo,
  vehicleCargo: UnitCargo,
): UnitCargo {
  return unit === "building" ? buildingCargo : vehicleCargo;
}

function getMaxQuantityFromSource(
  destinationUnit: TransferUnit,
  resourceId: string,
  buildingCargo: UnitCargo,
  vehicleCargo: UnitCargo,
): number {
  const sourceUnit = getOppositeUnit(destinationUnit);
  return getResourceQuantity(
    getCargoForUnit(sourceUnit, buildingCargo, vehicleCargo),
    resourceId,
  );
}

function CargoColumn({
  title,
  cargo,
  capacity,
  resourceNames,
  emptyMessage,
  transferDirection,
  onTransfer,
  transferringResourceId,
  selectedResourceId,
  onResourceNameClick,
}: {
  title: string;
  cargo: UnitCargo;
  capacity?: number;
  resourceNames?: Record<string, string>;
  emptyMessage: string;
  transferDirection: "toVehicle" | "toBuilding";
  onTransfer?: (resource: CargoResource) => void;
  transferringResourceId: string | null;
  selectedResourceId: string | null;
  onResourceNameClick: (
    resourceId: string,
    resourceName: string,
    sourceUnit: TransferUnit,
  ) => void;
}): React.ReactElement {
  const entries = listCargoEntries(cargo, resourceNames);
  const used = sumCargo(cargo);
  const transferLabel = transferDirection === "toVehicle" ? "To vehicle" : "To building";

  return (
    <section style={columnStyle} aria-label={`${title} cargo`}>
      <p style={columnTitleStyle}>{title}</p>
      {capacity != null ? <CargoGauge capacity={capacity} used={used} /> : null}
      {entries.length === 0 ? (
        <p style={mutedStyle}>{emptyMessage}</p>
      ) : (
        <ul style={listStyle}>
          {entries.map((entry) => {
            const isTransferring = transferringResourceId === entry.id;

            const isSelected = selectedResourceId === entry.id;

            return (
              <li key={entry.id} style={itemStyle}>
                <button
                  type="button"
                  style={
                    isSelected
                      ? { ...resourceNameButtonStyle, ...resourceNameSelectedStyle }
                      : resourceNameButtonStyle
                  }
                  aria-pressed={isSelected}
                  onClick={() =>
                    onResourceNameClick(
                      entry.id,
                      entry.name,
                      transferDirection === "toVehicle" ? "building" : "vehicle",
                    )
                  }
                >
                  {entry.name}
                </button>
                <span style={itemActionsStyle}>
                  <span style={quantityStyle}>{entry.quantity}</span>
                  {onTransfer != null ? (
                    <button
                      type="button"
                      style={
                        isTransferring
                          ? { ...actionButtonStyle, ...actionButtonDisabledStyle }
                          : actionButtonStyle
                      }
                      disabled={isTransferring}
                      aria-label={`${transferLabel} ${entry.name}`}
                      onClick={() => onTransfer({ id: entry.id, quantity: entry.quantity })}
                    >
                      {transferDirection === "toVehicle" ? "→" : "←"}
                    </button>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export function TransferPanel({
  buildingName,
  vehicleName,
  buildingCargo,
  vehicleCargo,
  buildingCapacity,
  vehicleCapacity,
  resourceNames,
  emptyMessage = "No cargo.",
  onTransferToVehicle,
  onTransferToGarage,
  transferringResourceId = null,
  transferError = null,
  onBack,
  onClose,
  className,
  style,
}: TransferPanelProps): React.ReactElement {
  const [selectedResource, setSelectedResource] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<TransferUnit>("building");
  const [transferQuantity, setTransferQuantity] = useState(1);

  const maxTransferQuantity =
    selectedResource != null
      ? getMaxQuantityFromSource(
          selectedUnit,
          selectedResource.id,
          buildingCargo,
          vehicleCargo,
        )
      : 0;

  const isTransferQuantityValid =
    Number.isInteger(transferQuantity) &&
    transferQuantity >= 1 &&
    transferQuantity <= maxTransferQuantity;

  const canFooterTransfer =
    selectedResource != null &&
    isTransferQuantityValid &&
    transferringResourceId !== selectedResource.id &&
    (selectedUnit === "vehicle"
      ? onTransferToVehicle != null
      : onTransferToGarage != null);

  function handleResourceNameClick(
    resourceId: string,
    resourceName: string,
    sourceUnit: TransferUnit,
  ): void {
    if (selectedResource?.id === resourceId) {
      setSelectedResource(null);
      return;
    }

    const destinationUnit = getOppositeUnit(sourceUnit);
    const maxQuantity = getResourceQuantity(
      getCargoForUnit(sourceUnit, buildingCargo, vehicleCargo),
      resourceId,
    );

    setSelectedResource({ id: resourceId, name: resourceName });
    setSelectedUnit(destinationUnit);
    setTransferQuantity(maxQuantity > 0 ? maxQuantity : 1);
  }

  function handleUnitChange(destinationUnit: TransferUnit): void {
    setSelectedUnit(destinationUnit);

    if (selectedResource == null) {
      return;
    }

    const maxQuantity = getMaxQuantityFromSource(
      destinationUnit,
      selectedResource.id,
      buildingCargo,
      vehicleCargo,
    );
    setTransferQuantity(maxQuantity > 0 ? maxQuantity : 1);
  }

  function handleFooterTransfer(): void {
    if (selectedResource == null || !isTransferQuantityValid) {
      return;
    }

    const resource: CargoResource = {
      id: selectedResource.id,
      quantity: transferQuantity,
    };

    if (selectedUnit === "vehicle") {
      onTransferToVehicle?.(resource);
      return;
    }

    onTransferToGarage?.(resource);
  }

  return (
    <aside
      className={className}
      style={{ ...panelStyle, ...style }}
      aria-label={`${vehicleName} transfer`}
    >
      <header style={headerStyle}>
        <p style={titleStyle}>Transfer</p>
        {onBack != null || onClose != null ? (
          <div style={headerActionsStyle}>
            {onBack != null ? (
              <button type="button" style={headerButtonStyle} onClick={onBack}>
                Back
              </button>
            ) : null}
            {onClose != null ? (
              <button type="button" style={headerButtonStyle} onClick={onClose}>
                Close
              </button>
            ) : null}
          </div>
        ) : null}
      </header>
      <p style={metaStyle}>
        {buildingName} ↔ {vehicleName}
      </p>
      {transferError != null ? (
        <p style={errorStyle} role="alert">
          {transferError}
        </p>
      ) : null}
      <div style={columnsStyle}>
        <CargoColumn
          title={buildingName}
          cargo={buildingCargo}
          capacity={buildingCapacity}
          resourceNames={resourceNames}
          emptyMessage={emptyMessage}
          transferDirection="toVehicle"
          onTransfer={onTransferToVehicle}
          transferringResourceId={transferringResourceId}
          selectedResourceId={selectedResource?.id ?? null}
          onResourceNameClick={handleResourceNameClick}
        />
        <CargoColumn
          title={vehicleName}
          cargo={vehicleCargo}
          capacity={vehicleCapacity}
          resourceNames={resourceNames}
          emptyMessage={emptyMessage}
          transferDirection="toBuilding"
          onTransfer={onTransferToGarage}
          transferringResourceId={transferringResourceId}
          selectedResourceId={selectedResource?.id ?? null}
          onResourceNameClick={handleResourceNameClick}
        />
      </div>
      {selectedResource != null ? (
        <footer style={footerStyle} aria-label="Selected resource" aria-live="polite">
          <span style={footerNameStyle}>{selectedResource.name}</span>
          <span style={footerLabelStyle}>to</span>
          <select
            style={unitSelectStyle}
            value={selectedUnit}
            aria-label="Transfer unit"
            onChange={(event) => handleUnitChange(event.target.value as TransferUnit)}
          >
            <option value="building">{buildingName}</option>
            <option value="vehicle">{vehicleName}</option>
          </select>
          <input
            type="number"
            style={quantityInputStyle}
            value={transferQuantity}
            min={1}
            max={maxTransferQuantity}
            aria-label="Transfer quantity"
            onChange={(event) => {
              const parsed = Number.parseInt(event.target.value, 10);

              if (!Number.isNaN(parsed)) {
                setTransferQuantity(parsed);
              }
            }}
          />
          <button
            type="button"
            style={
              canFooterTransfer
                ? transferButtonStyle
                : { ...transferButtonStyle, ...actionButtonDisabledStyle }
            }
            disabled={!canFooterTransfer}
            onClick={handleFooterTransfer}
          >
            Transfer
          </button>
        </footer>
      ) : null}
    </aside>
  );
}
