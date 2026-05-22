import type { useHierarchicalFilter } from "@hooks/useHierarchicalFilter";
import { Badge, Flex, Group, Stack, Text, Title } from "@mantine/core";

export function NormalizedEventCard({
  event,
}: {
  event: ReturnType<typeof useHierarchicalFilter>["filteredEvents"][0];
}) {
  return (
    <Flex
      direction="column"
      gap="xs"
      p="md"
      bdrs="md"
      style={{
        border: "1px solid transparent",
        background:
          "linear-gradient(transparent, transparent) padding-box, linear-gradient(90.99deg, #4C35C2 0.34%, #963CB6 105.96%) border-box",
      }}
    >
      <Group justify="space-between" align="flex-start">
        <Stack gap="xs" style={{ flex: 1 }}>
          <Title order={4}>{event.title}</Title>
          <Group gap="xs">
            <Badge size="sm" variant="light">
              {event.category}
            </Badge>
            {event.region && (
              <Badge size="sm" variant="light" color="blue">
                {event.region}
              </Badge>
            )}
          </Group>
        </Stack>
      </Group>

      <Text size="sm" c="dimmed">
        {event.venue}
      </Text>

      <Text size="xs" c="dimmed">
        {event.address}
      </Text>

      <Group gap="md">
        <Text size="sm" fw={500}>
          {event.startDate} • {event.startTime} - {event.endTime}
        </Text>
      </Group>

      {event.description && (
        <Text size="sm" lineClamp={2}>
          {event.description}
        </Text>
      )}
    </Flex>
  );
}