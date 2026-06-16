# Kickoff — M2 Dev: Today Widget

**Type:** Development
**Proposed branch:** `dev/chores-today-widget`
**Origin:** Queued in M2 Product Planning (2026-06-15)

## Pre-session checklist

- [ ] Read `CLAUDE.md`
- [ ] Read `docs/modules/chores/stories/today-widget.md` — full story spec and ACs
- [ ] Read `docs/modules/chores/design.md` §4 — **locked widget design** (read-only tap-through; taskee vs family framing; sizes; conventions)
- [ ] Read `docs/sessions/logs/2026-06-15-design-chores-ux.md` (Group 4) — full record + the "completion surfaced" decision
- [ ] Read the `dev-chores-task-model` session log — API and data model reference
- [ ] Read `docs/design-system.md` — Widget identity header, **Reward/XP (gold) semantic**, **Status vs identity colour**, Empty states (compact variant), CSS container queries rule
- [ ] Read `docs/sessions/logs/2026-06-07-dev-family-feed-read.md` — reference: how the family-feed widget was built (same size slots, same container query approach)

> **Design is locked — build to `design.md` §4.** The `Chores Playground/4 · Widget`
> stories are the _visual reference only_. Ship the real widget in `chore-engine`
> with final stories under a **`Chores/…`** category (mirror `Family Feed/Feed
Widget`). Delete the playground once these land.

## Session scope

Build the `chores.today-summary` widget component — it fills the reserved home screen slot that has been rendering a placeholder card since the home-surface story shipped.

## Implementation notes

- Widget `id` must be exactly `chores.today-summary` — this is what the layout seed references (ADR 028 reservation)
- CSS container queries only — no media queries (ADR 014 plugin design contract)
- Widget identity header: `CheckSquare` icon (13px, `--accent`) + "CHORES" in `text-section-label` at `--accent`
- Reads from `GET /api/chores/tasks` — already built in task-model-creation; CASL filtering handles the tier-appropriate view
- **Read-only + tap-through in MVP** — the whole tile deep-links into `/chores`; it does NOT mutate. (Inline-complete is a 1.5 fast-follow.)
- **Two framings by viewing profile** (same widget id): **taskee** (tiers 1–3) — "N left today" + task peek + progress bar + gold **coin score** (lifetime) / daily XP; status-encoded colour. **family** (tier 4) — pending + **"X of Y done today"** + overdue pill + per-person rows with **identity avatars** + labelled count chips; **no XP**; completion surfaced at summary level + per-person green "✓ all done" state.
- **Sizes:** standard 2×1 + large 2×2 for both framings; compact 1×1 taskee (nice-to-have); no compact family.
- Visual conventions from `design.md` §4: soft rounded gap-separated rows (no full-width dividers); overdue **wash** via `color-mix(in oklch, var(--error) 8%, transparent)`; **labelled count chips** (no bare trailing numbers); 2×2 fills height (hero + growing list). Gold = XP only; red = overdue only.
- Empty state: compact variant (per design-system.md compact empty state section); tier-appropriate copy

## Required outputs

- [ ] `TodaySummary` widget component in `chore-engine` plugin (read-only; whole tile taps into `/chores`)
- [ ] Registered in plugin manifest `widgets[]` array
- [ ] Taskee framing: standard + large (+ compact 1×1 nice-to-have) per `design.md` §4
- [ ] Family framing: standard + large (per-person avatars, count chips, "X of Y done", "✓ all done" state)
- [ ] Profile-aware framing selection (taskee for tiers 1–3, family for tier 4)
- [ ] Empty states (tier 1 and tier 2+ copy variants)
- [ ] Storybook stories under the **`Chores/…`** category (taskee + family × sizes, plus empty states)
- [ ] `docs/modules/chores/progress.md` — Today Widget marked ✅ Done
- [ ] M2 milestone marked ✅ Done in `docs/modules/chores/progress.md` (this is the last M2 story)
- [ ] Session log committed
- [ ] `CLAUDE.md` updated (milestone → M3 or next, if M2 done-line is met)
- [ ] This kickoff doc deleted
