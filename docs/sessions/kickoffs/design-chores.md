# Kickoff — M2 Design: Chores

**Type:** Design
**Proposed branch:** `dev/design-chores`
**Origin:** Queued in M2 Product Planning (2026-06-15)

> This is the first design session for the chores module — there is no existing chores UX.
> The module spec is in `docs/modules/chores/spec.md`. All five M2 dev sessions depend on
> the outputs of this session.

## Pre-session checklist

- [ ] Read `CLAUDE.md`
- [ ] Read `docs/modules/chores/spec.md` — module scope, permissions, events, widget spec
- [ ] Read `docs/modules/chores/stories/` — all five story specs; understand the full M2 scope
- [ ] Read `docs/design-system.md` — esp. Identity in widget slots (4px spine), Empty states, Widget Composition System, Mobile Surface, Role-Aware Rendering
- [ ] Read ADR 003 (tier model), ADR 030 (member identity colors), ADR 032 (nav item registration)
- [ ] Read `docs/sessions/logs/2026-06-03-design-home-surface.md` — home surface layouts, reserved slots

## Session scope

_One sentence:_ Design the complete UX for the chores module — task list view, create-and-assign surface, kid completion interaction, XP display, `chores.today-summary` widget — such that every M2 dev story has clear visual direction to implement against.

## Decisions to make

1. **Task list layout** — How does the full chores page render for kids (own tasks only) vs. parents (all tasks, grouped or flat)? What information density per row?
2. **Create-and-assign surface** — Where does task creation live (inline, drawer, modal)? What fields are shown at creation time?
3. **Completion interaction** — Exactly what does the one-tap done interaction look like? Is there any feedback animation (e.g., brief success state on the row)? Check motion prohibition list before proposing.
4. **XP display** — How prominent is the XP total in the full-page view? How does the large widget surface it at a glance? What's the hierarchy between XP and the task list?
5. **Widget content** — What exactly does the standard vs. large widget show for kids vs. family pseudo-profile? How do unassigned/all-family tasks render in the large family view?
6. **Assignee identity hue** — Confirm the 4px left spine pattern applies on chore rows (per design-system.md rule). Any other identity hue expression?

## Constraints

- Kids completing chores: completion is one-tap, auto-accepted (no pending state after tap). No approval dialog. Parent notification is the visibility mechanism.
- M2 tasks are one-shot (no recurrence). Do not design recurrence UI.
- M2 XP: number only. No levels, badges, or progress bars — just the running total.
- Assignee identity hue: follow the 4px left spine convention from design-system.md (settled pattern).
- Mobile: chores is a primary tab. The full-page view must work on mobile (single column, bottom tab bar). Widget stacks in the mobile home column.
- No create-task CTA in the widget — task creation lives on the full-page view only.
- Touch targets: ≥ 48px for all interactive elements.
- Do not re-litigate the tab bar structure (ADR 033).

## Required outputs

- [ ] Design decisions documented (could be as ADR amendments or session notes — check if any new ADRs are warranted)
- [ ] Annotated wireframes or layout descriptions for:
  - [ ] Kid view of /chores (own tasks, completion button, XP total)
  - [ ] Parent view of /chores (all tasks, create task CTA)
  - [ ] Create-and-assign surface (form shape, fields, tier gate)
  - [ ] `chores.today-summary` widget — standard size and large size
- [ ] Empty state copy for chores (both tier 1 and tier 2+ variants)
- [ ] Completion interaction documented (what the kid sees at the moment of tapping done)
- [ ] `design-system.md` updated if any new settled patterns emerge
- [ ] Session log committed to `docs/sessions/logs/YYYY-MM-DD-design-chores.md`
- [ ] `CLAUDE.md` current status updated
- [ ] This kickoff doc deleted
