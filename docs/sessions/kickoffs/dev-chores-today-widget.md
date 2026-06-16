# Kickoff — M2 Dev: Today Widget

**Type:** Development
**Proposed branch:** `dev/chores-today-widget`
**Origin:** Queued in M2 Product Planning (2026-06-15)

## Pre-session checklist

- [ ] Read `CLAUDE.md`
- [ ] Read `docs/modules/chores/stories/today-widget.md` — full story spec and ACs
- [ ] Read `docs/sessions/logs/YYYY-MM-DD-design-chores.md` — widget visual design
- [ ] Read `docs/sessions/logs/YYYY-MM-DD-dev-chores-task-model.md` — API and data model reference
- [ ] Read `docs/design-system.md` — Widget identity header, Identity in widget slots, Empty states (compact variant), CSS container queries rule
- [ ] Read `docs/sessions/logs/2026-06-07-dev-family-feed-read.md` — reference: how the family-feed widget was built (same size slots, same container query approach)

## Session scope

Build the `chores.today-summary` widget component — it fills the reserved home screen slot that has been rendering a placeholder card since the home-surface story shipped.

## Implementation notes

- Widget `id` must be exactly `chores.today-summary` — this is what the layout seed references (ADR 028 reservation)
- CSS container queries only — no media queries (ADR 014 plugin design contract)
- Widget identity header: `CheckSquare` icon (13px, `--accent`) + "CHORES" in `text-section-label` at `--accent`
- Reads from `GET /api/chores/tasks` — already built in task-model-creation; CASL filtering handles the tier-appropriate view
- XP in large size: use `text-card-title` (not `text-metric`); full `text-metric` display is on the chores full-page view
- Empty state: compact variant (per design-system.md compact empty state section); tier-appropriate copy

## Required outputs

- [ ] `TodaySummary` widget component in `chore-engine` plugin
- [ ] Registered in plugin manifest `widgets[]` array
- [ ] Standard size: task count + message
- [ ] Large size: task list with identity hue spines + XP metric
- [ ] Empty states (tier 1 and tier 2+ copy variants)
- [ ] Storybook stories (standard with tasks, large with tasks, empty state — both tier variants)
- [ ] `docs/modules/chores/progress.md` — Today Widget marked ✅ Done
- [ ] M2 milestone marked ✅ Done in `docs/modules/chores/progress.md` (this is the last M2 story)
- [ ] Session log committed
- [ ] `CLAUDE.md` updated (milestone → M3 or next, if M2 done-line is met)
- [ ] This kickoff doc deleted
