import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { useFavoriteEvents } from "./useFavoriteEvents";

function HookHarness({ eventId }: { eventId: string }) {
  const { isFavorite, toggleFavorite } = useFavoriteEvents();

  return (
    <button type="button" onClick={() => toggleFavorite(eventId)}>
      {isFavorite(eventId) ? "favorito" : "nao-favorito"}
    </button>
  );
}

describe("useFavoriteEvents", () => {
  it("loads favorites from localStorage on mount", async () => {
    const getItemMock = vi.fn(() => JSON.stringify(["event-123"]));

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: getItemMock,
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });

    render(
      <MantineProvider>
        <HookHarness eventId="event-123" />
      </MantineProvider>
    );

    expect(await screen.findByRole("button", { name: "favorito" })).toBeInTheDocument();
    expect(getItemMock).toHaveBeenCalledWith("viradaFavoriteEventIds");
  });

  it("persists favorite ids to localStorage on toggle", async () => {
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

    render(
      <MantineProvider>
        <HookHarness eventId="event-321" />
      </MantineProvider>
    );

    const button = await screen.findByRole("button", { name: "nao-favorito" });
    await userEvent.click(button);

    expect(setItemMock).toHaveBeenCalledWith(
      "viradaFavoriteEventIds",
      JSON.stringify(["event-321"])
    );
    expect(await screen.findByRole("button", { name: "favorito" })).toBeInTheDocument();
  });
});
