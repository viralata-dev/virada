import type { CSSProperties } from "react";
import type { DayGroups, Event, Location } from "../types/event";
import type { EventRecord } from "../types/event26";

const SATURDAY_DATE = "24.5";
const SUNDAY_DATE = "25.5";
const PIXELS_PER_HOUR = 100;

export interface NormalizedEvent {
  id: string;
  title: string;
  venue: string;
  category: string;
  region: string;
  startDate: string;
  startTime: string;
  endTime: string;
  startHour: number;
  endHour: number;
  tags: string[];
  description: string;
  address: string;
  imageUrl: string | null;
}

export interface FilterIndex {
  dayToEventIds: Map<string, Set<string>>;
  hourToEventIds: Map<number, Set<string>>;
  categoryToEventIds: Map<string, Set<string>>;
  venueToEventIds: Map<string, Set<string>>;
  regionToEventIds: Map<string, Set<string>>;
  allEventIds: Set<string>;
}

export function parseTimeToHour(timeStr: string | null): number {
  if (!timeStr) return 0;
  const match = timeStr.match(/^(\d+):/);
  return match ? Math.min(23, Math.max(0, Number.parseInt(match[1], 10))) : 0;
}

export function normalizeEvent(record: EventRecord, index: number): NormalizedEvent | null {
  if (!record.title || !record.venue || !record.category || !record.start_date) {
    return null;
  }

  const startHour = parseTimeToHour(record.start_time);
  const endHour = parseTimeToHour(record.end_time);

  return {
    id: record.source_url || `event-${index}`,
    title: record.title,
    venue: record.venue.trim(),
    category: record.category.trim(),
    region: record.region?.trim() ?? "Unknown",
    startDate: record.start_date,
    startTime: record.start_time ?? "00:00",
    endTime: record.end_time ?? "23:59",
    startHour,
    endHour: endHour >= startHour ? endHour : 23,
    tags: (record.tags ?? []).filter((t) => t?.trim()),
    description: record.description ?? "",
    address: record.address ?? "",
    imageUrl: record.image_url,
  };
}

export function buildFilterIndex(events: NormalizedEvent[]): FilterIndex {
  const index: FilterIndex = {
    dayToEventIds: new Map(),
    hourToEventIds: new Map(),
    categoryToEventIds: new Map(),
    venueToEventIds: new Map(),
    regionToEventIds: new Map(),
    allEventIds: new Set(),
  };

  const getOrCreate = <K, V>(map: Map<K, Set<V>>, key: K): Set<V> => {
    let set = map.get(key);
    if (!set) {
      set = new Set();
      map.set(key, set);
    }
    return set;
  };

  for (const event of events) {
    index.allEventIds.add(event.id);
    getOrCreate(index.dayToEventIds, event.startDate).add(event.id);
    getOrCreate(index.hourToEventIds, event.startHour).add(event.id);
    getOrCreate(index.categoryToEventIds, event.category).add(event.id);
    getOrCreate(index.venueToEventIds, event.venue).add(event.id);
    getOrCreate(index.regionToEventIds, event.region).add(event.id);
  }

  return index;
}

export function intersectSets<T>(...sets: Set<T>[]): Set<T> {
  if (sets.length === 0) return new Set();
  if (sets.length === 1) return new Set(sets[0]);

  const result = new Set(sets[0]);
  for (const set of sets.slice(1)) {
    for (const item of result) {
      if (!set.has(item)) {
        result.delete(item);
      }
    }
  }

  return result;
}

export function unionSets<T>(...sets: Set<T>[]): Set<T> {
  const result = new Set<T>();
  for (const set of sets) {
    for (const item of set) {
      result.add(item);
    }
  }

  return result;
}

export function timeToHour(timeStr: string): number {
  const match = timeStr.match(/^(\d+)h/);
  if (match) {
    return Number.parseInt(match[1], 10);
  }
  return 0;
}

export function dateToNumeric(dateStr: string | undefined): number {
  if (!dateStr) return 999;
  const parts = dateStr.split(".");
  if (parts.length === 2) {
    const day = Number.parseInt(parts[0], 10);
    if (!Number.isNaN(day)) return day;
  }
  return 999;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours > 0 ? `${hours}h` : ""}${mins > 0 ? ` ${mins}min` : ""}`;
}

export function isEventHappening(
  time: string,
  duration: number,
  date: string | undefined,
  now: Date
): boolean {
  const currentHour = now.getHours();
  const currentDate = `${now.getDate()}.${now.getMonth() + 1}`;

  const timeMatch = time.match(/^(\d+)h(\d+)?/);
  if (!timeMatch) return false;

  const eventHour = Number.parseInt(timeMatch[1], 10);
  const eventMinutes = timeMatch[2] ? Number.parseInt(timeMatch[2], 10) : 0;

  if (date && date !== currentDate) {
    return false;
  }

  const eventEndHour = eventHour + Math.floor(duration / 60);
  const eventEndMinutes = eventMinutes + (duration % 60);

  const eventStartTime = eventHour + eventMinutes / 60;
  const eventEndTime = eventEndHour + eventEndMinutes / 60;
  const currentTime = currentHour + now.getMinutes() / 60;

  return currentTime >= eventStartTime && currentTime <= eventEndTime;
}

export function sortEventsByDateAndTime(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    const dateA = dateToNumeric(a.date);
    const dateB = dateToNumeric(b.date);

    if (dateA !== dateB) {
      return dateA - dateB;
    }

    return timeToHour(a.time) - timeToHour(b.time);
  });
}

export function splitEventsByDay(events: Event[]): DayGroups {
  const saturday: Event[] = [];
  const sunday: Event[] = [];
  const other: Event[] = [];

  for (const event of events) {
    if (event.date === SATURDAY_DATE) {
      saturday.push(event);
      continue;
    }

    if (event.date === SUNDAY_DATE) {
      sunday.push(event);
      continue;
    }

    other.push(event);
  }

  const sortByTime = (a: Event, b: Event) => timeToHour(a.time) - timeToHour(b.time);

  saturday.sort(sortByTime);
  sunday.sort(sortByTime);
  other.sort(sortByTime);

  return { saturday, sunday, other };
}

export function getTimelineMinHour(events: Event[]): number {
  if (events.length === 0) {
    return 0;
  }

  const hours = events.map((event) => timeToHour(event.time));
  return Math.max(0, Math.min(...hours) - 1);
}

export function calculateTimelineHeight(events: Event[]): number {
  if (events.length === 0) {
    return 0;
  }

  const hours = events.map((event) => timeToHour(event.time));
  const minHour = Math.max(0, Math.min(...hours) - 1);
  const maxHour = Math.min(24, Math.max(...hours) + 1);

  return (maxHour - minHour + 1) * PIXELS_PER_HOUR;
}

export function getEventTopOffset(time: string, minHour: number): number {
  return (timeToHour(time) - minHour) * PIXELS_PER_HOUR;
}

export function getTimelineCardHeight(duration: number): number {
  return Math.max(48, (duration / 60) * PIXELS_PER_HOUR - 12);
}

export function getEventCardStyle(event: Event, isHappening: boolean): CSSProperties {
  const baseStyle: CSSProperties = {
    height: `${(event.duration / 60) * 5}rem`,
    display: "flex",
    flexDirection: "column",
    borderWidth: isHappening ? "4px" : "1px",
  };

  if (isHappening) {
    return {
      ...baseStyle,
      backgroundColor: "#FFF3E0",
      borderColor: "#FF9800",
    };
  }

  if (event.date === SATURDAY_DATE) {
    return {
      ...baseStyle,
      backgroundColor: "#E3F2FD",
      borderColor: "#2196F3",
    };
  }

  if (event.date === SUNDAY_DATE) {
    return {
      ...baseStyle,
      backgroundColor: "#F3E5F5",
      borderColor: "#9C27B0",
    };
  }

  return baseStyle;
}

export function generateEventId(locationName: string, artistName: string, time: string): string {
  return `${locationName}-${artistName}-${time}`;
}

export function buildAttendingState(locations: Location[]): Record<string, boolean> {
  const attendingState: Record<string, boolean> = {};

  for (const location of locations) {
    for (const event of location.events) {
      attendingState[generateEventId(location.name, event.artist, event.time)] = event.attending;
    }
  }

  return attendingState;
}
