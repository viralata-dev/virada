import type { FilterIndex } from "@utils/event";
import { intersectSets, unionSets } from "@utils/event";

type RegionFilterArgs = {
  matchedEventIds: Set<string>;
  selectedRegions: Set<string>;
  index: FilterIndex;
};

export function applyRegionFilter({
  matchedEventIds,
  selectedRegions,
  index,
}: RegionFilterArgs): Set<string> {
  if (selectedRegions.size === 0) {
    return matchedEventIds;
  }

  const regionEventIds: Set<string>[] = [];
  for (const region of selectedRegions) {
    const ids = index.regionToEventIds.get(region);
    if (ids) {
      regionEventIds.push(ids);
    }
  }

  return intersectSets(matchedEventIds, unionSets(...regionEventIds));
}
