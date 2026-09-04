# Kickoff — M5.5/6 · Dev: offline

**Type:** Development · **Branch:** `dev/shopping-offline` (off `main`) → PR to `main`
**Modules:** `apps/shell` (the service worker), `shopping`
**Depends on:** M5.5/4 merged — this session replays **its** check mutation

> Replaces the superseded `dev-grocery-shop-offline.md`, which described the
> index-and-drill-in world ADR 069 killed. Nothing in that file survives.

## Pre-session reads

- [ ] `CLAUDE.md` — **Standing Engineering Conventions**, all of them
- [ ] `docs/modules/shopping/spec.md` + **`design.md`**, especially the closing line:
      _"Nothing above assumes a live connection to be legible."_
- [ ] **`docs/sessions/artifacts/2026-09-03-shopping-surface-explorations.html`**, read _with_
      design.md. **Frame S3 — "in the aisle"** is the surface offline has to keep working;
      the artifact is an input, not an appendix. Whatever offline chrome you add has to sit
      in that frame without displacing the status line or the meter.
- [ ] **`apps/shell/public/sw.js`** — `/api/` and `/events` are **network-first by design**
      (lines 25–37), which is exactly why the list fails where it is used
- [ ] **`logs/2026-07-19-dev-sw-cache-strategy.md`** — the SW has bitten twice; know what it
      cost before touching it
- [ ] M5.5/4's session log — the transport and conflict rule it settled
- [ ] ADRs **013** (TanStack Query is the persistence seam), **046**, **012**
- [ ] Worktree: copy `.env` in or `turbo dev` dies at `node: ../../.env: not found`

## Scope

Make the list work in a shop with no signal. One reviewable PR, because it is the chunk that
can take the whole shell down.

## Acceptance criteria

1. **The list renders offline** — reopening `/shopping` with no network shows the last known
   list, in walk order, not an error page.
2. **Checks apply optimistically offline and replay when signal returns**, converging on the
   same conflict rule M5.5/4 settled. A replayed queue and a second shopper touching the same
   item do not produce opposite states.
3. **A quiet pill under the title** — `Offline — checks will sync`. Not a banner, not amber:
   offline is expected, not exceptional. It sits in frame S3 without displacing the compacted
   status line or the progress meter.
4. **Adds are honest about what they cannot do.** An add offline either queues visibly or is
   refused visibly — a captured item that silently evaporated is worse than a refusal. Say
   which behaviour you chose and why in the log.
5. **A deploy still lands immediately on every device.** Whatever the SW change is, it does
   **not** stale the app shell or `/api`. This AC outranks 1–4: if they conflict, this wins.
6. **No blind `catch {}` anywhere on the replay path.** A check that silently failed to sync
   is a person standing in an aisle with wrong information — `console.error` the reason and
   surface it in the UI.
7. `pnpm typecheck` + `pnpm test` clean — replay and conflict logic unit-tested, RTL over the
   offline pill and the optimistic check.

## Decisions to make (state each in the log, with why)

1. **The mechanism** — a SW write queue (Background Sync) vs. client-side optimistic
   mutations over a persisted TanStack Query cache, replayed on reconnect. The second has the
   smaller blast radius and leaves the SW's rules intact; take it unless you can say why not.
2. **Which reads get an offline copy**, and how they revalidate without weakening AC5.
3. **How the queue is bounded** — what happens to a replay that keeps failing, and when the
   user is told.

## Constraints

- **The SW's network-first `/api` rule exists for deploy correctness.** Any exception is
  narrow, explicit, and justified in the session log. **Do not flip the default.**
- **Do not re-litigate** ADR 069/070 or the settled surface.
- Scope is offline. Shop context, sync, the wall and the widget already shipped — do not
  reopen them beyond what replay genuinely requires, and name any file you had to reopen.
- **`db:reset` defaults to the DEV database** and destroys the `seed-parent-1` /
  `seed-child-1` fixtures the API suite needs — set `DATABASE_URL`, re-seed after.
- **`familyos_test` rejects `migrate deploy` (P3009)** — hand-apply any new migration's SQL.
- Offline plugin render is a **deferred** platform item (queue §Platform v2) — a plugin only
  renders offline if its lazy chunks were fetched online first. Do not solve it here; note it
  if it bites the demo.

## Outputs

- [ ] **Live-app review in the real shell with the user before any close-out task, in the
      conditions that matter** — a phone throttled to offline, checks applied, signal
      restored, checks landed. Then **a real deploy verified to land immediately** (AC5),
      because that is the failure this SW has already caused twice.
- [ ] Standing-conventions pass · `pnpm typecheck` + `pnpm test` clean
- [ ] `progress.md` → ✅ (M5.5 closes here) · session log · PR to `main` · delete this kickoff
