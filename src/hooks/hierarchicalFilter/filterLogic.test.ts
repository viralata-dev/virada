import { buildFilterIndex, type NormalizedEvent } from "@utils/event";
import { describe, expect, it } from "vitest";
import { applyCategoryFilter } from "./categoryFilter";
import { applyDayFilter } from "./dayFilter";
import { computeFacetOptions } from "./facetOptions";
import { applyRegionFilter } from "./regionFilter";
import { applyTimeFilter } from "./timeFilter";
import { applyVenueFilter } from "./venueFilter";

function makeEvent(overrides: Partial<NormalizedEvent>): NormalizedEvent {
  return {
    id: overrides.id ?? "event-id",
    title: overrides.title ?? "Event title",
    venue: overrides.venue ?? "Venue",
    category: overrides.category ?? "Category",
    region: overrides.region ?? "Region",
    startDate: overrides.startDate ?? "2026-05-24",
    startTime: overrides.startTime ?? "10:00",
    endDate: overrides.endDate ?? "2026-05-24",
    endTime: overrides.endTime ?? "11:00",
    startHour: overrides.startHour ?? 10,
    endHour: overrides.endHour ?? 11,
    tags: overrides.tags ?? [],
    description: overrides.description ?? "",
    address: overrides.address ?? "",
    imageUrl: overrides.imageUrl ?? null,
  };
}

function makeFixtures() {
  const events: NormalizedEvent[] = [
    makeEvent({
      id: "e1",
      title: "Morning Music",
      venue: "Venue A",
      category: "Music",
      region: "North",
      startDate: "2026-05-24",
      startTime: "10:00",
      endTime: "11:00",
      startHour: 10,
      tags: ["free", "family"],
    }),
    makeEvent({
      id: "e2",
      title: "Noon Theater",
      venue: "Venue B",
      category: "Theater",
      region: "South",
      startDate: "2026-05-24",
      startTime: "12:00",
      endTime: "14:00",
      startHour: 12,
      endHour: 14,
      tags: ["indoor"],
    }),
    makeEvent({
      id: "e3",
      title: "Night Concert",
      venue: "Venue C",
      category: "Music",
      region: "North",
      startDate: "2026-05-25",
      startTime: "23:00",
      endTime: "01:00",
      startHour: 23,
      endHour: 23,
      tags: ["night"],
    }),
  ];

  return {
    events,
    index: buildFilterIndex(events),
    eventById: new Map(events.map((event) => [event.id, event])),
    allIds: new Set(events.map((event) => event.id)),
  };
}

describe("hierarchical filter handlers", () => {
  it("filters by selected days using union inside the selected set", () => {
    const { index, allIds } = makeFixtures();

    const result = applyDayFilter({
      matchedEventIds: allIds,
      selectedDays: new Set(["2026-05-25"]),
      index,
    });

    expect(Array.from(result).sort()).toEqual(["e3"]);
  });

  it("filters by category, region and venue", () => {
    const { index, allIds } = makeFixtures();

    const byCategory = applyCategoryFilter({
      matchedEventIds: allIds,
      selectedCategories: new Set(["Music"]),
      index,
    });
    expect(Array.from(byCategory).sort()).toEqual(["e1", "e3"]);

    const byRegion = applyRegionFilter({
      matchedEventIds: allIds,
      selectedRegions: new Set(["South"]),
      index,
    });
    expect(Array.from(byRegion).sort()).toEqual(["e2"]);

    const byVenue = applyVenueFilter({
      matchedEventIds: allIds,
      selectedVenues: new Set(["Venue A", "Venue C"]),
      index,
    });
    expect(Array.from(byVenue).sort()).toEqual(["e1", "e3"]);
  });

  it("applies 'all' time preset using custom hour range", () => {
    const { index, allIds, eventById } = makeFixtures();

    const result = applyTimeFilter({
      matchedEventIds: allIds,
      selectedTimePreset: "all",
      customTimeRange: [11, 12],
      index,
      eventById,
      currentDate: "2026-05-24",
      currentHour: 0,
      currentMinutes: 0,
    });

    expect(Array.from(result).sort()).toEqual(["e2"]);
  });

  it("matches 'now' and 'next' presets correctly", () => {
    const { index, allIds, eventById } = makeFixtures();

    const nowResult = applyTimeFilter({
      matchedEventIds: allIds,
      selectedTimePreset: "now",
      customTimeRange: [0, 24],
      index,
      eventById,
      currentDate: "2026-05-24",
      currentHour: 10,
      currentMinutes: 30,
    });
    expect(Array.from(nowResult).sort()).toEqual(["e1"]);

    const nextResult = applyTimeFilter({
      matchedEventIds: allIds,
      selectedTimePreset: "next",
      customTimeRange: [0, 24],
      index,
      eventById,
      currentDate: "2026-05-24",
      currentHour: 9,
      currentMinutes: 30,
    });
    expect(Array.from(nextResult).sort()).toEqual(["e1"]);
  });

  it("treats overnight events as happening now after start time", () => {
    const { index, allIds, eventById } = makeFixtures();

    const result = applyTimeFilter({
      matchedEventIds: allIds,
      selectedTimePreset: "now",
      customTimeRange: [0, 24],
      index,
      eventById,
      currentDate: "2026-05-25",
      currentHour: 23,
      currentMinutes: 30,
    });

    expect(Array.from(result).sort()).toEqual(["e3"]);
  });

  it("computes facet counts only from matched event ids", () => {
    const { events, index } = makeFixtures();

    const facets = computeFacetOptions(events, new Set(["e1", "e3"]), index);

    expect(facets.days).toEqual([
      { date: "2026-05-24", count: 1 },
      { date: "2026-05-25", count: 1 },
    ]);
    expect(facets.categories).toEqual([{ category: "Music", count: 2 }]);
    expect(facets.venues).toEqual([
      { venue: "Venue A", count: 1 },
      { venue: "Venue C", count: 1 },
    ]);
    expect(facets.tags).toEqual([
      { tag: "family", count: 1 },
      { tag: "free", count: 1 },
      { tag: "night", count: 1 },
    ]);
  });
});
