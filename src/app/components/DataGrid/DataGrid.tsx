import data from "@data/events.json";
import { Flex, Grid, Pill, PillsInput, Text } from "@mantine/core";
import type { EventRecord } from "~/types/event26";

export const DataGrid = () => {
    const sortedData = data.sort((a: EventRecord, b: EventRecord) => {
        if (!a.start_date || !b.start_date) return 0;
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    }).sort((a: EventRecord, b: EventRecord) => {
        if (!a.start_time || !b.start_time) return 0;
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    });
    // const now = new Date();

    const dataByDate = sortedData.reduce((acc: Record<string, EventRecord[]>, item: EventRecord) => {
        const dateKey = item.start_date || "Unknown Date";
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(item);
        return acc;
    }, {});

    return (
        <Flex direction="column" gap="md">
            <Filters />
            <Text>Eventos</Text>
            <Grid gap="sm">
                {Object.keys(dataByDate).map((date) => (
                    <Flex direction="column" key={date}>
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
    const categories = Array.from(new Set(data.map((item) => item.category))).filter(Boolean);
    return (
        <Flex direction="column" gap="sm" pos="fixed">
            <Text h="">Filtros</Text>
            <PillsInput label="Categorias" defaultValue={categories}>
                <Pill.Group>
                    {categories.map((category) => (
                        <Pill withRemoveButton size="xs" key={category}>{category}</Pill>
                    ))}
                </Pill.Group>

            </PillsInput>
        </Flex>

    )
}

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
    )
}