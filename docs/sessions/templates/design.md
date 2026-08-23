# Design Session Template

> **Recipe for kickoff docs.** Fill this in before the session opens and save it
> to `docs/sessions/kickoffs/[session-name].md`. The session itself executes the
> kickoff — it doesn't fill out the template live.

---

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

**Explore in two passes.** Diverge first — unanchored from the current
primitives, bounded only by tokens and the physical situation. Then converge —
the survivors rendered in the real app, in the real page, at real density, beside
what already exists. Storybook is a deliverable of the decision, never the venue
for making one.

Name the axis the options must disagree on. Require one option that breaks a
house convention and says which. Three options, not two.

For each decision:

1. State the options and their tradeoffs
2. Ask: does this hold across all surfaces in scope?
3. Ask: does this hold at all trust tiers?
4. Gate it — rendered options, explicit pick from the user
5. Record it in `docs/design-system.md` before moving on

If a design decision requires a new architectural constraint, **stop and
write an ADR** rather than burying it in the design doc.

---

## Outputs (required before closing)

- [ ] `docs/design-system.md` updated with decisions from this session; **Last updated** header updated to today's date
- [ ] Record in `docs/sessions/artifacts/` — screenshots of the options considered, losers included, and which won and why
- [ ] **Handoff wording** — the spec is the contract and the artifact is the
      visual reference; the build session reads **both**. Never write "build from
      this, not the exploration" — name the rejected options as rejected instead.
      Prose settles what is decided and cannot settle proportion.
- [ ] Exploration route deleted; nothing ephemeral left on the branch
- [ ] Any new ADRs written to `docs/decisions/NNN-title.md`
- [ ] If this session produced code (Storybook stories, token changes, component updates): branch opened, PR created
- [ ] Session log committed to `docs/sessions/logs/YYYY-MM-DD-design-[topic].md`
- [ ] `CLAUDE.md` current status updated

## Session log format

```
## What was decided
## What was produced
## Open questions raised
## What the next session needs to know
```
