import { useHierarchicalFilter } from "@hooks/useHierarchicalFilter";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Collapse,
  Group,
  MultiSelect,
  RangeSlider,
  Stack,
  Text,
} from "@mantine/core";
import { useState } from "react";
import type { EventRecord } from "~/types/event26";

type DataFilterProps = {
  data: EventRecord[];
};

export /**
 * Hierarchical filters component with cascading dependencies.
 * https://mantine.dev/core/checkbox/#usage
 * https://mantine.dev/core/multi-select/#usage
 * https://mantine.dev/core/range-slider/#usage
 */
function HierarchicalFilters({ data }: DataFilterProps) {
  const {
    selectedDays,
    selectedTimePreset,
    customTimeRange,
    selectedCategories,
    selectedRegions,
    selectedVenues,
    facetOptions,
    onDaysChange,
    onVenuesChange,
    onCategoriesChange,
    onRegionsChange,
    onTimePresetChange,
    onCustomTimeRangeChange,
    onClearAll,
  } = useHierarchicalFilter(data);
  const [expanded, setExpanded] = useState(true);

  const daysData = facetOptions.days.map((d) => ({
    value: d.date,
    label: `${d.date} (${d.count})`,
  }));

  const categoriesData = facetOptions.categories.map((c) => ({
    value: c.category,
    label: `${c.category} (${c.count})`,
  }));

  const regionsData = facetOptions.regions.map((r) => ({
    value: r.region,
    label: `${r.region} (${r.count})`,
  }));

  const venuesData = facetOptions.venues.map((v) => ({
    value: v.venue,
    label: `${v.venue} (${v.count})`,
  }));

  const allVisibleVenueValues = venuesData.map((venue) => venue.value);
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

  return (
    <Stack bd="1px solid #ff6ec7" p="md" bdrs="md" pos="sticky" top={0} gap="md">
      <Group justify="space-between" align="center">
        <Button variant="light" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Ocultar Filtros" : "Mostrar Filtros"}
        </Button>
        <Button variant="subtle" size="xs" onClick={onClearAll}>
          Limpar Todos
        </Button>
      </Group>

      {/* https://mantine.dev/core/collapse/#usage */}
      <Collapse expanded={expanded} transitionDuration={200}>
        <Stack gap="lg">
          {/* DAY FILTER */}
          <Stack gap="xs" p="sm">
            <Text fw={600} size="sm">
              Dia
            </Text>
            <CheckboxGroup value={Array.from(selectedDays)}>
              {daysData.map((day) => (
                <Checkbox
                  key={day.value}
                  value={day.value}
                  label={day.label}
                  onChange={() => {
                    handleDayToggle(day.value);
                  }}
                />
              ))}
            </CheckboxGroup>
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
              {/* https://mantine.dev/core/button/#usage */}
              <Group gap="xs">
                <Button
                  size="xs"
                  variant={allVisibleVenuesSelected ? "filled" : "light"}
                  onClick={handleSelectAllVisibleVenues}
                >
                  Selecionar todos
                </Button>
                <Button size="xs" variant="subtle" onClick={() => onVenuesChange(new Set())}>
                  Limpar locais
                </Button>
              </Group>
              {/* https://mantine.dev/core/multi-select/#usage */}
              <MultiSelect
                data={venuesData}
                value={Array.from(selectedVenues)}
                onChange={(values) => {
                  onVenuesChange(new Set(values));
                }}
                placeholder="Selecione locais..."
                searchable
                clearable
              />
            </Stack>
          )}
        </Stack>
      </Collapse>
    </Stack>
  );
}

/**
 * Display a normalized event as a card.
 */
