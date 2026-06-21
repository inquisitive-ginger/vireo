# Chores — UX Design Spec

> Locked in **M2 Design: Chores** (2026-06-15). The dev-facing distillation of
> `docs/sessions/logs/2026-06-15-design-chores-ux.md`. The interactive Storybook
> playground that served as the original visual reference was removed once the real
> `chore-engine` components shipped (M2 Task Model + Creation, 2026-06-16); the live
> reference is now the `Chores/…` Storybook stories in the plugin. Cross-cutting
> conventions are in `docs/design-system.md` (gold/XP semantic; status-vs-identity colour).

---

## Shared language (applies everywhere)

- **Gold = XP only** (treasure semantic on the marigold hue; see design-system).
  Status never gold; XP never red/green. XP numerals are **DM Sans** (`text-metric`).
- **Red = overdue only.** Green = done. Neutral otherwise.
- **Taskee surfaces encode status** (identity hue carries no info there).
  **Admin/family surfaces encode identity** (per-person lanes/dots/avatars).
- Cards: `--card` bg, `--border`, `--shadow-card`, ~14px radius, a 4px status
  spine. Page title "Chores" in Lora (`page-title`); all else DM Sans.

## Tier / view model

- **Tiers 1–3 = taskee view** (own tasks only). Parents can be taskees too.
- **Tier 4 = admin view** (all tasks; create/assign; by-assignee breakout).
- Taskee surface has **two variants**, chosen by a per-profile **"Focus mode"**
  setting that _defaults from tier_ (younger/lower → Focus on) and a parent can
  override. Tier alone is too blunt.

---

## 1 · Page layout

### Taskee — Focus view (younger / ADHD)

One obvious next action. Header (title + lifetime XP score plate) + progress line,
then a single hero **"Next up"** card (most urgent / overdue auto-surfaces) with a
big green **Mark done** button. "Coming up" and "Done" collapse to quiet mini-rows
below; empties to "🎉 All done today". Minimises executive-function load.

> **Shipped "Spotlight" (M2 Dev: Focus Mode, 2026-06-20).** Gated against two
> alternatives ("peek" — next 2 always visible; "on-deck stack") via a Storybook
> exploration; **Spotlight** (collapsed secondary sections) won as the most
> single-focus reading. The gate is which a profile sees via the per-profile
> **`focusMode`** setting (ADR 036): `null` → tier default (**1–2 → Focus**), a
> parent overrides in Settings. `FocusView` shares the flight engine with the
> Agency `TaskeeView` via the extracted **`useXpFlight`** hook; the hero promotes
> the next task on landing.

### Taskee — Agency view (older)

Same header + progress line, then the **full list** of neutral status-encoded
cards (4px status spine, per-task gold XP pill, 40px completion circle). Equal
standing; the kid chooses where to start.

### Admin view (tier 4) — grouped by assignee

Each person is a **lane**: 2px hue top-border + left→right hue-tint gradient
header (DM Sans name), per-lane **workload meter** (count + summed XP "load") and
a per-lane **"+ add"** (prefills assignee). Rows: status spine, per-task gold XP,
and **edit / remove** row actions. Sort: overdue → due-dated → undated → completed
last.

> **Row actions — reconciled in Task Editing (2026-06-20).** Originally specced as
> a hover **kebab**; shipped instead as the **settings → profiles** inline pattern,
> because a kebab leans on hover (absent on touch) and the app already established
> inline edit/remove there. **Edit = tap the row** (the whole row is the edit target,
> design §3) with an explicit **pencil on `sm+`** (hidden on mobile, where tap-row is
> the affordance); **Remove = inline trash at every width** → confirm dialog. Both are
> 44px touch targets and tier-4 only. The faint **drag handle** (hover) is still owed
> to 1.5 drag-to-reassign.

Controls: segmented **Today / Week / All** scope (S1; week-strip layered later);
**hide-completed** toggle (shared with taskee); **family pulse filter chips**
(All / Pending / Overdue) that scope the board. Family pulse summary by the
title = counts only, **no family XP**.

**1.5 / later:** drag-to-reassign (affordance shown now); capacity-aware load
meter (**needs ADR** — where member capacity lives); week-as-columns; per-lane
badge filters; bulk select; search.

---

## 2 · Completion — the "XP flight"

One reward feedback across all views. Tap target is per-view (focus = green
"Mark done" button; agency = 40px circle).

**Locked sequence (order matters — keeps the points tethered to their chore):**

1. On tap, measure the badge rect + score-plate rect; launch the chip
   **immediately** (visible frame 0) from the badge's exact spot and **hide the
   source badge** (looks like it lifted off).
2. **The card does not change during the flight** — no morph/reorder; the
   control is disabled. State: `pending → inFlight → done+banked`.
3. **On landing:** card morphs to done (focus promotes next; empties to
   "All done"), XP **banks**, the score plate grows → counts up → settles, the
   circle pops its check.

**Motion:** flight ~760ms ease-in-out, gentle arc (~36px lift), scales 1→0.5 +
fades near the plate (tuned snappier from ~980ms in dev review). Plate grow to
1.09 (held ~22–70%) then settle ~660ms; count-up easeInOutCubic ~500ms. Chip is
`position: fixed` (portal) so no
ancestor `overflow` clips it; start/end are live `getBoundingClientRect`.
Each flight animates once (mount-only effect + onDone ref).

**Edge/perf:** if the score plate is scrolled off-screen → quiet bank (no flight)
or pin the plate. Under reduced-motion → skip flight; morph + bank + update on tap.

### Admin completion (Option A — settled 2026-06-17, Completion Flow dev)

The flight is a **taskee** reward; the admin board has **no score plate** (family
surfaces carry no XP), so admin completion is a **plain check-off**, no flight.
Settled via an interactive Storybook exploration:

- **Option A:** a tier-4 parent may complete **any** task from the board (a per-row
  completion circle on every pending row). Backed by the shipped `manage all`.
- **Reopen:** a completed row's check is also the **un-complete** control (tier-4
  only). Reopening resurfaces the task on the assignee's own list — kids cannot
  reverse their own completion.

**Score plate is local/optimistic in M2** (seeded from completed tasks, banks on
completion). XP Award swaps the seed for the persisted balance (`GET /api/chores/xp`).

---

## 3 · Create / assign surface — right drawer

A **right-side drawer** (board stays visible, dimmed behind a light scrim) is the
single surface for every entry point:

- **Create · global** — admin "New Task" (blank).
- **Create · per-person** — group-header "+ add" → assignee prefilled.
- **Edit** — admin taps a task → fields prefilled; CTA "Save changes". (Reuses the
  create drawer; see Task Editing, 2026-06-20.)

**Form (M2 fields):** title (required); identity-hue **assignee chips** (required,
single-select); gold **Reward** row — preset chips 5/10/15/20/25, default 10,
selected chip gets the gold treatment + star; optional due date. Header
"New task" / "Edit task" + close (X). Footer: **full-width** primary CTA only.

> **Remove placement — reconciled in Task Editing (2026-06-20).** Originally specced
> as a destructive **Remove** beneath the CTA in the drawer's edit mode; shipped
> instead as a **row action** (inline trash + confirm dialog — §1), so the drawer
> footer carries only the primary CTA. Remove still needs the confirm step.

---

## 4 · `chores.today-summary` widget — read-only

**Read-only + tap-through in MVP** (whole tile opens the module).
Inline-complete = 1.5 fast-follow (the widget's mini score plate becomes the
flight target then).

**Visual direction: "Hero split"** — gated in **Today Widget Rework**
(2026-06-20). The widget originally shipped via the agent team (#22) without the
UI gate and quietly simplified the locked exploration to a flat sentence-headline
peek (and dropped daily XP entirely). The gate restored the richer direction:

- **A big `text-metric` count anchors the glance** (left column / hero row), not a
  sentence headline. Label below ("N tasks left today" / "N pending today").
- **Taskee rows are filled pills** (muted bg, overdue → error wash) carrying the
  4px status spine + title + **per-task `+XP`** in gold ink.
- **Daily XP is back in the header** (`+N today`, gold) alongside the lifetime
  **coin score** — the two are distinct (daily = today's banked rewards; lifetime
  = persisted `GET /api/chores/xp` balance, the same source as the page ScorePlate).

**Sizes:** standard 2×1 + large 2×2 for both framings, plus a **compact** short/
narrow-slot fallback for each — taskee shows count and progress; family shows count,
progress, and the overdue pill (no per-person rows, which need height). The family
compact was added in the responsive-reflow pass (2026-06-20): a family slot can be
short (an h=1 slot is 180px on the mobile stack) where the stacked list would clip.
**Framing by viewing profile** (same widget id):

- **Taskee** — header (coin score, or daily XP on 2×2) → hero count + daily XP
  (left) / filled `+XP` task rows (right) on 2×1; hero + coin + progress + full
  filled list on 2×2. Status-only colour. **All-done** → centered "🎉 All done
  today" (coin retained in header). Empty → tier-aware EmptyState.
- **Family** — `+N pending today` hero + **"X of Y done"** sub + overdue pill;
  per-person **filled tiles** with **identity avatars** + labelled count chips,
  **No XP.** **Every member shows, urgent-first** (overdue → most-pending) and the
  list **fills the slot height** — it only clips if it genuinely overflows, and the
  clip drops the least-urgent member last (no hard 2-row cap; never hides
  non-overdue members). Per-person green **"✓ all done"** state when someone
  clears their list.

> **Slots fill height; the widget self-sizes.** The home grid sizes each row to
> fill the viewport (clamped 180–400px/row), so a 2-row-tall slot is ~600–800px —
> the fixed 180/376 only holds in Storybook. The widget **self-sizes to its
> rendered box via CSS container queries** (the content-widget standard; mirrors
> family-feed). The two-column **standard** is a _wide-and-short_ layout — it only
> engages when the slot is both wide (`≥440px`) and short (`≤299px`); a **tall**
> slot → large at any width; anything **narrower** (mobile full-width stack) reflows
> to a **single column** (design-system mobile rule): taskee → compact (short) /
> large (tall); family → the full-width stacked list (so the per-person chips get
> room instead of clipping). Every list (`flex-1`, all items, urgent-first sort)
> grows to fill and clips on overflow rather than capping at a fixed count. The
> `size` prop remains an optional explicit override (Storybook / fixed hosts).

**Conventions:** soft rounded, gap-separated rows (no full-width dividers);
overdue **wash** via `color-mix(in oklch, var(--error) 8%, transparent)`;
labelled count chips (no bare trailing numbers); 2×2s fill height (hero +
growing list). WidgetHeader = CheckSquare + "CHORES" in **neutral** (icon
`--muted-foreground`, label inherits `--foreground`), matching the family-feed
reference — identity is carried by the rows, not the header (optional trailing slot
for coin / daily XP / overdue pill).

> **Focus-mode widget variant — shipped (M2 Dev: Focus Mode, 2026-06-20).** The
> taskee widget above is the **Agency / default** framing. The **Focus** variant —
> a single hero **"Next up"** row + "+N more" + progress, mirroring the Focus page
> language (§1) — ships across all three sizes, branching on the same per-profile
> **`focusMode`** setting (ADR 036) the widget reads from `/auth/me`. Taskee
> framing + Focus on → the "Next up" variant; off → the Agency Hero split.

---

## Implementation note — playground vs final components

The Storybook **`Chores Playground/…`** stories were exploration scaffolding, not
shippable components. They were **deleted** in M2 Task Model + Creation (2026-06-16)
once the **real** components landed in the `chore-engine` plugin, with their final
stories under a **`Chores/…` category** (mirroring how `Family Feed/…` is organised).
Remaining M2 dev sessions extend that real component set — there is no playground to
maintain in parallel.

## Open / owed

- **ADR: member capacity** — where it lives, who sets it. Gates the capacity-aware
  admin load meter (1.5).
