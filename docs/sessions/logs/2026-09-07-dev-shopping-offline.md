# 2026-09-07 — Dev: offline (M5.5/6) — the milestone closes

**Shipped:** PR #144. Branch `dev/shopping-offline`.
The list renders, checks and replays with no signal. **M5.5 — Shopping is done.**

## The decision that shaped the rest: the service worker is not touched

The kickoff offered a SW write queue or a persisted client cache, and named AC5 —
_a deploy still lands immediately_ — as outranking everything. What holds AC5
hardest is not a careful SW change; it is **no SW change**. The diff touches
nothing in `apps/shell`, so the network-first `/api` rule that has bitten twice
(`logs/2026-07-19-dev-sw-cache-strategy.md`) is byte-identical. The offline copy
lives in `localStorage`, where it cannot weaken that rule; the feature is nine
files in `plugins/shopping`.

## The three decisions the kickoff asked for

**1. Mechanism.** Optimistic cache writes plus a durable replay queue, drained on
reconnect. The queue is **ours** rather than TanStack's paused mutations: a paused
mutation cannot resume after a reload without its `mutationFn` registered before
the client restores, which for a federated plugin means the shell would have to
know about shopping. It also gives AC7 something real — `queueCheck` and
`drainQueue` are pure functions.

**2. Which reads get a copy.** The list index and one list's rows. Nothing else —
they are what someone reads standing at a shelf, and every other read here answers
an act that cannot happen offline. They revalidate without weakening AC5 because
the snapshot is dated **when it was saved** and that date is handed to
`initialDataUpdatedAt`: stale on arrival, refetched the moment there is a network,
so nothing cached outlives a deploy.

**3. How the queue is bounded.** Four rules, in the order they bite:

- **One entry per row.** `queueCheck` coalesces, so the queue cannot outgrow the
  list. The server's body names the _target_ state (M5.5/4), so only the last
  intent is worth sending.
- **A row tapped back to where it started drops out** — nothing to tell the
  server, and an entry saying "leave it alone" would overwrite whatever the other
  shopper did to that row meanwhile.
- **It ages from the first tap**, so a row tapped all afternoon cannot outrun the
  cap. Past 24 h an entry is dropped at load and **named**: `Couldn't sync "milk" · 1 more`.
- **A refusal is dropped, a dropout is not** (below).

## Adds are refused, not queued (AC4)

An add needs the server: it files the aisle against the family's overrides and it
is what finds the duplicate — whose only verb, `Take it back?`, is server-derived.
A queued add would land in an aisle nobody chose and report a collision long after
the person who caused it walked away. The field closes: `Adding needs a
connection. Checking things off still works.`

**The cost is real and not hidden:** you cannot capture "batteries" in the aisle
you remembered it in. A trade made, not an oversight. Reversing it needs an answer
to where an unfiled row sits in a walk-order list.

## A refusal and a dropout are opposite outcomes

The idea the rest falls out of. `sendCheck` throws `OfflineError` when `fetch`
itself rejects, a plain `Error` when the server answers badly.

- **Refused** — the row is wrong. Put it back, say so, drop the entry.
- **Dropped** — the row is not wrong, it is _unsent_. Rolling it back would undo a
  check in front of the person who just made it and destroy the only record of it.
  The row stands, the tap queues, the pill says why.

So the online mutation needed no rewrite: its existing rollback is still exactly
right for the refusal branch, and the new branch sits above it.

`navigator.onLine` calls a captive supermarket wifi online, so it only seeds the
state and can clear it; a request that failed to leave the device sets it.

## The pill

`Offline — checks will sync`, muted, `role="status"`, under the title. Not amber:
amber is for something to act on. Deliberately **not** in the sticky block — that
block is the shopper's arithmetic, and the radio must not push the count or the
meter off frame S3. It also sits above the error card, for the case the ACs did
not name: a device that never read this list _with_ signal has nothing to draw,
and `Shopping couldn't load` alone sends someone hunting a broken app instead of
a bar of signal.

## Verification

`pnpm typecheck` · `pnpm lint` · **183 tests in 10 files** · `check-spacing.sh` ·
prod build green, SW stamped `family-os-BoGK0JsL`. Live pass on the **prod
preview**, signed off by Zach — dev tears the SW down, so a preview build is the
only local place this is real.

**Port 3000 was silently owned by VS Code's Live Preview**, which held
`127.0.0.1:3000` while the API bound `*:3000` — macOS routes `localhost` to the
more specific bind, so Vite's proxy hit the editor and 401'd the whole app. One
listening socket is not proof it is yours: `lsof -nP -iTCP:3000 -sTCP:LISTEN`.

## Owed at merge

**AC5's empirical half** — a real deploy landing immediately, verified against
`https://vireohome.app` after the auto-deploy. The structural argument is the
empty `apps/shell` diff.

## What the next session needs to know

- **Offline plugin render is still best-effort** (queue §Platform v2) — a plugin
  renders offline only if its chunks were fetched online first. Untouched, as the
  kickoff said; it did not bite the demo because the review reloaded a page that
  was already open.
- Keys are profile-scoped, so a **profile switch on a shared device** starts with
  an empty snapshot — the error card plus the pill. Correct, and the only routine
  way to reach that branch.
- `scripts/preview-tunnel.sh` is three plugins behind — it predates `meals`,
  `rewards` and `shopping`, so it previews a three-plugin app.
- The 2026-09-04 trade stands unpaid: the sticky line carries **no list name**, so
  a shopper deep in a long list cannot see which list it is. Offline neither
  touched it nor worsened it.
