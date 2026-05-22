"use client";

import data from "@data/events.json";
import { Button, Collapse, Flex, Grid, Pill, PillsInput, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMemo } from "react";
import type { EventRecord } from "~/types/event26";

export const DataGrid = () => {
  const sortedData = useMemo(
    () =>
      [...data]
        .sort((a: EventRecord, b: EventRecord) => {
          if (!a.start_date || !b.start_date) return 0;
          return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
        })
        .sort((a: EventRecord, b: EventRecord) => {
          if (!a.start_time || !b.start_time) return 0;
          return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
        }),
    []
  );

  const dataByDate = useMemo(
    () =>
      sortedData.reduce((acc: Record<string, EventRecord[]>, item: EventRecord) => {
        const dateKey = item.start_date || "Unknown Date";
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(item);
        return acc;
      }, {}),
    [sortedData]
  );

  return (
    <Flex direction="column" gap="md">
      <Filters />
      <Text>Eventos</Text>
      <Grid gap="sm">
        {Object.keys(dataByDate).map((date) => (
          <Flex direction="column" gap="sm" key={date}>
            <Text>{date}</Text>
            {dataByDate[date].map((item: EventRecord) => (
              <DataCard key={item.source_url} item={item} />
            ))}
          </Flex>
        ))}
      </Grid>
    </Flex>
  );
};

export const Filters = () => {
  const [expanded, { toggle }] = useDisclosure(false);
  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          data.map((item) => item.category).filter((value): value is string => Boolean(value))
        )
      ),
    []
  );

  console.log("Available categories:", categories.length, categories);

  return (
    <Stack bd="1px solid pink.6" p="sm" bdrs="md" pos="sticky" top={0} bg="primary.5">
      <Flex align="center" justify="space-between">
        <Button fw={600} onClick={toggle}>
          Filtros
        </Button>
      </Flex>

      {/* Mantine Collapse usage snippet: https://mantine.dev/core/collapse/#usage */}
      <Collapse expanded={expanded} transitionDuration={220}>
        <PillsInput label="Categorias">
          {/* Mantine PillsInput usage snippet: https://mantine.dev/core/pills-input/#usage */}
          <Pill.Group gap="sm">
            {categories.map((category) => (
              <Pill withRemoveButton size="xs" key={category}>
                {category}
              </Pill>
            ))}
          </Pill.Group>
        </PillsInput>
      </Collapse>
    </Stack>
  );
};

export const DataCard = ({ item }: { item: EventRecord }) => {
  return (
    <Flex direction="column" p="sm" bg={"blue"} bdrs="md">
      <Text>{item.category}</Text>
      <Text>{item.title}</Text>
      <Text>{item.start_date}</Text>
      <Text>{item.start_time}</Text>
      <Text>{item.venue}</Text>
      <Text>{item.region}</Text>
      <Text>{item.address}</Text>
    </Flex>
  );
};
