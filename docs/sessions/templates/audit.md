# Audit Session Template

Use this template to check cross-document consistency and surface gaps
before starting a new milestone or after a run of design/architecture
sessions. Audit sessions do not define new stories from scratch — that
belongs to product sessions. They may update existing stories, fix stale
references, or queue new sessions as a byproduct of gap-finding.

---

## Pre-session reads (required)

- `CLAUDE.md` — current milestone and last session
- `docs/roadmap.md` — milestone structure and done definitions
- `docs/architecture.md` — settled decisions, schema, deferred items
- `docs/design-system.md` — settled design decisions and To Be Defined table
- `docs/sessions/queue.md` — queued and blocked sessions
- `docs/modules/[active milestone]/progress.md` — story statuses
- All story specs under `docs/modules/[active milestone]/stories/`
- ADRs relevant to the active milestone's scope

---

## Audit checklist

Work through each area. Log every issue found before fixing anything.
Present issues to the user one at a time; get approval before applying
each fix.

### 1. Milestone coherence
- [ ] Are milestones sequenced correctly given inter-milestone dependencies?
- [ ] Is each milestone's done definition achievable with its listed scope alone?
- [ ] Are any features planned but not assigned to any milestone?
- [ ] Is any milestone carrying scope that belongs to two separate concerns?

### 2. Cross-document consistency
- [ ] Do story specs reflect all decisions made since the stories were written?
      (Design or architecture sessions may have settled things the stories still
      treat as deferred.)
- [ ] Does `architecture.md` match the latest ADRs? Check: schema definitions,
      milestone references, To Be Defined entries.
- [ ] Does `design-system.md` To Be Defined table reflect current state — no
      rows that have since been settled?
- [ ] Are milestone numbers consistent across all docs, ADRs, stories, and
      the session queue?

### 3. Story completeness
- [ ] Does every story have a clear dependency chain with no missing links?
- [ ] Does every settled architectural or design decision have at least one
      story AC that implements it?
- [ ] Does any story's Out scope incorrectly exclude something that is now settled?

### 4. Session queue health
- [ ] Are design/architecture sessions that implementation sessions depend on
      queued ahead of them?
- [ ] Are blocking dependencies between queued sessions explicitly noted?
- [ ] Does `design-system.md` To Be Defined reference any sessions that don't
      exist in the queue?

### 5. ADR integrity
- [ ] Do any ADRs reference milestone numbers that have since changed?
- [ ] Do any ADRs reference decisions superseded by a later ADR without being
      marked Superseded?

---

## Fix protocol

1. **State the issue** — what is wrong and where (file + line if helpful)
2. **Propose the fix** — what should change and why
3. **Wait for approval**
4. **Apply the fix**, then move to the next issue

One issue at a time. Do not batch.

---

## Outputs (required before closing)

- [ ] All issues resolved or explicitly deferred with a reason recorded below
- [ ] `docs/roadmap.md` updated if milestone structure changed
- [ ] `docs/sessions/queue.md` updated with any new or reordered sessions
- [ ] `CLAUDE.md` current status updated
- [ ] All changes in a single commit with prefix `[planning/audit]`

## Issues log

_Fill in during the session._

| # | Issue | Fix applied | Deferred? |
|---|-------|-------------|-----------|
| 1 | | | |
