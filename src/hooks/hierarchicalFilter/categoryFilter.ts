import type { FilterIndex } from "@utils/event";
import { intersectSets, unionSets } from "@utils/event";

type CategoryFilterArgs = {
  matchedEventIds: Set<string>;
  selectedCategories: Set<string>;
  index: FilterIndex;
};

export function applyCategoryFilter({
  matchedEventIds,
  selectedCategories,
  index,
}: CategoryFilterArgs): Set<string> {
  if (selectedCategories.size === 0) {
    return matchedEventIds;
  }

  const categoryEventIds: Set<string>[] = [];
  for (const category of selectedCategories) {
    const ids = index.categoryToEventIds.get(category);
    if (ids) {
      categoryEventIds.push(ids);
    }
  }

  return intersectSets(matchedEventIds, unionSets(...categoryEventIds));
}
