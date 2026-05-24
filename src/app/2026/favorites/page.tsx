"use client";

import { NormalizedEventCard } from "@app/components/DataGrid/DataCard";
import data from "@data/events.json";
import { useFavoriteEvents } from "@hooks/useFavoriteEvents";
import {
  Box,
  Card,
  Container,
  Modal,
  ScrollArea,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { isLoggedIn } from "@utils/auth";
import {
  type EventTimelineStatus,
  getEventTimelineStatus,
  getEventTimeRange,
  getTimelineMinutesBetween,
  type NormalizedEvent,
  normalizeEvent,
} from "@utils/event";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { EventRecord } from "~/types/event26";
import { EVENTS_2026_TOKENS } from "../../components/Events2026";

const TIMELINE_PIXELS_PER_HOUR = 84;
const MIN_TIMELINE_HEIGHT = 360;
const TIMELINE_COLUMN_WIDTH = 180;
const TIMELINE_COLUMN_MAX_WIDTH = 220;
const TIMELINE_COLUMN_GAP = 16;
const LEFT_RAIL_WIDTH = 40;
const TIME_TICK_STEP_HOURS = 1;
const TIMELINE_LANE_TOP_OFFSET = 56;

function minutesToPixels(minutes: number): number {
  return (minutes / 60) * TIMELINE_PIXELS_PER_HOUR;
}

function formatTimelineTime(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatTimelineDay(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

export function getTimelinePlacement(event: NormalizedEvent, timelineStart: Date) {
  const range = getEventTimeRange(event);
  if (!range) {
    return {
      top: 0,
      height: 0,
    };
  }

  const top = Math.max(0, minutesToPixels(getTimelineMinutesBetween(timelineStart, range.start)));
  const height = minutesToPixels(getTimelineMinutesBetween(range.start, range.end));

  return {
    top,
    height,
  };
}

function buildTimelineTicks(start: Date, end: Date): Date[] {
  const ticks: Date[] = [];
  const tick = new Date(start);
  tick.setMinutes(0, 0, 0);

  while (tick <= end) {
    ticks.push(new Date(tick));
    tick.setHours(tick.getHours() + TIME_TICK_STEP_HOURS);
  }

  if (ticks.length === 0 || ticks[ticks.length - 1]?.getTime() !== end.getTime()) {
    ticks.push(new Date(end));
  }

  return ticks;
}

function getTimelineHeight(start: Date, end: Date): number {
  return Math.max(MIN_TIMELINE_HEIGHT, minutesToPixels(getTimelineMinutesBetween(start, end)));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getStatusColors(status: EventTimelineStatus) {
  if (status === "live") {
    return {
      border: EVENTS_2026_TOKENS.colors.borderOrange,
      background: "rgba(253, 126, 20, 0.18)",
      accent: EVENTS_2026_TOKENS.colors.tagOrange,
    };
  }

  if (status === "past") {
    return {
      border: "rgba(255, 255, 255, 0.16)",
      background: "rgba(255, 255, 255, 0.04)",
      accent: "rgba(255, 255, 255, 0.45)",
    };
  }

  return {
    border: EVENTS_2026_TOKENS.colors.borderViolet,
    background: "rgba(76, 53, 194, 0.16)",
    accent: EVENTS_2026_TOKENS.colors.borderViolet,
  };
}

export function groupFavoriteEventsByVenue(events: NormalizedEvent[]) {
  const grouped = new Map<string, NormalizedEvent[]>();

  for (const event of events) {
    const venueKey = event.venue.trim() || "Sem local";
    const previous = grouped.get(venueKey) ?? [];
    grouped.set(venueKey, [...previous, event]);
  }

  return Array.from(grouped.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

export default function FavoritesPage() {
  const router = useRouter();
  const { favoriteEventIds, isFavorite, toggleFavorite } = useFavoriteEvents();
  const [selectedEvent, setSelectedEvent] = useState<NormalizedEvent | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  const favoriteEventsByVenue = useMemo(() => {
    const favoriteEvents = (data as EventRecord[])
      .map((record, index) => normalizeEvent(record, index))
      .filter((event): event is NormalizedEvent => event !== null)
      .sort((a, b) => {
        const dateCompare = a.startDate.localeCompare(b.startDate);
        if (dateCompare !== 0) {
          return dateCompare;
        }

        return a.startTime.localeCompare(b.startTime);
      })
      .filter((event) => favoriteEventIds.has(event.id));

    return groupFavoriteEventsByVenue(favoriteEvents);
  }, [favoriteEventIds]);

  const allFavoriteEvents = useMemo(
    () => favoriteEventsByVenue.flatMap(([, events]) => events),
    [favoriteEventsByVenue]
  );

  const timelineBounds = useMemo(() => {
    const ranges = allFavoriteEvents
      .map((event) => getEventTimeRange(event))
      .filter(
        (range): range is NonNullable<ReturnType<typeof getEventTimeRange>> => range !== null
      );

    if (ranges.length === 0) {
      return null;
    }

    let minStart = ranges[0]?.start ?? new Date();
    let maxEnd = ranges[0]?.end ?? new Date();

    for (const range of ranges) {
      if (range.start < minStart) {
        minStart = range.start;
      }
      if (range.end > maxEnd) {
        maxEnd = range.end;
      }
    }

    const start = new Date(minStart);
    start.setHours(Math.max(0, start.getHours() - 1), 0, 0, 0);

    const end = new Date(maxEnd);
    end.setHours(Math.min(23, end.getHours() + 1), 0, 0, 0);

    return {
      start,
      end,
      height: getTimelineHeight(start, end),
      ticks: buildTimelineTicks(start, end),
    };
  }, [allFavoriteEvents]);

  const currentTimePosition = useMemo(() => {
    if (!timelineBounds) {
      return null;
    }

    return clamp(
      minutesToPixels(getTimelineMinutesBetween(timelineBounds.start, now)),
      0,
      timelineBounds.height
    );
  }, [now, timelineBounds]);

  return (
    // Mantine Container docs: https://mantine.dev/core/container/#usage
    <Container component="main" size="xl" py="md" px="xs">
      {/* Mantine Stack docs: https://mantine.dev/core/stack/#usage */}
      <Stack gap="md">
        {/* Mantine Title docs: https://mantine.dev/core/title/#usage */}
        <Title
          order={2}
          c={EVENTS_2026_TOKENS.colors.textPrimary}
          style={{ fontFamily: "var(--font-nerko-one)" }}
        >
          Favoritos
        </Title>

        {favoriteEventsByVenue.length === 0 || !timelineBounds ? (
          // Mantine Text docs: https://mantine.dev/core/text/#usage
          <Text ta="center" c={EVENTS_2026_TOKENS.colors.textPrimary} py="xl">
            Nenhum evento favoritado ainda. Toque na estrela no topo dos cards para salvar.
          </Text>
        ) : (
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: `${LEFT_RAIL_WIDTH}px minmax(0, 1fr)`,
              gap: TIMELINE_COLUMN_GAP,
              alignItems: "start",
            }}
          >
            <Box style={{ position: "sticky", top: 16, alignSelf: "start", zIndex: 1 }}>
              <Box
                style={{
                  position: "relative",
                  height: timelineBounds.height + TIMELINE_LANE_TOP_OFFSET,
                }}
              >
                <Box
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: TIMELINE_LANE_TOP_OFFSET,
                    bottom: 0,
                    width: 2,
                    transform: "translateX(-50%)",
                    backgroundColor: EVENTS_2026_TOKENS.colors.borderViolet,
                  }}
                />

                {timelineBounds.ticks.map((tick) => {
                  const offsetMinutes = getTimelineMinutesBetween(timelineBounds.start, tick);
                  const top = minutesToPixels(offsetMinutes);
                  const isDayBoundary = tick.getHours() === 0 && tick.getMinutes() === 0;

                  return (
                    <Box
                      key={tick.toISOString()}
                      style={{
                        position: "absolute",
                        top: top + TIMELINE_LANE_TOP_OFFSET,
                        left: 0,
                        right: 0,
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Text c={EVENTS_2026_TOKENS.colors.addressText} fz={10} ta="right">
                        {formatTimelineTime(tick)}
                      </Text>
                      <Box
                        style={{
                          height: 1,
                          backgroundColor: isDayBoundary
                            ? EVENTS_2026_TOKENS.colors.borderOrange
                            : "rgba(255, 255, 255, 0.18)",
                        }}
                      />
                      {isDayBoundary && (
                        <Text
                          c={EVENTS_2026_TOKENS.colors.textPrimary}
                          fz={10}
                          style={{
                            position: "absolute",
                            left: 0,
                            top: -14,
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          {formatTimelineDay(tick)}
                        </Text>
                      )}
                    </Box>
                  );
                })}

                {currentTimePosition !== null && (
                  <Box
                    style={{
                      position: "absolute",
                      top: currentTimePosition + TIMELINE_LANE_TOP_OFFSET,
                      left: 0,
                      right: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transform: "translateY(-50%)",
                    }}
                  >
                    <Box
                      style={{
                        position: "relative",
                        flex: 1,
                        height: 0,
                      }}
                    >
                      <Box
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          top: -1,
                          height: 2,
                          backgroundColor: EVENTS_2026_TOKENS.colors.tagOrange,
                          boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.18)",
                        }}
                      />
                      <Box
                        style={{
                          position: "absolute",
                          left: -4,
                          top: -4,
                          width: 8,
                          height: 8,
                          borderRadius: 999,
                          backgroundColor: EVENTS_2026_TOKENS.colors.tagOrange,
                          boxShadow: "0 0 0 2px rgba(35, 26, 54, 0.9)",
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>

            <ScrollArea type="scroll" scrollbarSize={8} offsetScrollbars>
              <Box
                style={{
                  display: "flex",
                  gap: TIMELINE_COLUMN_GAP,
                  minWidth: "max-content",
                  paddingBottom: 16,
                }}
              >
                {favoriteEventsByVenue.map(([venue, venueEvents]) => {
                  const venueHeight = timelineBounds.height;

                  return (
                    <Card
                      key={venue}
                      withBorder
                      radius="md"
                      p="sm"
                      style={{
                        minWidth: TIMELINE_COLUMN_WIDTH,
                        maxWidth: TIMELINE_COLUMN_MAX_WIDTH,
                        borderColor: EVENTS_2026_TOKENS.colors.borderViolet,
                        backgroundColor: "rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      <Stack gap="md">
                        <Title order={3} c={EVENTS_2026_TOKENS.colors.textPrimary}>
                          {venue}
                        </Title>

                        <Box style={{ position: "relative", height: venueHeight }}>
                          {venueEvents.map((event) => {
                            const status = getEventTimelineStatus(event);
                            const colors = getStatusColors(status);
                            const placement = getTimelinePlacement(event, timelineBounds.start);

                            return (
                              <Box
                                key={event.id}
                                style={{
                                  position: "absolute",
                                  top: placement.top,
                                  left: 0,
                                  right: 0,
                                  height: placement.height,
                                  paddingRight: 4,
                                }}
                              >
                                <UnstyledButton
                                  onClick={() => setSelectedEvent(event)}
                                  style={{ display: "block", width: "100%", height: "100%" }}
                                >
                                  <Card
                                    withBorder
                                    p="xs"
                                    radius="sm"
                                    style={{
                                      height: "100%",
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center",
                                      borderColor: colors.border,
                                      backgroundColor: colors.background,
                                      boxShadow:
                                        status === "live"
                                          ? "0 0 0 1px rgba(253, 126, 20, 0.22), 0 10px 24px rgba(0, 0, 0, 0.3)"
                                          : "none",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <Stack gap={4} style={{ minWidth: 0 }}>
                                      <Text
                                        c={EVENTS_2026_TOKENS.colors.textPrimary}
                                        fz={13}
                                        fw={700}
                                        lh={1.15}
                                        style={{ overflowWrap: "anywhere" }}
                                      >
                                        {event.title}
                                      </Text>
                                      <Text
                                        c={
                                          status === "past"
                                            ? "rgba(255, 255, 255, 0.42)"
                                            : EVENTS_2026_TOKENS.colors.addressText
                                        }
                                        fz={11}
                                        lh={1.2}
                                        style={{ overflowWrap: "anywhere" }}
                                      >
                                        {event.startTime} - {event.endTime}
                                      </Text>
                                      <Text
                                        c={
                                          status === "past"
                                            ? "rgba(255, 255, 255, 0.42)"
                                            : EVENTS_2026_TOKENS.colors.addressText
                                        }
                                        fz={11}
                                        lh={1.2}
                                        style={{ overflowWrap: "anywhere" }}
                                      >
                                        {event.region}
                                      </Text>
                                    </Stack>
                                    <Box
                                      style={{
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: 4,
                                        backgroundColor: colors.accent,
                                      }}
                                    />
                                  </Card>
                                </UnstyledButton>
                              </Box>
                            );
                          })}
                        </Box>
                      </Stack>
                    </Card>
                  );
                })}
              </Box>
            </ScrollArea>
          </Box>
        )}
      </Stack>

      {/* Mantine Modal docs: https://mantine.dev/core/modal/#usage */}
      <Modal
        opened={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        title="Detalhes do evento"
        size="lg"
        centered
        styles={{
          content: {
            backgroundColor: EVENTS_2026_TOKENS.colors.bgDark,
          },
          header: {
            backgroundColor: EVENTS_2026_TOKENS.colors.bgDark,
          },
          title: {
            color: EVENTS_2026_TOKENS.colors.textPrimary,
          },
        }}
      >
        {selectedEvent && (
          <NormalizedEventCard
            event={selectedEvent}
            isFavorite={isFavorite(selectedEvent.id)}
            onToggleFavorite={toggleFavorite}
            defaultExpanded
            timelineStatus={getEventTimelineStatus(selectedEvent)}
          />
        )}
      </Modal>
    </Container>
  );
}
