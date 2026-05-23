import { MantineProvider } from "@mantine/core";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataGrid } from "./DataGrid";

vi.mock("@data/events.json", () => ({
    default: [
        {
            event_id: "1",
            source_url: "event-1",
            title: "Evento Sabado",
            subtitle: null,
            description: "",
            start_date: "2026-05-24",
            end_date: "2026-05-24",
            start_time: "10:00",
            end_time: "11:00",
            venue: "Local A",
            address: "Rua A",
            region: "Centro",
            category: "Musica",
            tags: ["gratis"],
            image_url: null,
            raw_html_path: null,
            fetched_at: null,
        },
        {
            event_id: "2",
            source_url: "event-2",
            title: "Evento Domingo",
            subtitle: null,
            description: "",
            start_date: "2026-05-25",
            end_date: "2026-05-25",
            start_time: "12:00",
            end_time: "13:00",
            venue: "Local B",
            address: "Rua B",
            region: "Zona Sul",
            category: "Teatro",
            tags: ["kids"],
            image_url: null,
            raw_html_path: null,
            fetched_at: null,
        },
    ],
}));

vi.mock("./DataCard", () => ({
    NormalizedEventCard: ({ event }: { event: { title: string } }) => <div>{event.title}</div>,
}));

vi.mock("../ActionButton", () => ({
    ActionCircleButton: ({ ariaLabel }: { ariaLabel: string }) => (
        <button type="button">{ariaLabel}</button>
    ),
}));

const renderWithMantine = () => {
    render(
        <MantineProvider>
            <DataGrid />
        </MantineProvider>
    );
};

describe("DataGrid filter wiring", () => {
    it("applies day filter from DataFilter to the visible events list", async () => {
        renderWithMantine();

        await waitFor(() => {
            expect(screen.getByText("Evento Sabado")).toBeInTheDocument();
            expect(screen.getByText("Evento Domingo")).toBeInTheDocument();
        });

        await userEvent.click(screen.getByLabelText("2026-05-25 (1)"));

        await waitFor(() => {
            expect(screen.queryByText("Evento Sabado")).not.toBeInTheDocument();
            expect(screen.getByText("Evento Domingo")).toBeInTheDocument();
            expect(screen.getByText("1 Eventos encontrados!")).toBeInTheDocument();
        });
    });
});
