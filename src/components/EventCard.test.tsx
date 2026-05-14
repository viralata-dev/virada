import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EventCard } from "../components/EventCard";

const renderWithMantine = (ui: React.ReactElement) =>
  render(<MantineProvider>{ui}</MantineProvider>);

const baseEvent = {
  time: "18h",
  artist: "Test Artist",
  duration: 60,
  attending: false,
  date: "24.5",
};

describe("EventCard", () => {
  it("renders artist name", () => {
    renderWithMantine(<EventCard event={baseEvent} onToggleAttending={vi.fn()} />);
    expect(screen.getByText("Test Artist")).toBeInTheDocument();
  });

  it("renders event time", () => {
    renderWithMantine(<EventCard event={baseEvent} onToggleAttending={vi.fn()} />);
    expect(screen.getByText("18h")).toBeInTheDocument();
  });

  it("renders duration badge in human-readable format", () => {
    renderWithMantine(<EventCard event={baseEvent} onToggleAttending={vi.fn()} />);
    expect(screen.getByText("1h")).toBeInTheDocument();
  });

  it("renders 'Saturday' badge for date '24.5'", () => {
    renderWithMantine(<EventCard event={baseEvent} onToggleAttending={vi.fn()} />);
    expect(screen.getByText("Saturday")).toBeInTheDocument();
  });

  it("renders 'Sunday' badge for date '25.5'", () => {
    renderWithMantine(
      <EventCard event={{ ...baseEvent, date: "25.5" }} onToggleAttending={vi.fn()} />
    );
    expect(screen.getByText("Sunday")).toBeInTheDocument();
  });

  it("does not render day badge when date is undefined", () => {
    renderWithMantine(
      <EventCard event={{ ...baseEvent, date: undefined }} onToggleAttending={vi.fn()} />
    );
    expect(screen.queryByText("Saturday")).not.toBeInTheDocument();
    expect(screen.queryByText("Sunday")).not.toBeInTheDocument();
  });

  it("toggle switch starts unchecked when attending is false", () => {
    renderWithMantine(<EventCard event={baseEvent} onToggleAttending={vi.fn()} />);
    const toggle = screen.getByRole("switch");
    expect(toggle).not.toBeChecked();
  });

  it("toggle switch starts checked when attending is true", () => {
    renderWithMantine(
      <EventCard event={{ ...baseEvent, attending: true }} onToggleAttending={vi.fn()} />
    );
    const toggle = screen.getByRole("switch");
    expect(toggle).toBeChecked();
  });

  it("clicking toggle calls onToggleAttending with new value (true)", async () => {
    const onToggleAttending = vi.fn();
    renderWithMantine(<EventCard event={baseEvent} onToggleAttending={onToggleAttending} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onToggleAttending).toHaveBeenCalledWith(true);
  });

  it("clicking toggle calls onToggleAttending with false when was true", async () => {
    const onToggleAttending = vi.fn();
    renderWithMantine(
      <EventCard event={{ ...baseEvent, attending: true }} onToggleAttending={onToggleAttending} />
    );
    await userEvent.click(screen.getByRole("switch"));
    expect(onToggleAttending).toHaveBeenCalledWith(false);
  });

  describe("Happening Now badge", () => {
    beforeEach(() => {
      // Mock Date to be 24.5.2025 at 19:00 — within the 18h + 60min event window
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 4, 24, 19, 0, 0)); // month is 0-indexed: 4 = May
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("shows 'Happening Now' badge when event is currently happening", () => {
      renderWithMantine(
        <EventCard event={{ ...baseEvent, date: "24.5" }} onToggleAttending={vi.fn()} />
      );
      expect(screen.getByText("Happening Now")).toBeInTheDocument();
    });

    it("does not show 'Happening Now' when date doesn't match", () => {
      renderWithMantine(
        <EventCard event={{ ...baseEvent, date: "25.5" }} onToggleAttending={vi.fn()} />
      );
      expect(screen.queryByText("Happening Now")).not.toBeInTheDocument();
    });

    it("does not show 'Happening Now' when time is outside event window", () => {
      // Event starts at 22h, 60min → ends 23h, but current time is 19h
      renderWithMantine(
        <EventCard
          event={{ ...baseEvent, time: "22h", date: "24.5" }}
          onToggleAttending={vi.fn()}
        />
      );
      expect(screen.queryByText("Happening Now")).not.toBeInTheDocument();
    });
  });
});
