"use client";

import type { FilterIndex, NormalizedEvent } from "@utils/event";
import { buildFilterIndex, intersectSets, normalizeEvent, unionSets } from "@utils/event";
import { useMemo, useState } from "react";
import type { EventRecord } from "~/types/event26";

/**
 * Filter state for hierarchical filtering.
 */
export interface HierarchicalFilterState {
  selectedDays: Set<string>; // dates like "2026-05-24"
  selectedTimePreset: "now" | "next" | "all" | null; // time preset or custom
  customTimeRange: [number, number]; // [startHour, endHour] for custom range
  selectedCategories: Set<string>; // category names
  selectedRegions: Set<string>; // region names
  selectedVenues: Set<string>; // venue names
  selectedTags: Set<string>; // tag names
}

/**
 * Available options at each filter level.
 */
export interface FacetOptions {
  days: Array<{ date: string; count: number }>;
  hours: Array<{ hour: number; count: number }>;
  categories: Array<{ category: string; count: number }>;
  regions: Array<{ region: string; count: number }>;
  venues: Array<{ venue: string; count: number }>;
  tags: Array<{ tag: string; count: number }>;
}

/**
 * Result of filtering: filtered events and facet information.
 */
export interface FilteredResult {
  filteredEvents: NormalizedEvent[];
  matchedEventIds: Set<string>;
  facetOptions: FacetOptions;
  totalCount: number;
}

/**
 * Check if an event is "happening now" (currently ongoing).
 * start_time <= current time < end_time
 */
function isEventHappeningNow(
  event: NormalizedEvent,
  currentDate: string,
  currentHour: number,
  currentMinutes: number
): boolean {
  // Check if event date matches today
  if (event.startDate !== currentDate) {
    return false;
  }

  // Parse start and end times for minute-level precision
  const [startHourStr, startMinStr] = event.startTime.split(":").map(Number);
  const [endHourStr, endMinStr] = event.endTime.split(":").map(Number);

  const startTotalMinutes = (startHourStr ?? 0) * 60 + (startMinStr ?? 0);
  const endTotalMinutes = (endHourStr ?? 0) * 60 + (endMinStr ?? 0);
  const currentTotalMinutes = currentHour * 60 + currentMinutes;

  // Handle events ending after midnight
  let adjustedEndTotalMinutes = endTotalMinutes;
  if (adjustedEndTotalMinutes < startTotalMinutes) {
    adjustedEndTotalMinutes += 24 * 60;
  }

  return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes < adjustedEndTotalMinutes;
}

/**
 * Check if an event is "happening next" (starting within next 2 hours).
 */
function isEventHappeningNext(
  event: NormalizedEvent,
  currentDate: string,
  currentHour: number,
  currentMinutes: number
): boolean {
  // For simplicity, check if event is on same day and starting within next 2 hours
  if (event.startDate !== currentDate) {
    return false;
  }

  const [startHourStr, startMinStr] = event.startTime.split(":").map(Number);
  const startTotalMinutes = (startHourStr ?? 0) * 60 + (startMinStr ?? 0);
  const currentTotalMinutes = currentHour * 60 + currentMinutes;
  const nextTwoHours = currentTotalMinutes + 2 * 60;

  return currentTotalMinutes < startTotalMinutes && startTotalMinutes <= nextTwoHours;
}

/**
 * Custom hook for hierarchical faceted filtering with cascading dependencies.
 *
 * @param rawEvents - Raw EventRecord array from API/data
 * @returns Filter state, setters, and filtering result
 */
export function useHierarchicalFilter(rawEvents: EventRecord[]) {
  // Normalize events once on mount
  const normalizedEvents = useMemo(() => {
    return rawEvents
      .map((record, index) => normalizeEvent(record, index))
      .filter((event) => event !== null) as NormalizedEvent[];
  }, [rawEvents]);

  // Build index once
  const index = useMemo(() => buildFilterIndex(normalizedEvents), [normalizedEvents]);

  // Filter state
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
  const [selectedTimePreset, setSelectedTimePreset] = useState<"now" | "next" | "all" | null>(
    "all"
  );
  const [customTimeRange, setCustomTimeRange] = useState<[number, number]>([0, 24]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());
  const [selectedVenues, setSelectedVenues] = useState<Set<string>>(new Set());
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  // Get current date/time for "happening now/next" logic
  const now = new Date();
  const todayDate = now.toISOString().split("T")[0]; // "2026-05-20"
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  // Compute filtered results and facet options
  const filterResult = useMemo(() => {
    let matchedEventIds = new Set(index.allEventIds);

    // Step 1: Apply day filter
    if (selectedDays.size > 0) {
      const dayEventIds: Set<string>[] = [];
      for (const day of selectedDays) {
        const ids = index.dayToEventIds.get(day);
        if (ids) dayEventIds.push(ids);
      }
      matchedEventIds = intersectSets(matchedEventIds, unionSets(...dayEventIds));
    }

    // Step 2: Apply time filter
    if (selectedTimePreset && selectedTimePreset !== "all") {
      const timeFilteredEventIds = new Set<string>();
      for (const eventId of matchedEventIds) {
        const event = normalizedEvents.find((e) => e.id === eventId);
        if (!event) continue;

        if (selectedTimePreset === "now") {
          if (isEventHappeningNow(event, todayDate, currentHour, currentMinutes)) {
            timeFilteredEventIds.add(eventId);
          }
        } else if (selectedTimePreset === "next") {
          if (isEventHappeningNext(event, todayDate, currentHour, currentMinutes)) {
            timeFilteredEventIds.add(eventId);
          }
        }
      }
      matchedEventIds = timeFilteredEventIds;
    } else if (selectedTimePreset === "all") {
      // Custom time range
      const [startHour, endHour] = customTimeRange;
      const rangeEventIds: Set<string>[] = [];
      for (let h = startHour; h <= endHour; h++) {
        const ids = index.hourToEventIds.get(h);
        if (ids) rangeEventIds.push(ids);
      }
      if (rangeEventIds.length > 0) {
        matchedEventIds = intersectSets(matchedEventIds, unionSets(...rangeEventIds));
      }
    }

    // Step 3: Apply category filter (multi-select with union logic)
    if (selectedCategories.size > 0) {
      const categoryEventIds: Set<string>[] = [];
      for (const category of selectedCategories) {
        const ids = index.categoryToEventIds.get(category);
        if (ids) categoryEventIds.push(ids);
      }
      matchedEventIds = intersectSets(matchedEventIds, unionSets(...categoryEventIds));
    }

    // Step 4: Apply region filter (multi-select with union logic)
    if (selectedRegions.size > 0) {
      const regionEventIds: Set<string>[] = [];
      for (const region of selectedRegions) {
        const ids = index.regionToEventIds.get(region);
        if (ids) regionEventIds.push(ids);
      }
      matchedEventIds = intersectSets(matchedEventIds, unionSets(...regionEventIds));
    }

    // Step 5: Apply venue filter (multi-select with union logic)
    if (selectedVenues.size > 0) {
      const venueEventIds: Set<string>[] = [];
      for (const venue of selectedVenues) {
        const ids = index.venueToEventIds.get(venue);
        if (ids) venueEventIds.push(ids);
      }
      matchedEventIds = intersectSets(matchedEventIds, unionSets(...venueEventIds));
    }

    // Step 6: Apply tags filter (multi-select with union logic)
    if (selectedTags.size > 0) {
      const tagFilteredEventIds = new Set<string>();

      for (const eventId of matchedEventIds) {
        const event = normalizedEvents.find((e) => e.id === eventId);
        if (!event) continue;

        const hasAnySelectedTag = event.tags.some((tag) => selectedTags.has(tag));
        if (hasAnySelectedTag) {
          tagFilteredEventIds.add(eventId);
        }
      }

      matchedEventIds = tagFilteredEventIds;
    }

    // Compute facet options (available choices at each level given current filters)
    const facetOptions = computeFacetOptions(normalizedEvents, matchedEventIds, index);

    // Convert matched IDs to event objects and sort
    const filteredEvents = Array.from(matchedEventIds)
      .map((id) => normalizedEvents.find((e) => e.id === id))
      .filter((e) => e !== undefined) as NormalizedEvent[];

    filteredEvents.sort((a, b) => {
      const dateCompare = a.startDate.localeCompare(b.startDate);
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });

    return {
      filteredEvents,
      matchedEventIds,
      facetOptions,
      totalCount: filteredEvents.length,
    };
  }, [
    normalizedEvents,
    index,
    selectedDays,
    selectedTimePreset,
    customTimeRange,
    selectedCategories,
    selectedRegions,
    selectedVenues,
    selectedTags,
    todayDate,
    currentHour,
    currentMinutes,
  ]);

  return {
    // State
    selectedDays,
    selectedTimePreset,
    customTimeRange,
    selectedCategories,
    selectedRegions,
    selectedVenues,
    selectedTags,

    // State setters
    setSelectedDays,
    setSelectedTimePreset,
    setCustomTimeRange,
    setSelectedCategories,
    setSelectedRegions,
    setSelectedVenues,
    setSelectedTags,

    // Clear helpers
    clearAllFilters: () => {
      setSelectedDays(new Set());
      setSelectedTimePreset("all");
      setCustomTimeRange([0, 24]);
      setSelectedCategories(new Set());
      setSelectedRegions(new Set());
      setSelectedVenues(new Set());
      setSelectedTags(new Set());
    },

    // Result
    ...filterResult,
  };
}

/**
 * Compute available facet options given current filter selections.
 * This ensures dependent filters only show relevant options.
 */
function computeFacetOptions(
  allEvents: NormalizedEvent[],
  matchedEventIds: Set<string>,
  index: FilterIndex
): FacetOptions {
  // Start with matched events for base facet computation
  const baseEventIds = matchedEventIds;

  // Days: count all distinct days (with counts)
  const dayCounts = new Map<string, number>();
  for (const date of index.dayToEventIds.keys()) {
    const dayIds = index.dayToEventIds.get(date);
    if (!dayIds) continue;
    const count = Array.from(dayIds).filter((id) => baseEventIds.has(id)).length;
    if (count > 0) {
      dayCounts.set(date, count);
    }
  }

  // Hours: count distinct start hours in matched events
  const hourCounts = new Map<number, number>();
  for (const hour of index.hourToEventIds.keys()) {
    const hourIds = index.hourToEventIds.get(hour);
    if (!hourIds) continue;
    const count = Array.from(hourIds).filter((id) => baseEventIds.has(id)).length;
    if (count > 0) {
      hourCounts.set(hour, count);
    }
  }

  // Categories: count distinct categories in matched events
  const categoryCounts = new Map<string, number>();
  for (const category of index.categoryToEventIds.keys()) {
    const catIds = index.categoryToEventIds.get(category);
    if (!catIds) continue;
    const count = Array.from(catIds).filter((id) => baseEventIds.has(id)).length;
    if (count > 0) {
      categoryCounts.set(category, count);
    }
  }

  // Regions: count distinct regions in matched events
  const regionCounts = new Map<string, number>();
  for (const region of index.regionToEventIds.keys()) {
    const regionIds = index.regionToEventIds.get(region);
    if (!regionIds) continue;
    const count = Array.from(regionIds).filter((id) => baseEventIds.has(id)).length;
    if (count > 0) {
      regionCounts.set(region, count);
    }
  }

  // Venues: count distinct venues in matched events
  const venueCounts = new Map<string, number>();
  for (const venue of index.venueToEventIds.keys()) {
    const venueIds = index.venueToEventIds.get(venue);
    if (!venueIds) continue;
    const count = Array.from(venueIds).filter((id) => baseEventIds.has(id)).length;
    if (count > 0) {
      venueCounts.set(venue, count);
    }
  }

  // Tags: count distinct tags in matched events
  const tagCounts = new Map<string, number>();
  for (const event of allEvents) {
    if (!baseEventIds.has(event.id)) continue;

    for (const tag of event.tags) {
      if (!tag) continue;
      const previousCount = tagCounts.get(tag) ?? 0;
      tagCounts.set(tag, previousCount + 1);
    }
  }

  return {
    days: Array.from(dayCounts.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date)),

    hours: Array.from(hourCounts.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => a.hour - b.hour),

    categories: Array.from(categoryCounts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => a.category.localeCompare(b.category)),

    regions: Array.from(regionCounts.entries())
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => a.region.localeCompare(b.region)),

    venues: Array.from(venueCounts.entries())
      .map(([venue, count]) => ({ venue, count }))
      .sort((a, b) => a.venue.localeCompare(b.venue)),

    tags: Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => a.tag.localeCompare(b.tag)),
  };
}
