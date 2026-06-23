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

- **Milestone:** M3 — Calendar 🔄 in progress (product + design done; **dev next**)
- **Active stories:** None building yet — UX locked in design (`docs/modules/calendar/design.md`); **M3 dev unblocked**, start with **Event Model + Plugin Scaffold (#1)** after resolving the recurrence-storage ADR.
- **Last session:** 2026-06-22 — **M3 Design: Calendar.** Locked all six surfaces in a Storybook playground built against the **real design system** (`Calendar Exploration/…`). **Month view (hero):** filled hue pills (highlighter analog), continuous multi-day **span bars**, today = filled `--primary` date circle, past = **dim-events**, `+N more` density; legibility carried by **colour, not text**. **Multi-person events pulled INTO M3** (was deferred) → **split fill**; needs an `event_attendees` join (folded into the recurrence ADR). **Event drawer:** each modifier on its field (inline Multiple-days→range, inline All-day, +60m end, "(Every Tuesday)" inline); **multi-select** owner picker, **required/never-defaulted**; **30m default reminder**. **Date picker → ADR 037:** react-day-picker v10 themed by token — `Calendar`/`Popover`/`DatePicker`/`DateRangePicker` shipped to `@family-os/ui` (chores due-date retrofits). **Activities → a load lens** (Activity = a person's standing seasonal commitment; derive, don't categorize; weekday-load + season timeline). **`calendar.up-next` widget** (Family/Mine, 3 sizes, owner spine, all-clear). Shipped 2 engineering fixes: `cn` token-size in tailwind-merge; Storybook `@source` for `../src`. See `logs/2026-06-22-design-calendar.md`.
- **Previous session:** 2026-06-21 — **M3 Product Planning: Calendar.** Requirements brainstorm against the family's real paper wall calendar; stood up `docs/modules/calendar/` (spec + 8 stories). Settled: glanceable month-mirror; weekly recurrence; activities first-class; email parsing = north star (deferred); month default; one shared calendar; mobile capture + reminders in M3; tier-4 creates. 3 owed ADRs logged. See `logs/2026-06-21-product-m3.md`.
- **Earlier session:** 2026-06-21 — **Audit: Post-M2 Coherence.** Cross-doc sweep after M2 closed; fixed 6 drifts. See `logs/2026-06-21-audit-post-m2.md`.
- **Next session:** **M3 Dev — Event Model + Plugin Scaffold (#1).** Scaffold the `calendar` plugin + `events` table (weekly recurrence, **`event_attendees` join** for multi-person, all-day/timed/multi-day, status/source reserved) + CRUD API + events/permissions namespaces. **Resolve the owed recurrence-storage ADR first** (it now also settles the attendees join). Build against `docs/modules/calendar/design.md` + the `Calendar Exploration/` stories. See `docs/sessions/queue.md`.

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
