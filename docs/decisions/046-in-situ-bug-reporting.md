# ADR 046 — In-situ bug reporting

**Status:** Decided · 2026-07-20

---

## Context

The app is live on the fridge iPad and a phone. The people using it are not the
person who can fix it, and the report path is a sentence said in a kitchen —
"the calendar's being weird" — that loses every detail which would make the bug
reproducible. By the time it reaches a session, the route, the build, and the
console are gone, and the reporter has no idea whether anything happened.

Two things had to be decided: what the app captures, and what it promises back.

## Decision

### 1. A report is a capture, not a complaint

The user writes one sentence. The app attaches, without being asked: the
**route**, the **build hash**, the **profile** (id, name, tier), the
**viewport**, the **user agent**, and the **last ten errors** the page produced.

The description alone is rarely reproducible, and none of the rest is something a
household member could reasonably be asked to find. The **route** is the one
required field — a fixer who knows the page can start; one who doesn't is
guessing. Everything else is optional and clamped rather than rejected, because a
capture that fails validation would lose the report entirely, and the report is
worth more than the metadata.

The build hash is read **off the entry script's filename at runtime**, not
injected at build time — a content hash cannot be known before the content is
hashed. It is the same hash `stampServiceWorker` bakes into the service worker's
cache name, which is what lets a report be matched against a deployed build.

The captured errors live in an **in-memory ring buffer**, never persisted and
never sent anywhere until someone presses Send. This is evidence for a report
being filed right now, not telemetry.

### 2. Every tier can report — including tier 1

`platform.bug-report.create` is a baseline capability for **every** profile, in
the registry so a parent can revoke it per-profile through the existing override
UI.

The youngest user is the likeliest to hit a rough edge and the least able to
route around it. Gating reporting at tier 2 would silence exactly the reports
worth having.

This has a consequence that had to be paid rather than dodged: **the notification
tray is tier-2+ chrome**, so the decided entry point — the tray footer — does not
exist for a tier-1 profile. Granting the capability and leaving it unreachable
would recreate the "a capability with no surface is not a capability" failure from
ADR 044. So below tier 2, the report control **takes the notification bell's
slot** rather than adding a new affordance: one report entry per profile, in one
place, in whichever chrome that profile actually has.

`notify()` returns `null` below tier 2 and stays that way — a tier-1 reporter is
not sent a notification. Their status is legible **in the drawer**, on their own
list of reports, which is why that list exists for everyone and not just as a
maintainer view.

### 3. The GitHub issue is the bridge, and it is best-effort

On create, the server opens a labelled (`auto-bug`) GitHub issue whose body is the
full capture, and writes the issue number back to the row.

The issue is the bridge because the fix does not happen in this app — it happens
in a repo, in a session, in CI. Building a queue we own would mean rebuilding
issue tracking badly and still needing to get the report to where the work is.

It is **best-effort in both directions**: fired without blocking the reply (the
same shape as the push dispatch in `notify()`), and returning `null` on every
failure path rather than throwing. A household on a slow uplink should not watch a
spinner while we talk to github.com, and an expired token must not cost them their
report. **The report is the household's; the issue is the maintainer's
convenience.** With no token configured the feature still works end to end — it
just stops at a row a parent triages by hand.

### 4. The status round-trip is the feature

A report has a status the reporter can watch — `new → triaged → fixing →
deployed`, plus `wont_fix` — and **only arrival is worth a ping**. Firing on every
transition would train the household to ignore the tray, and the intermediate
states are already visible in-app.

The notification is guarded on the **transition**, not the value, so re-saving an
already-deployed report is silent. Its body quotes the reporter's own words back,
because "a fix was deployed" means nothing to a child who reported that the
calendar looked funny.

Status words are the household's, not engineering's: `deployed` renders as
**"Fixed — live"**.

### 5. On the triage board, identity takes the edge

The board shows several people at once, so per **ADR 043** the `ItemCard` spine is
the **reporter's identity hue in every state** and never encodes status; the
status pill sits in the row's field. The reporter's `identityHue` therefore
travels on the payload (**ADR 044**), or the spine cannot be painted.

## Why not

**A floating action button.** Most discoverable, and it overlaps content on every
screen while fighting the mobile tab bar. The tray is already the surface that
means "something needs your attention."

**Settings only.** You would have to leave the broken screen to report it — and
the route, which is the single most valuable captured field, would be `/settings`
every time.

**Screenshot capture in v1.** The strongest signal for visual bugs, and it costs a
client capture dependency plus image storage plus magic-byte validation. Route +
build + console errors carry enough to reproduce most of what a household hits.
Deferred, not rejected.

**An autonomous fix agent, now.** Auto-merging generated patches to the app a
family depends on, unattended, is a trust step to earn by watching a few go
through first. The loop runs manually today; `docs/fix-it-playbook.md` documents
the GitHub Action upgrade.

**A queue we own instead of GitHub issues.** See §3.

## Consequences

- The capture is schemaless JSON (`context`) on purpose: adding a captured field
  must never require a migration, because it is evidence, not queryable data.
- The sidebar's utility group now renders for **every** tier. It previously hid
  entirely below tier 2, and its top divider was conditional on having items; it
  always has at least one now.
- A `wont_fix` report still shows the reporter a status. Telling someone their
  report was considered and declined is part of the promise.

## Do not revisit unless

- Reports arrive that the capture cannot reproduce — then add a screenshot, which
  is the deferred v2 and the obvious next signal.
- The household files enough reports that a tier-4 board is the wrong shape (a
  real queue, assignment, dedupe).
- The fix loop becomes autonomous, which changes who moves a status and when — at
  that point the notification's honesty matters more, not less.
