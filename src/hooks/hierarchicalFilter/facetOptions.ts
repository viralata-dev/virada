import type { FilterIndex, NormalizedEvent } from "@utils/event";
import type { FacetOptions } from "./types";

/**
 * Compute available facet options given current filter selections.
 * This ensures dependent filters only show relevant options.
 */
export function computeFacetOptions(
  allEvents: NormalizedEvent[],
  matchedEventIds: Set<string>,
  index: FilterIndex
): FacetOptions {
  const baseEventIds = matchedEventIds;

  const dayCounts = new Map<string, number>();
  for (const date of index.dayToEventIds.keys()) {
    const dayIds = index.dayToEventIds.get(date);
    if (!dayIds) {
      continue;
    }
    const count = Array.from(dayIds).filter((id) => baseEventIds.has(id)).length;
    if (count > 0) {
      dayCounts.set(date, count);
    }
  }

  const hourCounts = new Map<number, number>();
  for (const hour of index.hourToEventIds.keys()) {
    const hourIds = index.hourToEventIds.get(hour);
    if (!hourIds) {
      continue;
    }
    const count = Array.from(hourIds).filter((id) => baseEventIds.has(id)).length;
    if (count > 0) {
      hourCounts.set(hour, count);
    }
  }

  const categoryCounts = new Map<string, number>();
  for (const category of index.categoryToEventIds.keys()) {
    const categoryIds = index.categoryToEventIds.get(category);
    if (!categoryIds) {
      continue;
    }
    const count = Array.from(categoryIds).filter((id) => baseEventIds.has(id)).length;
    if (count > 0) {
      categoryCounts.set(category, count);
    }
  }

  const regionCounts = new Map<string, number>();
  for (const region of index.regionToEventIds.keys()) {
    const regionIds = index.regionToEventIds.get(region);
    if (!regionIds) {
      continue;
    }
    const count = Array.from(regionIds).filter((id) => baseEventIds.has(id)).length;
    if (count > 0) {
      regionCounts.set(region, count);
    }
  }

  const venueCounts = new Map<string, number>();
  for (const venue of index.venueToEventIds.keys()) {
    const venueIds = index.venueToEventIds.get(venue);
    if (!venueIds) {
      continue;
    }
    const count = Array.from(venueIds).filter((id) => baseEventIds.has(id)).length;
    if (count > 0) {
      venueCounts.set(venue, count);
    }
  }

  const tagCounts = new Map<string, number>();
  for (const event of allEvents) {
    if (!baseEventIds.has(event.id)) {
      continue;
    }

    for (const tag of event.tags) {
      if (!tag) {
        continue;
      }
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
