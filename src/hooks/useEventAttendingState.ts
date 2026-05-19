"use client";

import { useCallback, useEffect, useState } from "react";
import type { Location } from "../types/event";
import { buildAttendingState, generateEventId, sortEventsByDateAndTime } from "../utils/event";

const STORAGE_KEY = "viradaAttendingState";

export function useEventAttendingState(initialLocations: Location[]) {
  const [locations, setLocations] = useState<Location[]>(() =>
    initialLocations.map((location) => ({
      ...location,
      events: sortEventsByDateAndTime(location.events),
    }))
  );

  const saveAttendingState = useCallback((locationsToSave: Location[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(buildAttendingState(locationsToSave)));
    } catch (error) {
      console.error("Error saving attending state:", error);
    }
  }, []);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (!savedState) {
        return;
      }

      const parsedState = JSON.parse(savedState) as Record<string, boolean>;
      setLocations((previousLocations) =>
        previousLocations.map((location) => ({
          ...location,
          events: location.events.map((event) => {
            const eventId = generateEventId(location.name, event.artist, event.time);
            const savedAttending = parsedState[eventId];

            return savedAttending === undefined ? event : { ...event, attending: savedAttending };
          }),
        }))
      );
    } catch (error) {
      console.error("Error loading attending state:", error);
    }
  }, []);

  const toggleAttending = useCallback(
    (locationName: string, artistName: string, attending: boolean) => {
      setLocations((previousLocations) => {
        const updatedLocations = previousLocations.map((location) => {
          if (location.name !== locationName) {
            return location;
          }

          return {
            ...location,
            events: location.events.map((event) =>
              event.artist === artistName ? { ...event, attending } : event
            ),
          };
        });

        saveAttendingState(updatedLocations);

        return updatedLocations;
      });
    },
    [saveAttendingState]
  );

  return {
    locations,
    toggleAttending,
  };
}
