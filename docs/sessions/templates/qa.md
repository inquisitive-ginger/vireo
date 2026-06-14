# QA Session Template

> **Recipe for kickoff docs.** Fill this in before the session opens and save it
> to `docs/sessions/kickoffs/[session-name].md`. The session itself executes the
> kickoff — it doesn't fill out the template live.

---

## Pre-session reads

- [ ] `CLAUDE.md`
- [ ] Story spec (`docs/modules/[name]/stories/[story].md`) — read ACs carefully
- [ ] Session log for the dev session that implemented this story
- [ ] Any ADRs cited in the story's Notes section

## Session scope

_One sentence: which story's ACs is this session verifying, and what is the pass condition?_

## Story: `[module/story-name]`

_Copy the story's acceptance criteria here so they're visible during verification._

## Constraints coming in

_List ADRs or implementation decisions that affect how ACs should be interpreted._

---

## During the session

Work through ACs in order. For each:

1. **Run the app** and exercise the feature path that the AC describes
2. **Record the result**: Pass · Fail · Skip (with reason)
3. For a Fail: note the symptom and where in the code it likely lives — don't fix here
4. For a Skip: record why and whether it blocks sign-off

If tests exist for an AC, run them first (`pnpm test` / `pnpm e2e`) — but passing tests are not sufficient. Verify the behavior in the running app as well. Tests verify code; QA verifies the feature.

**If a Fail blocks the story:** send the story back (🔙 Sent Back in progress.md) and queue a fix session.

**If a Fail is cosmetic or out-of-scope:** log it as an open question; don't block sign-off on it.

---

## Outputs (required before closing)

- [ ] AC checklist completed (every AC is Pass / Fail / Skip with a note)
- [ ] Any failing ACs either fixed (if trivial) or logged as a fix-session queue entry
- [ ] Story status confirmed ✅ Done or updated to 🔙 Sent Back in `docs/modules/[name]/progress.md`
- [ ] Session log committed to `docs/sessions/logs/YYYY-MM-DD-qa-[story].md`
- [ ] `CLAUDE.md` current status updated

## Session log format

```
## Story verified
## AC results (Pass / Fail / Skip per criterion)
## Defects found (symptom + suspected location)
## Sign-off decision (Done / Sent Back — with reason)
## What the next session needs to know
```
