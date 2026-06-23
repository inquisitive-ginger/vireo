# Dev: Calendar — Event Model + Plugin Scaffold (M3 story 1)

**Date:** 2026-06-23
**Type:** Development
**Story:** `docs/modules/calendar/stories/event-model.md`
**PR:** #27 (merged) · branch `dev/m3-calendar-event-model`

Opens M3 Calendar dev. Scaffolded the `calendar` plugin and its data backbone.

## What was decided

- **ADR 038 — Recurrence storage** (written this session, the owed gate):
  canonical event row + **computed-on-read** weekly expansion; **no `occurrences`
  table**. Synthetic occurrence id `"{eventId}:{date}"`; canonical id always on
  `seriesId`.
- **Per-occurrence skip pulled into MVP** (the one scope change from the original
  story, at the user's call): an `event_exceptions` overlay (`kind = 'cancelled'`)
  filtered at expansion; `DELETE …?occurrence=YYYY-MM-DD` skips one week (idempotent),
  bare `DELETE` removes the series. Per-occurrence **field edits** stay deferred
  (the `kind` column leaves room for a future `'moved'`).
- **Attendees = join-only**, no `owner_id` column. API takes `attendeeIds: string[]`
  (0 = Family · 1 = solo · 2+ = shared); the published-event payload's `ownerId` is
  **derived** (single id or null). `is_activity` **derived on write**
  (`weekly && attendeeIds.length === 1`).
- **Scaffold by mirroring `chores`, not the generator** — the generator is
  known-incomplete (see queued chore).
- **Validation via shared Zod** (PR-review course-correction): `@family-os/schemas`
  is the established pattern (routes + client forms); chores' hand-rolled parsing was
  the outlier. Calendar uses `EventInputSchema.safeParse` → `400 { error: flatten() }`,
  the same shape `profiles.ts`/`setup.ts` use.

## What was built

- `@family-os/plugin-calendar` (db export, prisma config, federation singletons,
  manifest, `/calendar` placeholder, `calendar.up-next` widget **stub**); registered
  in `plugins.json` (port 3013), `server.ts`, `load-plugin.ts`, `federation.d.ts`,
  shell `ICON_MAP` (`calendar-days`).
- `calendar` schema + migration: `events`, `event_attendees`, `event_exceptions`.
- CRUD API `apps/api/src/plugins/calendar.ts`: create/list(`?from=&to=` expansion)/
  update/delete; CASL gates (view tier 1+, write tier 4); emits
  `calendar.event.{created,updated,deleted}`.
- `EventInputSchema` in `@family-os/schemas` (story 3's drawer will reuse it).
- Registry keys `calendar.event.{view,create}`; CASL subject `calendar.Event`.
- 24 calendar API tests; full API suite **200** green; typecheck + lint + federation
  build clean.

## Migration note

This repo shares one `public._prisma_migrations`, so `prisma migrate dev` flags
other plugins' migrations as drift and wants a full DB reset. Avoided that —
applied the init SQL **non-destructively** (`migrate diff --from-empty --to-schema`
→ `psql` apply on dev + test DBs → `migrate resolve --applied`). No dev data
touched. (Worth folding into the generator-hardening chore.)

## Sent back / course-corrected

- PR review flagged the hand-rolled validation; realigned to Zod before merge.

## Live review

Nav item + `/calendar` placeholder confirmed in the real shell. The home Calendar
widget shows the **reserved placeholder** (expected): the seed layout still uses the
legacy id `calendar.today`, which doesn't match the manifest's `calendar.up-next`.
Left as-is by decision; story 7 renames the seed slot + builds the real widget.

## What the next session needs to know

- **Tablet Month View (story 2)** is next — renders against `GET /api/calendar/events
?from=&to=` (occurrences arrive ready-to-render; don't re-implement the rule).
- The `Calendar Exploration/` Storybook stories are the visual reference; delete them
  as real components land.
- Owed ADRs still open: reminder scheduling (gates 6), external-ingest (gates 8).
- Queued follow-ons: **plugin-generator hardening**, **validation audit (Zod)** for
  chores + any other hand-rolled routes.
