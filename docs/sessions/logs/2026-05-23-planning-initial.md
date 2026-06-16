# Session Log — Initial Vision

![Type](https://img.shields.io/badge/Type-Planning-orange) ![Date](https://img.shields.io/badge/Date-2026--05--23-lightgrey) ![Milestone](https://img.shields.io/badge/Milestone-Pre--M0-informational) ![Status](https://img.shields.io/badge/Status-Complete-brightgreen)

---

## What Was Decided

- Plugin-native micro-frontend architecture (ADR 001)
- Two-layer currency model: XP + Family Dollars (ADR 002)
- Four age-tiered trust levels, family-configurable display names (ADR 003)
- WebSocket-first real-time locally, push for mobile, polling for external APIs (ADR 004)
- Allowance system as ledger, not bank — system never touches real money (ADR 005)
- Workspace structure: CLAUDE.md as master context, ADRs for settled decisions,
  module specs + progress boards, session queue, spec-driven development flow
- Milestone roadmap: M0–M7 (Foundation, Chores, Smart Home, Calendar, School,
  Finance, Meals, Marketplace) — all MVP-first

## What Was Produced

- `CLAUDE.md` — master session context
- `docs/vision.md` — project north star
- `docs/roadmap.md` — milestone map M0–M7
- `docs/decisions/001–005.md` — founding ADRs
- `docs/sessions/queue.md` — near-term session queue

## What Was Sent Back

Nothing — this was the first session.

## Open Questions Raised

- Final product name (working title: "Family OS")
- Default tier display names — deferred to System Design session
- Bulletin board / announcements: surface feature or thin module?
  Recommend resolving in M0 Product session.
- Meals module scope: meal planning + grocery lists at minimum;
  full scope defined in product session

## What the Next Session Needs to Know

- Platform Architecture is up next — see `docs/sessions/queue.md`
- No tech stack decisions have been made yet; everything is open
- The plugin API contract (ADR 001) is the most critical thing to
  nail in that session — everything else depends on it
- Read all five ADRs before proposing any architectural approaches
