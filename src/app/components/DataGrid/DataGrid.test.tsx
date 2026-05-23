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
    ActionCircleButton: ({ ariaLabel, onClick }: { ariaLabel: string; onClick?: () => void }) => (
        <button type="button" aria-label={ariaLabel} onClick={onClick}>
            {ariaLabel}
        </button>
    ),
    ActionSimpleButton: ({ ariaLabel, onClick }: { ariaLabel: string; onClick?: () => void }) => (
        <button type="button" aria-label={ariaLabel} onClick={onClick}>
            {ariaLabel}
        </button>
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

        await userEvent.click(screen.getByRole("button", { name: "Abrir filtros" }));

        const day24Button = await screen.findByRole("button", {
            name: "Dia 2026-05-24 (1)",
        });
        const day25Button = await screen.findByRole("button", {
            name: "Dia 2026-05-25 (1)",
        });

        await userEvent.click(day25Button);

        await waitFor(() => {
            expect(screen.queryByText("Evento Sabado")).not.toBeInTheDocument();
            expect(screen.getByText("Evento Domingo")).toBeInTheDocument();
            expect(screen.getByText("1 Eventos encontrados!")).toBeInTheDocument();
        });

        // Both day filters stay visible and both can be selected together.
        expect(screen.getByRole("button", { name: "Dia 2026-05-24 (1)" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Dia 2026-05-25 (1)" })).toBeInTheDocument();

        await userEvent.click(day24Button);

        await waitFor(() => {
            expect(screen.getByText("Evento Sabado")).toBeInTheDocument();
            expect(screen.getByText("Evento Domingo")).toBeInTheDocument();
            expect(screen.getByText("2 Eventos encontrados!")).toBeInTheDocument();
        });
    });

    it("allows selecting multiple category values with search after first selection", async () => {
        renderWithMantine();

        await waitFor(() => {
            expect(screen.getByText("Evento Sabado")).toBeInTheDocument();
            expect(screen.getByText("Evento Domingo")).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole("button", { name: "Abrir filtros" }));

        const categoryInput = await screen.findByPlaceholderText("Selecione categorias...");

        await userEvent.click(categoryInput);
        await userEvent.click(await screen.findByText("Musica (1)"));

        await waitFor(() => {
            expect(screen.getByText("Evento Sabado")).toBeInTheDocument();
            expect(screen.queryByText("Evento Domingo")).not.toBeInTheDocument();
            expect(screen.getByText("1 Eventos encontrados!")).toBeInTheDocument();
        });

        await userEvent.click(categoryInput);
        await userEvent.type(categoryInput, "Tea");
        await userEvent.click(await screen.findByText("Teatro (1)"));

        await waitFor(() => {
            expect(screen.getByText("Evento Sabado")).toBeInTheDocument();
            expect(screen.getByText("Evento Domingo")).toBeInTheDocument();
            expect(screen.getByText("2 Eventos encontrados!")).toBeInTheDocument();
        });
    });

    it("cascades local options from selected category", async () => {
        renderWithMantine();

        await userEvent.click(screen.getByRole("button", { name: "Abrir filtros" }));

        const categoryInput = await screen.findByPlaceholderText("Selecione categorias...");
        await userEvent.click(categoryInput);
        await userEvent.click(await screen.findByText("Musica (1)"));

        const localInput = await screen.findByPlaceholderText("Selecione locais...");
        await userEvent.click(localInput);

        await waitFor(() => {
            expect(screen.getByText("Local A (1)")).toBeInTheDocument();
            expect(screen.getByText("Local B (0)")).toBeInTheDocument();
        });
    });

    it("allows selecting multiple region values after selecting one", async () => {
        renderWithMantine();

        await userEvent.click(screen.getByRole("button", { name: "Abrir filtros" }));

        const regionInput = await screen.findByPlaceholderText("Selecione regioes...");
        await userEvent.click(regionInput);
        await userEvent.click(await screen.findByText("Centro (1)"));

        await waitFor(() => {
            expect(screen.getByText("Evento Sabado")).toBeInTheDocument();
            expect(screen.queryByText("Evento Domingo")).not.toBeInTheDocument();
            expect(screen.getByText("1 Eventos encontrados!")).toBeInTheDocument();
        });

        await userEvent.click(regionInput);
        await userEvent.type(regionInput, "Zona");
        await userEvent.click(await screen.findByText("Zona Sul (0)"));

        await waitFor(() => {
            expect(screen.getByText("Evento Sabado")).toBeInTheDocument();
            expect(screen.getByText("Evento Domingo")).toBeInTheDocument();
            expect(screen.getByText("2 Eventos encontrados!")).toBeInTheDocument();
        });
    });
});
