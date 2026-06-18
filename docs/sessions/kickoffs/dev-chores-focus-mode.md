# Kickoff — M2 Dev: Focus Mode (taskee Focus view + per-profile setting)

**Type:** Development (+ a small ADR for where the setting lives)
**Proposed branch:** `dev/chores-focus-mode`
**Origin:** Deferred from M2 Task Model + Creation; queued at the user's request
during the Completion Flow live review (2026-06-17).

## Pre-session checklist

- [ ] Read `CLAUDE.md`
- [ ] Read `docs/modules/chores/design.md` §1 — **Taskee Focus vs Agency** (the
      locked two-variant design)
- [ ] Read the `dev-chores-task-model` session log — the Focus deferral + the owed
      "where does the Focus-mode flag live" call
- [ ] Read the `dev-chores-completion` session log — the shipped `TaskeeView`
      (Agency), the XP flight, and the completion/reopen wiring this builds on

## Background

The taskee surface has **two variants** (design §1): **Focus** (younger / ADHD —
one obvious next action) and **Agency** (the full status-encoded list). Which one
shows is gated by a per-profile **"Focus mode"** setting that **defaults from tier**
(younger/lower → Focus on) and a parent can override. Task Model shipped **Agency
only**; Focus and the setting were deferred. Completion Flow shipped the XP flight
on the Agency `TaskeeView` — Focus reuses all of it.

## Open decisions to make

- **Where does the Focus-mode flag live?** Per-profile. Candidates: a column on the
  `platform` profile model, or a generic per-profile settings store. **Write an ADR**
  if it lands on the profile model (schema decision). Decide the default-from-tier
  threshold + the parent override surface (likely the existing profile/permission
  edit drawer).

## Scope

- Per-profile **Focus mode** setting: storage + read in `useAuth`/profile payload +
  default-from-tier + parent override UI.
- **Focus** taskee variant (design §1): header (title + lifetime score plate) +
  progress line, a single hero **"Next up"** card (most urgent / overdue
  auto-surfaces) with a big green **Mark done**, collapsed "Coming up" / "Done"
  mini-rows, empties to "🎉 All done today". Branch off the existing `TaskeeView`
  (which is the Agency variant); **reuse the shipped completion + XP flight**
  (`ScorePlate` / `FlightChip`).
- Storybook stories for the Focus variant under `Chores/`.

**Out:** any change to Agency, admin, or widget; new completion mechanics.

## Required outputs

- [ ] Focus-mode setting (storage + default-from-tier + parent override) + ADR if a
      schema decision is made
- [ ] Focus taskee variant wired to the Focus-mode setting; completion + XP flight reused
- [ ] Tests (setting read/override; view branching) + Storybook stories
- [ ] Live-app review + sign-off before close-out
- [ ] `progress.md` (if a Focus story row is added), session log, `CLAUDE.md`, delete this kickoff
