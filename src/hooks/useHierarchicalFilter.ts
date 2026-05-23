"use client";

import type { NormalizedEvent } from "@utils/event";
import { buildFilterIndex, normalizeEvent } from "@utils/event";
import { useMemo, useState } from "react";
import type { EventRecord } from "~/types/event26";
import { applyCategoryFilter } from "./hierarchicalFilter/categoryFilter";
import { applyDayFilter } from "./hierarchicalFilter/dayFilter";
import { computeFacetOptions } from "./hierarchicalFilter/facetOptions";
import { applyRegionFilter } from "./hierarchicalFilter/regionFilter";
import { applyTagFilter } from "./hierarchicalFilter/tagFilter";
import { applyTimeFilter } from "./hierarchicalFilter/timeFilter";
import type {
  FacetOptions,
  FilteredResult,
  HierarchicalFilterState,
  TimePreset,
} from "./hierarchicalFilter/types";
import { applyVenueFilter } from "./hierarchicalFilter/venueFilter";

export type { FacetOptions, FilteredResult, HierarchicalFilterState, TimePreset };

/**
 * Custom hook for hierarchical faceted filtering with cascading dependencies.
 */
export function useHierarchicalFilter(rawEvents: EventRecord[]) {
  const normalizedEvents = useMemo(() => {
    return rawEvents
      .map((record, index) => normalizeEvent(record, index))
      .filter((event): event is NormalizedEvent => event !== null);
  }, [rawEvents]);

  const eventById = useMemo(() => {
    return new Map(normalizedEvents.map((event) => [event.id, event]));
  }, [normalizedEvents]);

  const index = useMemo(() => buildFilterIndex(normalizedEvents), [normalizedEvents]);

  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
  const [selectedTimePreset, setSelectedTimePreset] = useState<TimePreset>("all");
  const [customTimeRange, setCustomTimeRange] = useState<[number, number]>([0, 24]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());
  const [selectedVenues, setSelectedVenues] = useState<Set<string>>(new Set());
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const now = new Date();
  const todayDate = now.toISOString().split("T")[0] ?? "";
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  const filterResult: FilteredResult = useMemo(() => {
    let matchedEventIds = new Set(index.allEventIds);

    matchedEventIds = applyDayFilter({
      matchedEventIds,
      selectedDays,
      index,
    });

    matchedEventIds = applyTimeFilter({
      matchedEventIds,
      selectedTimePreset,
      customTimeRange,
      index,
      eventById,
      currentDate: todayDate,
      currentHour,
      currentMinutes,
    });

    matchedEventIds = applyCategoryFilter({
      matchedEventIds,
      selectedCategories,
      index,
    });

    matchedEventIds = applyRegionFilter({
      matchedEventIds,
      selectedRegions,
      index,
    });

    matchedEventIds = applyVenueFilter({
      matchedEventIds,
      selectedVenues,
      index,
    });

    matchedEventIds = applyTagFilter({
      matchedEventIds,
      selectedTags,
      eventById,
    });

    const facetOptions: FacetOptions = computeFacetOptions(
      normalizedEvents,
      matchedEventIds,
      index
    );

    const filteredEvents = Array.from(matchedEventIds)
      .map((id) => eventById.get(id))
      .filter((event): event is NormalizedEvent => event !== undefined)
      .sort((a, b) => {
        const dateCompare = a.startDate.localeCompare(b.startDate);
        if (dateCompare !== 0) {
          return dateCompare;
        }
        return a.startTime.localeCompare(b.startTime);
      });

    return {
      filteredEvents,
      matchedEventIds,
      facetOptions,
      totalCount: filteredEvents.length,
    };
  }, [
    index,
    selectedDays,
    selectedTimePreset,
    customTimeRange,
    eventById,
    todayDate,
    currentHour,
    currentMinutes,
    selectedCategories,
    selectedRegions,
    selectedVenues,
    selectedTags,
    normalizedEvents,
  ]);

  const filterResetKey = useMemo(
    () =>
      JSON.stringify({
        days: Array.from(selectedDays).sort(),
        timePreset: selectedTimePreset,
        timeRange: customTimeRange,
        categories: Array.from(selectedCategories).sort(),
        regions: Array.from(selectedRegions).sort(),
        venues: Array.from(selectedVenues).sort(),
        tags: Array.from(selectedTags).sort(),
      }),
    [
      customTimeRange,
      selectedCategories,
      selectedDays,
      selectedRegions,
      selectedTags,
      selectedTimePreset,
      selectedVenues,
    ]
  );

  function onCategoriesChange(newCategories: Set<string>) {
    setSelectedCategories(newCategories);
  }

  function onDaysChange(newDays: Set<string>) {
    setSelectedDays(newDays);
  }

  function onTimePresetChange(newPreset: TimePreset) {
    setSelectedTimePreset(newPreset);
  }

  function onCustomTimeRangeChange(newRange: [number, number]) {
    setCustomTimeRange(newRange);
  }

  function onRegionsChange(newRegions: Set<string>) {
    setSelectedRegions(newRegions);
  }

  function onVenuesChange(newVenues: Set<string>) {
    setSelectedVenues(newVenues);
  }

  function onClearAll() {
    setSelectedDays(new Set());
    setSelectedTimePreset("all");
    setCustomTimeRange([0, 24]);
    setSelectedCategories(new Set());
    setSelectedRegions(new Set());
    setSelectedVenues(new Set());
    setSelectedTags(new Set());
  }

  function handleDayToggle(day: string) {
    const newDays = new Set(selectedDays);
    if (newDays.has(day)) {
      newDays.delete(day);
    } else {
      newDays.add(day);
    }
    onDaysChange(newDays);
  }

  function handleSelectAllVisibleVenues(visibleVenueValues: string[]) {
    onVenuesChange(new Set(visibleVenueValues));
  }

  return {
    selectedDays,
    selectedTimePreset,
    customTimeRange,
    selectedCategories,
    selectedRegions,
    selectedVenues,
    selectedTags,
    setSelectedDays,
    setSelectedTimePreset,
    setCustomTimeRange,
    setSelectedCategories,
    setSelectedRegions,
    setSelectedVenues,
    setSelectedTags,
    onCategoriesChange,
    onDaysChange,
    onTimePresetChange,
    onCustomTimeRangeChange,
    onRegionsChange,
    onVenuesChange,
    onClearAll,
    clearAllFilters: onClearAll,
    handleSelectAllVisibleVenues,
    handleDayToggle,
    ...filterResult,
    filterResetKey,
  };
}
