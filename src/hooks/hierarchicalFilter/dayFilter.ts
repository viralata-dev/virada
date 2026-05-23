import type { FilterIndex } from "@utils/event";
import { intersectSets, unionSets } from "@utils/event";

type DayFilterArgs = {
  matchedEventIds: Set<string>;
  selectedDays: Set<string>;
  index: FilterIndex;
};

export function applyDayFilter({
  matchedEventIds,
  selectedDays,
  index,
}: DayFilterArgs): Set<string> {
  if (selectedDays.size === 0) {
    return matchedEventIds;
  }

  const dayEventIds: Set<string>[] = [];
  for (const day of selectedDays) {
    const ids = index.dayToEventIds.get(day);
    if (ids) {
      dayEventIds.push(ids);
    }
  }

  return intersectSets(matchedEventIds, unionSets(...dayEventIds));
}
