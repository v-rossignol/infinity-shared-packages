import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CargoGauge } from "../../src/components/CargoGauge";

describe("CargoGauge", () => {
  function getFillElement(): HTMLElement {
    const gauge = screen.getByRole("progressbar", { name: "Cargo space used" });
    const fill = gauge.firstElementChild;

    if (fill == null) {
      throw new Error("Expected cargo gauge fill element");
    }

    return fill as HTMLElement;
  }

  it("shows used and capacity labels", () => {
    render(<CargoGauge capacity={1000} used={250} />);

    expect(screen.getByText("Cargo")).toBeInTheDocument();
    expect(screen.getByText("250 / 1000")).toBeInTheDocument();
  });

  it("exposes progressbar semantics", () => {
    render(<CargoGauge capacity={1000} used={250} />);

    const gauge = screen.getByRole("progressbar", { name: "Cargo space used" });
    expect(gauge).toHaveAttribute("aria-valuemin", "0");
    expect(gauge).toHaveAttribute("aria-valuemax", "1000");
    expect(gauge).toHaveAttribute("aria-valuenow", "250");
  });

  it("clamps fill when used exceeds capacity", () => {
    render(<CargoGauge capacity={100} used={150} />);

    expect(screen.getByText("150 / 100")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("handles zero capacity without errors", () => {
    render(<CargoGauge capacity={0} used={0} />);

    expect(screen.getByText("0 / 0")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("uses green fill below 50%", () => {
    render(<CargoGauge capacity={100} used={49} />);

    expect(getFillElement()).toHaveStyle({ backgroundColor: "rgb(107, 207, 127)" });
  });

  it("uses yellow fill at 50%", () => {
    render(<CargoGauge capacity={100} used={50} />);

    expect(getFillElement()).toHaveStyle({ backgroundColor: "rgb(230, 197, 71)" });
  });

  it("uses yellow fill at 75%", () => {
    render(<CargoGauge capacity={100} used={75} />);

    expect(getFillElement()).toHaveStyle({ backgroundColor: "rgb(230, 197, 71)" });
  });

  it("uses red fill above 75%", () => {
    render(<CargoGauge capacity={100} used={76} />);

    expect(getFillElement()).toHaveStyle({ backgroundColor: "rgb(255, 107, 107)" });
  });
});
