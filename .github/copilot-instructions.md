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
- Use **Mantine** components for all UI. Do not introduce other component libraries.
- Inline styles are acceptable for layout-critical one-offs (e.g. card height from duration).
  Prefer Mantine props (`p`, `m`, `gap`, `c`, `fw`, etc.) over inline styles where possible.
- **`EventCard` height** is computed from duration: `height = (duration / 60) * 5rem`. Do not
  break this proportional layout.

## Styling rules
- Use Mantine's default theme and components for all styling. Do not add custom CSS,  or
  component libraries.
- Colors should be from the Mantine palette (e.g. `"blue"`, `"violet"`, `"orange"`) if needed create custom color palletes in [theme.ts](src/app/theme.ts) instead of hardcoding hex values.
- Biome formatter: 2-space indent, double quotes, trailing commas (ES5), 100-char line width.
- Always run `pnpm lint` before committing.
- Day colour coding: Saturday (`24.5`) = blue (`#E3F2FD` / `"blue"`), Sunday (`25.5`) = purple
  (`#F3E5F5` / `"violet"`), happening now = orange (`#FFF3E0` / `"orange"`).

## Updating for a new edition
We should do a yearly refresh of the event data from the virada-bot crawler, which may include new fields or structural changes. When updating the data structure, ensure that the app remains backwards compatible. Avoid reusing last version's components and pages. Create new ones with the necessary adjustments, and keep the old ones for reference until the new version is stable.

## Agent behaviour
- Prefer surgical, focused changes over large rewrites.
- Do not introduce new dependencies without a clear reason.
- When in doubt, ask for clarification instead of making assumptions about requirements or design.
- The app should be quick and responsive, so avoid heavy computations or unnecessary re-renders in the React components.
- Implement a server api route if you need to perform complex data transformations or if you want to keep the client-side code simpler, but prefer client-side filtering for better responsiveness with the static data.
- When updating event-data structure, keep backwards compatibility with the existing component
  interface or update all consuming components in the same change.
- For every Mantine component that is added or modified in code, include a short inline comment
  near its usage with an official Mantine docs link (prefer the `/core/<component>/#usage` anchor)
  so future edits can quickly verify API props.
- When a task is done, prompt the user to verify the changes locally by running the app and checking the relevant UI parts. If the change is not visible in the UI, provide instructions on how to trigger it (e.g. "go to the share page to see the new QR code component"). If the changes are approved by the user, commit and proceed to the next task. If not, iterate on the feedback and update the code until it is approved.
- Run `tsc`, `pnpm lint` and `pnpm format` to verify changes before committing.
- After commiting create tests for each feature created or modified, and ensure all tests pass before moving on to the next task.
