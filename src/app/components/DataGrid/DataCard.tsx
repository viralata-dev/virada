import { Flex, Group, Stack, Text, Title } from "@mantine/core";
import type { NormalizedEvent } from "@utils/event";
import { EventMetaBadges } from "./EventMetaBadges";

interface DataCardProps {
  event: NormalizedEvent;
}

export function DataCard({ event }: DataCardProps) {
  return (
    // https://mantine.dev/core/flex/#usage
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
      {/* https://mantine.dev/core/group/#usage */}
      <Group justify="space-between" align="flex-start">
        {/* https://mantine.dev/core/stack/#usage */}
        <Stack gap="xs" style={{ flex: 1 }}>
          {/* https://mantine.dev/core/title/#usage */}
          <Title order={4}>{event.title}</Title>
          <EventMetaBadges category={event.category} venue={event.venue} region={event.region} />
        </Stack>
      </Group>

      {/* https://mantine.dev/core/text/#usage */}
      <Text size="xs" c="dimmed">
        {event.address}
      </Text>

      {/* https://mantine.dev/core/group/#usage */}
      <Group gap="md">
        {/* https://mantine.dev/core/text/#usage */}
        <Text size="sm" fw={500}>
          {event.startDate} • {event.startTime} - {event.endTime}
        </Text>
      </Group>

      {event.description && (
        // https://mantine.dev/core/text/#usage
        <Text size="sm" lineClamp={2}>
          {event.description}
        </Text>
      )}
    </Flex>
  );
}
