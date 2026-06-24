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

- **Milestone:** M3 — Calendar 🔄 in progress (story 2 of 7 shipped; **dev continuing**)
- **Active stories:** **Tablet Month View (story 2) ✅ shipped** (PR #28). Next: **Event Create / Edit (story 3)** — the reused drawer; wires the month view's inert "Add event" CTA + react-day-picker (ADR 037); optimistic mutations invalidate the shared `['calendar/events']` prefix.
- **Last session:** 2026-06-23 — **M3 Dev: Calendar Tablet Month View (story 2).** The hero glanceable `/calendar` month grid, wired to the live `GET /api/calendar/events?from=&to=` occurrences. **`MonthGrid`:** 7-col Sunday-start, color-by-owner pills, **split-fill** shared / **neutral + `Users`** Family, **lane-packed multi-day span bars**, today circle + dim past; layout math ported into pure `lib/grid.ts`. **Density + drill-in:** `+N more` → day/week agenda via internal view state (no routes). **Data:** TanStack Query keyed `['calendar/events', { from, to }]` over the full grid range; skeleton/empty/error; **Add-event CTA inert** (→ #3). **Tests = RTL (user's call):** first plugin DOM-test infra (jsdom + RTL); 22 tests. `platform` re-exports `QueryClient`/`QueryClientProvider`. **PR #28 review fixes:** `EventRow` → shared `<Spine>`; dropped duplicated `FamilyMember` for platform `Profile` (**chores migrated too**); real `Calendar/…` stories replace the deleted exploration. **Queued** the cross-cutting `ItemCard` + `SegmentedControl` extraction. Live-reviewed + signed off. See `logs/2026-06-23-dev-calendar-tablet-month-view.md`.
- **Previous session:** 2026-06-23 — **M3 Dev: Calendar Event Model + Plugin Scaffold (story 1).** Scaffolded `@family-os/plugin-calendar` + data backbone + CRUD API. **ADR 038 — recurrence storage:** canonical row + **computed-on-read** weekly expansion. **Per-occurrence skip** via `event_exceptions`; **attendees = join-only** (`attendeeIds[]`, derived `ownerId`/`is_activity`). CASL `calendar.Event`; emits `calendar.event.{created,updated,deleted}`; shared-Zod validation (`EventInputSchema`). See `logs/2026-06-23-dev-calendar-event-model.md`.
- **Earlier session:** 2026-06-22 — **M3 Design: Calendar.** Locked all six surfaces against the real design system (`Calendar Exploration/…`): hue pills + span bars; **split fill** (→ `event_attendees`); event drawer; **ADR 037** react-day-picker; Activities load lens; `calendar.up-next`. See `logs/2026-06-22-design-calendar.md`.
- **Next session:** **M3 Dev — Event Create / Edit (story 3).** One reused right Drawer (chores `CreateTaskDrawer` pattern): multi-select owner picker (required), inline Multiple-days→range, inline All-day, weekly repeat, 30m default reminder; **wires react-day-picker `DatePicker`/`DateRangePicker` (ADR 037) and retrofits the chores due-date field**; tier 4. Wires the month view's inert "Add event" CTA; optimistic create/edit/delete invalidate `['calendar/events']`. See `docs/sessions/queue.md`.

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
