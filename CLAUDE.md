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

- **Milestone:** M3 — Calendar 🔄 in progress (story 4 of 7 shipped; **dev continuing**)
- **Active stories:** **Mobile Event Creation (story 4) ✅ shipped** (PR #31). Next: **Recurring Activities (story 5)** — recurring series surfaced/managed as named **Activities** (`is_activity`); the load-lens (per-kid weekday load + family season timeline). _Depends on #1, #3._
- **Last session:** 2026-06-24 — **M3 Dev: Calendar Mobile Event Creation (story 4) (PR #31).** The mobile PWA calendar surface — capture-once. **`AgendaView`** (calendar plugin): forward-looking, day-grouped read surface led by an **"Up next" hero** (owner-colour wash) + full-width **`AgendaRow`** `ItemCard`s with a **leading time column**; warm Today / Later today / Tomorrow / weekday headers; tap-to-edit (tier 4). **`CalendarPage` branches by viewport** (`useIsTabletUp`, `md:`/768px): **agenda below `md:`**, the existing **month/week/day at `md:`+**, each with its own range (`agendaRange` vs `rangeFor`) so **one query runs per device**; tier-4 **Add** CTA opens the reused **`CreateEventDrawer`**. Shared **`Drawer`** → **full-width sheet below `md:`** + safe-area insets (chores' drawer inherits it). New reusable **`MobileCanvas`** Storybook canvas composes the **real** `MobileBrandTopBar` + `BottomTabBar` at a phone viewport. **UX gate → "Up Next hero"**; rows reuse `ItemCard`; one Lora moment per route. Removed the leftover story-3 drawer exploration. typecheck (10 pkgs) + lint clean; calendar 47 + ui 52 green; live-reviewed + signed off. See `logs/2026-06-24-dev-calendar-mobile-event-creation.md`.
- **Previous session:** 2026-06-23 — **M3 Dev: Calendar Event Create / Edit (story 3) (PR #30).** The reused **`CreateEventDrawer`** (create / edit / per-day prefill) over the story-1 CRUD API; multi-select owner + Family, all-day/multi-day span, weekly repeat + Until, 30m reminder; recurring Remove = this-week/series; edit-from-agenda + month-cell hover quick-add; chores due-date retrofit (ADR 037). Centralized `FAMILY_PROFILE_ID`; extracted shared `Chip`/`MemberChip`/`FieldLabel`; both drawers → RHF + zodResolver. See `logs/2026-06-23-dev-calendar-event-create-edit.md`.
- **Earlier session:** 2026-06-23 — **Design+Dev: Shared `ItemCard` + `SegmentedControl` primitives (PR #29).** Extracted the card-row skeleton + view switch feed/chores/calendar hand-rolled. **`ItemCard`** (`@family-os/ui`) composes `<Spine>` + card chrome; **`SegmentedControl`** custom `radiogroup`; **`--radius-card` (8px)**; **`Spine`** → `color: string | string[]` split. See `logs/2026-06-23-dev-itemcard-segmented-control.md`.
- **Next session:** **M3 Dev — Recurring Activities (story 5).** Recurring series surfaced/managed as named Activities (`is_activity`), with the load-lens (per-kid weekday load + family season timeline). _Depends on #1, #3._ Or **story 6 — Event Reminders** (still gated by the owed reminder-scheduling ADR). See `docs/sessions/queue.md`.

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
