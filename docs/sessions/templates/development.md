# Development Session Template

## Pre-session checklist

- [ ] Create branch off `main`: `git checkout -b dev/[module]-[story]` (do this before touching any files)
- [ ] Read `CLAUDE.md`
- [ ] Read `docs/architecture.md`
- [ ] Read the target story spec (`docs/modules/[name]/stories/[story].md`)
- [ ] Read `docs/modules/[name]/progress.md`
- [ ] Read all ADRs referenced in the story's Notes section
- [ ] Confirm all story dependencies are Done
- [ ] **AC audit** — review each acceptance criterion; flag any that are ambiguous,
      underspecified, or reveal a missing requirement before writing any code. Resolve
      or document gaps first.

## Session scope

_One sentence: what story does this session implement, and what is the done condition?_

## Story: `[module/story-name]`

_Copy the story's acceptance criteria here so they're visible during work._

## Constraints coming in

_List ADRs or prior decisions that bound implementation choices. Do not re-litigate._

---

## During the session

Work through acceptance criteria in order as a guide. Verify as you go where it's
natural — don't save all verification for the end. If you need to complete several
ACs before anything is runnable, that's fine; use judgment.

If work uncovers a missing requirement that clearly belongs in this story, implement
it and note it in the session log. If it's better suited to a follow-on story (a new
feature, a separate concern, or something that would significantly expand scope), write
a stub story spec in `docs/modules/[name]/stories/` and add it to the queue —
don't silently drop it or try to squeeze it into scope.

If an AC reveals a conflict with an ADR, **stop and flag it** rather than improvising.
Log it as an open question; don't silently override settled decisions.

---

## Outputs (required before closing)

- [ ] All acceptance criteria verified and passing
- [ ] `pnpm typecheck` passes with zero errors
- [ ] `pnpm test` passes (if test files were written or modified)
- [ ] Any new stub stories written and added to queue
- [ ] Story status updated to ✅ Done in `docs/modules/[name]/progress.md`
- [ ] Session log committed to `docs/sessions/logs/YYYY-MM-DD-dev-[story].md`
- [ ] `CLAUDE.md` current status updated
- [ ] `docs/sessions/queue.md` updated if this session unblocks or adds new entries
- [ ] PR opened against `main` following conventions in `CONTRIBUTING.md`

## Session log format

```
## What was built
## Acceptance criteria status (pass / skip / deferred — with reason)
## Scope additions (missing requirements folded in)
## New stories created (if any)
## Open questions raised
## What the next session needs to know
```
