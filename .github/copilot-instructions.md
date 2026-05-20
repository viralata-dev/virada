# Copilot Instructions — virada

## Project purpose
This is the **Virada Cultural SP** event browser — a Next.js 15 web app that lets users browse,
filter, and track events from the Virada Cultural de São Paulo festival.

Event data is produced by the [virada-bot](https://github.com/lobolab-website/virada-bot)
crawler and stored statically in `src/data/events.json`.

## Stack
- **Framework:** Next.js 15 (App Router)
- **UI library:** Mantine v8 (`@mantine/core`, `@mantine/dates`, `@mantine/hooks`)
- **Language:** TypeScript (strict)
- **Linter/Formatter:** Biome (`pnpm lint` / `pnpm format`)
- **Package manager:** pnpm

## Directory layout
```
src/
  app/
    layout.tsx          # Root layout — MantineProvider, fonts, global metadata
    page.tsx            # Home page — renders EventsGrid with static event data
    globals.css         # Global styles
    share/
      page.tsx          # Share page — QR code linking to the app
  components/
    EventsGrid.tsx      # Main grid: filtering state, location columns, sorting
    EventCard.tsx       # Single event card — duration height, "happening now" badge
    DateTimeFilter.tsx  # Date segmented control + time range slider
    LocationFilter.tsx  # Multi-select location toggle buttons
    TimeBar.tsx         # Visual hour ruler rendered beside each location column
  data/
    events.json         # Static event data — refreshed from virada-bot each year
```

## Data shape (`events.json`)
```ts
{
  locations: Array<{
    name: string;       // Venue/location display name
    address: string;
    events: Array<{
      time: string;     // Format: "18h" or "20h30"
      artist: string;
      duration: number; // Minutes
      attending: boolean;
      date?: string;    // Format: "DD.M" e.g. "24.5", "25.5"
    }>;
  }>;
}
```

## Component conventions
- All components are **client components** (`"use client"`) — the data is static and filtering
  is all done in-browser.
- **No server actions, no API routes.** Keep the app fully static.
- Use **Mantine** components for all UI. Do not introduce other component libraries.
- Inline styles are acceptable for layout-critical one-offs (e.g. card height from duration).
  Prefer Mantine props (`p`, `m`, `gap`, `c`, `fw`, etc.) over inline styles where possible.
- **`EventCard` height** is computed from duration: `height = (duration / 60) * 5rem`. Do not
  break this proportional layout.

## Styling rules
- Biome formatter: 2-space indent, double quotes, trailing commas (ES5), 100-char line width.
- Always run `pnpm lint` before committing.
- Day colour coding: Saturday (`24.5`) = blue (`#E3F2FD` / `"blue"`), Sunday (`25.5`) = purple
  (`#F3E5F5` / `"violet"`), happening now = orange (`#FFF3E0` / `"orange"`).

## Updating for a new edition
When adapting for a new year (e.g. 2026):
1. Replace `src/data/events.json` with the new crawl output from virada-bot.
2. Update dates in `DateTimeFilter.tsx` (`SegmentedControl` data values and labels).
3. Update date comparisons in `EventCard.tsx` (hardcoded `"24.5"` / `"25.5"` strings).
4. Update `metadata` in `src/app/layout.tsx` (title/description).
5. Verify `TimeBar` hour range still covers the festival schedule.

## Agent behaviour
- Prefer surgical, focused changes over large rewrites.
- Do not introduce new dependencies without a clear reason.
- Do not add server-side logic — keep the app statically deployable.
- When updating event-data structure, keep backwards compatibility with the existing component
  interface or update all consuming components in the same change.
- For every Mantine component that is added or modified in code, include a short inline comment
  near its usage with an official Mantine docs link (prefer the `/core/<component>/#usage` anchor)
  so future edits can quickly verify API props.
- Run `pnpm lint` to verify changes before committing.
