import type { FilterIndex, NormalizedEvent } from "@utils/event";
import { intersectSets, unionSets } from "@utils/event";
import type { TimePreset } from "./types";

type TimeFilterArgs = {
  matchedEventIds: Set<string>;
  selectedTimePreset: TimePreset;
  customTimeRange: [number, number];
  index: FilterIndex;
  eventById: Map<string, NormalizedEvent>;
  currentDate: string;
  currentHour: number;
  currentMinutes: number;
};

/**
 * start_time <= current time < end_time
 */
function isEventHappeningNow(
  event: NormalizedEvent,
  currentDate: string,
  currentHour: number,
  currentMinutes: number
): boolean {
  if (event.startDate !== currentDate) {
    return false;
  }

  const [startHourStr, startMinStr] = event.startTime.split(":").map(Number);
  const [endHourStr, endMinStr] = event.endTime.split(":").map(Number);

  const startTotalMinutes = (startHourStr ?? 0) * 60 + (startMinStr ?? 0);
  const endTotalMinutes = (endHourStr ?? 0) * 60 + (endMinStr ?? 0);
  const currentTotalMinutes = currentHour * 60 + currentMinutes;

  let adjustedEndTotalMinutes = endTotalMinutes;
  if (adjustedEndTotalMinutes < startTotalMinutes) {
    adjustedEndTotalMinutes += 24 * 60;
  }

  return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes < adjustedEndTotalMinutes;
}

/**
 * Event starting within next 2 hours.
 */
function isEventHappeningNext(
  event: NormalizedEvent,
  currentDate: string,
  currentHour: number,
  currentMinutes: number
): boolean {
  if (event.startDate !== currentDate) {
    return false;
  }

  const [startHourStr, startMinStr] = event.startTime.split(":").map(Number);
  const startTotalMinutes = (startHourStr ?? 0) * 60 + (startMinStr ?? 0);
  const currentTotalMinutes = currentHour * 60 + currentMinutes;
  const nextTwoHours = currentTotalMinutes + 2 * 60;

  return currentTotalMinutes < startTotalMinutes && startTotalMinutes <= nextTwoHours;
}

export function applyTimeFilter({
  matchedEventIds,
  selectedTimePreset,
  customTimeRange,
  index,
  eventById,
  currentDate,
  currentHour,
  currentMinutes,
}: TimeFilterArgs): Set<string> {
  if (selectedTimePreset === null) {
    return matchedEventIds;
  }

  if (selectedTimePreset !== "all") {
    const timeFilteredEventIds = new Set<string>();

    for (const eventId of matchedEventIds) {
      const event = eventById.get(eventId);
      if (!event) {
        continue;
      }

      if (selectedTimePreset === "now") {
        if (isEventHappeningNow(event, currentDate, currentHour, currentMinutes)) {
          timeFilteredEventIds.add(eventId);
        }
      }

      if (selectedTimePreset === "next") {
        if (isEventHappeningNext(event, currentDate, currentHour, currentMinutes)) {
          timeFilteredEventIds.add(eventId);
        }
      }
    }

    return timeFilteredEventIds;
  }

  const [startHour, endHour] = customTimeRange;
  const rangeEventIds: Set<string>[] = [];

  for (let hour = startHour; hour <= endHour; hour += 1) {
    const ids = index.hourToEventIds.get(hour);
    if (ids) {
      rangeEventIds.push(ids);
    }
  }

  if (rangeEventIds.length === 0) {
    return matchedEventIds;
  }

  return intersectSets(matchedEventIds, unionSets(...rangeEventIds));
}
