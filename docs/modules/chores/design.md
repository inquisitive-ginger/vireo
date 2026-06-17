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

### Taskee — Agency view (older)

Same header + progress line, then the **full list** of neutral status-encoded
cards (4px status spine, per-task gold XP pill, 40px completion circle). Equal
standing; the kid chooses where to start.

### Admin view (tier 4) — grouped by assignee

Each person is a **lane**: 2px hue top-border + left→right hue-tint gradient
header (DM Sans name), per-lane **workload meter** (count + summed XP "load") and
a per-lane **"+ add"** (prefills assignee). Rows: faint **drag handle** (hover) +
kebab (edit/remove), status spine, per-task gold XP. Sort: overdue → due-dated →
undated → completed last.

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

**Motion:** flight ~980ms ease-in-out, gentle arc (~36px lift), scales 1→0.5 +
fades near the plate. Plate grow to 1.09 (held ~22–70%) then settle ~860ms;
count-up easeInOutCubic ~640ms. Chip is `position: fixed` (portal) so no
ancestor `overflow` clips it; start/end are live `getBoundingClientRect`.
Each flight animates once (mount-only effect + onDone ref).

**Edge/perf:** if the score plate is scrolled off-screen → quiet bank (no flight)
or pin the plate. Under reduced-motion → skip flight; morph + bank + update on tap.

---

## 3 · Create / assign surface — right drawer

A **right-side drawer** (board stays visible, dimmed behind a light scrim) is the
single surface for every entry point:

- **Create · global** — admin "New Task" (blank).
- **Create · per-person** — group-header "+ add" → assignee prefilled.
- **Edit** — admin taps a task → fields prefilled; CTA "Save changes"; a
  destructive **Remove task** below the CTA.

**Form (M2 fields):** title (required); identity-hue **assignee chips** (required,
single-select); gold **Reward** row — preset chips 5/10/15/20/25, default 10,
selected chip gets the gold treatment + star; optional due date. Header
"New task" / "Edit task" + close (X). Footer: **full-width** primary CTA, Remove
beneath (edit only). Remove needs a confirm step.

---

## 4 · `chores.today-summary` widget — read-only

**Read-only + tap-through in MVP** (whole tile opens the module).
Inline-complete = 1.5 fast-follow (the widget's mini score plate becomes the
flight target then).

**Sizes:** standard 2×1 + large 2×2 for both framings; **compact 1×1 taskee**
nice-to-have; no compact family. **Framing by viewing profile** (same widget id):

- **Taskee** — "N tasks left today", task peek, success progress bar, daily XP
  (header) + gold **coin score** (lifetime). Status-only colour.
- **Family** — pending headline + **"X of Y done today"** progress + overdue
  pill; per-person rows with **identity avatars** + labelled count chips. **No XP.**
  Completion surfaced at summary level + a per-person green **"✓ all done"** state.

**Conventions:** soft rounded, gap-separated rows (no full-width dividers);
overdue **wash** via `color-mix(in oklch, var(--error) 8%, transparent)`;
labelled count chips (no bare trailing numbers); 2×2s fill height (hero +
growing list); staggered row rise on load (reduced-motion aware). WidgetHeader =
CheckSquare + "CHORES" in `--accent`.

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
