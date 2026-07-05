import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GaragePanel } from "../../src/components/GaragePanel";

describe("GaragePanel", () => {
  it("renders the building name, slot usage, and parked vehicles", () => {
    render(
      <GaragePanel
        buildingName="Sawmill"
        slots={[{ size: "small", used: 1, capacity: 1 }]}
        vehicles={[{ id: "scout-parked", name: "Scout-X1", size: "small" }]}
      />,
    );

    expect(screen.getByLabelText("Sawmill garage")).toBeInTheDocument();
    expect(screen.getByText("Sawmill Garage")).toBeInTheDocument();
    expect(screen.getByText("Slots: 1/1 small")).toBeInTheDocument();
    expect(screen.getByText("Scout-X1")).toBeInTheDocument();
    expect(screen.getByText("Small")).toBeInTheDocument();
  });

  it("shows the empty message when no vehicles are parked", () => {
    render(<GaragePanel buildingName="Sawmill" vehicles={[]} />);

    expect(screen.getByText("No vehicles parked.")).toBeInTheDocument();
  });

  it("uses a custom empty message when provided", () => {
    render(
      <GaragePanel
        buildingName="Sawmill"
        vehicles={[]}
        emptyMessage="Garage is empty."
      />,
    );

    expect(screen.getByText("Garage is empty.")).toBeInTheDocument();
  });

  it("shows unknown size when a vehicle size is missing", () => {
    render(
      <GaragePanel
        buildingName="Sawmill"
        vehicles={[{ id: "scout-parked", name: "Scout-X1", size: null }]}
      />,
    );

    expect(screen.getByText("Unknown size")).toBeInTheDocument();
  });

  it("does not render action buttons when handlers are omitted", () => {
    render(
      <GaragePanel
        buildingName="Sawmill"
        vehicles={[{ id: "scout-parked", name: "Scout-X1", size: "small" }]}
      />,
    );

    expect(screen.queryByRole("button", { name: "Unpark Scout-X1" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Transfer Scout-X1" })).not.toBeInTheDocument();
  });

  it("renders action buttons and calls handlers with the vehicle id", () => {
    const onUnpark = vi.fn();
    const onTransfer = vi.fn();

    render(
      <GaragePanel
        buildingName="Sawmill"
        vehicles={[{ id: "scout-parked", name: "Scout-X1", size: "small" }]}
        onUnpark={onUnpark}
        onTransfer={onTransfer}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Unpark Scout-X1" }));
    expect(onUnpark).toHaveBeenCalledWith("scout-parked");

    fireEvent.click(screen.getByRole("button", { name: "Transfer Scout-X1" }));
    expect(onTransfer).toHaveBeenCalledWith("scout-parked");
  });

  it("disables the unpark button for the vehicle being unparked", () => {
    render(
      <GaragePanel
        buildingName="Sawmill"
        vehicles={[{ id: "scout-parked", name: "Scout-X1", size: "small" }]}
        onUnpark={vi.fn()}
        unparkingVehicleId="scout-parked"
      />,
    );

    expect(screen.getByRole("button", { name: "Unpark Scout-X1" })).toBeDisabled();
  });
});
