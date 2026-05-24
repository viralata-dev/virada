import type { NormalizedEvent } from "@utils/event";

export type TimePreset = "now" | "next" | "all" | null;

/**
 * Filter state for hierarchical filtering.
 */
export interface HierarchicalFilterState {
  selectedDays: Set<string>; // dates like "2026-05-24"
  selectedTimePreset: TimePreset; // time preset or custom
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
  availableCategoryOptions: string[];
  availableRegionOptions: string[];
  availableVenueOptions: string[];
}
