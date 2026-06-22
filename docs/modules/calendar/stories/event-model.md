# Story: Event Model + Plugin Scaffold

**Module:** calendar
**Status:** ⬜ Not Started

## User story

As a parent (tier 4), I can create, view, edit, and delete family events — one-off
or weekly-recurring, owned by a person or the whole family, all-day or timed,
single- or multi-day — so the calendar has a real data backbone to render.

## Scope

**In:**

- `calendar` plugin scaffolded via `pnpm turbo gen plugin` and extended to mirror
  the existing plugin structure (db export, prisma config, federation singletons,
  manifest); registered in `plugins.json`, `load-plugin.ts`, `federation.d.ts`,
  and the shell `ICON_MAP` (`calendar-days` → lucide `CalendarDays`)
- `calendar` Prisma schema with the `events` table (see module spec for fields)
- CRUD API:
  - `POST /api/calendar/events` — create; tier 4; emits `calendar.event.created`
  - `GET /api/calendar/events?from=&to=` — list events overlapping the range,
    **expanded into weekly occurrences** for recurring rows (per the owed
    recurrence ADR); visible to tier 1+ (shared calendar — all members see all)
  - `PATCH /api/calendar/events/:id` — edit; tier 4; emits `calendar.event.updated`
  - `DELETE /api/calendar/events/:id` — remove; tier 4; emits `calendar.event.deleted`
- Event fields: `title`, `description?`, `owner_id?` (null = Family),
  `created_by`, `starts_at`, `ends_at?`, `all_day`, `location?`,
  `recurrence?` (`'weekly' | null`), `recurrence_until?`, `is_activity`
  (default false; set by the Activities story), `status` (default `confirmed`),
  `source` (default `manual`), `reminder_minutes?`, timestamps
- `calendar.event.view`, `calendar.event.create` added to `PERMISSION_REGISTRY`
- CASL baseline: `can('view', 'calendar.Event')` = tier 1+;
  `can('create' | 'update' | 'delete', 'calendar.Event')` = tier 4
- Plugin nav item: `{ label: "Calendar", route: "/calendar", icon: "calendar-days", minTier: 1 }`
- Minimal `/calendar` route placeholder (the real month view is story #2)
- Route + API unit tests

**Out:** Month-view UI (#2); create/edit form UI (#3); mobile create (#4); the
Activity management surface (#5 — this story only adds the `is_activity` column);
reminders (#6); the widget (#7); suggested-event ingest (#8 — this story only
reserves `status`/`source`); per-occurrence edits/exceptions; complex recurrence.

## Acceptance criteria

1. `POST /api/calendar/events` with `{ title, startsAt }` returns 201 for tier 4;
   returns 403 for tiers 1–3
2. An event can be created with `ownerId` set (a profile) **or** omitted/null
   (a Family event); an invalid `ownerId` returns 404
3. A multi-day event (`endsAt` on a later day than `startsAt`) and an all-day event
   (`allDay: true`) both round-trip correctly
4. A weekly-recurring event (`recurrence: 'weekly'`, `recurrenceUntil` set) is
   stored once and **expanded** by `GET …?from=&to=` into one occurrence per week
   within the queried range, not beyond `recurrenceUntil`
5. `GET /api/calendar/events?from=&to=` returns events (and expanded occurrences)
   overlapping the range for any tier 1+ profile (shared calendar)
6. `PATCH` (tier 4 → 200; tier 3 → 403) and `DELETE` (tier 4 → 200; tier 3 → 403)
   emit `calendar.event.updated` / `calendar.event.deleted`
7. `PERMISSION_REGISTRY` includes `calendar.event.view` and `calendar.event.create`
8. The Calendar nav item appears for all tiers (minTier 1) and routes to `/calendar`
9. Route tests cover: create (4 → 201, 3 → 403), create Family vs owned, multi-day,
   all-day, weekly expansion within range, list, update, delete

## Dependencies

None — first calendar story. **Gated by the owed recurrence-storage ADR** (settle
materialized-occurrences vs. computed-on-read before implementing AC 4).

## Notes

- Recurrence expansion lives server-side so the month view and widget receive
  ready-to-render occurrences and never re-implement the rule.
- `is_activity`, `status`, `source`, `reminder_minutes` are added now (cheap) so
  later stories don't each migrate the table; only `is_activity`/`status`/`source`
  defaults matter here.
- Emit all three events even before a subscriber exists (M5 School is the first
  real consumer) — for parity with the chores `created` precedent.
