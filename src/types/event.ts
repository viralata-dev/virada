export interface Event {
  time: string;
  artist: string;
  duration: number;
  attending: boolean;
  date?: string;
}

export interface Location {
  name: string;
  address: string;
  events: Event[];
}

export interface EventsData {
  locations: Location[];
}

export interface DayHeights {
  saturday: number;
  sunday: number;
  other: number;
}

export interface DayGroups {
  saturday: Event[];
  sunday: Event[];
  other: Event[];
}

export type EventsByLocation = Record<string, Event[]>;
