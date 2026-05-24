import type { useHierarchicalFilter } from "@hooks/useHierarchicalFilter";
import { Box, Collapse, Divider, Flex, Group, Image, Stack, Text } from "@mantine/core";
import { useState } from "react";
import type { EventTimelineStatus } from "~/utils/event";
import { ActionCircleButton } from "../ActionButton";
import { EVENTS_2026_TOKENS, EventTag } from "../Events2026";

function dayFromStartDate(date: string): string {
  const match = date.match(/\d{4}-\d{2}-(\d{2})/);
  return match?.[1] ?? "--";
}

function openGoogleMapsAddress(address: string, venue?: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const fullQuery = `${venue ? `${venue}, ` : ""}${address}`.trim();
  if (!fullQuery) {
    return;
  }

  const query = encodeURIComponent(fullQuery);
  const webMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  const userAgent = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const openWebMapsInNewTab = () => {
    window.open(webMapsUrl, "_blank", "noopener,noreferrer");
  };

  const fallbackToWebMaps = () => {
    window.setTimeout(() => {
      if (!document.hidden) {
        openWebMapsInNewTab();
      }
    }, 700);
  };

  // Prefer opening native Google Maps app on mobile when possible.
  if (isIOS) {
    window.location.href = `comgooglemaps://?daddr=${query}`;
    fallbackToWebMaps();
    return;
  }

  if (isAndroid) {
    window.location.href = `intent://maps.google.com/maps?daddr=${query}#Intent;scheme=https;package=com.google.android.apps.maps;end`;
    fallbackToWebMaps();
    return;
  }

  openWebMapsInNewTab();
}

export function NormalizedEventCard({
  event,
  isFavorite,
  onToggleFavorite,
  defaultExpanded = false,
  timelineStatus,
}: {
  event: ReturnType<typeof useHierarchicalFilter>["filteredEvents"][0];
  isFavorite?: boolean;
  onToggleFavorite?: (eventId: string) => void;
  defaultExpanded?: boolean;
  timelineStatus?: EventTimelineStatus;
}) {
  const dayLabel = dayFromStartDate(event.startDate);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const statusStyle =
    timelineStatus === "live"
      ? {
          borderColor: EVENTS_2026_TOKENS.colors.borderOrange,
          backgroundColor: "rgba(253, 126, 20, 0.16)",
        }
      : timelineStatus === "past"
        ? {
            borderColor: "rgba(255, 255, 255, 0.16)",
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            opacity: 0.72,
          }
        : {
            borderColor: EVENTS_2026_TOKENS.colors.borderViolet,
            backgroundColor: "rgba(76, 53, 194, 0.14)",
          };

  return (
    // Mantine Flex docs: https://mantine.dev/core/flex/#usage
    <Flex
      direction="column"
      px="md"
      pt="xs"
      pb="md"
      bdrs={EVENTS_2026_TOKENS.radius.card}
      style={{
        border: `1px solid ${statusStyle.borderColor}`,
        backgroundColor: statusStyle.backgroundColor,
        opacity: statusStyle.opacity,
      }}
    >
      {/* Mantine Group docs: https://mantine.dev/core/group/#usage */}
      <Group justify="space-between" align="center" wrap="nowrap" mb="md">
        <Group gap="xs" wrap="nowrap" style={{ flex: 1 }}>
          <EventTag variant="day" label={dayLabel} />
          <EventTag variant="category" label={event.category} />
        </Group>
        <ActionCircleButton
          variant={isFavorite ? "favorite" : "favorite-empty"}
          ariaLabel={isFavorite ? "Remover dos favoritos" : "Salvar evento"}
          onClick={() => onToggleFavorite?.(event.id)}
        />
      </Group>

      {/* Mantine Image docs: https://mantine.dev/core/image/#usage */}
      {event.imageUrl && (
        <Image
          src={event.imageUrl}
          alt={event.title}
          h={124}
          mb="md"
          radius={EVENTS_2026_TOKENS.radius.card}
          fit="cover"
        />
      )}

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
            <Text c={EVENTS_2026_TOKENS.colors.textPrimary} fz={13} fw={600} lh={1.2}>
              {event.venue}
            </Text>
            {event.region !== "Unknown" && (
              <Text c={EVENTS_2026_TOKENS.colors.textPrimary} fz={12} lh={1}>
                {event.region}
              </Text>
            )}
          </Group>
        </Stack>
        <ActionCircleButton
          variant={isExpanded ? "minus" : "plus"}
          size={32}
          onClick={() => setIsExpanded((current) => !current)}
          ariaLabel={isExpanded ? "Ocultar detalhes" : "Expandir detalhes"}
        />
      </Group>

      {event.description && (
        // Mantine Collapse docs: https://mantine.dev/core/collapse/#usage
        <Collapse
          expanded={isExpanded}
          transitionDuration={320}
          transitionTimingFunction="ease-in-out"
        >
          {/* Mantine Box docs: https://mantine.dev/core/box/#usage */}
          <Box pt="md">
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
                  <Text
                    c={EVENTS_2026_TOKENS.colors.addressText}
                    fz={10}
                    lh={1.2}
                    style={{ flex: 1 }}
                  >
                    {event.address}
                  </Text>
                  <ActionCircleButton
                    variant="location"
                    ariaLabel="Ver localização no Google Maps"
                    onClick={() => openGoogleMapsAddress(event.address, event.venue)}
                  />
                </Group>
              </Stack>
            </Box>
          </Box>
        </Collapse>
      )}
    </Flex>
  );
}
