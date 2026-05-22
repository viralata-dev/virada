---
name: figma-design-adaptations
description: >
  Adapt Figma designs to production-ready code in this Next.js + Mantine project.
  Use this skill when: (1) implementing a Figma screen or component in code, (2)
  updating existing UI to match new Figma revisions, (3) mapping Figma styles and
  tokens to Mantine theme values, (4) handling responsive behavior differences
  between design and implementation, or (5) validating visual parity before merge.
argument-hint: "Paste a Figma URL and target route/component"
---

# Figma Design Adaptations Skill

## Scope

Workspace-scoped skill for this repository at `.github/skills/figma-design-adaptations/`.

## Outcome

Convert a Figma design (or node) into maintainable project-consistent implementation
in this codebase, preserving Mantine patterns, responsiveness, and accessibility.

## When To Use

- New page or component implementation from Figma
- Existing page refactor to match updated Figma
- Visual bug fixes where source of truth is Figma
- Token/style alignment from design to Mantine theme

## Inputs Checklist

1. Figma URL and target node/page
2. Target destination in app (route or component)
3. Scope: full screen or specific component
4. Expected breakpoints (mobile/tablet/desktop)
5. Acceptance criteria (design intent, behavior, accessibility)

## Workflow

1. Identify target and constraints
- Confirm destination file(s) and whether this is a new component or an edit.
- Confirm whether existing project components must be reused.

2. Gather design context from Figma
- Parse `fileKey` and `nodeId` from the Figma URL.
- Retrieve structure and screenshot/context from Figma tools.
- Note design tokens: spacing, typography, colors, radius, shadows, and states.

3. Map design to project primitives first
- Prefer existing components and hooks over creating new ones.
- Map visual values to Mantine theme tokens from `src/theme/`.
- If a token is missing but broadly reusable, add it in theme files instead of hardcoding.

4. Implement with maintainable structure
- Keep changes focused and surgical.
- Preserve project conventions and data contracts.
- Keep UI responsive without introducing one-off CSS unless necessary.

5. Handle adaptation branches
- If design and existing UX conflict: preserve behavior and adapt visuals incrementally.
- If a design element is unsupported in Mantine props: use minimal local styling.
- If content density differs on small screens: prioritize readability over strict pixel lock.

6. Validate before finishing
- Run validation commands in this order: `tsc`, `pnpm lint`, `pnpm format`.
- Verify major breakpoints and interaction states.
- Confirm accessibility basics: focus visibility, semantic structure, contrast, touch targets.

7. Communicate result
- Summarize what was implemented and any deliberate deviations.
- List remaining gaps requiring designer/product confirmation.

## Decision Points

- Reuse vs create:
  Reuse existing component when behavior is close and styling can be adapted safely.
  Create new component only when reuse causes complexity or regressions.

- Theme token vs hardcoded value:
  Add or reuse theme token when value is reused or part of design language.
  Hardcode only for isolated one-off values with low reuse potential.

- Design intent vs pixel parity:
  Prefer design intent parity, usability, and responsiveness over strict pixel-perfect matching.

## Completion Criteria

1. Matches Figma design intent at target breakpoints
2. Uses Mantine + project conventions
3. Validation commands succeed: `tsc`, `pnpm lint`, `pnpm format`
4. Accessibility basics covered for changed UI
5. Clear note of deviations, assumptions, and follow-ups

## Example Prompts

- `/figma-design-adaptations Adapt this Figma node to src/app/2026/page.tsx`
- `/figma-design-adaptations Update EventCard to match this revised Figma variant`
- `/figma-design-adaptations Implement mobile-first version of this Figma section using existing components`
