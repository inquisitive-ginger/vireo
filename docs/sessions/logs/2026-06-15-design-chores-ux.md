# Session Log — M2 Design: Chores UX

**Date:** 2026-06-15
**Type:** Design
**Scope:** Full chores-module UX — task list / taskee views, create-and-assign
surface, kid completion interaction, XP display, and the `chores.today-summary`
widget. Goal: every M2 dev story has clear visual direction to build against.

**Method:** Interactive design review against a live Storybook playground
(`packages/ui/src/chores-playground/`) using the real design system — tokens,
fonts, identity hues, components. Each story group is stepped through with the
user, tightened, then the decision captured here. **This is a running log** —
updated as each group locks; full closeout (design-system.md, CLAUDE.md, queue,
playground teardown) happens after all groups are decided.

> Playground (temporary, deleted at session close):
> `chores-playground/{page-layout,completion,create-surface,widget}.stories.tsx`
>
> - `_shared.tsx`.

---

## Group 1 — Page Layout

### Tier / view model (revised this session)

The earlier "kid vs parent" split was replaced. Settled model:

- **Tiers 1–3 = taskee view** — sees only their own tasks. (Parents can be
  taskees too — tasks are assignable to anyone, not just kids.)
- **Tier 4 = admin view** — sees all tasks across the family, can create/assign,
  needs the by-assignee breakout. This is the management/overview surface.

### ✅ LOCKED — Taskee views (tiers 1–3)

**Two taskee variants ship**, sharing one visual language. Which a profile gets
is a **per-profile "Focus mode" setting that _defaults_ from tier** (younger /
lower tier → Focus on) but a parent can override. Tier alone is too blunt — a
focused 6yo and a scattered 10yo don't split cleanly by age.

- **Focus view** (ADHD / younger) — one obvious next action. Header + daily
  stat, then a single hero **"Next up"** card (the most urgent task auto-surfaces
  — overdue first), with a big low-friction green **Mark done** button.
  "Coming up" and "Done" collapse to quiet mini-rows below so the full list stays
  visible without competing for attention. Minimizes executive-function load.
- **Agency view** (older) — same header + daily stat, then the full list of
  neutral status-encoded cards. Every task has equal standing; the kid chooses
  where to start.

Reference: `page-layout.stories.tsx` → `Kid H — XP treatment v2` (both variants
side by side).

### ✅ LOCKED — Card color logic (kid/taskee view)

In taskee view the identity hue carries **no information** (every task is the
same person), so flooding cards with it was both meaningless and the source of a
false "everything's alarming" red wash (Maya = terracotta tint ≈ pink-red).
Decision: **kid-view cards are neutral; color encodes STATUS, not identity.**

- Neutral default — `--card` bg, `--border`, grey status spine.
- **Red reserved for overdue only** — red left spine + `OVERDUE` chip + red date.
  Because it's the only red on the page, it reads correctly as urgent.
- Green for done — green spine, line-through, success check.
- Per-task XP shown on every row.

(Identity color still does its job in the **admin** view, where multiple people
appear — see below.)

### ✅ LOCKED — XP treatment ("warm arcade ledger", option H-2)

Gold is a **dedicated "treasure" semantic** built on the system's
marigold/`--warning` hue (≈78), kept well clear of error-red (hue 12) so XP can
never read as an alarm and the two color languages can't collide. **Gold is used
exclusively for XP**; status never uses gold, XP never uses red/green.

- **Total XP = the trophy.** Header "score plate" (H-2): minted gold coin
  medallion with a **Star**, Lora numeral, stacked `XP / TOTAL`. Reads explicitly
  as the lifetime/all-time score. It is the page's hero stat.
- **Daily XP = momentum, not a second trophy.** On the progress line, deliberately
  lighter: no fill, a **TrendingUp** glyph (distinct from the Star), gold-_ink_
  text `↗ +20 XP today`. Same gold family for cohesion, clearly subordinate in
  weight/form/icon. (Fixes the prior problem where total and daily sat at the
  same visual level.)
- **XP semantics:** header number = running lifetime total (a growing score, not
  the value of current tasks). Per-task value lives on each row's gold pill.
- Per-task reward pills use a soft gold tint; earned (done) rewards show in
  success green to signal "banked".

Rejected along the way: amber-on-everything (clashed because cards were all
red-tinted — root cause was the card flood, not the amber); G-1/G-3 header
variants (coin medallion was a close 2nd for delight; editorial swash too
restrained for a kid surface).

### ✅ LOCKED — Admin view (tier 4)

**Grouped by assignee (variant B).** The by-assignee breakout is the dominant
MVP admin requirement; grouping beats a flat list for the "are these balanced?"
question and beats collapsible (C) because at family scale you rarely need the
collapse, and C hides the overdue tasks you most want surfaced. Identity hue
does real work here (unlike taskee view) — each person is a **lane**, signalled
by a 2px hue top-border + a left-to-right hue-tint gradient wash. Name in DM Sans.

Reference: `page-layout.stories.tsx` → `Admin B+ — parts to compare` (option
matrix) and `Admin B+ — composed + reassign` (recommended composition).

**Locked element picks (audited against the foundation):**

- **Time scope — S1 segmented** `Today / Week / All` (MVP, simplest). The **S3
  week strip** (7 day chips with overdue/today dot markers) layers in later as the
  week view; S2 day stepper not chosen.
- **Group header — H2 person plate + load meter.** Name + a hue **workload bar**
  ("2 tasks · 25 XP load") — the at-a-glance balance read. **No profile-initial
  avatar** — redundant against the lane hue + spelled-out name (removed). Per-lane
  **"+ add"** prefills assignee = that person (faster than global New Task).
- **Task row — R2 drag handle + kebab.** A faint **drag handle** (hover) on every
  row — touch-friendly, discoverable, and pre-stages the 1.5 drag-to-reassign.
  Kebab opens edit/remove.
- **Family pulse = interactive filter chips** (`All / Pending / Overdue`).
  Tapping scopes the board. Global filter is MVP; per-lane badge filtering later.
  Red "Overdue" chip reads red idle, fills red active.
- **Hide-completed toggle** — shared control across taskee + admin views.
- **Sort within a lane:** overdue → due-dated → undated → completed last.
- **Family pulse summary** by the title (`N pending · N overdue`) — counts only.
  **No family XP hero** (XP is a kid motivator, not a management KPI — confirmed).
- **Empty states:** per-person "all clear"; whole-view empty. (To detail at dev.)

**Typography audit fixes applied:**

- Group header names were Lora → **corrected to DM Sans**. Per
  `design-system.md:82`, Lora is scoped to `page-title`/`display-lg`/`display-xl`/
  `prose` only; structural chrome stays DM Sans.
- **XP numerals moved Lora → DM Sans** (`text-metric`, 700) across all surfaces
  (admin + the kid score plate / focus card). The gold treasure treatment carries
  the warmth; the type scale stays compliant. (Decision: no Lora-for-XP exception.)

### Deferred to 1.5+ (admin)

- **Drag-to-reassign** — affordance (drag handle + drop-target visual language)
  shown now in `Admin B+ — composed + reassign`; wiring is 1.5.
- **Capacity-aware load meter** — each profile gets a settable **capacity**
  (XP/day or task count); the meter fills toward _their own_ capacity and warns
  when over, making the balance read fair across ages. **Needs an ADR for where
  capacity lives** (per-profile setting, who sets it). MVP meter = relative load.
- Week-as-day-columns calendar, overdue-only quick filter via the pulse chips,
  bulk select/reassign, search, unassigned bucket (only once assignee-optional or
  recurring templates exist).

---

## Open questions raised

- "Focus mode" setting: where does it live (profile settings vs. a quick toggle),
  and what's the exact tier default boundary? Captured as a setting; mechanics TBD
  at dev time.
- Green "Mark done" button introduces green as a completion-action color in the
  focus view (previews the done state). Confirm this doesn't conflict with the
  app's primary (terracotta) CTA convention — deliberate exception for the
  low-friction kid loop.

## Group 2 — Completion

### ✅ LOCKED — the "XP flight" earn moment (all views)

One reward feedback across every view: on complete, the task's **gold +XP badge
lifts off from its exact position and arcs up to the score plate** (a measured
flight — real `getBoundingClientRect` start/end, rendered `position: fixed` so no
ancestor `overflow` clips it). The lifetime total then **grows → counts up →
settles** as the chip lands (banked on arrival, not on tap). Chosen over the
quieter inline-only and the louder sparkle-burst alternatives — the flight makes
the action→reward link explicit without overstimulating, so it suits the focus /
ADHD view too. (Earlier leaning toward per-view feedback was dropped in favour of
one consistent moment.)

Reference: `completion.stories.tsx` → `XP flight (locked)` (both taskee views).

**Tap targets (per view, from Group 1):**

- **Focus view** — the big green **"Mark done"** button on the featured "Next up"
  card. On complete the next task auto-promotes; empties to "🎉 All done today!".
- **Agency view** — the **40px completion circle** on each card.
  Both fire the same flight; origin is measured per task so it works from wherever
  the badge sits.

**Locked sequence (order matters — this is the fix that makes XP feel tethered
to its chore):**

1. On tap, measure the badge's rect and the plate's rect, launch the chip
   **immediately** (visible from frame 0 — no opacity ramp) at the badge's exact
   position, and **hide the source badge** so it reads as the badge itself lifting
   off (not a duplicate).
2. **During the flight the originating card does NOT change** — no morph, no
   reorder; the complete control is disabled so it can't re-fire. (Earlier the
   card morphed on tap, which detached the points from their chore — rejected.)
3. **On landing:** the card morphs to done (focus view promotes the next task to
   "Next up"; empties to "All done today"), XP **banks**, the plate
   grows→counts→settles, and the circle pops its check.

**Motion spec (as tuned):**

- Flight: ~980ms, `cubic-bezier(0.45, 0, 0.2, 1)` (ease-in-out), gentle arc
  (≈36px midpoint lift), scales 1→0.5 + fades slightly as it nears the plate.
- Score plate: grow to 1.09 (held ~22–70%) then settle, ~860ms; count-up on
  easeInOutCubic (~640ms), time-aligned so the number ticks while enlarged.
- Circle: quick pop + check fade-in on landing.
- All under `prefers-reduced-motion: no-preference`.

**Implementation notes for dev:**

- The chip is rendered `position: fixed` at the document level (a portal in the
  real app) so no ancestor `overflow: hidden` clips its path. Start/end are live
  `getBoundingClientRect` centres — robust to layout/scroll.
- Card state machine per task: `pending → inFlight (badge hidden, control
disabled) → done+banked`. The visible "done today" count and daily-XP also
  update on landing, not on tap.
- Each flight runs its animation exactly once (mount-only effect + an `onDone`
  ref) — depending on the fresh `onDone` closure restarts it mid-flight.
- Edge cases: if the score plate is scrolled off-screen, fall back to a quiet
  bank (no flight) or pin the plate. Under reduced-motion, skip the flight —
  morph + bank + update the total directly on tap.

---

## Group 3 — Create / assign surface

### ✅ LOCKED — right drawer (variant A)

Create/assign uses a **right-side drawer** (slides in from the right; the board
stays visible but dimmed behind a light scrim). Chosen over the centered modal
(heavier / more interrupting than needed) and the inline form (awkward in the
dense admin board). The drawer is the same surface for every entry point.

Reference: `create-surface.stories.tsx` → `Right drawer (locked)` + `Modes`.

**One form, three entry points (all open the same drawer):**

- **Create · global** — from the admin "New Task" button (blank).
- **Create · per-person prefill** — from a group header's "+ add" → assignee
  pre-selected to that person.
- **Edit** — admin taps an existing task → fields prefilled; CTA becomes
  "Save changes"; a destructive **Remove** action appears (far left of footer).

**Form (locked language):** title; identity-hue **assignee chips** (required,
single-select); a gold **Reward** row — preset chips 5/10/15/20/25, default 10,
selected chip carries the gold treatment + star (gold = XP only); optional due
date. DM Sans throughout; header "New task" / "Edit task" + close (X); footer is
a **full-width** primary CTA ("Assign task" / "Save changes") with a destructive
**Remove task** link beneath it (edit only).

**Notes for dev:**

- xp_reward presets cover the common range; default 10. (If a custom value is
  ever needed, the preset row can grow a "custom" affordance — not M2.)
- Assignee required to submit (single). Title required. Due date optional.
- Edit and create share one component (mode flag); Remove needs a confirm step.

---

## Group 4 — `chores.today-summary` widget

### ✅ LOCKED — "warm dashboard tile", read-only

**Read-only + tap-through in MVP.** The widget summarises and deep-links into the
chores module; it does not mutate. Rationale: the completion XP-flight needs the
module page's score plate as its target, which isn't reliably present in a slot
(esp. compact). **Inline-complete from the widget = 1.5 fast-follow** (the
widget's own mini score plate becomes the flight target then). Whole tile is the
tap target.

Reference: `widget.stories.tsx` (5 stories).

**Sizes shipped:** standard 2×1 + large 2×2 for **both** framings; **compact 1×1
taskee** as a nice-to-have. No compact family (1×1 too small for a multi-person
pulse).

**Two framings, by viewing profile** (same `chores.today-summary` id):

- **Taskee** (tiers 1–3) — "N tasks left today", a peek of today's tasks (status
  spine + gold +XP), a success **progress bar**, daily XP (header) and the gold
  **coin score** (lifetime total). Status-only colour (identity carries no info).
- **Family** (tier 4 / admin) — pending headline + **"X of Y done today"**
  progress (momentum is surfaced, not just the backlog) + overdue pill; per-person
  rows with **identity avatars** and labelled count chips. **No XP** (management
  pulse, not a kid KPI).

**Completion is surfaced** (resolved Q): at the **summary** level (family "done
today" progress) and as a per-person **state** — someone with 0 left shows a green
**"✓ all done"** chip instead of count pills. Rows otherwise lead with what's
outstanding (overdue wash + "N left") so the "who needs a nudge" scan stays clean.

**Visual conventions (fresher than the first ledger pass):** soft rounded,
gap-separated rows (no full-width divider lines); gentle overdue **wash** via
`color-mix(in oklch, var(--error) 8%, transparent)`; labelled count **chips**
(no bare trailing numbers); identity **avatars** (tint + initial); 2×2s fill
their height (hero + growing list, no dead gap); staggered row rise on load
(reduced-motion aware). WidgetHeader unchanged (CheckSquare + "CHORES" in accent).

---

## What the next session(s) need to know

- All four UX groups are locked; the playground (`packages/ui/src/chores-playground/`)
  is **retained as the visual reference** for M2 dev (delete once real `chores`
  component stories exist — see note below).
- Distilled, dev-facing spec lives in **`docs/modules/chores/design.md`**.
  Cross-cutting conventions (gold XP semantic, status-vs-identity colour rule)
  added to **`docs/design-system.md`**.
- **ADR still owed:** member **capacity** (where it lives / who sets it) — gates
  the capacity-aware admin load meter (1.5).
- M2 dev sessions already queued with kickoffs (`dev-chores-*`). They build
  against this design + `design.md`.

## Playground teardown

Intentionally **kept** (not deleted at close): the playground is the richest
visual reference for the M2 dev stories (esp. the completion XP-flight and the
widgets). Remove it when the real `chores` module components land with their own
stories. Decisions are also captured in this log + `design.md` + `design-system.md`.

## ADRs to write at session close

- **Member capacity** (where it lives, who sets it) — gates the capacity-aware
  load meter (admin 1.5).
