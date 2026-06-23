# Kickoff — M3 Dev: Tablet Month View (calendar story #2)

**Type:** development
**Story:** `docs/modules/calendar/stories/tablet-month-view.md`
**Depends on:** #1 Event Model ✅ (PR #27) + M3 Design: Calendar ✅

## Pre-session reads

- `docs/modules/calendar/stories/tablet-month-view.md` (AC 1–8)
- `docs/modules/calendar/design.md` §1 (Month view — the hero)
- `packages/ui/src/explorations/calendar-month.stories.tsx` (locked visual reference)
- `apps/api/src/plugins/calendar.ts` (`GET /calendar/events?from=&to=` contract)
- Standing conventions in `CLAUDE.md` (TanStack Query, `@family-os/ui` + tokens, identity palette)

## Scope

Replace the `/calendar` placeholder with the real glanceable month grid: 7-column
Sunday-start month, color-by-owner chips, multi-day span bars, today/past
treatment, `+N more` density with day/week drill-in, prev/next/today nav. \*\*Read

- navigate + drill only\*\* — create/edit is #3, the widget is #7.

## Decisions (locked at the approval gate)

- **Test approach:** stand up RTL (`@testing-library/react` + jsdom) in the
  calendar plugin — first plugin DOM-test infra; mirrors `packages/ui`'s
  `vitest.config.ts` + `test.setup.ts`.
- **Add-event CTA:** rendered to match the locked chrome but **inert** (no-op)
  this story; #3 wires it to the drawer.
- **Multi-day detection:** derived from data — an event spanning 2+ calendar days
  → span bar; otherwise a single-day chip.
- **Drill-in:** internal plugin **view state** (`month | week | day` + focused
  date), not nested routes — keeps the single `Plugin` component shape.
- **Query range:** the full visible 6-week grid bounds (not month bounds), so
  spillover days populate. Key `['calendar/events', { from, to }]`.

## Acceptance criteria

Per the story spec, AC 1–8. Hue resolution: `attendeeIds[]` → profile name (via
`/api/profiles`) → `identityColor`/`getIdentityHue`. Family (no attendee) =
neutral `--secondary` + `Users` glyph; shared (2+) = split fill.

## Required outputs

- Real month-view components in `@family-os/plugin-calendar`; `/calendar` opens on
  the current month.
- RTL component tests (grid hues, span bar, `+N more` drill-in, month-nav refetch).
- Delete `packages/ui/src/explorations/calendar-month.stories.tsx` (keep the other
  three calendar explorations until #3/#5/#7 ship).
- Live-app review + sign-off before close-out (per standing feedback).
- Session log; update progress board, queue, `CLAUDE.md`.
