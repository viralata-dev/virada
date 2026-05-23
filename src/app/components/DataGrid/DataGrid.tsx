"use client";

import data from "@data/events.json";
import { Group, Paper, Stack, Text, Title } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useHierarchicalFilter } from "~/hooks/useHierarchicalFilter";
import type { EventRecord } from "~/types/event26";
import { ActionCircleButton } from "../ActionButton";
import { EVENTS_2026_TOKENS } from "../Events2026";
import { NormalizedEventCard } from "./DataCard";
import { HierarchicalFilters } from "./DataFilter";

const INITIAL_EVENTS_BATCH = 40;
const EVENTS_BATCH_SIZE = 40;

export const DataGrid = () => {
  const filters = useHierarchicalFilter(data as EventRecord[]);
  const { filteredEvents, totalCount, filterResetKey } = filters;

  const [visibleCount, setVisibleCount] = useState(INITIAL_EVENTS_BATCH);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);

  const hasMoreEvents = visibleCount < filteredEvents.length;

  const visibleEvents = useMemo(
    () => filteredEvents.slice(0, visibleCount),
    [filteredEvents, visibleCount]
  );

  useEffect(() => {
    // Reset visible items when filters change.
    void filterResetKey;
    setVisibleCount(INITIAL_EVENTS_BATCH);
  }, [filterResetKey]);

  useEffect(() => {
    const trigger = loadMoreTriggerRef.current;
    if (!trigger || !hasMoreEvents) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (!firstEntry?.isIntersecting) {
          return;
        }

        setVisibleCount((current) => Math.min(current + EVENTS_BATCH_SIZE, filteredEvents.length));
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observer.observe(trigger);

    return () => {
      observer.disconnect();
    };
  }, [filteredEvents.length, hasMoreEvents]);

  return (
    <Stack gap="md">
      <HierarchicalFilters filters={filters} />
      <Paper
        p="md"
        radius={EVENTS_2026_TOKENS.radius.content}
        style={{
          border: `1px solid ${EVENTS_2026_TOKENS.colors.borderViolet}`,
          backgroundColor: "rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Mantine Group docs: https://mantine.dev/core/group/#usage */}
        <Group align="flex-end" justify="space-between" gap="sm" wrap="nowrap">
          <Stack gap={4} style={{ flex: 1 }}>
            {/* Mantine Title docs: https://mantine.dev/core/title/#usage */}
            <Title
              order={1}
              c={EVENTS_2026_TOKENS.colors.textPrimary}
              fz={36}
              lh={0.64}
              style={{ fontFamily: "var(--font-nerko-one)", textTransform: "none" }}
            >
              Eventos
            </Title>
            {/* Mantine Text docs: https://mantine.dev/core/text/#usage */}
            <Text c={EVENTS_2026_TOKENS.colors.textPrimary} fz={12}>
              {totalCount} Eventos encontrados!
            </Text>
          </Stack>

          <Stack gap={6} align="center">
            <ActionCircleButton variant="filter" size={35} ariaLabel="Abrir filtros" />
            <Text c={EVENTS_2026_TOKENS.colors.textPrimary} fz={12}>
              Filtrar
            </Text>
          </Stack>
        </Group>

        <Stack gap="md" mt="md">
          {visibleEvents.map((event) => (
            <NormalizedEventCard key={event.id} event={event} />
          ))}
        </Stack>
      </Paper>

      {hasMoreEvents && <div ref={loadMoreTriggerRef} style={{ height: 1 }} />}

      {hasMoreEvents && (
        <Text size="sm" c={EVENTS_2026_TOKENS.colors.textPrimary} ta="center">
          Carregando mais eventos...
        </Text>
      )}

      {totalCount === 0 && (
        <Text ta="center" py="xl" c={EVENTS_2026_TOKENS.colors.textPrimary}>
          Nenhum evento encontrado com os filtros selecionados.
        </Text>
      )}
    </Stack>
  );
};
