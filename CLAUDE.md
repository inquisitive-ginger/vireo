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

- **Milestone:** M3 — Calendar 🔄 in progress (story 5 of 7 shipped; **dev continuing**)
- **Active stories:** **Recurring Activities (story 5) ✅ shipped** (PR #32). Next: **Event Reminders (story 6)** — gated by the owed reminder-scheduling ADR — or **Up Next Widget (story 7)**, unblocked now.
- **Last session:** 2026-07-09 — **M3 Dev: Calendar Recurring Activities (story 5) (PR #32).** A first-class **Activities lens** — standing commitments (weekly-recurring + single owner, the derived **`is_activity`**) surfaced/managed as named activities, grouped by owner. **`GET /calendar/activities`** returns each activity as its canonical **series** (no occurrence expansion; tier 1+). **`ActivitiesView`** splits two questions behind a **`[Roster · Seasons]`** sub-switch: **Roster** = owner-grouped list + per-kid **weekday-load strip**, tier-4 per-person **+ Add** / row **edit·remove**; **Seasons** = a schematic Gantt to each activity's end. **Two-tier chrome** — a primary **`Calendar ⇄ Activities`** tier over Month/Week/Day, on **both tablet and mobile** (lazy `['calendar/activities']` query). Reused **`CreateEventDrawer`** with activity framing (repeat-weekly implied, per-person owner prefill, `event → activity` copy). **UX gate:** co-existence = **Frame B (two-tier tabs)**, Roster/Seasons = **sub-tabs**. New reusable **`TabBar`** primitive (`@family-os/ui`) — underline ARIA tablist, roving tabindex + arrow-key nav + `tabpanel` association (kept custom, not `@radix-ui/react-tabs`). **Live-review course-corrections:** Activities on **mobile** (was tablet-only); `cursor-pointer` on `TabBar` **and** `SegmentedControl`; **44px** `ghost`/`ghost-destructive` row actions; Activities row → **`ItemCard`**. Deleted the superseded Activities exploration. typecheck (10 pkgs) + lint clean; API calendar 26 + calendar 58 + ui incl. `TabBar` 7 green; live-reviewed + signed off. See `logs/2026-07-09-dev-recurring-activities.md`.
- **Previous session:** 2026-06-24 — **M3 Dev: Calendar Mobile Event Creation (story 4) (PR #31).** The mobile PWA calendar surface — capture-once. **`AgendaView`** (calendar plugin): forward-looking, day-grouped read surface led by an **"Up next" hero** + full-width **`AgendaRow`** `ItemCard`s with a leading time column; tap-to-edit (tier 4). **`CalendarPage` branches by viewport** (`useIsTabletUp`, `md:`/768px): agenda below `md:`, month/week/day at `md:`+, one query per device; tier-4 **Add** opens the reused **`CreateEventDrawer`** as a **full-width sheet below `md:`**. New reusable **`MobileCanvas`** Storybook device canvas. See `logs/2026-06-24-dev-calendar-mobile-event-creation.md`.
- **Earlier session:** 2026-06-23 — **M3 Dev: Calendar Event Create / Edit (story 3) (PR #30).** The reused **`CreateEventDrawer`** (create / edit / per-day prefill) over the story-1 CRUD API; multi-select owner + Family, all-day/multi-day span, weekly repeat + Until, 30m reminder; recurring Remove = this-week/series; edit-from-agenda + month-cell hover quick-add; chores due-date retrofit (ADR 037). Centralized `FAMILY_PROFILE_ID`; extracted shared `Chip`/`MemberChip`/`FieldLabel`; both drawers → RHF + zodResolver. See `logs/2026-06-23-dev-calendar-event-create-edit.md`.
- **Next session:** **M3 Dev — Event Reminders (story 6)** (resolve the owed reminder-scheduling ADR first) — time-based reminders via `platform.notify()` + Web Push, the rung that retires Google. **Or story 7 — Up Next Widget** (`calendar.up-next`; unblocked now). See `docs/sessions/queue.md`.

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
