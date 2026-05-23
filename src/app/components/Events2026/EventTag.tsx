import { Badge } from "@mantine/core";
import { EVENTS_2026_TOKENS } from "./designTokens";

type EventTagVariant = "day" | "category";

interface EventTagProps {
  variant: EventTagVariant;
  label: string;
}

const TAG_BACKGROUND_BY_VARIANT: Record<EventTagVariant, string> = {
  day: EVENTS_2026_TOKENS.colors.tagOrange,
  category: EVENTS_2026_TOKENS.colors.tagPink,
};

export function EventTag({ variant, label }: EventTagProps) {
  return (
    // Mantine Badge docs: https://mantine.dev/core/badge/#usage
    <Badge
      radius="xl"
      tt="none"
      style={{
        backgroundColor: TAG_BACKGROUND_BY_VARIANT[variant],
        color: EVENTS_2026_TOKENS.colors.textPrimary,
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
