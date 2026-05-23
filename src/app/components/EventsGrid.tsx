"use client";

import { DateTimeFilter } from "@components/DateTimeFilter";
import { EventCard } from "@components/EventCard";
import { LocationFilter } from "@components/LocationFilter";
import { useEventAttendingState } from "@hooks/useEventAttendingState";
import { useEventFiltering } from "@hooks/useEventFiltering";
import { Box, Button, Container, Group, ScrollArea, Stack, Text, Title } from "@mantine/core";
import {
  getEventTopOffset,
  getTimelineCardHeight,
  getTimelineMinHour,
  splitEventsByDay,
} from "@utils/event";
import Image from "next/image";
import { useState } from "react";
import type { Event, EventsData } from "~/types/event";

interface EventsGridProps {
  data: EventsData;
}

export function EventsGrid({ data: initialData }: EventsGridProps) {
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    initialData.locations.map((location) => location.name)
  );
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 24]);
  const [selectedDate, setSelectedDate] = useState<string>("all");
  const [showAttendingOnly, setShowAttendingOnly] = useState(false);

  const { locations, toggleAttending } = useEventAttendingState(initialData.locations);
  const { filteredEvents, dayHeights } = useEventFiltering({
    locations,
    selectedLocations,
    timeRange,
    selectedDate,
    showAttendingOnly,
  });

  const locationNames = initialData.locations.map((location) => location.name);

  return (
    <Container size="xl" py="xl">
      <Image
        src="/viradasp.svg"
        alt="Virada Cultural 2025"
        width={240}
        height={240}
        style={{
          display: "block",
          margin: "0 auto",
          marginBottom: "24px",
        }}
      />

      <Box display={{ base: "none", md: "block" }} mb="xl">
        <Stack>
          <Group grow>
            <LocationFilter
              locations={locationNames}
              selectedLocations={selectedLocations}
              onLocationChange={setSelectedLocations}
            />

            <DateTimeFilter onTimeRangeChange={setTimeRange} onDateChange={setSelectedDate} />
          </Group>
          <Button
            variant={showAttendingOnly ? "filled" : "outline"}
            color="green"
            onClick={() => setShowAttendingOnly(!showAttendingOnly)}
            w="fit-content"
          >
            {showAttendingOnly
              ? "Mostrar apenas os eventos que estou participando"
              : "Mostrar Todos os eventos"}
          </Button>
        </Stack>
      </Box>

      <Box display={{ base: "block", md: "none" }} mb="xl">
        <Stack gap="lg">
          <LocationFilter
            locations={locationNames}
            selectedLocations={selectedLocations}
            onLocationChange={setSelectedLocations}
          />
          <Button
            variant={showAttendingOnly ? "filled" : "outline"}
            color="cyan"
            onClick={() => setShowAttendingOnly(!showAttendingOnly)}
          >
            {showAttendingOnly ? "Eventos selecionados" : "Todos os eventos"}
          </Button>
        </Stack>
      </Box>

      <Box display={{ base: "none", md: "block" }}>
        <ScrollArea type="scroll" scrollbarSize={8} offsetScrollbars scrollHideDelay={500}>
          <Box
            style={{
              display: "flex",
              minWidth: "max-content",
              gap: "16px",
              paddingBottom: "16px",
            }}
          >
            {Object.keys(filteredEvents).length > 0 ? (
              Object.entries(filteredEvents).map(([locationName, events]) => {
                const groupedEvents = splitEventsByDay(events);

                return (
                  <Box key={locationName} style={{ minWidth: "300px", maxWidth: "350px" }}>
                    <Stack>
                      <Title order={3}>{locationName}</Title>
                      <Text size="sm" c="dimmed" lineClamp={2}>
                        {locations.find((location) => location.name === locationName)?.address}
                      </Text>
                      <ScrollArea style={{ height: "70vh" }} offsetScrollbars>
                        <Stack>
                          <DesktopDaySection
                            title="Saturday (24.5)"
                            color="#1976d2"
                            events={groupedEvents.saturday}
                            dayKey="sat"
                            locationName={locationName}
                            onToggleAttending={toggleAttending}
                          />
                          <DesktopDaySection
                            title="Sunday (25.5)"
                            color="#9c27b0"
                            events={groupedEvents.sunday}
                            dayKey="sun"
                            locationName={locationName}
                            onToggleAttending={toggleAttending}
                          />
                          <DesktopDaySection
                            title="Other Events"
                            color="#757575"
                            events={groupedEvents.other}
                            dayKey="other"
                            locationName={locationName}
                            onToggleAttending={toggleAttending}
                          />
                        </Stack>
                      </ScrollArea>
                    </Stack>
                  </Box>
                );
              })
            ) : (
              <Text ta="center" fz="lg" fw={500} w="100%">
                No events match your filters. Try adjusting your selection.
              </Text>
            )}
          </Box>
        </ScrollArea>
      </Box>

      <Box display={{ base: "block", md: "none" }} mt="xl">
        <ScrollArea type="scroll" scrollbarSize={8} offsetScrollbars>
          <Box style={{ display: "flex", gap: "16px", paddingBottom: "16px" }}>
            {Object.keys(filteredEvents).length > 0 ? (
              Object.entries(filteredEvents).map(([locationName, events]) => {
                const groupedEvents = splitEventsByDay(events);

                return (
                  <Box
                    key={locationName}
                    style={{
                      minWidth: "280px",
                      maxWidth: "calc(75vw)",
                      flex: "0 0 auto",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      padding: "16px",
                    }}
                  >
                    <Stack>
                      <Title order={3}>{locationName}</Title>
                      <Text size="sm" c="dimmed" lineClamp={2}>
                        {locations.find((location) => location.name === locationName)?.address}
                      </Text>

                      <MobileDaySection
                        title="Saturday (24.5)"
                        color="#1976d2"
                        events={groupedEvents.saturday}
                        height={dayHeights.saturday}
                        dayKey="sat"
                        locationName={locationName}
                        onToggleAttending={toggleAttending}
                      />
                      <MobileDaySection
                        title="Sunday (25.5)"
                        color="#9c27b0"
                        events={groupedEvents.sunday}
                        height={dayHeights.sunday}
                        dayKey="sun"
                        locationName={locationName}
                        onToggleAttending={toggleAttending}
                      />
                      <MobileDaySection
                        title="Other Events"
                        color="#757575"
                        events={groupedEvents.other}
                        height={dayHeights.other}
                        dayKey="other"
                        locationName={locationName}
                        onToggleAttending={toggleAttending}
                      />
                    </Stack>
                  </Box>
                );
              })
            ) : (
              <Text ta="center" fz="lg" fw={500} w="100%">
                No events match your filters. Try adjusting your selection.
              </Text>
            )}
          </Box>
        </ScrollArea>
      </Box>
    </Container>
  );
}

interface DaySectionProps {
  title: string;
  color: string;
  events: Event[];
  dayKey: string;
  locationName: string;
  onToggleAttending: (locationName: string, artistName: string, attending: boolean) => void;
}

function DesktopDaySection({
  title,
  color,
  events,
  dayKey,
  locationName,
  onToggleAttending,
}: DaySectionProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <>
      <Title order={4} mt="md" style={{ color }}>
        {title}
      </Title>
      {events.map((event) => (
        <EventCard
          key={`${dayKey}-${event.time}-${event.artist}`}
          event={event}
          onToggleAttending={(attending) =>
            onToggleAttending(locationName, event.artist, attending)
          }
        />
      ))}
    </>
  );
}

interface MobileDaySectionProps extends DaySectionProps {
  height: number;
}

function MobileDaySection({
  title,
  color,
  events,
  height,
  dayKey,
  locationName,
  onToggleAttending,
}: MobileDaySectionProps) {
  if (events.length === 0) {
    return null;
  }

  const minHour = getTimelineMinHour(events);

  return (
    <>
      <Title order={4} mt="md" style={{ color }}>
        {title}
      </Title>
      <Box
        style={{
          position: "relative",
          height: `${height}px`,
        }}
      >
        <Box style={{ position: "relative", height: "100%" }}>
          {events.map((event) => (
            <Box
              key={`${dayKey}-${event.time}-${event.artist}`}
              style={{
                position: "absolute",
                top: `${getEventTopOffset(event.time, minHour)}px`,
                left: 0,
                right: 0,
                height: `${getTimelineCardHeight(event.duration)}px`,
                padding: "0 0 24px 0",
              }}
            >
              <EventCard
                event={event}
                onToggleAttending={(attending) =>
                  onToggleAttending(locationName, event.artist, attending)
                }
              />
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}
