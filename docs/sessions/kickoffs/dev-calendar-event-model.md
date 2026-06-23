# Kickoff — M3 Dev: Calendar Event Model + Plugin Scaffold (#1)

> Ad-hoc kickoff written at session open (no pre-written kickoff existed). Story:
> `docs/modules/calendar/stories/event-model.md`. Opens M3 dev.

## Pre-session reads

- `docs/modules/calendar/spec.md` · `stories/event-model.md` · `design.md`
- ADR 038 (recurrence storage — written this session, gates the build)
- ADRs 018 (CASL), 022 (widgets), 035 (plugin styling), 013 (TanStack Query)
- Reference plugin: `plugins/chores` (closest precedent — has API + CASL + events)

## Scope

Scaffold the `calendar` plugin and its data backbone. Per the story's In/Out plus
two refinements settled in the gate this session:

- **Join-only attendees** (`event_attendees`), no `owner_id` column (ADR 038).
- **Per-occurrence skip is MVP** — `event_exceptions` overlay + `DELETE …?occurrence=`
  (the one change from the original story; per-occurrence _field edits_ stay deferred).

## Decisions made (gate, 2026-06-23)

1. Recurrence = canonical row + computed-on-read expansion; no `occurrences` table (ADR 038).
2. Attendees = join is sole source of truth; API takes `attendeeIds: string[]`; event
   payload `ownerId` derived (single id or null).
3. `is_activity` derived on write (`weekly && attendeeIds.length === 1`).
4. Skip/cancel one occurrence via `event_exceptions` (`kind = 'cancelled'`); un-skip deletes the row.
5. **Scaffold by mirroring `chores`**, not `turbo gen plugin` (generator is known-incomplete —
   see queued `chore-harden-plugin-generator`).

## Acceptance criteria

Story ACs 1–9, plus added:

10. `DELETE /calendar/events/:id?occurrence=YYYY-MM-DD` on a weekly series suppresses
    exactly that occurrence in a subsequent `GET …?from=&to=`; the series and other
    weeks remain; re-issuing is idempotent.

## Required outputs

- `@family-os/plugin-calendar` mirroring chores (db export, prisma config, manifest,
  federation singletons, `/calendar` placeholder, `calendar.up-next` widget stub).
- `calendar` schema + migration: `events`, `event_attendees`, `event_exceptions`.
- `apps/api/src/plugins/calendar.ts` CRUD + `calendar.event.{created,updated,deleted}`.
- Registry keys + CASL subject `calendar.Event`; registrations in `plugins.json`,
  `server.ts`, `load-plugin.ts`, `federation.d.ts`, shell `ICON_MAP`.
- Route/API tests on `familyos_test`; live-app review before close-out.
- Session log; progress.md → 🔄/✅; queue update.
