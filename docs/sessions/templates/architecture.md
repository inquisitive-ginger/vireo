# Architecture Session Template

> **Recipe for kickoff docs.** Fill this in before the session opens and save it
> to `docs/sessions/kickoffs/[session-name].md`. The session itself executes the
> kickoff — it doesn't fill out the template live.

---

## Pre-session checklist

- [ ] Read `CLAUDE.md`
- [ ] Read `docs/architecture.md`
- [ ] Read all ADRs in `docs/decisions/` that are relevant to this session's scope
- [ ] Read the story spec or module doc being designed (if applicable)

## Session scope

_One sentence: what architectural question does this session answer?_

## Constraints coming in

_List any ADRs or prior decisions that bound the solution space._

## Decisions to make

_List the open questions this session must close. Each becomes an ADR or an
update to `docs/architecture.md`._

---

## During the session

For each decision:

1. State the options and their tradeoffs
2. Identify which tradeoffs actually matter given the project's constraints
3. Make the call
4. Write the ADR before moving to the next decision

If a decision reveals a conflict with an existing ADR, **stop and flag it**
rather than overriding silently. Log it as an open question.

---

## Outputs (required before closing)

- [ ] New ADRs written to `docs/decisions/NNN-title.md`
- [ ] `docs/architecture.md` updated — settled decisions table + any new section
- [ ] Affected story specs updated if the decisions constrain or expand their scope or acceptance criteria
- [ ] Session log committed to `docs/sessions/logs/YYYY-MM-DD-architecture-[topic].md`
- [ ] `CLAUDE.md` current status updated

## Session log format

```
## What was decided
## What was produced
## Open questions raised
## What the next session needs to know
```
