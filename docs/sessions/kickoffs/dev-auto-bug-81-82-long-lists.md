# Dev — auto-bug #81 + #82: lists with no upper bound

Ad-hoc session (not from the queue). Two in-app reports, one shape.

## Scope

Fix the two open `auto-bug` issues. Both are a list that grows without bound and
has no way to shed or defer what the reader is done with.

- **#82** (Zoë, tier 3, `/chores`) — "The chores list is getting really long and
  there's no way to hide completed chores. Should have some way to paginate or
  'show more'."
- **#81** (Zach, tier 4, `/settings`) — "The reported problems list in settings
  should paginate or 'reveal more' now that it's grown considerably."

## Triage

**#82.** Zoë is tier 3, so `resolveFocusMode(focusMode, tier) = focusMode ?? tier <= 2`
resolves to `false` → the **Agency** `TaskeeView`. That is the only chores framing
with no completed-chore treatment:

| Framing                        | Completed rows                                     |
| ------------------------------ | -------------------------------------------------- |
| `AdminBoard` (tier 4 / family) | "Hide completed" switch — `ChoresPageView.tsx:117` |
| `FocusView` (tiers ≤ 2)        | collapsed `Done · N` section — `FocusView.tsx:88`  |
| `TaskeeView` (tier 3, Agency)  | **none** — flat list, inline, forever              |

The switch is unreachable from the taskee branch because `ChoresPageView.tsx:80`
early-returns above it.

Same root, **not reported**: `TaskeeView.tsx:45-47` derives `done`/`total` from
every task ever, so the progress line and bar inflate permanently as completions
accumulate. This is auto-bug #73's defect (a "today" that never checked
`completedAt`) on the taskee page rather than the widget. `isToday` already
exists in `plugins/chores/src/lib/dates.ts` from that fix.

**#81.** `GET /bug-reports` (`apps/api/src/plugins/bug-reports.ts:127-147`) takes
no query params and hardcodes `take: 100`, returning a bare array;
`BugReportsSection.tsx:62-107` renders all of it flat with `deployed`/`wont_fix`
mixed in. So the list is both unbounded _and_ silently truncated at 100 — past
that, the oldest reports vanish with no indication, including from a reporter's
own list in `ReportProblemDrawer`.

## Decisions taken at the gate

1. **Chores** — `TaskeeView` gains the collapsed `Done · N` disclosure `FocusView`
   already has (extracted so the two can't drift), sorted newest-completed first
   and count-clamped with a "Show more". Progress line and bar count **today's**
   completions only.
2. **Reports** — bound on the **server**: `limit`/`cursor` on `GET /bug-reports`
   with a `{ reports, nextCursor, total }` envelope, `useInfiniteQuery`, and a
   reveal. Mirrors the wallet ledger (ADR 047) and family feed. Removes the
   silent `take: 100`.
3. **Resolved split** — fold in: `deployed`/`wont_fix` group into their own
   collapsed section so the board leads with live work.

## Acceptance criteria

- **AC1** — A tier-3 taskee's completed chores are out of the pending list, in a
  collapsed `Done · N` section, and still reachable.
- **AC2** — Expanding `Done` shows a bounded number of rows and states the
  remainder; revealing more does not re-clamp.
- **AC3** — The taskee progress line and bar reflect today, not all time.
- **AC4** — `FocusView` keeps its behaviour; both taskee framings share one
  component.
- **AC5** — `GET /bug-reports` accepts `status`, `limit`, `cursor`; rejects an
  unknown status and an out-of-range limit; pages with a stable cursor.
- **AC6** — The triage board leads with active reports and pages them; resolved
  reports are collapsed and page independently; both state a true total.
- **AC7** — A reporter's own list in the drawer pages too — no silently dropped
  reports at any count.

## Constraints

- ADR 046 — a report is a capture; status words are the household's
  (`deployed` → "Fixed — live"). Identity takes the edge on the board (ADR 043).
- ADR 013 — TanStack Query via `@family-os/platform`; share a key prefix
  (`['bug-reports']`) so one invalidation refreshes every section.
- ADR 047 precedent — `take: limit + 1`, `cursor` + `skip: 1`, slice the extra.
- The comma-separated `status` param mirrors `/api/rewards/payouts?status=…`.
- `useFitRows` is **not** applicable: it is height-based and needs a
  height-constrained flex child. These are document-scrolled pages
  (`PageContainer width="list"`), so the clamp is count-based.

## Required outputs

- [ ] Both issues fixed on `fix/auto-bug-81-82-long-lists`
- [ ] Tests: chores taskee sections + today-scoped progress; API paging/filtering
- [ ] Live review + sign-off
- [ ] PR → merge → CD
- [ ] Session log, close out on `main`
