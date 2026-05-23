"use client";

import { useMemo } from "react";
import type { DayHeights, EventsByLocation, Location } from "../types/event";
import { calculateTimelineHeight, splitEventsByDay, timeToHour } from "../utils/event";

interface UseEventFilteringInput {
  locations: Location[];
  selectedLocations: string[];
  timeRange: [number, number];
  selectedDate: string;
  showAttendingOnly: boolean;
}

interface UseEventFilteringOutput {
  filteredEvents: EventsByLocation;
  dayHeights: DayHeights;
}

const EMPTY_DAY_HEIGHTS: DayHeights = {
  saturday: 0,
  sunday: 0,
  other: 0,
};

export function useEventFiltering({
  locations,
  selectedLocations,
  timeRange,
  selectedDate,
  showAttendingOnly,
}: UseEventFilteringInput): UseEventFilteringOutput {
  return useMemo(() => {
    const filteredEvents: EventsByLocation = {};
    const dayHeights: DayHeights = { ...EMPTY_DAY_HEIGHTS };

    for (const location of locations) {
      if (!selectedLocations.includes(location.name)) {
        continue;
      }

      const visibleEvents = location.events.filter((event) => {
        const hour = timeToHour(event.time);
        const dateMatches = selectedDate === "all" || !event.date || event.date === selectedDate;
        const timeMatches = hour >= timeRange[0] && hour <= timeRange[1];
        const attendingMatches = !showAttendingOnly || event.attending;

        return dateMatches && timeMatches && attendingMatches;
      });

      if (visibleEvents.length === 0) {
        continue;
      }

      const groupedEvents = splitEventsByDay(visibleEvents);

      dayHeights.saturday = Math.max(
        dayHeights.saturday,
        calculateTimelineHeight(groupedEvents.saturday)
      );
      dayHeights.sunday = Math.max(
        dayHeights.sunday,
        calculateTimelineHeight(groupedEvents.sunday)
      );
      dayHeights.other = Math.max(dayHeights.other, calculateTimelineHeight(groupedEvents.other));

      filteredEvents[location.name] = [
        ...groupedEvents.saturday,
        ...groupedEvents.sunday,
        ...groupedEvents.other,
      ];
    }

    return {
      filteredEvents,
      dayHeights,
    };
  }, [locations, selectedLocations, selectedDate, showAttendingOnly, timeRange]);
}
