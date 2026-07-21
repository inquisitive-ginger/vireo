# 2026-07-21 — Design + Dev: In-situ Bug Reporting (PRs #47, #49)

**Type:** design + development (ad-hoc) · **Shipped to prod.**

---

## What was decided — ADR 046

The app is live on the fridge iPad and the people using it are not the person who
can fix it. The report path was a sentence said in a kitchen, which loses every
detail that makes a bug reproducible, and gave the reporter no reason to believe
anything happened.

**A report is a capture, not a complaint.** One sentence from the user, plus the
route, build hash, profile, viewport, user agent, and last ten errors — attached
automatically, because none of it is something a household member could
reasonably be asked to find. The **route is the only required field**; everything
else is clamped rather than rejected, since a capture that fails validation would
lose the report entirely, and the report is worth more than the metadata.

The build hash is read **off the entry script's filename at runtime** — a content
hash cannot be known before the content is hashed. It is the same hash
`stampServiceWorker` bakes into the SW cache name, which is what lets a report be
matched against a deployed build.

**Every tier can report, tier 1 included.** The youngest user is the likeliest to
hit a rough edge and the least able to route around it. That decision cost
something and it was paid rather than dodged: the notification tray is tier-2+
chrome, so the decided entry point does not exist below tier 2. Rather than add a
second affordance, **the report control takes the bell's slot** in a tier-1
profile — one entry per profile, in whichever chrome that profile has. Granting a
capability and leaving it unreachable is the ADR 044 failure repeated.

**The GitHub issue is the bridge, best-effort in both directions** — fired without
blocking the reply, returning `null` on every failure path. _The report is the
household's; the issue is the maintainer's convenience._

**Only arrival pings**, guarded on the transition so re-saving is silent, and the
body quotes the reporter's own words back. Status words are the household's:
`deployed` renders as "Fixed — live".

## What was built

- `platform.bug_reports` + a Fastify plugin (`POST` / `GET` / `PATCH`), the
  `auto-bug` GitHub bridge, and the `notify()` round-trip.
- `ReportProblemDrawer` + `ReportProblemButton` (three chrome shapes mirroring
  `BellBadge`), a `footer` slot on `NotificationTray`, a tier-4 triage board in
  Settings, and `report-context.ts` (error ring buffer + build hash).
- `platform.bug-report.create` in the registry, revocable per-profile.
- `docs/fix-it-playbook.md` — the operational half.

## The failure worth keeping

**Production has no `profiles` row for the household pseudo-profile, and it is the
default profile.** The first live check after #47 deployed returned **500 /
P2003**: the `reporterId` foreign key rejected `family`, making the single
likeliest report in the house — the one filed from the fridge tablet — a hard
error. Named profiles were unaffected, which is why nothing else looked wrong.

**This risk was identified during the build and dismissed on bad evidence.** The
question "does the family profile have a row?" was asked, checked against **dev**,
answered yes, and generalized. Dev has the row; prod's onboarding never wrote one.
All 286 tests passed because they ran against a database that happened to have it.

The lesson is not "test more" — it is that **an environment-specific fact must be
verified in the environment that matters**. A local `psql` cannot answer a question
about production, and the more confident the local answer looks, the less likely
anyone re-asks it.

The fix (#49) drops the FK and resolves the reporter at read time with a household
fallback. The FK encoded an assumption that is false: a reporter is not guaranteed
a profile row, and on the most important surface it usually has none. The same
fallback keeps a report readable after its author is deleted — the better model
anyway, since **a report is evidence about the app, not the filer's property**.

## A second near-miss

`prisma generate` wanted to rewrite ~19k lines of `runtime/*` — same version
(7.8.0), but a **minified** build where the committed client is pretty-printed.
Those files reference the new model **zero** times, so only the schema-derived
files were committed and the runtime was left byte-identical to what is running.
Given the previous session's outage came from exactly these committed clients,
swapping the Prisma runtime does not ride along on a feature PR. **It recurred on
the second regenerate and had to be stripped again** — so this will keep happening
until the local generate and the committed client are reconciled.

Also caught before it shipped: `GITHUB_TOKEN` in `.env` would have reached
**nothing**. The api service declares an explicit `environment:` map, so
`--env-file` only feeds compose interpolation — the bridge would have silently
no-opped forever, discovered only when a child's report vanished.

And the Family profile would have been painted a **member's** hue on the triage
board (`identityHue: null` → the name hash), the exact bug ADR 041 exists for, on
the likeliest reporter of all. Routed through `FAMILY_HUE`.

## Verified

End-to-end **on production**: a report filed from the household profile → 201 →
GitHub issue #50 opened with the full capture (route, build, viewport, UA, console
errors) → the row updated itself to `triaged` with the issue number. No human
touched the middle. Test artifacts removed afterwards; prod is at zero reports.

288 api · 170 ui · 11 shell · 33 platform. Typecheck + lint clean.

## What the next session needs to know

- **The UI has never been reviewed by a human.** The drawer, the tier-4 board, and
  the "Fixed — live" notification are integration-tested only. The real check is
  filing one from the fridge iPad.
- **`sw.js` served no cache name** to a grep during the live check. Unconfirmed
  either way, but the SW stamp is what makes deploys reach installed PWAs — worth
  ruling out before trusting the iPad to auto-update.
- The bridge token is a fine-grained PAT, Issues-only, on the Pi's `.env`. It was
  pasted into a chat transcript and **should be rotated**.
- The fix loop is manual by design. `docs/fix-it-playbook.md` documents the
  GitHub-Action upgrade; adopt it PR-only before auto-merge.
