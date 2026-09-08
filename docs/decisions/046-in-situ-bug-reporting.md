# ADR 046 — In-situ bug reporting

**Status:** Decided · 2026-07-20

## Context

The app is live on the fridge iPad and a phone. The people using it cannot fix it, and the
report path is a sentence said in a kitchen — "the calendar's being weird" — losing every
detail that would make the bug reproducible. By the time it reaches a session the route, the
build and the console are gone, and the reporter has no idea whether anything happened.

## Decision

**1. A report is a capture, not a complaint.** The user writes one sentence; the app attaches
unasked the **route**, the **build hash**, the **profile** (id, name, tier), the
**viewport**, the **user agent**, and the **last ten errors** the page produced.

The description alone is rarely reproducible, and none of the rest is something a household
member could be asked to find. The **route** is the one required field — a fixer who knows
the page can start, one who doesn't is guessing. The rest is optional and clamped, never
rejected: failing validation would lose the report, worth more than its metadata.

The build hash is read **off the entry script's filename at runtime** — a content hash cannot
be known before the content is hashed — and is the hash `stampServiceWorker` bakes into the
service worker's cache name, which is what matches a report to a deployed build.

Captured errors live in an **in-memory ring buffer**, never persisted and never sent anywhere
until someone presses Send: evidence for a report being filed now, not telemetry.

**2. Every tier can report — including tier 1.** `platform.bug-report.create` is baseline for
**every** profile, in the registry so a parent can revoke it per-profile. The youngest user
is likeliest to hit a rough edge and least able to route around it; gating at tier 2 would
silence exactly the reports worth having.

That consequence was paid, not dodged: **the notification tray is tier-2+ chrome**, so the
decided entry point, its footer, does not exist for a tier-1 profile — and granting a
capability with no surface would recreate ADR 044's failure. Below tier 2 the report control
**takes the notification bell's slot** rather than adding an affordance: one report entry per
profile, in whichever chrome that profile has.

`notify()` returns `null` below tier 2 and stays that way; a tier-1 reporter's status is
legible **in the drawer**, on their own list of reports — which is why that list exists for
everyone, not as a maintainer view.

**3. The GitHub issue is the bridge, and it is best-effort.** On create the server opens a
labelled (`auto-bug`) GitHub issue whose body is the full capture, and writes the issue number back to the row. The issue is the bridge because the fix
happens in a repo, in a session, in CI — not in this app. A queue we own would rebuild issue
tracking badly and still need to get the report to where the work is.

It is **best-effort in both directions**: fired without blocking the reply (the shape of
`notify()`'s push dispatch), returning `null` on every failure path rather than throwing. A
household on a slow uplink should not watch a spinner while we talk to github.com, and an
expired token must not cost them their report. **The report is the household's; the issue is
the maintainer's convenience.** With no token configured it still works, stopping at a row a
parent triages by hand.

**4. The status round-trip is the feature.** A report has a status the reporter can watch — `new → triaged → fixing → deployed`, plus
`wont_fix` — and **only arrival is worth a ping**: firing on every transition would train the
household to ignore the tray, and the intermediate states are visible in-app. The
notification is guarded on the **transition**, not the value, so re-saving a deployed report
is silent. Its body quotes the reporter's own words back, because "a fix was deployed" means
nothing to a child who reported that the calendar looked funny. Status words are the
household's: `deployed` renders as **"Fixed — live"**.

**5. On the triage board, identity takes the edge.** The board shows several people at once,
so per **ADR 043** the `ItemCard` spine is the **reporter's identity hue in every state**,
with the status pill in the field. The reporter's `identityHue` must travel on the payload
(**ADR 044**), or the spine cannot be painted.

## Why not

**A floating action button** — most discoverable, and it overlaps content on every screen
while fighting the mobile tab bar. The tray already means "something needs attention".

**Settings only** — you would leave the broken screen to report it, and the route, the most
valuable field, would be `/settings` every time.

**Screenshot capture in v1** — the strongest signal for visual bugs, at the cost of a capture
dependency, image storage and magic-byte validation. Route + build + console errors reproduce
most of what a household hits. Deferred, not rejected.

**An autonomous fix agent, now** — auto-merging generated patches unattended, to the app a
family depends on, is a trust step to earn by watching a few go through. The loop runs
manually; `docs/fix-it-playbook.md` documents the GitHub Action upgrade.

## Consequences

- The capture is schemaless JSON (`context`) on purpose: adding a field must never need a
  migration, because it is evidence, not queryable data.
- The sidebar's utility group now renders for **every** tier; it previously hid below tier 2,
  and its top divider was conditional on having items.
- A `wont_fix` report still shows a status: telling someone their report was considered and
  declined is part of the promise.

## Do not revisit unless

- Reports arrive the capture cannot reproduce — then add a screenshot, the deferred v2.
- The household files enough reports that a tier-4 board is the wrong shape (a real queue,
  assignment, dedupe).
- The fix loop becomes autonomous, changing who moves a status and when — at which point the
  notification's honesty matters more, not less.
