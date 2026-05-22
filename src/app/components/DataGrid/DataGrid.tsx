"use client";

import data from "@data/events.json";
import { useHierarchicalFilter } from "@hooks/useHierarchicalFilter";
import {
    Stack,
    Text,
    Title
} from "@mantine/core";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { EventRecord } from "~/types/event26";
import { NormalizedEventCard } from "./DataCard";

const INITIAL_EVENTS_BATCH = 40;
const EVENTS_BATCH_SIZE = 40;

export const DataGrid = () => {
    const {
        selectedDays,
        selectedTimePreset,
        customTimeRange,
        selectedCategories,
        selectedRegions,
        selectedVenues,
        selectedTags,
        filteredEvents,
        totalCount,
    } = useHierarchicalFilter(data as EventRecord[]);

    const [visibleCount, setVisibleCount] = useState(INITIAL_EVENTS_BATCH);
    const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);

    const filterResetKey = useMemo(
        () =>
            JSON.stringify({
                days: Array.from(selectedDays).sort(),
                timePreset: selectedTimePreset,
                timeRange: customTimeRange,
                categories: Array.from(selectedCategories).sort(),
                regions: Array.from(selectedRegions).sort(),
                venues: Array.from(selectedVenues).sort(),
                tags: Array.from(selectedTags).sort(),
            }),
        [
            customTimeRange,
            selectedCategories,
            selectedDays,
            selectedRegions,
            selectedTags,
            selectedTimePreset,
            selectedVenues,
        ]
    );

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

    const eventsByDate = useMemo(
        () =>
            visibleEvents.reduce((acc: Record<string, typeof visibleEvents>, event) => {
                const date = event.startDate;
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(event);
                return acc;
            }, {}),
        [visibleEvents]
    );

    return (
        <Stack gap="lg">
            {/* <HierarchicalFilters
                facetOptions={facetOptions}
                selectedDays={selectedDays}
                onDaysChange={setSelectedDays}
                selectedTimePreset={selectedTimePreset}
                onTimePresetChange={setSelectedTimePreset}
                customTimeRange={customTimeRange}
                onCustomTimeRangeChange={setCustomTimeRange}
                selectedCategories={selectedCategories}
                onCategoriesChange={setSelectedCategories}
                selectedRegions={selectedRegions}
                onRegionsChange={setSelectedRegions}
                selectedVenues={selectedVenues}
                onVenuesChange={setSelectedVenues}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                onClearAll={clearAllFilters}
            /> */}


            <Text fw={500} ta="center">{totalCount} eventos encontrados</Text>
            <Stack gap="lg">
                {Object.keys(eventsByDate)
                    .sort()
                    .map((date) => (
                        <Stack key={date} gap="md">

                            <Title order={3}>{date}</Title>
                            <Stack gap="sm">
                                {eventsByDate[date].map((event, i) => (
                                    <div key={event.id} style={{ display: "flex", gap: 16 }}>
                                        <Image

                                            src={event.imageUrl || "/placeholder.png"}
                                            alt={event.title}
                                            width={600}
                                            height={400}
                                            style={{ borderRadius: 8 }}
                                        />
                                        <NormalizedEventCard key={event.id} event={event} />
                                    </div>
                                ))}
                            </Stack>
                        </Stack>
                    ))}
            </Stack>

            {hasMoreEvents && <div ref={loadMoreTriggerRef} style={{ height: 1 }} />}

            {hasMoreEvents && (
                <Text size="sm" c="dimmed" ta="center">
                    Carregando mais eventos...
                </Text>
            )}

            {totalCount === 0 && (
                <Text ta="center" py="xl" c="dimmed">
                    Nenhum evento encontrado com os filtros selecionados.
                </Text>
            )}
        </Stack>
    );
};
