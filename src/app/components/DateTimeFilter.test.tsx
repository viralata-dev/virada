import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import { DateTimeFilter } from "./DateTimeFilter";

const renderWithMantine = (ui: React.ReactElement) =>
  render(<MantineProvider>{ui}</MantineProvider>);

describe("DateTimeFilter", () => {
  it("renders 'All Days', '24.5', '25.5' options", () => {
    renderWithMantine(<DateTimeFilter onDateChange={vi.fn()} onTimeRangeChange={vi.fn()} />);
    expect(screen.getByText("All Days")).toBeInTheDocument();
    expect(screen.getByText("24.5")).toBeInTheDocument();
    expect(screen.getByText("25.5")).toBeInTheDocument();
  });

  it("calls onDateChange with '24.5' when that segment is clicked", async () => {
    const onDateChange = vi.fn();
    renderWithMantine(<DateTimeFilter onDateChange={onDateChange} onTimeRangeChange={vi.fn()} />);
    await userEvent.click(screen.getByText("24.5"));
    expect(onDateChange).toHaveBeenCalledWith("24.5");
  });

  it("calls onDateChange with '25.5' when that segment is clicked", async () => {
    const onDateChange = vi.fn();
    renderWithMantine(<DateTimeFilter onDateChange={onDateChange} onTimeRangeChange={vi.fn()} />);
    await userEvent.click(screen.getByText("25.5"));
    expect(onDateChange).toHaveBeenCalledWith("25.5");
  });

  it("calls onDateChange with 'all' when 'All Days' is clicked", async () => {
    const onDateChange = vi.fn();
    renderWithMantine(<DateTimeFilter onDateChange={onDateChange} onTimeRangeChange={vi.fn()} />);
    // Click 24.5 first, then All Days
    await userEvent.click(screen.getByText("24.5"));
    await userEvent.click(screen.getByText("All Days"));
    expect(onDateChange).toHaveBeenLastCalledWith("all");
  });

  it("displays the initial time range as '0h - 24h'", () => {
    renderWithMantine(<DateTimeFilter onDateChange={vi.fn()} onTimeRangeChange={vi.fn()} />);
    expect(screen.getByText("0h - 24h")).toBeInTheDocument();
  });
});
