import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TransferPanel } from "../../src/components/TransferPanel";

describe("TransferPanel", () => {
  it("renders building and vehicle cargo with transfer controls", () => {
    const onTransferToVehicle = vi.fn();
    const onTransferToGarage = vi.fn();

    render(
      <TransferPanel
        buildingName="Sawmill"
        vehicleName="Scout-X1"
        buildingCargo={{ wood: 5 }}
        vehicleCargo={{ stone: 2 }}
        buildingCapacity={10}
        vehicleCapacity={5}
        onTransferToVehicle={onTransferToVehicle}
        onTransferToGarage={onTransferToGarage}
      />,
    );

    expect(screen.getByLabelText("Scout-X1 transfer")).toBeInTheDocument();
    expect(screen.getByText("Transfer", { selector: "p" })).toBeInTheDocument();
    expect(screen.getByText("Sawmill ↔ Scout-X1")).toBeInTheDocument();
    expect(screen.getByLabelText("Sawmill cargo")).toBeInTheDocument();
    expect(screen.getByLabelText("Scout-X1 cargo")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "To vehicle Wood" }));
    expect(onTransferToVehicle).toHaveBeenCalledWith({ id: "wood", quantity: 5 });

    fireEvent.click(screen.getByRole("button", { name: "To building Stone" }));
    expect(onTransferToGarage).toHaveBeenCalledWith({ id: "stone", quantity: 2 });
  });

  it("shows the selected resource name below a line at the bottom of the panel", () => {
    render(
      <TransferPanel
        buildingName="Sawmill"
        vehicleName="Scout-X1"
        buildingCargo={{ wood: 5 }}
        vehicleCargo={{ stone: 2 }}
      />,
    );

    expect(screen.queryByLabelText("Selected resource")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Wood" }));

    expect(screen.getByLabelText("Selected resource")).toHaveTextContent("Wood");
    expect(screen.getByLabelText("Transfer unit")).toHaveValue("vehicle");
    expect(screen.getByLabelText("Transfer quantity")).toHaveValue(5);

    fireEvent.change(screen.getByLabelText("Transfer unit"), {
      target: { value: "building" },
    });
    expect(screen.getByLabelText("Transfer unit")).toHaveValue("building");
    expect(screen.getByLabelText("Transfer quantity")).toHaveValue(1);

    fireEvent.click(screen.getByRole("button", { name: "Wood" }));
    expect(screen.queryByLabelText("Selected resource")).not.toBeInTheDocument();
  });

  it("transfers the selected quantity from the footer", () => {
    const onTransferToVehicle = vi.fn();
    const onTransferToGarage = vi.fn();

    render(
      <TransferPanel
        buildingName="Sawmill"
        vehicleName="Scout-X1"
        buildingCargo={{ wood: 5 }}
        vehicleCargo={{ stone: 2 }}
        onTransferToVehicle={onTransferToVehicle}
        onTransferToGarage={onTransferToGarage}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Wood" }));
    expect(screen.getByLabelText("Transfer quantity")).toHaveValue(5);
    fireEvent.click(screen.getByRole("button", { name: "Transfer" }));

    expect(onTransferToVehicle).toHaveBeenCalledWith({ id: "wood", quantity: 5 });
    expect(onTransferToGarage).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Stone" }));
    expect(screen.getByLabelText("Transfer quantity")).toHaveValue(2);
    fireEvent.click(screen.getByRole("button", { name: "Transfer" }));

    expect(onTransferToGarage).toHaveBeenCalledWith({ id: "stone", quantity: 2 });
  });

  it("defaults the destination unit to the opposite column from the selected resource", () => {
    render(
      <TransferPanel
        buildingName="Sawmill"
        vehicleName="Scout-X1"
        buildingCargo={{ wood: 5 }}
        vehicleCargo={{ stone: 2 }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Stone" }));

    expect(screen.getByLabelText("Transfer unit")).toHaveValue("building");
    expect(screen.getByLabelText("Transfer quantity")).toHaveValue(2);
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();

    render(
      <TransferPanel
        buildingName="Sawmill"
        vehicleName="Scout-X1"
        buildingCargo={{}}
        vehicleCargo={{}}
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onBack when the back button is clicked", () => {
    const onBack = vi.fn();

    render(
      <TransferPanel
        buildingName="Sawmill"
        vehicleName="Scout-X1"
        buildingCargo={{}}
        vehicleCargo={{}}
        onBack={onBack}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
