import type { NormalizedEvent } from "@utils/event";
import { describe, expect, it } from "vitest";
import { groupFavoriteEventsByVenue } from "./page";

function makeEvent(overrides: Partial<NormalizedEvent>): NormalizedEvent {
  return {
    id: overrides.id ?? "event-1",
    title: overrides.title ?? "Evento",
    venue: overrides.venue ?? "Local A",
    category: overrides.category ?? "Categoria",
    region: overrides.region ?? "Centro",
    startDate: overrides.startDate ?? "2026-05-24",
    startTime: overrides.startTime ?? "10:00",
    endDate: overrides.endDate ?? "2026-05-24",
    endTime: overrides.endTime ?? "11:00",
    startHour: overrides.startHour ?? 10,
    endHour: overrides.endHour ?? 11,
    tags: overrides.tags ?? [],
    description: overrides.description ?? "",
    address: overrides.address ?? "Rua A",
    imageUrl: overrides.imageUrl ?? null,
  };
}

describe("groupFavoriteEventsByVenue", () => {
  it("groups favorite timeline columns by venue", () => {
    const grouped = groupFavoriteEventsByVenue([
      makeEvent({ id: "2", venue: "Local B", title: "Evento B" }),
      makeEvent({ id: "1", venue: "Local A", title: "Evento A1" }),
      makeEvent({ id: "3", venue: "Local A", title: "Evento A2" }),
    ]);

    expect(grouped).toHaveLength(2);
    expect(grouped[0]?.[0]).toBe("Local A");
    expect(grouped[0]?.[1].map((event) => event.title)).toEqual(["Evento A1", "Evento A2"]);
    expect(grouped[1]?.[0]).toBe("Local B");
    expect(grouped[1]?.[1].map((event) => event.title)).toEqual(["Evento B"]);
  });

  it("falls back to a default column label when venue is blank", () => {
    const grouped = groupFavoriteEventsByVenue([makeEvent({ venue: "   " })]);

    expect(grouped).toEqual([["Sem local", [expect.objectContaining({ title: "Evento" })]]]);
  });
});
