# Product Session Template

> **Recipe for kickoff docs.** Fill this in before the session opens and save it
> to `docs/sessions/kickoffs/[session-name].md`. The session itself executes the
> kickoff — it doesn't fill out the template live.

---

## Pre-session checklist

- [ ] Read `CLAUDE.md`
- [ ] Read `docs/vision.md`
- [ ] Read `docs/roadmap.md` — milestone scope and done definition
- [ ] Read `docs/architecture.md` — settled architectural constraints
- [ ] Read `docs/design-system.md` — settled design constraints
- [ ] Read all ADRs relevant to this milestone's scope
- [ ] Read open questions in prior session logs that fall in this milestone's scope

## Session scope

_One sentence: which milestone is this session breaking into stories?_

## Done definition (from roadmap)

_Copy the "Done when:" line verbatim from `docs/roadmap.md` for this milestone.
Every story defined here should be traceable to this definition._

## Constraints coming in

_List ADRs or prior decisions that bound story scope.
These are things a story must not contradict._

## Open questions to resolve

_List flagged questions from prior session logs that are in scope for this milestone.
Each must be answered (or explicitly deferred with a reason) before this session closes._

## Stories to define

_List the stories in the order they'll be specced. Resolve dependencies first.
This list can grow during the session — add stories as they emerge._

---

## During the session

### Story format

Each story spec is written to
`docs/modules/[module]/stories/[story-slug].md`
before moving to the next story.

```markdown
# Story: [Story Name]

**Module:** [module-name]
**Status:** ⬜ Not Started

## User story

As a [role], I can [capability] so that [outcome].

## Scope

**In:** what this story covers
**Out:** what's explicitly excluded

## Acceptance criteria

1. [Testable, observable condition]
2. ...

## Dependencies

- [other story name, if any — or "none"]

## Notes

_Any implementation constraints, open questions, or context the next
session needs._
```

### Process

For each story:

1. Write the user story in one sentence — if it needs "and," split it
2. Define scope: explicit in, explicit out
3. Write numbered, testable acceptance criteria — each criterion must be
   verifiable without knowing the implementation
4. Mark dependencies on other stories in this milestone
5. Write the spec file, then move on

**If a story reveals an unsettled architectural question:** log it as an
open question and move on — do not improvise architecture inside a product
session. Flag it for the next architecture session.

**If a story can't be stated in one sentence without "and":** split it
before writing the spec. A story that can't be split belongs in a future
milestone.

---

## Outputs (required before closing)

- [ ] Story specs written to `docs/modules/[module]/stories/[story-slug].md`
- [ ] `docs/modules/[module]/progress.md` created or updated

  Progress board format:

  ```markdown
  # [Module Name] — M[N] Stories

  | Story                               | Status         | Notes |
  | ----------------------------------- | -------------- | ----- |
  | [Story Name](stories/story-slug.md) | ⬜ Not Started |       |
  ```

  Statuses: ⬜ Not Started · 🔄 In Progress · ✅ Done · 🔙 Sent Back

- [ ] `docs/sessions/queue.md` updated — add any newly-identified follow-on sessions
- [ ] Session log committed to `docs/sessions/logs/YYYY-MM-DD-product-[milestone].md`
- [ ] `CLAUDE.md` current status updated

## Session log format

```
## What was decided
## Stories defined
## Open questions raised
## What the next session needs to know
```
