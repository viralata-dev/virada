import type { FilterIndex } from "@utils/event";
import { intersectSets, unionSets } from "@utils/event";

type VenueFilterArgs = {
  matchedEventIds: Set<string>;
  selectedVenues: Set<string>;
  index: FilterIndex;
};

export function applyVenueFilter({
  matchedEventIds,
  selectedVenues,
  index,
}: VenueFilterArgs): Set<string> {
  if (selectedVenues.size === 0) {
    return matchedEventIds;
  }

  const venueEventIds: Set<string>[] = [];
  for (const venue of selectedVenues) {
    const ids = index.venueToEventIds.get(venue);
    if (ids) {
      venueEventIds.push(ids);
    }
  }

  return intersectSets(matchedEventIds, unionSets(...venueEventIds));
}
