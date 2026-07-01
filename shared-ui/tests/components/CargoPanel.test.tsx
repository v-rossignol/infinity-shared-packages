import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CargoPanel } from "../../src/components/CargoPanel";

describe("CargoPanel", () => {
  it("renders the unit title and cargo entries", () => {
    render(
      <CargoPanel
        title="Scout X1"
        cargo={{ wood: 50, "iron-ore": 10 }}
        resourceNames={{ wood: "Wood", "iron-ore": "Iron ore" }}
      />,
    );

    expect(screen.getByText("Scout X1")).toBeInTheDocument();
    expect(screen.getByLabelText("Scout X1 cargo")).toBeInTheDocument();
    expect(screen.getByText("Wood")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("Iron ore")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("shows the empty message when cargo is empty", () => {
    render(<CargoPanel title="Scout X1" cargo={{}} />);

    expect(screen.getByText("No cargo.")).toBeInTheDocument();
  });

  it("humanizes resource ids when names are not provided", () => {
    render(<CargoPanel cargo={{ "iron-ore": 5 }} />);

    expect(screen.getByText("Iron Ore")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("shows cargo gauge when capacity is provided", () => {
    render(
      <CargoPanel
        title="Hauler"
        cargo={{ wood: 50, "iron-ore": 10 }}
        resourceNames={{ wood: "Wood", "iron-ore": "Iron ore" }}
        capacity={1000}
      />,
    );

    expect(screen.getByText("60 / 1000")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Cargo space used" })).toHaveAttribute(
      "aria-valuenow",
      "60",
    );
  });

  it("does not render the capacity row when capacity is not provided", () => {
    render(
      <CargoPanel
        cargo={{ wood: 50 }}
        resourceNames={{ wood: "Wood" }}
      />,
    );

    expect(screen.queryByRole("progressbar", { name: "Cargo space used" })).not.toBeInTheDocument();
  });

  it("omits zero-quantity resources and sorts entries by name", () => {
    render(
      <CargoPanel
        cargo={{ wood: 0, stone: 3, food: 12 }}
        resourceNames={{ wood: "Wood", stone: "Stone", food: "Food" }}
      />,
    );

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Food");
    expect(items[0]).toHaveTextContent("12");
    expect(items[1]).toHaveTextContent("Stone");
    expect(items[1]).toHaveTextContent("3");
    expect(screen.queryByText("Wood")).not.toBeInTheDocument();
  });

  it("does not render drop buttons when onDrop is omitted", () => {
    render(
      <CargoPanel
        cargo={{ wood: 50 }}
        resourceNames={{ wood: "Wood" }}
      />,
    );

    expect(screen.queryByRole("button", { name: "Drop Wood" })).not.toBeInTheDocument();
  });

  it("renders drop buttons and calls onDrop with the resource", () => {
    const onDrop = vi.fn();

    render(
      <CargoPanel
        cargo={{ wood: 50, "iron-ore": 10 }}
        resourceNames={{ wood: "Wood", "iron-ore": "Iron ore" }}
        onDrop={onDrop}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Drop Iron ore" }));
    expect(onDrop).toHaveBeenCalledWith({ id: "iron-ore", quantity: 10 });

    fireEvent.click(screen.getByRole("button", { name: "Drop Wood" }));
    expect(onDrop).toHaveBeenCalledWith({ id: "wood", quantity: 50 });
  });

  it("disables the drop button for the resource being dropped", () => {
    render(
      <CargoPanel
        cargo={{ wood: 50, stone: 3 }}
        resourceNames={{ wood: "Wood", stone: "Stone" }}
        onDrop={vi.fn()}
        droppingResourceId="wood"
      />,
    );

    expect(screen.getByRole("button", { name: "Drop Wood" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Drop Stone" })).toBeEnabled();
  });
});
