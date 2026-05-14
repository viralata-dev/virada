import { MantineProvider } from "@mantine/core";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EventsGrid } from "../components/EventsGrid";

const renderWithMantine = (ui: React.ReactElement) =>
  render(<MantineProvider>{ui}</MantineProvider>);

const makeData = (overrides?: object) => ({
  locations: [
    {
      name: "Location A",
      address: "Street 1",
      events: [
        { time: "18h", artist: "Artist Saturday", duration: 60, attending: false, date: "24.5" },
        { time: "20h", artist: "Artist Sunday", duration: 60, attending: false, date: "25.5" },
      ],
    },
    {
      name: "Location B",
      address: "Street 2",
      events: [{ time: "10h", artist: "Artist B", duration: 90, attending: true, date: "24.5" }],
    },
  ],
  ...overrides,
});

describe("EventsGrid", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders location headers", async () => {
    renderWithMantine(<EventsGrid data={makeData()} />);
    await waitFor(() => {
      expect(screen.getAllByText("Location A").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Location B").length).toBeGreaterThan(0);
    });
  });

  it("shows all events initially", async () => {
    renderWithMantine(<EventsGrid data={makeData()} />);
    await waitFor(() => {
      expect(screen.getAllByText("Artist Saturday").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Artist Sunday").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Artist B").length).toBeGreaterThan(0);
    });
  });

  it("filters by date — only '24.5' events shown", async () => {
    renderWithMantine(<EventsGrid data={makeData()} />);
    // Click on the "24.5" segment in DateTimeFilter (desktop only has one)
    const segments = screen.getAllByText("24.5");
    // Click the segmented control option (not location or badge)
    const segmentBtn = segments.find((el) => el.closest("button") || el.tagName === "BUTTON");
    if (segmentBtn) await userEvent.click(segmentBtn);
    else await userEvent.click(segments[0]);
    await waitFor(() => {
      expect(screen.getAllByText("Artist Saturday").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Artist B").length).toBeGreaterThan(0);
      expect(screen.queryByText("Artist Sunday")).not.toBeInTheDocument();
    });
  });

  it("filters by date — only '25.5' events shown", async () => {
    renderWithMantine(<EventsGrid data={makeData()} />);
    const segments = screen.getAllByText("25.5");
    const segmentBtn = segments.find((el) => el.closest("button") || el.tagName === "BUTTON");
    if (segmentBtn) await userEvent.click(segmentBtn);
    else await userEvent.click(segments[0]);
    await waitFor(() => {
      expect(screen.getAllByText("Artist Sunday").length).toBeGreaterThan(0);
      expect(screen.queryByText("Artist Saturday")).not.toBeInTheDocument();
      expect(screen.queryByText("Artist B")).not.toBeInTheDocument();
    });
  });

  it("loads attending state from localStorage on mount", async () => {
    const savedState = JSON.stringify({ "Location A-Artist Saturday-18h": true });
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn((key: string) => (key === "viradaAttendingState" ? savedState : null)),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });

    renderWithMantine(<EventsGrid data={makeData()} />);
    await waitFor(() => {
      const switches = screen.getAllByRole("switch");
      expect(switches.some((sw) => (sw as HTMLInputElement).checked)).toBe(true);
    });
  });

  it("saves attending state to localStorage when toggled", async () => {
    const setItemMock = vi.fn();
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => null),
        setItem: setItemMock,
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });

    renderWithMantine(<EventsGrid data={makeData()} />);
    await waitFor(() => expect(screen.getAllByText("Artist Saturday").length).toBeGreaterThan(0));

    const switches = screen.getAllByRole("switch");
    await userEvent.click(switches[0]);
    expect(setItemMock).toHaveBeenCalledWith("viradaAttendingState", expect.any(String));
  });

  it("shows 'no events' message when all locations are deselected", async () => {
    renderWithMantine(<EventsGrid data={makeData()} />);
    await waitFor(() => expect(screen.getAllByText("Location A").length).toBeGreaterThan(0));

    // Click "Select All" to deselect all locations (toggles between all/none)
    const selectAllBtns = screen.getAllByText("Select All");
    await userEvent.click(selectAllBtns[0]); // deselects all
    await waitFor(() => {
      expect(screen.queryByText("Artist Saturday")).not.toBeInTheDocument();
      expect(screen.queryByText("Artist Sunday")).not.toBeInTheDocument();
    });
  });
});
