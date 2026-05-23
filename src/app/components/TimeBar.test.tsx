import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import type React from "react";
import { describe, expect, it } from "vitest";
import { TimeBar } from "./TimeBar";

const renderWithMantine = (ui: React.ReactElement) =>
  render(<MantineProvider>{ui}</MantineProvider>);

describe("TimeBar", () => {
  it("renders the correct number of hour boxes for 17–24", () => {
    renderWithMantine(<TimeBar startHour={17} endHour={24} />);
    // 17,18,19,20,21,22,23,24 = 8 hours
    for (let h = 17; h <= 24; h++) {
      expect(screen.getByText(`${h}:00`)).toBeInTheDocument();
    }
  });

  it("renders hour labels as 'H:00' format", () => {
    renderWithMantine(<TimeBar startHour={0} endHour={3} />);
    expect(screen.getByText("0:00")).toBeInTheDocument();
    expect(screen.getByText("1:00")).toBeInTheDocument();
    expect(screen.getByText("2:00")).toBeInTheDocument();
    expect(screen.getByText("3:00")).toBeInTheDocument();
  });

  it("renders correct boxes for range 0–6", () => {
    renderWithMantine(<TimeBar startHour={0} endHour={6} />);
    for (let h = 0; h <= 6; h++) {
      expect(screen.getByText(`${h}:00`)).toBeInTheDocument();
    }
  });

  it("renders exactly endHour - startHour + 1 boxes", () => {
    const { container } = renderWithMantine(<TimeBar startHour={10} endHour={13} />);
    // 4 boxes: 10,11,12,13
    const labels = container.querySelectorAll("p, span");
    const hourLabels = Array.from(labels).filter((el) => /^\d+:00$/.test(el.textContent ?? ""));
    expect(hourLabels).toHaveLength(4);
  });
});
