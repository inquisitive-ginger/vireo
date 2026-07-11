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

- **Milestone:** M3 — Calendar 🔄 in progress (6 of 7 MVP stories shipped; **one story from MVP-complete**)
- **Active stories:** **Up Next Widget (story 7) ✅ shipped** (PR #33). Only **Event Reminders (story 6)** remains for the M3 MVP — gated by the owed reminder-scheduling ADR (resolve first). Story 8 (Suggested Events Inbox) is the deferred north star.
- **Last session:** 2026-07-11 — **Design + Dev: Up Next — Density Rework (PR #36, merged).** The widget bucketed every event by **every day it touched**, so one week-long camp claimed five rows and swamped the appointments (and re-emitted the same event id per day — **duplicate React keys**, never caught because the story fixtures had no multi-day events). Spans now leave the day list for a dedicated band and the window is **one week** (today + 6), retiring the "+40 more" that read as a backlog. The tile is **three zones, three ranks**, each wearing a different **surface** so none reads as a peer: **raised** hero (a moment) · **recessed** full-bleed "all week" groove (a condition — the one element that touches both edges, because a multi-day event is the one thing that runs past the frame) · **flat** day-gutter list (a sequence). Earlier passes failed because the band kept **borrowing its grammar from a neighbour** (as a card → a second hero; folded into the gutter → lost among the days); the axis that resolved it was **material, not position**. **ADR 040 — the sunken surface plane:** the groove needed a surface meaning _below the card_ and the system had none (the ladder only climbed), while the one candidate, `--secondary`, **already means the Family fill** — so a Family-owned hero sat on a band of the identical beige. `--surface-sunken` is **near-achromatic on purpose** (chroma 0.006 vs 0.022): every identity fill is chromatic by construction, so a desaturated plane can never be mistaken for one. Ships paired with `--shadow-inset` (the tint alone is a grey rectangle; the inner shadow is what makes it a groove). Also: **`WIDGET_INSET`** (widget padding scales with the slot — 16/20/24; `WidgetSlot` contributes none, so the three widgets had drifted; retires family-feed's off-grid `14/18/16px`), owners as **avatars not names** (a strict superset of the spine), new `lib/week.ts` (11 tests), and a hero tidy (dropped the identity dot — **invisible** on a Family wash and silently indenting the eyebrow 14px). **Gotcha:** `leading-tight` is **silently dead** on `text-*-token` (those utilities bake their own line-height and win the cascade) — cost three passes at the gutter alignment; the fix was to **mirror the row's geometry** rather than compute an inset. **Fault line:** `--secondary` carrying two meanings bit **three times** this session — re-homing the Family fill is queued. Green: ui 85 · calendar 81 · api 206 · shell 3; live-reviewed. See `logs/2026-07-11-design-dev-up-next-density.md`.
- **Previous session:** 2026-07-11 — **Design + Dev: Sidebar Refresh (PR #35, merged).** Dropped the `--secondary` colored wall that competed with the floating widget cards (ADR 039). The sidebar now recedes on `--background` with **hairline edges** (`border-r` seam + inset `border-t` above the utility group) and **folds responsively**: slim `w-sidebar-rail` (96px) **label-under-icon** (11px) below `xl` → full `w-sidebar` (220px) **label-beside** (14px) at `xl`+ (item flex flips `col`→`row`; nav `overflow-y-auto` so the pinned utility group survives short viewports / tier-4 nav lists). **Profile chip elevated** into a `--card` chip (ADR-039 ladder, → `--shadow-raised` on hover/open), avatar-only when slim; its switch menu opens as a **floating dropdown below the chip**, edge-aligned at `xl`. Active softened to `bg-primary/10`; hover reuses `--secondary/70`. Utility group (bell + settings) **and its divider** render only at tier 2+ (no stray rule for the family profile). New `BellBadge` `fold` layout + **`--spacing-sidebar-rail`** token. Chosen from a rendered four-direction Storybook exploration (Quiet Rail · Hairline Rail · Lifted Marker · Inset Field; removed post-approval); the bare rail read too dissolved in review, so the ADR-031 **"Hairline Rail" fallback** was adopted. **ADR 031 amended** (surface/active/hover/profile-chip; core principle — `--primary` owns active, no left-bar — unchanged) + `design-system.md` §Sidebar. **Gotcha:** responsive font-size must sit on the label **span**, not the `<a>` beside a `text-align` class — tailwind-merge silently drops non-standard tokens (`text-xs-body`) there. Green: tsc/lint, ui + shell tests (bell-badge 7/7); live-reviewed across breakpoints/profiles/viewports. See `logs/2026-07-11-design-sidebar-refresh.md`.
- **Earlier session:** 2026-07-10 — **Design + Dev: Home Dashboard Elevation Ladder (PR #34, merged).** The three home widgets no longer read as equal peers. Locked **Option C — the Elevation Ladder** (from a rendered four-direction exploration) and shipped it: a shell-applied **three-rung prominence scale** on `WidgetSlot` — **feature** (`--shadow-raised` · `rounded-hero` · **no border**) · **card** (resting, `--shadow-card` + hairline) · **quiet** (recessed `--secondary` tint, no shadow, still fully live). **One feature per surface, re-ranked per profile** (parent→Calendar · kid→Chores · family→Feed banner) — elevation expresses ADR 028 dominance, not just `{w,h}`. Prominence is **derived on read** from a single **`apps/api/src/lib/default-layouts.ts`** composition (also fixed the **never-seeded `default_layout_family`**), **not a persisted column** (ADR 039 anticipates promoting it later). Ground-plane fixes shipped with it: **dropped the uniform widget border** ("depth, not lines") + density pass. Calendar hero refined (**no clock icon**, owner **identity pill**, **DM Sans** title not Lora — tested live, day headings smaller, **spacing not divider rules**); family-feed gained a **dense body mode** (new **`text-prose-sm`** token). **Sidebar ADR-031 tidy** (dropped the 3px left-bar, active `bg-primary/20`). **ADR 039** (widget prominence; amends 022/028) + `design-system.md` §Widget prominence. Storybook: exploration playground removed post-approval, rung demo folded into **`Foundation/Elevation`**; **typography audit** added the 3 missing scale tokens (`xs-body`/`prose`/`prose-sm`). Green: ui 85 · api 206 · calendar 66; live-reviewed + signed off. **Owed follow-up:** family-wall feed typography (banner renders dense 15px; robust fix needs prominence passed into the widget — queued). See `logs/2026-07-10-design-dev-home-dashboard-elevation-ladder.md`.
- **Next session:** **M3 Dev — Event Reminders (story 6)** — the last MVP story (resolve the owed reminder-scheduling ADR first): time-based reminders via `platform.notify()` + Web Push, the rung that retires Google. **Also queued:** **re-home the Family fill off `--secondary`** (the fault line ADR 040 names and leaves open — it caused three separate collisions in one session), the **widget content type floor** (the system says 18px for widget content; the widgets ship 14px — one of the two is wrong), the **mobile agenda span density** (same `eventsForDay` bug the widget just fixed), and the **family-wall feed-typography** follow-up. See `docs/sessions/queue.md`.

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
