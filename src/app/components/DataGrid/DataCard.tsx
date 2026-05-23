import type { useHierarchicalFilter } from "@hooks/useHierarchicalFilter";
import { Box, Divider, Flex, Group, Image, Stack, Text } from "@mantine/core";
import { ActionCircleButton } from "../ActionButton";
import {
  EVENTS_2026_TOKENS,
  EventTag,
  FIGMA_NODE_5_6629_ASSETS,
} from "../Events2026";

function dayFromStartDate(date: string): string {
  const match = date.match(/\d{4}-\d{2}-(\d{2})/);
  return match?.[1] ?? "--";
}

export function NormalizedEventCard({
  event,
}: {
  event: ReturnType<typeof useHierarchicalFilter>["filteredEvents"][0];
}) {
  const dayLabel = dayFromStartDate(event.startDate);

  return (
    // Mantine Flex docs: https://mantine.dev/core/flex/#usage
    <Flex
      direction="column"
      gap="md"
      px="md"
      pt="xs"
      pb="md"
      bdrs={EVENTS_2026_TOKENS.radius.card}
      style={{
        border: `1px solid ${EVENTS_2026_TOKENS.colors.borderOrange}`,
        backgroundColor: EVENTS_2026_TOKENS.colors.bgDark,
      }}
    >
      {/* Mantine Group docs: https://mantine.dev/core/group/#usage */}
      <Group justify="space-between" align="center" wrap="nowrap">
        <Group gap="xs" wrap="nowrap" style={{ flex: 1 }}>
          <EventTag variant="day" label={dayLabel} />
          <EventTag variant="category" label={event.category} />
        </Group>
        <ActionCircleButton variant="favorite-empty" ariaLabel="Salvar evento" />
      </Group>

      {/* Mantine Image docs: https://mantine.dev/core/image/#usage */}
      <Image
        src={event.imageUrl ?? FIGMA_NODE_5_6629_ASSETS.eventImage}
        alt={event.title}
        h={124}
        radius={EVENTS_2026_TOKENS.radius.card}
        fit="cover"
      />

      {/* Mantine Group docs: https://mantine.dev/core/group/#usage */}
      <Group justify="space-between" align="flex-end" wrap="nowrap" gap="xs">
        <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
          {/* Mantine Text docs: https://mantine.dev/core/text/#usage */}
          <Text
            c={EVENTS_2026_TOKENS.colors.textPrimary}
            fz={20}
            fw={700}
            lh={1.2}
            style={{ letterSpacing: "0.4px" }}
          >
            {event.title}
          </Text>
          <Group gap={4} wrap="nowrap">
            <Text c={EVENTS_2026_TOKENS.colors.textPrimary} fz={14} lh={1}>
              {event.startTime}
            </Text>
            <Box h={4} w={12} bg={EVENTS_2026_TOKENS.colors.textPrimary} />
            <Text c={EVENTS_2026_TOKENS.colors.textPrimary} fz={14} lh={1}>
              {event.endTime}
            </Text>
          </Group>
          <Group gap="xs" wrap="nowrap">
            <Text c={EVENTS_2026_TOKENS.colors.textPrimary} fz={13} fw={600} lh={1.2} truncate>
              {event.venue}
            </Text>
            {event.region !== "Unknown" && (
              <Text c={EVENTS_2026_TOKENS.colors.textPrimary} fz={12} lh={1} truncate>
                {event.region}
              </Text>
            )}
          </Group>
        </Stack>
        <ActionCircleButton variant="expand" size={32} ariaLabel="Expandir detalhes" />
      </Group>

      {event.description && (
        // Mantine Box docs: https://mantine.dev/core/box/#usage
        <Box
          p="md"
          style={{
            backgroundColor: EVENTS_2026_TOKENS.colors.overlay,
            borderRadius: EVENTS_2026_TOKENS.radius.card,
          }}
        >
          <Stack gap="xs">
            <Text c={EVENTS_2026_TOKENS.colors.textPrimary} fz={12} lh={1.2} lineClamp={7}>
              {event.description}
            </Text>
            {/* Mantine Divider docs: https://mantine.dev/core/divider/#usage */}
            <Divider color={EVENTS_2026_TOKENS.colors.borderOrange} />
            <Group justify="space-between" align="center" wrap="nowrap">
              <Text c={EVENTS_2026_TOKENS.colors.addressText} fz={10} lh={1.2} style={{ flex: 1 }}>
                {event.address}
              </Text>
              <ActionCircleButton variant="location" ariaLabel="Ver localização" />
            </Group>
          </Stack>
        </Box>
      )}
    </Flex>
  );
}
