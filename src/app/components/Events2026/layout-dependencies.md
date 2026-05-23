# Figma Node 5:6629 Layout Dependencies

## Source
- Figma file: `pP2nCjiQd67oGzJ9l3xU3f`
- Node: `5:6629` (Events Page)

## Layout dependency graph
- `Events Page (5:6629)`
  - `Header (123:830)`
    - `ActionsMenu (17:99)`
      - `Action Btn` variant: `Fav Default`
      - `Menu` icon button
  - `Container (5:6630)`
    - `Content (5:6633)`
      - `PageTitle (106:377)`
      - `Filter (113:995)`
        - `Action Btn` variant: `Filter Default`
      - `EventGrid (23:472)`
        - `Event Card` instance list
          - Header tags: `Day Tag`, `Category Tag`
          - Card actions: `Fav Empty`, `Plus`
          - Optional details section:
            - Description block
            - Divider
            - Address + `Map Pin` action

## Code dependency map
- `src/app/2026/layout.tsx`
  - consumes `EVENTS_2026_TOKENS`
  - renders `Header`
- `src/app/components/Header/Header.tsx`
  - consumes `ActionCircleButton` variant `favorite`
  - composes `UserMenu`
- `src/app/components/UserMenu/UserMenu.tsx`
  - consumes `ActionCircleButton` variant `menu`
- `src/app/components/DataGrid/DataGrid.tsx`
  - consumes `ActionCircleButton` variant `filter`
  - renders `NormalizedEventCard`
- `src/app/components/DataGrid/DataCard.tsx`
  - consumes `EventTag` variants `day` and `category`
  - consumes `ActionCircleButton` variants `favorite-empty`, `expand`, `location`
  - consumes fallback `FIGMA_NODE_5_6629_ASSETS.eventImage`

## Implemented reusable primitives
- `ActionCircleButton`
  - variants: `favorite`, `favorite-empty`, `filter`, `menu`, `location`, `expand`
- `EventTag`
  - variants: `day`, `category`
- `EVENTS_2026_TOKENS`
  - colors, radius, effect token mirror for `Shapex-sm`
- `FIGMA_NODE_5_6629_ASSETS`
  - harvested asset URL registry from design context
