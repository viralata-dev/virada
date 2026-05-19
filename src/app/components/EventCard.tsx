"use client";

import { useEventHappening } from "@hooks/useEventHappening";
import { Badge, Card, Flex, Group, Stack, Switch, Text } from "@mantine/core";
import type { Event } from "@types/event";
import { formatDuration, getEventCardStyle } from "@utils/event";
import { useEffect, useState } from "react";

interface EventCardProps {
  event: Event;
  onToggleAttending: (attending: boolean) => void;
}

export function EventCard({ event, onToggleAttending }: EventCardProps) {
  const [isAttending, setIsAttending] = useState(event.attending);
  const isHappening = useEventHappening(event);

  useEffect(() => {
    setIsAttending(event.attending);
  }, [event.attending]);

  const handleToggleAttending = () => {
    const newAttendingState = !isAttending;
    setIsAttending(newAttendingState);
    onToggleAttending(newAttendingState);
  };

  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="md"
      withBorder
      style={getEventCardStyle(event, isHappening)}
    >
      <Group justify="space-between" wrap="nowrap" align="flex-start" gap="md" h="100%">
        <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
          <Group gap="xs" align="center">
            <Flex gap="md">
              <Text fw={500} size="md">
                {event.time}
              </Text>
              <Text lh={1.2} fw={600} size="md">
                {event.artist}
              </Text>
            </Flex>
            {isHappening && (
              <Badge color="orange" variant="filled" size="sm" radius="sm">
                Happening Now
              </Badge>
            )}
          </Group>

          <Group gap="xs" wrap="wrap">
            {event.date && (
              <Badge color={event.date === "24.5" ? "blue" : "violet"} variant="light" size="sm">
                {event.date === "24.5" ? "Saturday" : "Sunday"}
              </Badge>
            )}
            <Badge color="gray" variant="light" size="sm">
              {formatDuration(event.duration)}
            </Badge>
          </Group>
        </Stack>

        <Switch
          checked={isAttending}
          onChange={handleToggleAttending}
          size="md"
          color="green"
          style={{ flexShrink: 0 }}
        />
      </Group>
    </Card>
  );
}
