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

> **M4.5 — Companion is the active milestone** (M4.5/3 next). M5 runs alongside: /2 shipped
> 2026-08-13, /3 and /4 on 2026-08-23; **groceries left M5 on 2026-09-03** and is now
> **M5.5 — Shopping** (ADR 069), surface settled the same day and **resequenced into five
> dev sessions** — **M5.5/2 builds it**. Part F offsite backups went live 2026-08-16, so
> the remaining infra items are improvements, not risks to the data.

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

### M5 — Meals: one story left (groceries split out to M5.5)

Wave 1 landed 2026-08-23 (PRs #124/#125); M5/6 and M5/7 left for M5.5 on 2026-09-03
(ADR 069), so **M5/5 Try Bites is all that remains**.
_Log: `logs/2026-09-03-product-shopping-boundary.md`._

### M5/5 — Dev: Try Bites

**Kickoff:** `kickoffs/dev-try-bites.md` · dev · _depends on M5/2, M4/6_
`meals.trybite.taken` → punches a `rewards` card. Replaces the paper sheet (15 squares →
small reward → reset). `meals` knows nothing about cards.

---

### M5.5 — Shopping: five sessions (split out of M5 by ADR 069, 2026-09-03)

**PR #127 closed unmerged**; the two 2026-08-23 artifacts are banner-marked SUPERSEDED.
Build from `docs/modules/shopping/design.md` **and its artifact**, never from #127.
**Resequenced 2026-09-03** — the old /4 bundled shop context, sync, the wall and offline;
offline is now its own PR (the SW is network-first for `/api`, bitten twice) and the
wall+widget theirs (separate devices, plus an owed label decision), so each session is one
demoable, reviewable chunk. _`docs/modules/shopping/{spec,salvage}.md` · ADR 069, 070._

### M5.5/2 — Dev: the plugin split + the capture surface · **run this next**

**Kickoff:** `kickoffs/dev-shopping-split-capture.md` · dev · _depends on M5.5/1 ✅_
Scaffold `shopping` (four of five registration points — WIDGET_META is /5's), move the four
tables, renamespace subjects, land `ListRow`+ADR 068 and `CaptureField`, build S1/S2, and
reorder `plugins.json` so Shopping takes a phone tab from `chores`.

### M5.5/3 — Dev: the needs-push contract

**Kickoff:** `kickoffs/dev-shopping-needs-push.md` · dev · _depends on /2_
`meals` publishes, `shopping` consumes (ADR 050 precedent); meals stops writing shopping
rows. May pick up the `MealsPage.tsx:35` TierGate.

### M5.5/4 — Dev: shop context + shopper sync

**Kickoff:** `kickoffs/dev-shopping-shop-context.md` · dev · _depends on /2_
Frame S3: whole-row checks, cleared-aisle collapse, progress meter, two shoppers converging.
**Blocking flag it owns — no permission key exists for checking an item off**, so spec.md's
three keys make it tier 4. Escalate, don't improvise.

### M5.5/5 — Dev: the wall and the Home widget

**Kickoff:** `kickoffs/dev-shopping-capture-surfaces.md` · dev · _depends on /2_
Frame W2 (the wall only takes things in; voice slot reserved, unimplemented) plus the
zero-navigation widget, which lands the **fifth** registration point. **Owes the wall's
`section-label` distance decision** into design-system.md.

### M5.5/6 — Dev: offline

**Kickoff:** `kickoffs/dev-shopping-offline.md` · dev · _depends on /4_
The list renders and checks replay with no signal, without staling the shell or `/api`.

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
Part F shipped 2026-08-16 (restic → R2, restore-tested). The 3B still holds stale
docker/tailscale/runner state: wipe it, then give it a weekly `restic copy`-style
second-copy pull of the R2 repo. Also owed from that log: live-test the backup failure
hook. _Reads: `logs/2026-08-16-infra-offsite-backups.md`. Depends on: none._

### Deployment: shrink the api image

**Type:** infra/tooling · **Kickoff:** _to be written_
All that's left of deploy hardening. The api image is **2.09 GB** (web is 150 MB) and is
why a Pi deploy takes ~6 min — every source change rebuilds the `pnpm install` layer. Split
`node_modules` off the source layer. **Same class of change that took the API down on
2026-07-21 — boot-test against a real DB in CI first**, and no `pnpm fetch` + `--offline`.
_Reads: `docs/deployment.md` E2/E3, `logs/2026-07-21-infra-deploy-hardening.md`._
_Depends on: none (live)._

### Platform: family-feed test addendum

**Type:** development (test addendum) · **Kickoff:** _to be written_
`family-feed` has a `test` script and **zero test files** — silently "passing" its whole
life, the condition chores was in before ADR 043. Stand up an RTL suite mirroring
chores/calendar. _Depends on: none._

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
  capacity-aware chores workload meter (chores 1.5); blocks no MVP story.
  _Reads: `docs/modules/chores/design.md` §1._

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
- **Family-wall feed typography** — the family banner should render at across-room
  `text-prose` (18px), not `text-prose-sm` (15px). Robust fix passes prominence into the
  widget (`useWidgetProminence()` from `WidgetSlot`); 15px Lora reads fine meanwhile, so
  it's polish. _Reads: `plugins/family-feed/src/widgets/FeedWidgetView.tsx`, ADR 039._

---

## Recently Completed

> **A rolling window, not a changelog.** One line per session plus its log
> pointer, most recent first, and nothing older than the current milestone's
> start. `docs/sessions/logs/` is date-ordered and holds the record — that
> directory listing is the changelog. Do not restore entries pruned from here.

- **2026-09-03 — Dev: a recipe link on a planned meal** (auto-bug #129, PR #131) — a
  `recipe_url` column and nothing more; the artifact ledgers the recipe-bank features
  refused. _[log](logs/2026-09-03-dev-meals-recipe-url.md)_
- **2026-09-03 — Design: the shopping surface** (M5.5/1, ADR 070) — capture field as the
  hero on a walk-order list, no mode; the wall only takes things in; Shopping takes a phone
  tab from `chores`. _[log](logs/2026-09-03-design-shopping-surface.md)_
- **2026-09-02 — Fix: calendar "Add event" date prefill** (auto-bug #128, PR #130) —
  the chrome CTA passed a null prefill while the three per-day affordances passed
  theirs. _[log](logs/2026-09-02-dev-calendar-add-event-date.md)_
- **2026-09-02 — Infra: the Pi's LAN address, pinned** — a reboot moved the Pi to
  `.43` while DNS and the Tailscale /32 still said `.42`; router reservation owed.
  _[log](logs/2026-09-02-infra-pi-static-ip.md)_
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
