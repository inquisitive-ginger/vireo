# 2026-07-28 — Dev: the two lists that grow forever (auto-bug #81, #82, PR #85)

Ad-hoc session. Picked up both open `auto-bug` issues; they turned out to be one
defect reported from two ends of the house.

## What was decided

Both reports describe **a list with no upper bound**, but the right bound is not
the same in the two places, and the difference is worth keeping:

- **A chore list is bounded on the client** — the page already holds every task,
  and what the reader wants is for finished work to stop competing with unfinished
  work. Count-clamped disclosure.
- **A report list is bounded on the server** — it only grows, nobody holds all of
  it, and the old cap was already lying about it. Cursor paging.

`useFitRows` was considered and rejected for both: it is height-based and needs a
height-constrained flex child, which is a **widget slot**. These are
document-scrolled pages (`PageContainer width="list"`), so the clamp is by count.
The design-system rule ("a widget list fits its slot") does not extend to pages,
and shouldn't — a page can scroll.

Four gates were put to the user; three taken as recommended, one against.

## #82 — chores (Zoë, tier 3)

> The chores list is getting really long and there's no way to hide completed
> chores. Should have some way to paginate or "show more"

**The report was literally accurate, and the framing is why.**
`resolveFocusMode(focusMode, tier) = focusMode ?? tier <= 2`, so a tier-3 profile
resolves to the **Agency** `TaskeeView` — and that was the one chores framing with
no completed-chore treatment at all:

| Framing                        | Completed rows                   |
| ------------------------------ | -------------------------------- |
| `AdminBoard` (tier 4 / family) | "Hide completed" switch          |
| `FocusView` (tiers ≤ 2)        | collapsed `Done · N` section     |
| `TaskeeView` (tier 3, Agency)  | **none** — flat, inline, forever |

The switch exists but is unreachable from the taskee branch: `ChoresPageView`
early-returns to the taskee surface _above_ where the switch is rendered. So the
capability was in the file Zoë's page renders from and could never reach her —
the same shape as ADR 044's "a capability with no surface is not a capability",
except here the surface exists and the early return hides it.

`FocusView`'s `CollapsibleSection` was extracted so both taskee framings share
one, and it gained the count clamp (10, then `Show N more`). Chores are never
archived, so an expanded `Done` is otherwise every chore the kid has ever
finished — a wall in place of a list.

**Same root, not reported, and worse:** the progress line and meter derived
`done`/`total` from **every task ever**, so they climbed toward 100% and stayed
there. A kid with three chores left read a nearly-full bar. This is the auto-bug
#73 defect — a "today" that never checked `completedAt` — on the page instead of
the widget, and `isToday` already existed in `lib/dates.ts` from that fix. Now
`taskeeProgress(tasks, isCompleted)`, one definition shared by both framings.

### The risk in the change, and the test that pins it

Agency's design (§2) is that a completed card **morphs in place** — the XP flight
launches from the badge and lands on the plate while the card holds still. Naively
partitioning on "is completed" would have yanked the row into `Done` at exactly the
moment the animation needed it to stay put.

So the split is not by status but by **when the task was first seen**: tasks still
pending on arrival stay in the active list even after they complete; only tasks
already completed on arrival are history. `orderRef` (the existing order lock) got
a `seenRef` beside it. There is a test that rerenders with the post-completion
refetch and asserts the row has not moved.

### Found in live review — the empty state

Clearing the list left **a blank page under a thin full meter**. This was
self-inflicted: completed rows had always filled that space before, so the Agency
surface had never needed an "everything done" state and had none.

`FocusView`'s celebration card was extracted as `AllDone` and Agency now shows it
**in place of** the meter, not under it — a 100%-green bar and a card both saying
"all done" is one fact stated twice, and the card says it better. It also carries
the history count ("22 chores finished so far"), which is the thing that makes a
cleared list feel earned rather than empty.

## #81 — settings (Zach, tier 4)

> The reported problems list in settings should paginate or "reveal more" now
> that it's grown considerably

`GET /bug-reports` took no query params and hardcoded `take: 100`, returning a
bare array. **That is worse than unbounded**: past 100 the oldest reports vanish
with nothing on screen to say so — including from a reporter's own list in the
drawer, where the status round-trip is the entire promise of ADR 046. A report
you can no longer find has not been declined, it has been lost.

Now `limit`/`cursor`/`status` with a `{ reports, nextCursor, total }` envelope,
mirroring the wallet ledger (ADR 047) and family feed exactly: `take: limit + 1`,
`cursor` + `skip: 1`, slice the extra. `status` is comma-separated, mirroring
`GET /rewards/payouts?status=`. `total` is returned so a collapsed section can
state a true count rather than the count of what it happens to have loaded.

The **resolved split was folded in at the user's direction** (recommended for
deferral, overruled — correctly, since the length problem and the noise problem
have the same fix and splitting them would have meant touching this board twice).
The board leads with active work; `deployed`/`wont_fix` collapse into a **Settled**
section that pages independently. Both read the `['bug-reports']` key prefix, so
one invalidation refreshes both — which it must, because moving a report to
"Fixed — live" is exactly what carries a row from one section to the other.

Named **Settled**, not "Resolved": the section holds `wont_fix` too, and ADR 046
is explicit that status words are the household's. "Resolved" overclaims on a
declined report.

## Gotchas

- **jsdom needed a `matchMedia` stub** to mount either taskee surface — the XP
  flight consults `prefers-reduced-motion`. The chores setup already had the
  `ResizeObserver` stub; this is the second one it has needed.
- **The response-shape change has two consumers**, and the second is easy to miss:
  the drawer's "Your reports" list reads the same endpoint. Adapting it to the
  envelope was mandatory, but so was giving it its own reveal — leaving it on page
  one would have replaced a silent truncation at 100 with a silent truncation at 10.
- **A dev API server from the main checkout was squatting on port 3000**, serving
  `main` without the paging change; the review would have failed against it. This
  is the third session to hit a stale server on the standard ports.

## Verification

chores **75** (+9) · api **367** (+5) · shell 17 · platform, ui unchanged.
Lint, typecheck and a full production build clean.

Live-reviewed by the user as Zoë and as a tier-4 parent against seeded volume
(19 completed chores; 26 active + 16 settled reports). The empty-state gap came
out of that review, was fixed, and was re-reviewed before sign-off. Fixtures
deleted from the dev DB afterwards (16 chores, 40 reports); the two real dev
reports were left alone.

## What the next session needs to know

- **Reports #81 and #82 need a tier-4 parent to move them to `deployed`** on the
  triage board — the user is doing this once they verify the deploy.

  **Correction, made at the end of this session.** This entry originally said they
  joined a six-deep queue of un-flipped reports, and that ADR 046's loop had closed
  end-to-end exactly once. The user said that did not match what they had been
  doing. The prod DB agreed with them:

  > `#51 #53 #61 #66 #67 #70 #73 #76 #77 #78 → deployed` · `#81 #82 → triaged`

  Every prior report was already flipped; the loop has closed **ten** times. The
  "needs a tier-4 status flip" line was a **standing note carried forward and
  appended to across five sessions without anyone querying the board** — it grew
  #73 → #76/#77/#78 → #81/#82 while the opposite was quietly true, and this session
  inherited it and added to it rather than checking it.

  Worth generalising: **a standing note that only ever gets appended to is a note
  nobody is verifying**, and the appending is what makes it look maintained. The
  prod DB is one command away (see below) — cheaper than the five sessions that
  repeated the claim.

- **The prod DB is queryable from the sandbox**, which several notes assume it is
  not:

  ```
  ssh 192.168.0.31 "cd /opt/family-os && docker compose -f docker-compose.prod.yml \
    exec -T postgres psql -U familyos -d familyos -c '<sql>'"
  ```

  `ssh vireo-pi` fails host-key verification — the **IP** is in `known_hosts`, the
  hostname is not. The compose file is `docker-compose.prod.yml` and is not the
  default name, so `docker compose exec` without `-f` reports "no configuration
  file provided". `https://vireohome.app` also answers **200** from the sandbox now
  (the Tailscale route), so a deploy can be verified by grepping the served chunks
  rather than trusting CI — that is how both fixes here were confirmed live.

- `CollapsibleSection` (chores, client clamp) and the Settled disclosure (shell,
  server paging) are **deliberately not shared**. The header + open state look
  alike, but the bodies page by different mechanisms and the plugin/shell boundary
  would need a `@family-os/ui` primitive to bridge them. If a third caller appears,
  extract the header as a `Disclosure` and let each keep its own body.
- The **taskee progress meter now means "today"**. Anything else reading
  `chores.tasks` for a rate or a total should be checked against the same
  question — this is twice now (#73, #82) that an all-time count has been read as
  a today count.
