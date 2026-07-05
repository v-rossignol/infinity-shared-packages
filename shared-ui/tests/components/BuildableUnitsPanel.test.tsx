import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BuildableUnitsPanel } from "../../src/components/BuildableUnitsPanel";
import type { BuildableUnitType } from "@infinity/shared-types";

const sawmill: BuildableUnitType = {
  id: "sawmill",
  name: "Sawmill",
  type: "building",
  size: "small",
  mobility: false,
  speed: null,
  environments: ["forest"],
  rules: [],
  capabilities: {},
  description: null,
  metadata: {},
  recipe: {
    ingredients: { wood: 100, stone: 25 },
    work: 100,
  },
  buildDurationMs: 100_000,
};

const scout: BuildableUnitType = {
  id: "scout-x1",
  name: "Scout X1",
  type: "vehicule",
  size: "small",
  mobility: true,
  speed: 2,
  environments: ["forest"],
  rules: [],
  capabilities: {},
  description: null,
  metadata: {},
  buildDurationMs: 45_000,
};

describe("BuildableUnitsPanel", () => {
  it("renders the title and buildable units", () => {
    render(
      <BuildableUnitsPanel title="Scout X1 - Building" units={[sawmill, scout]} />,
    );

    expect(screen.getByText("Scout X1 - Building")).toBeInTheDocument();
    expect(screen.getByLabelText("Scout X1 - Building")).toBeInTheDocument();
    expect(screen.getByText("Sawmill")).toBeInTheDocument();
    expect(screen.getByText("(Building, small)")).toBeInTheDocument();
    expect(screen.getByText("1m 40s")).toBeInTheDocument();
    expect(screen.getByText("(Vehicule, small)")).toBeInTheDocument();
    expect(screen.getByText("45s")).toBeInTheDocument();
  });

  it("shows the loading state", () => {
    render(<BuildableUnitsPanel title="Scout X1 - Building" isLoading />);

    expect(screen.getByText("Loading buildable units…")).toBeInTheDocument();
  });

  it("shows the empty message when there are no units", () => {
    render(<BuildableUnitsPanel title="Scout X1 - Building" units={[]} />);

    expect(screen.getByText("No buildable units on this hex.")).toBeInTheDocument();
  });

  it("shows a custom empty message", () => {
    render(
      <BuildableUnitsPanel
        title="Scout X1 - Building"
        units={[]}
        emptyMessage="Nothing to build here."
      />,
    );

    expect(screen.getByText("Nothing to build here.")).toBeInTheDocument();
  });

  it("shows a load error", () => {
    render(
      <BuildableUnitsPanel
        title="Scout X1 - Building"
        loadError="Network error"
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Network error");
  });

  it("shows a tooltip with needed resources on each unit", () => {
    render(<BuildableUnitsPanel units={[sawmill]} />);

    const item = screen.getByText("Sawmill").closest("li");
    expect(item).toHaveAttribute("title", "Needed: Stone 25, Wood 100");
  });

  it("uses resourceNames in the tooltip when provided", () => {
    render(
      <BuildableUnitsPanel
        units={[sawmill]}
        resourceNames={{ wood: "Timber", stone: "Granite" }}
      />,
    );

    const item = screen.getByText("Sawmill").closest("li");
    expect(item).toHaveAttribute("title", "Needed: Granite 25, Timber 100");
  });

  it("omits the tooltip when the unit has no recipe", () => {
    render(<BuildableUnitsPanel units={[scout]} />);

    const item = screen.getByText("Scout X1").closest("li");
    expect(item).not.toHaveAttribute("title");
  });

  it("does not show build buttons when onBuild is omitted", () => {
    render(<BuildableUnitsPanel units={[sawmill, scout]} />);

    expect(screen.queryByRole("button", { name: "Build Sawmill" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Build Scout X1" })).not.toBeInTheDocument();
  });

  it("shows a build button for each unit when onBuild is provided", () => {
    render(<BuildableUnitsPanel units={[sawmill, scout]} onBuild={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Build Sawmill" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Build Scout X1" })).toBeInTheDocument();
  });

  it("calls onBuild with the unit when the build button is clicked", () => {
    const onBuild = vi.fn();
    render(<BuildableUnitsPanel units={[sawmill]} onBuild={onBuild} />);

    fireEvent.click(screen.getByRole("button", { name: "Build Sawmill" }));

    expect(onBuild).toHaveBeenCalledTimes(1);
    expect(onBuild).toHaveBeenCalledWith(sawmill);
  });

  it("disables the build button when isBuildable returns false", () => {
    render(
      <BuildableUnitsPanel
        units={[sawmill, scout]}
        onBuild={vi.fn()}
        isBuildable={(unit) => unit.id === "scout-x1"}
      />,
    );

    expect(screen.getByRole("button", { name: "Build Sawmill" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Build Scout X1" })).not.toBeDisabled();
  });

  it("does not call onBuild when the build button is disabled", () => {
    const onBuild = vi.fn();
    render(
      <BuildableUnitsPanel
        units={[sawmill]}
        onBuild={onBuild}
        isBuildable={() => false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Build Sawmill" }));

    expect(onBuild).not.toHaveBeenCalled();
  });

  it("shows a no-entry sign before units that are not buildable", () => {
    render(
      <BuildableUnitsPanel
        units={[sawmill, scout]}
        isBuildable={(unit) => unit.id === "scout-x1"}
      />,
    );

    const sawmillRow = screen.getByText("Sawmill").closest("li");
    const scoutRow = screen.getByText("Scout X1").closest("li");

    expect(sawmillRow?.querySelector('[aria-label="Cannot build"]')).toBeInTheDocument();
    expect(scoutRow?.querySelector('[aria-label="Cannot build"]')).not.toBeInTheDocument();
  });

  it("does not show a no-entry sign when isBuildable is omitted", () => {
    render(<BuildableUnitsPanel units={[sawmill]} />);

    const row = screen.getByText("Sawmill").closest("li");
    expect(row?.querySelector('[aria-label="Cannot build"]')).not.toBeInTheDocument();
  });

  it("prefers the error state over the empty state", () => {
    render(
      <BuildableUnitsPanel
        title="Scout X1 - Building"
        units={[]}
        loadError="Network error"
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Network error");
    expect(screen.queryByText("No buildable units on this hex.")).not.toBeInTheDocument();
  });
});
