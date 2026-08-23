# Product Session Template

> **Recipe for kickoff docs.** Fill this in before the session opens and save it
> to `docs/sessions/kickoffs/[session-name].md`. The session itself executes the
> kickoff — it doesn't fill out the template live.

A product session produces one module spec and the session plan inside it. It
runs in one of two modes; say which at the top of the kickoff.

- **Origination** — nothing on the roadmap yet. The session invents the thing,
  gates the forks, and closes by writing the roadmap entry.
- **Breakdown** — the roadmap entry exists. The session turns it into a module
  spec and a sequenced session plan.

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

_One sentence: which milestone is this session breaking into sessions — or, when
originating, what is the thing and who is it for?_

## Done definition

_Breakdown: copy the "Done when:" line verbatim from `docs/roadmap.md`.
Origination: this session writes it. Every session in the plan should be
traceable to it._

## Constraints coming in

_ADRs and prior decisions that bound scope. Things the spec must not contradict.
Cite by number; don't restate them._

## Forks to gate

_The decisions that change what gets built. Each one goes to the user through
`AskUserQuestion` — 2–4 options, with the trade-off that separates them. A fork
resolved without the user is the failure mode of this session type._

## Open questions to resolve

_Flagged questions from prior logs that are in scope. Each is answered, or
explicitly deferred with a reason, before the session closes._

---

## During the session

### The module spec

Everything the session decides goes to `docs/modules/[module]/spec.md` — one
file, not a file per story. (`stories/*.md` is the M0–M4 pattern; `meals` and
`companion` are the current shape.) Sections:

```markdown
# [Module Name] — Module Spec (M[N])

## What it is

One paragraph. The problem in the house, not the feature list.

## M[N] scope (MVP)

Bulleted. Each bullet becomes a session or part of one.

## Explicitly deferred

What a reader will look for and not find, and why it's out.

## Session plan

Numbered, in run order. Per session: one-sentence scope, dependencies,
and whether it can run in parallel with its neighbours.

## Boundaries already settled

ADRs by number — do not re-litigate (rule 4). One line each on what it binds.

## Done when

The milestone's done definition.
```

### Process

For each session in the plan:

1. State its scope in one sentence — if it needs "and," split it
2. Name explicit in and out
3. Write acceptance criteria that are verifiable without knowing the
   implementation
4. Mark dependencies, and say what it shares files with if the wave runs parallel
5. Move on — depth belongs in the kickoff `planner` writes later, not here

**If a session reveals an unsettled architectural question:** log it as an open
question and move on — do not improvise architecture inside a product session.
Escalate it to `architect`. Same for anything crossing a permission boundary.

**If a session can't be stated in one sentence without "and":** split it. One
that can't be split belongs in a later milestone.

---

## Outputs (required before closing)

- [ ] `docs/modules/[module]/spec.md` written, in the shape above
- [ ] `docs/roadmap.md` entry written (origination) or its `Done when:` confirmed
      still accurate (breakdown)
- [ ] `docs/modules/[module]/progress.md` created or updated

  ```markdown
  # [Module Name] — Progress

  ## M[N] — [Name] · 🔄 In Progress

  > **Milestone done when:** [the done definition]

  | Story  | Status         | Notes |
  | ------ | -------------- | ----- |
  | [Name] | ⬜ Not Started |       |
  ```

  Statuses: ⬜ Not Started · 🔄 In Progress · ✅ Done · 🔙 Sent Back

- [ ] `docs/sessions/queue.md` — the milestone added under **Up Next** with a
      pointer to the spec. Kickoffs are `planner`'s job, not this session's
- [ ] Session log committed to `docs/sessions/logs/YYYY-MM-DD-product-[name].md`
- [ ] `CLAUDE.md` Current Status updated

## Session log format

```
## What was decided
## Forks gated (each with the argument that settled it)
## Sessions defined
## Open questions raised
## What the next session needs to know
```
