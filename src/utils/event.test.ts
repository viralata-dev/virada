import { describe, expect, it } from "vitest";
import { dateToNumeric, formatDuration, isEventHappening, timeToHour } from "../utils/event";

describe("timeToHour", () => {
  it("converts '18h' to 18", () => expect(timeToHour("18h")).toBe(18));
  it("converts '20h30' to 20", () => expect(timeToHour("20h30")).toBe(20));
  it("converts '0h' to 0", () => expect(timeToHour("0h")).toBe(0));
  it("converts '9h' to 9", () => expect(timeToHour("9h")).toBe(9));
  it("returns 0 for empty string", () => expect(timeToHour("")).toBe(0));
  it("returns 0 for non-matching string", () => expect(timeToHour("invalid")).toBe(0));
});

describe("dateToNumeric", () => {
  it("converts '24.5' to 24", () => expect(dateToNumeric("24.5")).toBe(24));
  it("converts '25.5' to 25", () => expect(dateToNumeric("25.5")).toBe(25));
  it("returns 999 for undefined", () => expect(dateToNumeric(undefined)).toBe(999));
  it("returns 999 for empty string", () => expect(dateToNumeric("")).toBe(999));
  it("returns 999 for invalid format", () => expect(dateToNumeric("invalid")).toBe(999));
});

describe("formatDuration", () => {
  it("formats 60 minutes as '1h'", () => expect(formatDuration(60)).toBe("1h"));
  it("formats 90 minutes as '1h 30min'", () => expect(formatDuration(90)).toBe("1h 30min"));
  it("formats 30 minutes as '30min'", () => expect(formatDuration(30)).toBe(" 30min"));
  it("formats 120 minutes as '2h'", () => expect(formatDuration(120)).toBe("2h"));
  it("formats 0 minutes as empty string", () => expect(formatDuration(0)).toBe(""));
});

describe("isEventHappening", () => {
  const makeDate = (day: number, month: number, hour: number, minute = 0) => {
    const d = new Date();
    d.setFullYear(2025, month - 1, day);
    d.setHours(hour, minute, 0, 0);
    return d;
  };

  it("returns false when event date doesn't match today", () => {
    // Event is on 24.5, but now is 25.5
    const now = makeDate(25, 5, 19, 0);
    expect(isEventHappening("18h", 120, "24.5", now)).toBe(false);
  });

  it("returns true when current time is within event window on correct date", () => {
    // Event starts 18h, duration 120min (ends 20h), now is 19h on 24.5
    const now = makeDate(24, 5, 19, 0);
    expect(isEventHappening("18h", 120, "24.5", now)).toBe(true);
  });

  it("returns false when current time is before event starts", () => {
    const now = makeDate(24, 5, 17, 0);
    expect(isEventHappening("18h", 60, "24.5", now)).toBe(false);
  });

  it("returns false when current time is after event ends", () => {
    const now = makeDate(24, 5, 21, 0);
    expect(isEventHappening("18h", 120, "24.5", now)).toBe(false);
  });

  it("handles '20h30' minute format correctly", () => {
    // Event starts 20h30, duration 60min (ends 21h30), now is 21h
    const now = makeDate(24, 5, 21, 0);
    expect(isEventHappening("20h30", 60, "24.5", now)).toBe(true);
  });

  it("returns false when time string doesn't match pattern", () => {
    const now = makeDate(24, 5, 19, 0);
    expect(isEventHappening("invalid", 60, "24.5", now)).toBe(false);
  });

  it("returns true for undated event when time matches", () => {
    // No date: only time check matters
    const now = makeDate(24, 5, 19, 0);
    expect(isEventHappening("18h", 120, undefined, now)).toBe(true);
  });
});
