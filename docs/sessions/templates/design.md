# Design Session Template

## Pre-session checklist
- [ ] Read `CLAUDE.md`
- [ ] Read `docs/vision.md`
- [ ] Read `docs/architecture.md`
- [ ] Read ADR 003 (tier model) — role-aware rendering depends on it
- [ ] Read any module spec being designed (if surface-specific)

## Session scope
_One sentence: what design question does this session answer?_

## Surfaces in scope
_List which surfaces this session covers: tablet · mobile · TV · Pi display_

## Constraints coming in
_List ADRs or prior decisions that bound the design space._

## Decisions to make
_List the open questions this session must close. Each becomes a section in
`docs/design-system.md` or a new ADR._

---

## During the session

For each decision:
1. State the options and their tradeoffs
2. Ask: does this hold across all surfaces in scope?
3. Ask: does this hold at all trust tiers?
4. Make the call
5. Record it in `docs/design-system.md` before moving on

If a design decision requires a new architectural constraint, **stop and
write an ADR** rather than burying it in the design doc.

---

## Outputs (required before closing)
- [ ] `docs/design-system.md` updated with decisions from this session
- [ ] Any new ADRs written to `docs/decisions/NNN-title.md`
- [ ] Session log committed to `docs/sessions/logs/YYYY-MM-DD-design-[topic].md`
- [ ] `CLAUDE.md` current status updated

## Session log format
```
## What was decided
## What was produced
## Open questions raised
## What the next session needs to know
```
