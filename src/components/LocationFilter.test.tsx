import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import { LocationFilter } from "../components/LocationFilter";

const locations = ["Sala A", "Sala B", "Sala C"];

const renderWithMantine = (ui: React.ReactElement) =>
  render(<MantineProvider>{ui}</MantineProvider>);

describe("LocationFilter", () => {
  it("renders all provided location buttons", () => {
    renderWithMantine(
      <LocationFilter
        locations={locations}
        selectedLocations={locations}
        onLocationChange={vi.fn()}
      />
    );
    for (const loc of locations) {
      expect(screen.getByText(loc)).toBeInTheDocument();
    }
  });

  it("renders 'Select All' button", () => {
    renderWithMantine(
      <LocationFilter
        locations={locations}
        selectedLocations={locations}
        onLocationChange={vi.fn()}
      />
    );
    expect(screen.getByText("Select All")).toBeInTheDocument();
  });

  it("clicking a location when not all selected toggles it out", async () => {
    const onLocationChange = vi.fn();
    renderWithMantine(
      <LocationFilter
        locations={locations}
        selectedLocations={["Sala A"]}
        onLocationChange={onLocationChange}
      />
    );
    await userEvent.click(screen.getByText("Sala A"));
    // Should remove Sala A
    expect(onLocationChange).toHaveBeenCalledWith([]);
  });

  it("clicking a location when not all selected adds it", async () => {
    const onLocationChange = vi.fn();
    renderWithMantine(
      <LocationFilter
        locations={locations}
        selectedLocations={["Sala A"]}
        onLocationChange={onLocationChange}
      />
    );
    await userEvent.click(screen.getByText("Sala B"));
    expect(onLocationChange).toHaveBeenCalledWith(["Sala A", "Sala B"]);
  });

  it("when all are selected, clicking one deselects all others (sets to empty)", async () => {
    const onLocationChange = vi.fn();
    renderWithMantine(
      <LocationFilter
        locations={locations}
        selectedLocations={locations}
        onLocationChange={onLocationChange}
      />
    );
    await userEvent.click(screen.getByText("Sala A"));
    // Per the component logic: if all selected, clicking any => onLocationChange([])
    expect(onLocationChange).toHaveBeenCalledWith([]);
  });

  it("'Select All' when all selected calls onLocationChange with empty array", async () => {
    const onLocationChange = vi.fn();
    renderWithMantine(
      <LocationFilter
        locations={locations}
        selectedLocations={locations}
        onLocationChange={onLocationChange}
      />
    );
    await userEvent.click(screen.getByText("Select All"));
    expect(onLocationChange).toHaveBeenCalledWith([]);
  });

  it("'Select All' when none selected calls onLocationChange with all locations", async () => {
    const onLocationChange = vi.fn();
    renderWithMantine(
      <LocationFilter
        locations={locations}
        selectedLocations={[]}
        onLocationChange={onLocationChange}
      />
    );
    await userEvent.click(screen.getByText("Select All"));
    expect(onLocationChange).toHaveBeenCalledWith(locations);
  });
});
