# Session Queue

> Owned by planning sessions. Updated at the end of every planning session. All
> other session types read but don't modify this file.
>
> Each queued session has a kickoff doc in `docs/sessions/kickoffs/` that pre-loads
> context, constraints, and decisions-to-make. Open the kickoff before starting
> work — don't fill out a template live.
>
> **Authoring rule (applies at every closeout):** a **Recently Completed** entry is
> **at most two or three concise lines** — the headline decision + a pointer to its
> session log, where the full detail lives. Do not paste the session summary here.
> **Deferred** entries stay short too: what it is · why it waits · a pointer. The
> log is the record; this file is the index.

---

## Up Next

> **M4.5 — Companion is the active milestone** (M4.5/3 next). M5 is running
> alongside it: /2 shipped 2026-08-13, /3 and /4 on 2026-08-23, and **M5/6's design
> rework is the one runnable M5 session**. Part F offsite backups went live
> 2026-08-16, so the remaining infra items are improvements, not risks to the data.

### Beacon — Product+Design: paired friend lamps (deadline: the friends' December visit)

**Type:** product + design · **Kickoff:** `kickoffs/product-design-beacon.md`
Both kids' best friends move cross-country ~2026-08-05; **4× LuvLink Infinity
(light-only) cover the goodbye** — set up pre-move, two Group-ID pairs, kids pick
signature colors as the ritual. The custom build — 4 paired Pi Zero 2 W beacons
(tap → glow + voice drops, relayed through the Pi as a `beacon` plugin) — is
gifted and paired in person at the **December visit**, voice as the headline
upgrade. _Log: `logs/2026-07-29-product-beacon-concept.md`._

### M4.5 — Companion: five sessions, strictly sequenced

**Direction settled 2026-08-07** (ADR 061/062, artifact
`artifacts/2026-08-07-xp-sink-direction.html`, log
`logs/2026-08-07-design-xp-sink-direction.md`). Session plan + sequencing:
`docs/modules/companion/spec.md`. Run in order:

1. ~~M4.5/1 — Style Bible + duotone proof~~ ✅ 2026-08-07 — bible settled,
   references signed off (A2), canvas-LUT duotone proven. _Log:
   `logs/2026-08-07-design-companion-style-bible.md`._
2. ~~M4.5/2 — Gear taxonomy + asset library~~ ✅ 2026-08-08 — 20 bodies + 15
   gear items shipped (4 parked pending renderer extensions: two-layer wraps,
   dual-placement pairs). _Log: `logs/2026-08-08-design-companion-gear-assets.md`._
3. **M4.5/3 — Design: Feature UX** · `kickoffs/design-companion-ux.md` ·
   _depends on /2 — ready._ Real assets + fits:
   `docs/modules/companion/assets/` (`bodies/`, `gear/`, `anchors.json`).
4. **M4.5/4 — Dev: Foundation** · `kickoffs/dev-companion-foundation.md` ·
   _depends on /3 (or /1 if wall-clock demands — see spec)_
5. **M4.5/5 — Dev: Surfaces (the launch PR)** ·
   `kickoffs/dev-companion-surfaces.md` · _depends on /4_

One pre-launch family task: **name the feature at the dinner table** (ADR 061 —
"critter" is the working register).

---

### M5 — Meals & Groceries: five sessions, two waves

**Wave 1 landed 2026-08-23** — M5/3 (PR #124) and M5/4 (PR #125) are done; M5/6 is
open as PR #127, its design gate now closed and the rework queued (below). Wave 2 is
M5/5 + M5/7, and both share `apps/api/src/plugins/meals.ts` and
`plugins/meals/prisma/` — land routes in a **new file**, rebase + `prisma generate`
before merging. _Log:
`logs/2026-08-22-infra-agent-delegation.md`._

### M5/5 — Dev: Try Bites

**Type:** development · **Kickoff:** `kickoffs/dev-try-bites.md`
`meals.trybite.taken` → punches a `rewards` card. Replaces the paper sheet (15 squares →
small reward → reset). `meals` knows nothing about cards. _Depends on: M5/2, M4/6._

### M5/6 — Dev: the grocery list, reworked on PR #127 · **run this next**

**Type:** development · **Kickoff:** `kickoffs/dev-grocery-list.md`
Rework above the data layer, **amending #127** rather than opening a PR: index of lists
→ per-list view, a new migration giving `grocery_items` a list reference, ADR 067's
registry key, and `GroceriesPage.tsx:26`'s `tier >= 4` → `ability.can`. `ListRow` unchanged.
_Contract: [dev-ready visual](artifacts/2026-08-23-grocery-list-devready.html) —
read it first, it is newer than the spec and carries the index decision —
plus [handoff](artifacts/2026-08-23-grocery-list-handoff.md) · ADR 067. Depends on:
nothing — #127 is open and waits on this._

### M5/7 — Dev: Shop Context, Sync + Offline, the Wall

**Type:** development · **Kickoff:** `kickoffs/dev-grocery-shop-offline.md`
Whole-row checks, cleared-aisle collapse, progress track, "Sam got it" sync between
shoppers, the wall's presence line — and **offline**. The SW is network-first for
`/api`, so today the list fails in the exact place it is used; it has bitten twice —
treat the offline half as its own reviewable chunk. **Amended 2026-08-23:** the M5/6
gate killed the three-column wall and the note line, so ACs 4 and 5 were rewritten.
_Reads: `design.md` §M5/7, `apps/shell/public/sw.js`,
`logs/2026-07-19-dev-sw-cache-strategy.md`. Depends on: M5/6 (PR #127)._

### Groceries' home, and an index-count animation

**Type:** product + design, then a small design+dev · **Kickoffs:** _to be written_
Two things the M5/6 review raised. Groceries sits under `meals` because that is where
it was born — a list of lists anticipating Home Depot (ADR 067) may not belong under
dinner planning; the crowded meals header is a symptom, fixed in #127. Separately,
adding from the index moves a count with no motion, so the signal the add hit the
right list is easy to miss. _Raised 2026-08-26, M5/6 live review._

---

### Prod storage off USB: NVMe HAT for the Pi 5

**Type:** infra (small, needs a purchase) · **Kickoff:** _to be written_
**Downgraded 2026-08-22 — an upgrade now, not a rescue.** The USB path was blamed
for the enclosure hang and months of slowness; it was a bad cable, and the same
disk now does 256 MB/s sequential / 17.6 MB/s at 4k
(`logs/2026-08-22-infra-watchdog-quiescence.md`). The HAT is still the tidier
end state — buy HAT + NVMe drive, rsync the storage roots (runbook Part C9
pattern), swap fstab, retire the enclosure — but nothing depends on it.
_Depends on: none._

### Retire the Pi 3B: second-copy backup puller

**Type:** infra (small) · **Kickoff:** _to be written_
Part F shipped 2026-08-16 (restic → R2, restore-tested; prod now on a Pi 5 —
`logs/2026-08-16-infra-offsite-backups.md`). The 3B still holds stale
docker/tailscale/runner state: wipe it, then give it a weekly
`restic copy`-style second-copy pull of the R2 repo. Also owed from that log:
live-test the backup failure hook. _Depends on: none._

### Deployment: shrink the api image

**Type:** infra/tooling · **Kickoff:** _to be written_
What's left of the deploy-hardening session (E3 auto-deploy and faster builds
**shipped 2026-07-21**; the SSD storage move **done 2026-07-20**, both roots —
`docs/deployment.md` Part C9). **Shrink the api image** — at
**2.09 GB** (web is 150 MB) it is the whole reason a deploy takes ~6 min on the
Pi; every source change rebuilds the `pnpm install` layer so ~2 GB is re-pulled.
Split `node_modules` off the source layer (`COPY` manifests → install → `COPY`
source). **This is the same class of change that took the API down on 2026-07-21
— boot-test the image against a real DB in CI before it goes near the Pi**, and
do not reach for `pnpm fetch` + `--offline`. _Reads: `docs/deployment.md` E2/E3,
`logs/2026-07-21-infra-deploy-hardening.md`, memory `project-poc-hardware`._
_Depends on: none (live)._

### Platform: family-feed test addendum

**Type:** development (test addendum) · **Kickoff:** _to be written_
`family-feed` has a `test` script and **zero test files** — silently "passing" for
its whole life, exactly the condition chores was in before ADR 043. Stand up an RTL
suite mirroring chores/calendar. _Depends on: none._

---

## Deferred Backlog

> Real, scoped work that isn't pressing. Grouped by kind; each is one-lined until it
> is picked up and a kickoff is written.

### Owed ADRs — settled-but-unscoped, scope when the dependent work starts

- **External-ingest / suggested-events extension point** — the source-agnostic
  contract (email/newsletter first, iCal/Google later) by which an external source
  lands events as `status:'suggested'` with a `source` provenance. Columns shipped in
  story #1; the contract is settled when story #8 (Suggested Events Inbox, the
  deferred north star) is scheduled. _Reads: calendar `spec.md` north-star section,
  `stories/suggested-events-inbox.md`, ADR 008, ADR 029._
- **A second day mark has nowhere to go** — the month cell's date row fits exactly one
  mark. Min-content is 83px against ~77px available at the 768px breakpoint, and
  left-packing did not change that; the deficit currently lands on the quick-add
  button. Stacking and reveal are **deferred by the user** until a second provider
  exists. **M7 School owes the decision** — drop the quick-add below some width, wrap,
  or shrink the glyph. _Reads: `logs/2026-08-23-dev-calendar-day-marks.md`._
- **Member capacity** — where per-member capacity lives and who sets it. Gates the
  capacity-aware chores workload meter (chores 1.5, a post-MVP enhancement); blocks
  no MVP story. _Reads: `docs/modules/chores/design.md` §1._

### Platform v2 — post-M3 platform/mobile follow-ons

- **Bug-report screenshots (ADR 046 v2)** — the strongest signal for visual bugs, and
  the reason "the calendar looks funny" is hard to act on. Deferred out of v1 because
  it needs a client capture dependency plus image storage (reuse the ADR 042
  bytes-in-Postgres + magic-byte pattern). _Reads: ADR 046 §"Why not"._
- **Autonomous fix agent (ADR 046)** — a GitHub Action on `auto-bug` issue open that
  patches and opens a **PR only**, no auto-merge, until it has earned the trust.
  Needs an `ANTHROPIC_API_KEY` repo secret. Do **not** run it on the Pi — the runner
  there is for `docker pull`, not a build and test suite. _Reads:
  `docs/fix-it-playbook.md` §"Making it automatic"._
- **Push subscription reconciliation** — the orphaned-subscription case left over
  from the SW cache story (2026-07-19). `reset.ts` deletes `push_subscriptions` on any
  `db:reset` while the phone keeps its browser-local subscription, so the toggle reads
  ON with **no server row** (silent no-op). On load, reconcile the browser's actual
  `PushSubscription` against the server and re-subscribe/clear. The **prod SW now
  exists** (subscriptions persist over a real HTTPS deploy), so the toggle-stuck-OFF
  symptom is resolved by deployment — this is the remaining discrete task. _Reads:
  `apps/api/src/plugins/push.ts`, `apps/shell` push toggle, `packages/platform/prisma/reset.ts`._
- **Offline plugin render (optional)** — plugins are network-first (SW cache story),
  so a plugin only renders offline if its lazy chunks were fetched online first. If
  offline plugin use ever matters, serve plugin `remoteEntry.js`/`manifest.json`
  network-first but their content-hashed chunks cache-first (mirrors the shell). Moot
  for a LAN appliance (offline ⇒ no API data). _Reads: `apps/shell/public/sw.js`._
- **Family Profile Notifications** — M1-scoped, deferred as a Platform v2 extra
  (outside M1's done-when). Surface shape + `FamilyNotificationStrip` + ADR 029
  `audience` field. _Kickoff: `kickoffs/design-family-profile-notifications.md`._
- **Push Multi-Profile Device** — M1-scoped, deferred likewise. Composite-key
  migration so one device can hold subscriptions for multiple profiles.
  _Kickoff: `kickoffs/dev-push-multi-profile-device.md`._

### Tooling / tech debt

- **Pin `name: family-os` in `docker-compose.yml`** — with no `name:`, compose
  derives the project from the directory, so since the `family-os` → `vireo` rename
  a plain `docker compose up` builds an **empty** `vireo_postgres_data` volume and
  the API boots against a blank dev DB. Workaround: `COMPOSE_PROJECT_NAME=family-os`.
  _Hit 2026-09-02 — `logs/2026-09-02-dev-calendar-add-event-date.md`._
- **Validation audit — align routes to shared Zod schemas** — every API route that
  hand-rolls body validation moves onto a `@family-os/schemas` schema
  (`safeParse` → 400 flatten). The known offender (`chores` tasks) was migrated in
  the 2026-07-30 recurring-chores session; what remains is the sweep for any other
  hand-rolled bodies. _Reads: `packages/schemas/src/index.ts`,
  `apps/api/src/plugins/chores.ts` as an aligned example._
- **Harden the plugin generator (`turbo gen plugin`)** — scaffolds a frontend-only
  remote today; each data-backed plugin hand-patches around it. Gaps: no data layer
  (schema/prisma config/db.ts/`./db` export), federation `shared` uses the array not
  singleton-object form, `dev` can't serve a federated remote, and backend wiring
  (server.ts, route file, load-plugin.ts, federation.d.ts, ICON*MAP) is manual.
  \_Reads: `turbo/generators/config.ts` + `templates/plugin/*`.\*
- **Storybook stories → Tailwind utilities** — migrate legacy inline-`style` layout
  in ui stories to Tailwind utilities (ADR 035), keeping inline `style` only for
  dynamic token values. Heaviest first: `color-tokens`, `form-primitives`,
  `typography`, `elevation`. _Unblocked by the 2026-06-22 `@source` fix._
- **Family-wall feed typography** — the family banner should render its body at
  across-room `text-prose` (18px), not `text-prose-sm` (15px). Robust fix is passing
  prominence into the widget (`useWidgetProminence()` from `WidgetSlot`); 15px Lora
  reads fine meanwhile, so it's polish. _Reads: `plugins/family-feed/src/widgets/FeedWidgetView.tsx`,
  ADR 039._

---

## Recently Completed

> **A rolling window, not a changelog.** One line per session plus its log
> pointer, most recent first, and nothing older than the current milestone's
> start. `docs/sessions/logs/` is date-ordered and holds the record — that
> directory listing is the changelog. Do not restore entries pruned from here.

- **2026-09-02 — Fix: calendar "Add event" date prefill** (auto-bug #128, PR #130) —
  the chrome CTA passed a null prefill while the three per-day affordances passed
  theirs. _[log](logs/2026-09-02-dev-calendar-add-event-date.md)_
- **2026-09-02 — Infra: the Pi's LAN address, pinned** — a reboot moved the Pi to
  `.43` while DNS and the Tailscale /32 still said `.42`; router reservation owed.
  _[log](logs/2026-09-02-infra-pi-static-ip.md)_
- **2026-08-23 — Design: the grocery list gate** (M5/6, ADR 067) — each store is its
  own list, index → drill-in, no note line; `ListRow` survives unchanged. Contract:
  _[handoff](artifacts/2026-08-23-grocery-list-handoff.md)_
- **2026-08-23 — Dev: Calendar Day Marks** (M5/4, PR #125) — ADR 050's provider
  contract at platform level, ADR 066's two gates server-side; **marks are
  today-forward only**, filtered in `MonthGrid` so M7's range survives.
  _[log](logs/2026-08-23-dev-calendar-day-marks.md)_
- **2026-08-23 — Dev: Who's Got Dinner** (M5/3, PR #124) — the 16:00 nudge poll on a
  `(date, audience)` ledger; a standing convention (`console.error` on every catch)
  overruled an ADR 045 precedent. _[log](logs/2026-08-23-dev-meals-whos-got-dinner.md)_
- **2026-08-23 — Fix: mobile nav active-tab wash** (auto-bug #123, PR #126) — one
  active-nav recipe with the sidebar; verified live, reporter notified.
  _[log](logs/2026-08-23-dev-mobile-nav-tab-wash.md)_
- **2026-08-22 — Design+dev: the app icon set** (PR #122) — a vireo family in a
  lit birdhouse, generated then traced to vector; Android's blank-square badge
  fixed. **e2e unrun; unseen on a real phone.**
  _[log](logs/2026-08-22-design-dev-brand-icon-set.md)_

Everything before 2026-08-22 (M0 through M4, deployment Parts A–F): see
`docs/sessions/logs/` and `docs/roadmap.md`.
