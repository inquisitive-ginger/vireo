# Session Queue

> Owned by planning sessions; every other session type reads but doesn't modify it. Each
> queued session has a kickoff in `docs/sessions/kickoffs/` that pre-loads its context —
> open it before starting work, don't fill out a template live.
>
> **Authoring rule (applies at every closeout):** an **Up Next** or **Recently Completed**
> entry is **at most two or three concise lines** — the headline + a pointer to its session
> log, where the detail lives. **Deferred** entries are one line: what it is · why it waits ·
> a pointer. Never paste a summary. The log is the record; this file is the index.

---

## Up Next

> **M4.5 — Companion is the active milestone** (M4.5/3 next). M5 runs alongside: /2 shipped
> 2026-08-13, /3 and /4 on 2026-08-23; **groceries left M5 on 2026-09-03** and is now
> **M5.5 — Shopping** (ADR 069), five of six shipped by 2026-09-04. Part F offsite backups
> went live 2026-08-16, so the remaining infra items are improvements, not risks.

### Beacon — Product+Design: paired friend lamps (deadline: the friends' December visit)

**Type:** product + design · **Kickoff:** `kickoffs/product-design-beacon.md`
LuvLink lamps covered the goodbye; the custom build — 4 paired Pi Zero 2 W beacons, tap → glow

- voice, a `beacon` plugin — is gifted at the December visit.
  _`logs/2026-07-29-product-beacon-concept.md`._

### M4.5 — Companion: five sessions, strictly sequenced

**Direction settled 2026-08-07** (ADR 061/062, `artifacts/2026-08-07-xp-sink-direction.html`,
`logs/2026-08-07-design-xp-sink-direction.md`). Sequencing: `docs/modules/companion/spec.md`.
Run in order:

1. ~~M4.5/1 — Style Bible + duotone proof~~ ✅ 2026-08-07 — bible settled, canvas-LUT
   duotone proven. _`logs/2026-08-07-design-companion-style-bible.md`._
2. ~~M4.5/2 — Gear taxonomy + asset library~~ ✅ 2026-08-08 — 20 bodies + 15 gear items
   (4 parked on renderer extensions). _`logs/2026-08-08-design-companion-gear-assets.md`._
3. **M4.5/3 — Design: Feature UX** · `kickoffs/design-companion-ux.md` · _depends on /2 —
   ready._ Assets + fits: `docs/modules/companion/assets/` (`bodies/`, `gear/`, `anchors.json`).
4. **M4.5/4 — Dev: Foundation** · `kickoffs/dev-companion-foundation.md` · _depends on /3
   (or /1 if wall-clock demands — see spec)_
5. **M4.5/5 — Dev: Surfaces (the launch PR)** · `kickoffs/dev-companion-surfaces.md` ·
   _depends on /4_

One pre-launch family task: **name the feature at the dinner table** (ADR 061 — "critter"
is the working register).

---

### M5/5 — Dev: Try Bites — the last M5 story (groceries went to M5.5, ADR 069)

**Kickoff:** `kickoffs/dev-try-bites.md` · dev · _depends on M5/2, M4/6_
`meals.trybite.taken` → punches a `rewards` card, replacing the paper sheet (15 squares →
small reward → reset). `meals` knows nothing about cards.
_`logs/2026-09-03-product-shopping-boundary.md`._

---

### M5.5 — Shopping: five of six shipped; **polish (design → dev), then /6 offline**

**PR #127 closed unmerged**; the two 2026-08-23 artifacts are banner-marked SUPERSEDED — build
from `docs/modules/shopping/design.md` **and its artifact**, never from #127. The plugin is
**built and reachable by URL but announced nowhere** until the dev polish session. _`docs/modules/shopping/{spec,salvage}.md` · ADR 069–073._

### Shopping polish — **two sessions, next in the milestone** (Zach, 2026-09-04)

**1. Design: the critique** · `kickoffs/design-shopping-polish.md` · _ready._ The built surface
judged whole, with Zach adding items in concert. Settles the check-ring contrast (a shared token —
chores fails identically), the widget's 2×2 footprint (an elevation-ladder call), the colliding
`14`s, `addError` erased by a later success, `section-label` spacing.
_`logs/2026-09-04-dev-shopping-{shop-context,capture-surfaces}.md`._

**2. Dev: the build** · `kickoffs/dev-shopping-polish.md` · _depends on the critique._ Builds the
decision set and **announces the plugin** — the `navItem` and `WIDGET_META` entry come back last.

### M5.5/6 — Dev: offline — _the last story in the milestone_

**Kickoff:** `kickoffs/dev-shopping-offline.md` · dev · _depends on /4 ✅; runs after both
polish sessions._
The list renders and checks replay with no signal, without staling the shell or `/api`.

---

### Fix: auto-bug #135 — calendar widget day labels

**Type:** fix · **Kickoff:** _to be written_
Reported 2026-09-04, `fixing` in `platform.bug_reports` (`69863d86`) — the home dashboard's
calendar widget puts its day labels on the wrong edge. `docs/fix-it-playbook.md`; the report
owes a `deployed` flip after the fix ships (tier-4 PIN, only Zach).

### Prod storage off USB: NVMe HAT for the Pi 5

**Type:** infra (small, needs a purchase) · **Kickoff:** _to be written_
**An upgrade, not a rescue** (2026-08-22) — the slowness was a bad cable. Buy HAT + drive,
rsync the storage roots (runbook Part C9), swap fstab, retire the enclosure.
_`logs/2026-08-22-infra-watchdog-quiescence.md`. Depends on: none._

### Retire the Pi 3B: second-copy backup puller

**Type:** infra (small) · **Kickoff:** _to be written_
Wipe the 3B's stale docker/tailscale/runner state, then give it a weekly `restic copy` pull of
the R2 repo. Also owed: live-test the backup failure hook.
_`logs/2026-08-16-infra-offsite-backups.md`. Depends on: none._

### Deployment: shrink the api image

**Type:** infra/tooling · **Kickoff:** _to be written_
The api image is **2.09 GB** and every source change rebuilds the `pnpm install` layer (~6 min
Pi deploy) — split `node_modules` off the source layer. **Boot-test against a real DB in CI
first** (this class of change took the API down 2026-07-21); no `pnpm fetch` + `--offline`.
_`docs/deployment.md` E2/E3, `logs/2026-07-21-infra-deploy-hardening.md`. Depends on: none._

### Docs: ten ADRs are over the 6000-byte cap

**Type:** docs · **Kickoff:** _to be written_
Rewrite concise — same arguments, fewer words; never cut reasoning, never raise the cap
(Zach, 2026-09-04). 042 (9704), 044, 043, 031, 035, 046, 041, 022, 040, 057. Grandfathered:
the check reads only changed files.

### Docs: `section-label` has no block-spacing rule

**Type:** design-system · **Kickoff:** _to be written_ · **the shopping design critique decides
whether it folds in there** — if it does, this entry closes with it. The token says nothing about the space
around it, so four call sites hand-roll four answers (`ui/widget-header.tsx`, `family-feed`,
`meals/TonightView.tsx`, `shopping/ShoppingPageView.tsx`). Found in M5.5/5.

### Platform: family-feed test addendum

**Type:** development (test addendum) · **Kickoff:** _to be written_
`family-feed` has a `test` script and **zero test files** — silently "passing" its whole life.
Stand up an RTL suite mirroring chores/calendar. See also the Deferred CI-glob gap.

---

## Deferred Backlog

> Real, scoped work that isn't pressing. Grouped by kind; one-lined until it is picked up
> and a kickoff is written.

### Owed ADRs — settled-but-unscoped, scope when the dependent work starts

- **External-ingest / suggested-events extension point** — the source-agnostic contract by
  which an external source lands events as `status:'suggested'` with a `source` provenance.
  Columns shipped in story #1; scope it when story #8 (Suggested Events Inbox) is scheduled.
  _Reads: calendar `spec.md` north star, `stories/suggested-events-inbox.md`, ADR 008/029._
- **A second day mark has nowhere to go** — the month cell's date row fits exactly one mark
  (83px min-content vs ~77px at the 768px breakpoint; the deficit lands on the quick-add
  button). Deferred by the user until a second provider exists; **M7 School owes the
  decision**. _Reads: `logs/2026-08-23-dev-calendar-day-marks.md`._
- **Member capacity** — where per-member capacity lives and who sets it. Gates the
  capacity-aware chores workload meter (chores 1.5); blocks no MVP story.
  _`docs/modules/chores/design.md` §1._

### Platform v2 — post-M3 platform/mobile follow-ons

- **Bug-report screenshots (ADR 046 v2)** — strongest signal for visual bugs; waits on a client
  capture dep + image storage (reuse ADR 042's bytes-in-Postgres). _ADR 046 §"Why not"._
- **Autonomous fix agent (ADR 046)** — Action on `auto-bug` open that patches and opens a **PR
  only**; needs `ANTHROPIC_API_KEY`, must not run on the Pi runner. _`fix-it-playbook.md`._
- **Push subscription reconciliation** — `db:reset` drops `push_subscriptions` while the phone
  keeps its local one, so the toggle reads ON with no server row. Reconcile on load.
  _`apps/api/src/plugins/push.ts`._
- **Offline plugin render (optional)** — a plugin renders offline only if its chunks were
  fetched online first; moot for a LAN appliance. _`apps/shell/public/sw.js`._
- **Family Profile Notifications** — M1-scoped, deferred as a Platform v2 extra: surface
  shape + `FamilyNotificationStrip` + ADR 029 `audience`.
  _Kickoff: `kickoffs/design-family-profile-notifications.md`._
- **Push Multi-Profile Device** — M1-scoped, deferred likewise: a composite-key migration so
  one device holds subscriptions for several profiles.
  _Kickoff: `kickoffs/dev-push-multi-profile-device.md`._

### Tooling / tech debt

- **Pin `name: family-os` in `docker-compose.yml`** — with no `name:`, compose derives the
  project from the directory, so since the `vireo` rename a plain `docker compose up` builds
  an **empty** `vireo_postgres_data` volume and the API boots against a blank dev DB.
  Workaround: `COMPOSE_PROJECT_NAME=family-os`. _Hit 2026-09-02 —
  `logs/2026-09-02-dev-calendar-add-event-date.md`._
- **Permission overrides drop their conditions** — `ability.ts` replays overrides as
  `can(action, subject)` unconditioned, so revoke-then-regrant of any conditioned key returns it
  **unscoped**; already true of shipped `rewards.{Wallet,Redemption,PunchCard}`. Found writing
  ADR 073, which works around it with a route-side ownership check.
- **Validation audit — align routes to shared Zod schemas** — every API route that hand-rolls
  body validation moves onto a `@family-os/schemas` schema (`safeParse` → 400 flatten);
  `chores` tasks was migrated 2026-07-30, the rest is a sweep. _Reads:
  `packages/schemas/src/index.ts`, `apps/api/src/plugins/chores.ts` as an aligned example._
- **Harden the plugin generator (`turbo gen plugin`)** — scaffolds a frontend-only remote, so
  every data-backed plugin hand-patches it: no data layer, `shared` in array not singleton form,
  `dev` can't serve a remote, backend wiring manual. _`turbo/generators/`._
- **Plugin test suites never run in CI** — `vitest.workspace.ts` globs only `packages/*` and
  `apps/*`, so every `plugins/*` suite (shopping's 28 included) passes locally and CI runs
  none of them. Widen the globs, then fix whatever the first honest run exposes.
- **`@db.Uuid` on profile-referencing columns is wrong platform-wide** (ADR 072) — `posts
.author_id`, `events.created_by`, `planned_meals.owner_id` declare `uuid` while
  `platform.profiles.id` is text holding `'family'`; each grew a hand-written 403 to hide it.
  **Latent** — urgent the day a surface lets the family profile write one.
- **`Profile` literals that drop `identityHue`** — `synthesizeHousehold`
  (`apps/api/src/plugins/auth.ts:79`) rebuilds a profile without the hue: the exact ADR 044
  silent failure CLAUDE.md names. Benign only while nothing calls `resolveHue(name)` on the
  family profile — ADR 072 §3 forbids that for shopping and nowhere else. Audit every
  `Profile` construction site.
- **Storybook stories → Tailwind utilities** — legacy inline-`style` layout in ui stories moves
  to Tailwind (ADR 035); inline `style` only for dynamic token values. `color-tokens` first.
- **Family-wall feed typography** — the family banner wants across-room `text-prose` (18px); the
  robust fix passes prominence in via `useWidgetProminence()`. Polish.
  _`plugins/family-feed/src/widgets/FeedWidgetView.tsx`, ADR 039._

---

## Recently Completed

> **A rolling window, not a changelog.** One line per session plus its log pointer, most
> recent first, nothing older than the current milestone's start. `docs/sessions/logs/` is
> date-ordered and holds the record. Do not restore entries pruned from here.

- **2026-09-04 — Dev: shop context, shopper sync, the aisle correction** (M5.5/4, PR #136) —
  ADR 064 amended: per-row attribution is rendered in neither direction. Ships with the nav item
  and widget **disabled**, one revertable commit. _[log](logs/2026-09-04-dev-shopping-shop-context.md)_
- **2026-09-04 — Dev: the capture surface, the widget, and taking back an add** (M5.5/5, PR #134) —
  the no-mode rule is the phone's, not an exception; ADR 070 amended (nothing autofocuses) and
  ADR 073 written. _[log](logs/2026-09-04-dev-shopping-capture-surfaces.md)_
- **2026-09-04 — Dev: the plugin split + the capture surface** (M5.5/2, PR #132) — `shopping`
  is its own plugin and schema; ADR 071 (`check` at tier 2) and 072 (profile columns are text)
  came out of the build, and the live review cut rendered attribution.
  _[log](logs/2026-09-04-dev-shopping-split-capture.md)_
- **2026-09-04 — Dev: the needs-push contract** (M5.5/3, PR #133) — `meals.needs.pushed` over
  the bus with a new `emitAndAwait` so a failed push reports; `source_label` carries the
  producer's words. _[log](logs/2026-09-04-dev-shopping-needs-push.md)_
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
- **2026-08-23 — Dev: Calendar Day Marks** (M5/4, PR #125) — ADR 050's provider contract at
  platform level, ADR 066's two gates server-side; marks are today-forward only.
  _[log](logs/2026-08-23-dev-calendar-day-marks.md)_
- **2026-08-23 — Dev: Who's Got Dinner** (M5/3, PR #124) — the 16:00 nudge poll on a
  `(date, audience)` ledger; a standing convention (`console.error` on every catch)
  overruled an ADR 045 precedent. _[log](logs/2026-08-23-dev-meals-whos-got-dinner.md)_
- **2026-08-23 — Fix: mobile nav active-tab wash** (auto-bug #123, PR #126) — one
  active-nav recipe with the sidebar; verified live, reporter notified.
  _[log](logs/2026-08-23-dev-mobile-nav-tab-wash.md)_
- **2026-08-22 — Design+dev: the app icon set** (PR #122) — a vireo family in a lit
  birdhouse, generated then traced to vector. **e2e unrun; unseen on a real phone.**
  _[log](logs/2026-08-22-design-dev-brand-icon-set.md)_

Everything before 2026-08-22 (M0 through M4, deployment Parts A–F): see
`docs/sessions/logs/` and `docs/roadmap.md`.
