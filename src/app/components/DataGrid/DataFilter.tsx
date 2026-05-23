import type { useHierarchicalFilter } from "@hooks/useHierarchicalFilter";
import {
  Button,
  Drawer,
  Group,
  MultiSelect,
  RangeSlider,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { ActionSimpleButton } from "../ActionButton";

type DataFilterProps = {
  filters: ReturnType<typeof useHierarchicalFilter>;
  opened: boolean;
  onClose: () => void;
};

/**
 * Hierarchical filters component with cascading dependencies.
 * https://mantine.dev/core/checkbox/#usage
 * https://mantine.dev/core/multi-select/#usage
 * https://mantine.dev/core/range-slider/#usage
 */
export function HierarchicalFilters({ filters, opened, onClose }: DataFilterProps) {
  const {
    selectedDays,
    selectedTimePreset,
    customTimeRange,
    selectedCategories,
    selectedRegions,
    selectedVenues,
    facetOptions,
    allCategoryOptions,
    allRegionOptions,
    allVenueOptions,
    onDaysChange,
    onVenuesChange,
    onCategoriesChange,
    onRegionsChange,
    onTimePresetChange,
    onCustomTimeRangeChange,
    onClearAll,
  } = filters;

  const [persistedDays, setPersistedDays] = useState<Array<{ value: string; count: number }>>([]);

  const currentDays = facetOptions.days.filter(
    (d) => d.date !== "2025-05-24" && d.date !== "24-05-2025"
  );

  useEffect(() => {
    setPersistedDays((previousDays) => {
      const mergedByDate = new Map(previousDays.map((day) => [day.value, day]));

      for (const day of currentDays) {
        mergedByDate.set(day.date, { value: day.date, count: day.count });
      }

      for (const selectedDay of selectedDays) {
        if (selectedDay === "2025-05-24" || selectedDay === "24-05-2025") {
          continue;
        }

        if (!mergedByDate.has(selectedDay)) {
          mergedByDate.set(selectedDay, { value: selectedDay, count: 0 });
        }
      }

      const nextDays = Array.from(mergedByDate.values())
        .sort((a, b) => a.value.localeCompare(b.value))
        .slice(0, 2);

      const isUnchanged =
        nextDays.length === previousDays.length &&
        nextDays.every(
          (day, index) =>
            day.value === previousDays[index]?.value && day.count === previousDays[index]?.count
        );

      if (isUnchanged) {
        return previousDays;
      }

      return nextDays;
    });
  }, [currentDays, selectedDays]);

  const dayButtonsData = persistedDays.map((day) => ({
    value: day.value,
    label: `${day.value} (${day.count})`,
    dayNumber: day.value.split("-")[2] ?? day.value,
  }));

  const categoryCountsByName = new Map(
    facetOptions.categories.map((category) => [category.category, category.count])
  );

  const categoriesData = allCategoryOptions.map((c) => ({
    value: c.category,
    label: `${c.category} (${categoryCountsByName.get(c.category) ?? c.count})`,
  }));

  const regionCountsByName = new Map(
    facetOptions.regions.map((region) => [region.region, region.count])
  );

  const venueCountsByName = new Map(facetOptions.venues.map((venue) => [venue.venue, venue.count]));

  const regionsData = allRegionOptions.map((r) => ({
    value: r.region,
    label: `${r.region} (${regionCountsByName.get(r.region) ?? 0})`,
  }));

  const venuesData = allVenueOptions.map((v) => ({
    value: v.venue,
    label: `${v.venue} (${venueCountsByName.get(v.venue) ?? 0})`,
  }));

  const allVisibleVenueValues = facetOptions.venues.map((venue) => venue.venue);
  const allVisibleVenuesSelected =
    allVisibleVenueValues.length > 0 &&
    allVisibleVenueValues.every((venue) => selectedVenues.has(venue));

  const handleDayToggle = (day: string) => {
    const newDays = new Set(selectedDays);
    if (newDays.has(day)) {
      newDays.delete(day);
    } else {
      newDays.add(day);
    }
    onDaysChange(newDays);
  };

  const handleSelectAllVisibleVenues = () => {
    onVenuesChange(new Set(allVisibleVenueValues));
  };

  const SELECT_ALL_VENUES_OPTION = "__all_visible_venues__";

  return (
    // Mantine Drawer docs: https://mantine.dev/core/drawer/#usage
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      size="90dvh"
      withCloseButton={false}
      closeOnClickOutside={true}
      overlayProps={{ opacity: 0.45, blur: 3 }}
      styles={{
        content: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          border: "1px solid #ff6ec7",
          borderBottom: "none",
          backgroundColor: "rgba(23, 17, 40, 0.98)",
          maxWidth: "90dvw",
          marginInline: "auto",
        },
        body: {
          // padding: "1rem",
          // paddingInline: "2rem",
          // height: "98%",
          // marginInline: "8px",
          // marginTop: "8px",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: `#63E6BE #231a36`,
          scrollBehavior: "smooth",
        },
      }}
    >
      <Stack gap="md">
        <Group justify="space-between" align="center">
          {/* Mantine Text docs: https://mantine.dev/core/text/#usage */}
          <Text c="white" fw={700} size="lg">
            Filtros
          </Text>
          <Group gap="xs">
            <ActionSimpleButton variant="check" ariaLabel="Aceitar filtros" onClick={onClose} />
            <ActionSimpleButton
              variant="close"
              ariaLabel="Fechar filtros"
              onClick={() => {
                onClearAll();
                onClose();
              }}
            />
          </Group>
        </Group>
      </Stack>
      {/* Mantine ScrollArea docs: https://mantine.dev/core/scroll-area/#usage */}
      <ScrollArea
        p="md"
        pb={0}
        h="calc(90dvh - 64px)"
        type="scroll"
        offsetScrollbars
        overscrollBehavior="contain"
        scrollbarSize={6}
      >
        {/* https://mantine.dev/core/collapse/#usage */}

        <Stack gap="lg">
          {/* DAY FILTER */}
          <Stack gap="xs" p="sm" bg="#231A36" bd="1px solid teal.3" bdrs={8}>
            <Text fw={600} size="sm">
              Dia
            </Text>
            {/* https://mantine.dev/core/button/#usage */}
            <Group gap="xs">
              {dayButtonsData.map((day) => {
                const isEnabled = selectedDays.has(day.value);

                return (
                  <Button
                    key={day.value}
                    variant="outline"
                    radius="xl"
                    size="sm"
                    aria-label={`Dia ${day.label}`}
                    aria-pressed={isEnabled}
                    onClick={() => {
                      handleDayToggle(day.value);
                    }}
                    style={{
                      minWidth: 44,
                      width: 44,
                      height: 44,
                      padding: 0,
                      opacity: isEnabled ? 1 : 0.5,
                      borderWidth: isEnabled ? 2 : 1,
                    }}
                  >
                    {day.dayNumber}
                  </Button>
                );
              })}
            </Group>
          </Stack>

          {/* TIME FILTER: Presets + Custom Range */}
          <Stack gap="xs" p="sm">
            <Text fw={600} size="sm">
              Horario
            </Text>
            <Group gap="xs">
              <Button
                variant={selectedTimePreset === "now" ? "filled" : "light"}
                size="xs"
                onClick={() => onTimePresetChange("now")}
              >
                Acontecendo Agora
              </Button>
              <Button
                variant={selectedTimePreset === "next" ? "filled" : "light"}
                size="xs"
                onClick={() => onTimePresetChange("next")}
              >
                Proximos 2h
              </Button>
              <Button
                variant={selectedTimePreset === "all" ? "filled" : "light"}
                size="xs"
                onClick={() => onTimePresetChange("all")}
              >
                Todos
              </Button>
            </Group>

            {selectedTimePreset === "all" && (
              <Stack gap="xs">
                <Text size="xs" c="dimmed">
                  Intervalo de horas: {customTimeRange[0]}h - {customTimeRange[1]}h
                </Text>
                {/* https://mantine.dev/core/range-slider/#usage */}
                <RangeSlider
                  min={0}
                  max={24}
                  step={1}
                  value={customTimeRange}
                  onChange={onCustomTimeRangeChange}
                  marks={[
                    { value: 0, label: "0h" },
                    { value: 6, label: "6h" },
                    { value: 12, label: "12h" },
                    { value: 18, label: "18h" },
                    { value: 24, label: "24h" },
                  ]}
                />
              </Stack>
            )}
          </Stack>

          {/* CATEGORY FILTER */}
          <Stack gap="xs" p="sm">
            <Text fw={600} size="sm">
              Categoria
            </Text>
            {/* https://mantine.dev/core/multi-select/#usage */}
            <MultiSelect
              data={categoriesData}
              value={Array.from(selectedCategories)}
              onChange={(values) => {
                onCategoriesChange(new Set(values));
              }}
              placeholder="Selecione categorias..."
              searchable
              clearable
            />
          </Stack>

          {/* REGION FILTER - Multi-selection */}
          {regionsData.length > 0 && (
            <Stack gap="xs" p="sm">
              <Text fw={600} size="sm">
                Região
              </Text>
              {/* https://mantine.dev/core/multi-select/#usage */}
              <MultiSelect
                data={regionsData}
                value={Array.from(selectedRegions)}
                onChange={(values) => {
                  onRegionsChange(new Set(values));
                }}
                placeholder="Selecione regioes..."
                searchable
                clearable
              />
            </Stack>
          )}

          {/* VENUE FILTER - Only shown if venues are available */}
          {venuesData.length > 0 && (
            <Stack gap="xs" p="sm">
              <Text fw={600} size="sm">
                Local
              </Text>
              {/* https://mantine.dev/core/multi-select/#usage */}
              <MultiSelect
                data={[
                  {
                    value: SELECT_ALL_VENUES_OPTION,
                    label: allVisibleVenuesSelected
                      ? "Todos os locais selecionados"
                      : "Selecionar todos",
                  },
                  ...venuesData,
                ]}
                value={Array.from(selectedVenues)}
                onChange={(values) => {
                  if (values.includes(SELECT_ALL_VENUES_OPTION)) {
                    handleSelectAllVisibleVenues();
                    return;
                  }
                  onVenuesChange(new Set(values));
                }}
                placeholder="Selecione locais..."
                searchable
                clearable
              />
            </Stack>
          )}
        </Stack>
      </ScrollArea>
    </Drawer>
  );
}
