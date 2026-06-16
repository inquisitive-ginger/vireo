# Kickoff — M2 Product Planning (Chores)

**Type:** Product (planning)
**Proposed branch:** `dev/product-m2`
**Origin:** Queued as M2's planning gate after M1 Design: Mobile Surface closed (2026-06-14)

> Driving doc for the session. Follows `docs/sessions/templates/product.md`.
> Breaks M2 — Chores into stories and seeds the chores module. Chores is the
> **first real feature module** (M1 was all platform shell), so it starts from a
> clean slate — there is no `docs/modules/chores/` yet and no chores design beyond
> the reserved `chores.today-summary` widget slot in the home layouts.

## Pre-session checklist

- [ ] Read `CLAUDE.md`
- [ ] Read `docs/vision.md` — kids as participants; agency grows with trust
- [ ] Read `docs/roadmap.md` — M2 scope and done definition
- [ ] Read `docs/architecture.md` — plugin/module constraints
- [ ] Read `docs/design-system.md` — esp. reserved widget slots, identity colors,
      permission-gate usage, mobile tab bar (Chores is a primary tab)
- [ ] Read ADR 001 (plugin-native), 002 (two-layer currency), 003 (age-tiered agency),
      005 (allowance-as-ledger), 022 (widget system), 028 (home-surface layouts),
      030 (member identity colors), 032 (plugin nav-item registration)
- [ ] Read the M1 Product Planning log (`2026-06-04-product-m1.md`) for the story-spec
      house style and how design/dev sessions were queued

## Session scope

_One sentence:_ Break **M2 — Chores** into stories, stand up the `docs/modules/chores/`
spec + progress board, and queue the M2 follow-on sessions — **including a chores design
session ahead of any dev session**, since the chores module has no design yet.

## Done definition (from roadmap, verbatim)

> **Done when:** A kid completes a chore and a parent sees it happen.

Every story defined here must trace to this line. The four roadmap bullets — task
creation/assignment, completion flow (kid marks done), XP gamification basics, parent
notification on completion — are the raw scope to slice.

## Constraints coming in

- **ADR 002 — two-layer currency.** Chore completions award **XP only** in M2. F$ earning
  from chores is explicitly deferred to M6 (per roadmap). Do not wire F$ into any M2 story.
- **ADR 003 — age-tiered agency.** Capabilities bind to tier _level_, not age or role name.
  Assignment and completion rights are tier-gated; parents (tier 4) assign, kids complete.
- **ADR 022 / ADR 028 — widget system + reserved layouts.** The `chores.today-summary`
  widget slot already exists in the default layouts (compact/standard/large per tier). The
  chores plugin's widget `widgetId` must match that reserved seed exactly.
- **ADR 030 — member identity colors.** Chore rows carry the assignee's identity hue
  ("people are color"); this is already referenced in design-system.md.
- **ADR 032 — plugin nav-item registration.** Chores is a primary surface — it has a
  reserved bottom-tab slot and needs a sidebar `navItem` in its manifest.
- **Module conventions (CLAUDE.md).** Module name `chores` (kebab-case); events
  `chores.task.*` (e.g. `chores.task.completed`); permissions `chores.<Subject>` /
  `chores.<verb>` consistent with the design-system examples (`chores.Task`, `chores.view`).
- **Notification infrastructure (M1, shipped).** Parent-on-completion notification rides the
  existing `platform.notify()` / bell+tray stack — M2 wires an event subscriber, it does not
  build new notification plumbing.

## Open questions to resolve (or explicitly defer)

1. **Recurrence in M2 or not?** Does task creation include recurring/scheduled chores, or is
   M2 one-shot tasks only with recurrence deferred? (Lean: defer recurrence; it risks
   bloating the milestone past the done line.)
2. **XP surfacing.** Does M2 only _award_ XP (a number that accrues), or also _display_ a
   running total / level somewhere? Decide the minimum that satisfies "gamification basics"
   without pulling a rewards/levels UI into M2.
3. **Approval step.** Is a completed chore auto-accepted, or does it need parent
   confirmation before XP lands? This shapes both the completion-flow story and the
   notification. (Flag for the design session if it's a UX question, but the data model
   consequence must be decided here.)
4. **Assignment model.** One assignee per task, or multiple? Self-assignment allowed for
   higher tiers? Resolve enough to write testable ACs.

If any of these turns into an unsettled _architectural_ question, log it for an architecture
session rather than improvising — per the product template.

## Stories to define (starting list — will grow during the session)

Slice the four roadmap bullets into single-sentence stories. Expected shape:

- **Chores — Task Model + Creation** — schema, create/assign a task (tier-gated).
- **Chores — Completion Flow** — kid marks a task done; emits `chores.task.completed`.
- **Chores — XP Award** — completion accrues XP per the M2 decision on surfacing.
- **Chores — Parent Notification** — subscriber on `chores.task.completed` → `platform.notify()`.
- **Chores — Today Widget** — fills the reserved `chores.today-summary` slot.

Resolve dependencies first (task model precedes completion; completion precedes XP and
notification). Split any story that needs "and."

## Required output: queue a Chores design session BEFORE the dev sessions

This is the reason this kickoff exists. **Planning queues design stories too, not just dev
stories.** Chores has no module-specific design — only the reserved widget slot. So before
any M2 dev session is scheduled, this planning session must:

- [ ] Add an **M2 Design: Chores** session to `docs/sessions/queue.md`, positioned _ahead_
      of the M2 dev sessions, and write its kickoff stub. It should cover the chore-module
      UX the dev stories depend on: the task list / today view, the create-and-assign
      surface, the kid completion interaction (one-tap done, optimistic feedback), how XP
      reads at a glance, the `chores.today-summary` widget contents, and how assignee
      identity hue applies to rows.
- [ ] Mark M2 dev sessions as **depends on: M2 Design: Chores** in the queue.

If the open questions reveal the design session should split (e.g. widget design vs. full
module UX), queue both — but design lands before dev either way.

## Outputs (required before closing)

- [ ] Story specs written to `docs/modules/chores/stories/[story-slug].md` (one per story,
      using the template's story format)
- [ ] `docs/modules/chores/progress.md` created (progress board, all ⬜ Not Started)
- [ ] `docs/modules/chores/` module spec stub (what the module is, its events/permissions
      namespace, reserved widget) if not folded into the progress board
- [ ] `docs/sessions/queue.md` updated — **M2 Design: Chores queued ahead of dev**, dev
      sessions queued after it with the dependency noted, each with a kickoff stub
- [ ] Session log committed to `docs/sessions/logs/2026-MM-DD-product-m2.md`
- [ ] `CLAUDE.md` current status updated (milestone → M2, last/next session)
- [ ] This kickoff doc deleted (its content now lives in the session log)

## Session log format

```
## What was decided
## Stories defined
## Open questions raised
## What the next session needs to know
```
