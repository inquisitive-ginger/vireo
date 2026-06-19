# Kickoff — Design + Dev: Today Widget Rework

**Type:** design + development
**Origin:** Post-M2 chores live review (2026-06-19). The `chores.today-summary`
widget shipped via the agent-team run (#22) **without going through the UI design
gate** — it needs a dedicated visual pass.

## Pre-session reads

- `docs/modules/chores/design.md` §4 (locked widget design — the spec it was built to)
- The shipped widget: `plugins/chores/src/widgets/TodaySummaryView.tsx` + `.stories.tsx`
- `docs/design-system.md` — Widget identity header, Reward/XP (gold), Status vs identity colour, Empty states, container queries
- `plugins/family-feed/src/widgets/FeedWidget*` — reference for a widget that went through design

## Scope

Run the **UI design gate** that the parallel build skipped: build a playground of
2–4 variants for the taskee + family framings, get sign-off on the visual
direction, rebuild in Storybook, then integrate. Update `design.md` §4 with any
refinements.

## Decisions to make

- What specifically needs polish (spacing, hierarchy, density, the family per-person rows, the gold coin score, empty states) — capture from the live review.
- Whether the design.md §4 spec itself needs amending.

## Required outputs

- Playground → sign-off → final Storybook stories (delete playground)
- `TodaySummaryView` updated to the approved direction
- `design.md` §4 updated; selected direction recorded in the session log
- Live-app review (widget on Home, both framings, across tiers)
