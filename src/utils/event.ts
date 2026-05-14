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
