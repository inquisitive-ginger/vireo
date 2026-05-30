# Session Log — Audit: Roadmap & Planning

![Type](https://img.shields.io/badge/Type-Audit-yellow) ![Date](https://img.shields.io/badge/Date-2026--05--30-lightgrey) ![Milestone](https://img.shields.io/badge/Milestone-M0-informational) ![Status](https://img.shields.io/badge/Status-Complete-brightgreen)

---

## What Was Audited

Full pre-implementation audit of roadmap, architecture, design system, M0
story specs, and all ADRs. Goal: ensure coherence before any implementation
session starts.

---

## Issues Found and Resolved

| # | Issue | Fix |
|---|-------|-----|
| 1 | `architecture.md` profiles table had stale `pin_hash` column (removed by ADR 021) | Removed `pin_hash`; added `system_config` table with `jsonb` value column |
| 2 | `shell-skeleton` story said nav layout was not decided; ADR 022 had since settled it | Updated story scope and ACs to reflect settled left sidebar layout |
| 3 | `design-system.md` To Be Defined table had two settled rows still listed | Removed stale rows |
| 4 | Plugin toolchain (ADR 020) had no story AC to build it | Added generator to `dev-environment` scope + two ACs |
| 5 | First-run/onboarding had no milestone home | Deferred to M1 (now Platform Shell); onboarding added as M1 bullet |
| 6 | Mobile surface (PWA + Web Push) not in any milestone | Added minimum mobile to M1 Platform Shell |
| 7 | Profile management UI not in any milestone | Added to M1 Platform Shell |
| 8 | Notification & States design session not queued | Added to session queue at #3, blocked on Visual Language Design |
| 9 | XP/F$ gap across milestones undefined | Added clarifying note to Chores (M2): XP only until Finance (M6) |
| 10 | Smart Home (M2) before Calendar (M3) — ordering questioned | Swapped: Calendar→M2, Smart Home→M3 (then renumbered further) |
| 11 | Bulletin board had no milestone home; converged with family dashboard discussion | Resolved as Family Feed module; M1 split into Platform Shell + Chores; roadmap renumbered M1–M8 |

## Milestone renumbering (pre → post audit)

| Old | New |
|-----|-----|
| M1 Chores | M2 Chores |
| M2 Calendar | M3 Calendar |
| M3 Smart Home | M4 Smart Home |
| M4 School | M5 School |
| M5 Finance | M6 Finance |
| M6 Meals | M7 Meals |
| M7 Marketplace | M8 Marketplace |
| _(new)_ | M1 Platform Shell |

## Milestone reference consistency pass

Updated all stale milestone numbers across: `architecture.md`, `design-system.md`,
`sessions/queue.md`, `stories/event-bus.md`, ADRs 008, 010, 013, 014, 020.
Session logs prior to this date intentionally left unchanged (historical records);
a caveat note added to `CLAUDE.md` to prevent AI sessions misreading old numbers.

## New sessions queued

- **Home Surface Design** (#2 in queue) — default layout model, core module slot
  reservation, placeholder states, Family Feed widget design, ADR 022 amendment.
  Blocked on Visual Language Design.
- **Notification & States Design** (#3 in queue) — notification patterns, error
  and empty states. Blocked on Visual Language Design.

## Key decisions made

- **Family Feed** is a dedicated module (not a surface feature). MVP in M1 Platform
  Shell (text posts, home screen widget). Enrichment milestone parked in Future
  Milestones once M2–M6 have shipped real events to aggregate.
- **Home Surface slot model**: reserved slots for core modules with placeholder
  states (not collapse-and-reflow). ADR 022 amendment to be written in Home Surface
  Design session.
- **`system_config.value` is `jsonb`** — supports heterogeneous platform config
  (PIN hash, default layouts, future settings) without schema migrations.
- **First-run/onboarding** deferred to M1 Platform Shell product session — building
  a throwaway bootstrap screen in M0 was rejected in favour of building onboarding
  once alongside the first real modules.

## Issues deferred

None — all identified gaps were resolved or assigned to a queued session.

## What the Next Session Needs to Know

- M0 implementation can start. No blocking gaps remain.
- Visual Language Design is the next queued session; run it once real M0 UI exists.
- Home Surface Design and Notification & States Design are both blocked on
  Visual Language Design completing first.
- The Home Surface Design session must resolve the slot reservation model and
  produce an ADR 022 amendment before M1 Platform Shell implementation begins.
