import { Badge, Group } from "@mantine/core";

interface EventMetaBadgesProps {
  category: string;
  venue: string;
  region: string;
}

const FIGMA_BADGE_COLORS = [
  "#00CFF5",
  "#9B4DFF",
  "#FFB800",
  "#A855F7",
  "#FF4D6D",
  "#06FFA5",
  "#FF006E",
  "#00D9FF",
  "#7B68EE",
  "#FFCC00",
  "#9D4EDD",
  "#FF1B8D",
  "#2AF8BC",
  "#FF6B9D",
];

function getDeterministicBadgeColor(label: string): string {
  let hash = 0;
  for (let i = 0; i < label.length; i += 1) {
    hash = (hash << 5) - hash + label.charCodeAt(i);
    hash |= 0;
  }

  const colorIndex = Math.abs(hash) % FIGMA_BADGE_COLORS.length;
  return FIGMA_BADGE_COLORS[colorIndex];
}

function FigmaPillBadge({ label }: { label: string }) {
  return (
    // https://mantine.dev/core/badge/#usage
    <Badge
      variant="filled"
      radius="xl"
      tt="none"
      style={{
        backgroundColor: getDeterministicBadgeColor(label),
        color: "#FAFAFA",
        fontWeight: 800,
        fontSize: "10px",
        lineHeight: 1,
        paddingInline: "8px",
        paddingBlock: "4px",
        height: "auto",
      }}
    >
      {label}
    </Badge>
  );
}

export function EventMetaBadges({ category, venue, region }: EventMetaBadgesProps) {
  const sanitizedRegion = region?.trim();

  return (
    // https://mantine.dev/core/group/#usage
    <Group gap="xs" wrap="wrap">
      {/* https://mantine.dev/core/badge/#usage */}
      <Badge size="sm" variant="light" tt="none">
        {category}
      </Badge>
      <FigmaPillBadge label={venue} />
      {sanitizedRegion && sanitizedRegion !== "Unknown" && (
        <FigmaPillBadge label={sanitizedRegion} />
      )}
    </Group>
  );
}
