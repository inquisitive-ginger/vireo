# Family OS — Master Context

> **Working title.** "Family OS" is provisional — use consistently
> throughout until renamed, then find-replace globally.

A locally-hosted, plugin-native platform for family organization —
chores, scheduling, finance, smart home, and more. Designed to grow
with the family that runs it. See [`docs/vision.md`](docs/vision.md).

---

## Milestone Numbering

> **Note:** Session logs prior to 2026-05-30 use pre-audit milestone numbering (old M1=Chores, M2=Calendar, M3=Smart Home, M7=Marketplace). The roadmap was restructured on 2026-05-30 to introduce M1 Platform Shell and renumber all subsequent milestones. `docs/roadmap.md` is authoritative — treat it as the source of truth over any milestone number found in session logs.

---

## Current Status

- **Milestone:** M3 — Calendar 🔄 in progress (story 1 of 7 shipped; **dev continuing**)
- **Active stories:** **Event Model + Plugin Scaffold (story 1) ✅ shipped** (PR #27). Next: **Tablet Month View (story 2)** — renders against `GET /api/calendar/events?from=&to=` (server returns ready-to-render occurrences).
- **Last session:** 2026-06-23 — **M3 Dev: Calendar Event Model + Plugin Scaffold (story 1).** Scaffolded `@family-os/plugin-calendar` (mirroring `chores`, **not** the known-incomplete generator) + data backbone + CRUD API. **ADR 038 — recurrence storage:** canonical row + **computed-on-read** weekly expansion (no `occurrences` table). **Per-occurrence skip pulled into MVP** via an `event_exceptions` overlay (`DELETE …?occurrence=`); field-edits stay deferred. **Attendees = join-only** (`event_attendees`, no `owner_id`); API takes `attendeeIds[]`, payload `ownerId` derived; `is_activity` derived on write. CASL subject `calendar.Event` + registry keys; emits `calendar.event.{created,updated,deleted}`. **PR-review course-correction:** validation realigned to the established **shared-Zod** pattern (`EventInputSchema` in `@family-os/schemas`) — chores' hand-rolled parsing was the outlier (→ queued a validation audit). 24 calendar tests; full API suite **200** green. Migration applied **non-destructively** (shared `_prisma_migrations`; diff→`db execute`→`migrate resolve`, no reset). See `logs/2026-06-23-dev-calendar-event-model.md`.
- **Previous session:** 2026-06-22 — **M3 Design: Calendar.** Locked all six surfaces in a Storybook playground against the **real design system** (`Calendar Exploration/…`): month-view hue pills + multi-day span bars; **multi-person split fill** (pulled into M3 → the `event_attendees` join); event drawer with per-field modifiers + multi-select owner picker + 30m default reminder; **ADR 037** react-day-picker; Activities as a **load lens**; `calendar.up-next` widget. See `logs/2026-06-22-design-calendar.md`.
- **Earlier session:** 2026-06-21 — **M3 Product Planning: Calendar.** Requirements brainstorm against the family's real paper wall calendar; stood up `docs/modules/calendar/` (spec + 8 stories). 3 owed ADRs logged. See `logs/2026-06-21-product-m3.md`.
- **Next session:** **M3 Dev — Tablet Month View (story 2).** The hero glanceable month grid (color-by-owner, `+N more` truncation, drill to week/day) against `docs/modules/calendar/design.md` + the `Calendar Exploration/` stories; renders the occurrences from `GET /api/calendar/events?from=&to=`. See `docs/sessions/queue.md`.

> Update this section at the end of every session.

---

## Workspace Map

| Path                       | What it is                                |
| -------------------------- | ----------------------------------------- |
| `docs/vision.md`           | The why — stable, rarely changes          |
| `docs/architecture.md`     | How pieces fit — living doc               |
| `docs/design-system.md`    | Visual language and component conventions |
| `docs/decisions/`          | ADRs — settled decisions                  |
| `docs/modules/[name]/`     | Per-module spec + progress board          |
| `docs/sessions/queue.md`   | What to run next — the session queue      |
| `docs/sessions/kickoffs/`  | Pre-loaded kickoff doc per queued session |
| `docs/sessions/templates/` | Recipes for writing kickoff docs          |
| `docs/sessions/logs/`      | Session output artifacts                  |
| `docs/roadmap.md`          | Milestones and delivery status            |

---

## Rules Every Session Follows

1. **Read this file first**
2. **Open the kickoff doc** (`docs/sessions/kickoffs/`) for this session — it has the pre-loaded context, constraints, and scope. If no kickoff exists (ad-hoc session), write a minimal one before touching code.
3. **Check `docs/decisions/` before proposing changes to settled questions**
4. **Do not re-litigate ADRs** — if a decision needs revisiting, flag
   it in your session note; don't just override it
5. **Commit an output artifact + session note before closing**
6. **Delete the kickoff doc** for this session after closing (it becomes the session log)
7. **Planning sessions must update `docs/sessions/queue.md`** before closing — add a kickoff stub for any new sessions queued

---

## Formats

### Kickoff Docs (`docs/sessions/kickoffs/[session-name].md`)

Written before the session opens. Contains: pre-session reads, scope statement,
ACs or decisions to make, constraints coming in, implementation notes (if dev),
and the required outputs checklist. Deleted after the session closes (its content
lives in the session log). Template recipes are in `docs/sessions/templates/`.

### Session Notes

Committed to `docs/sessions/logs/YYYY-MM-DD-[type]-[story].md`:

- What was decided
- What was built or produced
- What was sent back and why (if anything)
- Open questions raised
- What the next session needs to know

### ADRs (`docs/decisions/NNN-title.md`)

- **Status** — Decided | Superseded
- **Decision** — what was chosen
- **Why** — rationale
- **Alternatives considered**
- **Do not revisit unless** — what would justify reopening

### Story Progress (`docs/modules/[name]/progress.md`)

Statuses: ⬜ Not Started · 🔄 In Progress · ✅ Done · 🔙 Sent Back

---

## Conventions

**Module names:** kebab-case (`chore-engine`, `calendar`, `finance`)
**Event names:** `module.noun.verb` (`chores.task.completed`)
**Commits:** `[module/story] what changed`
**Sessions:** scoped to one story — not "backend for chores module"
but "backend for chores/task-completion story"

---

## Standing Engineering Conventions

> Cross-cutting decisions that bind **every** dev session, regardless of the
> story. Kickoffs list story-specific ADRs; these are the always-on ones a cold
> session must not miss. Check your work against this list before closing.

- **Server / plugin data → TanStack Query** (ADR 013). Never raw `fetch` + `useState`.
  Plugins import `useQuery` / `useMutation` / `useQueryClient` / `useInfiniteQuery`
  from `@family-os/platform` (the singleton path that shares the shell's
  `QueryClient`). Profile-scope query keys; invalidate on mutation. Share a key
  **prefix** across a module's page and its widget (e.g. `['chores/tasks']` +
  `['chores/tasks', 'widget']`) so one invalidation refreshes both.
- **UI → `@family-os/ui` (shadcn/Radix) components + design tokens** (ADR 012,
  `design-system.md`). Use `Button`/`Badge`/`Input`/`Label`/etc. and typography
  token utilities — never raw px font sizes, hardcoded colors, or reimplemented
  primitives. **Plugins are styled utility-first, same as the shell** (ADR 035):
  the shell's Tailwind `@source`-scans `plugins/*/src`, so `className` utilities,
  `hover:`/`focus:` variants, and container queries all emit — no per-plugin CSS
  setup. Colors/fonts still go through tokens (`bg-primary`, `var(--token)`), never
  hardcoded values. (First-party only; third-party plugin CSS is a future Option-2
  per-plugin build — see ADR 035.)
- **Member colors → identity palette helpers** (`identityColor`, ADR 030) — never
  invent hues.
- **Permissions → CASL namespaced subjects + `PERMISSION_REGISTRY`** (ADR 018).
- **Events → `module.noun.verb`**; **widgets → manifest + Query cache invalidation** (ADR 022).
- **New plugin → mirror the `family-feed` structure** (db export, prisma config,
  federation singletons, manifest); register in `plugins.json`, `load-plugin.ts`,
  `federation.d.ts`, and the shell `ICON_MAP`.

---

## Session Templates

`docs/sessions/templates/` — one file per type:
`product` · `design` · `architecture` · `development` · `qa` · `audit`

Templates are recipes for writing kickoff docs, not docs to fill out live.
All six types now exist.
