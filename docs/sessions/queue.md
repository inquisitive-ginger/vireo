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

> **M4.5 — Companion is the active milestone** (M4.5/3 next). M4 — Rewards &
> Wallet shipped 2026-07-26 (PR #75, P-Bucks live); M5/2 shipped 2026-08-13
> (PR #105) with M5/3+ queued below. Part F offsite backups went live 2026-08-16,
> so the remaining infra items are improvements, not risks to the data.

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

### M5/3 — Dev: Who's Got Dinner

**Type:** development · **Kickoff:** _to be written_
The afternoon `notify()` poll (ADR 045's in-plugin scheduler is the precedent): to
the owner, or to tier 4 if nobody has it; the widget's escalated state flips at the
same hour (`ESCALATION_HOUR`). Kind verbs + one-tap claim already shipped in M5/2;
**`coinReward` retired 2026-08-13** — a paid dinner is a dedicated chore, meals is
not an earn source. _Depends on: M5/2 ✅, M4/3._

### M5/4 — Platform: Calendar Day Marks

**Type:** development (platform) · **Kickoff:** _to be written_
The read-time provider contract from **ADR 050**: for a date range, a plugin returns at
most one mark per day; a month cell renders at most two. **Small** — no positioning, no
spans, no reminders. Shared with M7 School. Plugins never write `calendar.events`.
_Reads: ADR 050, `plugins/calendar` month grid + mobile agenda._ _Depends on: M5/3._

### M5/5 — Dev: Try Bites

**Type:** development · **Kickoff:** _to be written_
`meals.trybite.taken` → punches a `rewards` card. Replaces the paper sheet (15 squares →
small reward → reset). `meals` knows nothing about cards. _Depends on: M5/2, M4/6._

### M5/6 — Dev: The Grocery List (capture + filing)

**Type:** development · **Kickoff:** _to be written_
`grocery_items` + `staples`; **the mode split is retired (M5/1)** — one aisle-grouped
`ListRow` list, bottom add bar, aisle dictionary + learned per-family corrections,
tier 1+ adds, `needs` push. **Build `ListRow` in `@family-os/ui` first (ADR 063).**
Build to `design.md` §M5/6. _Depends on: M5/2._

### M5/7 — Dev: Shop Context, Sync + Offline, the Wall

**Type:** development · **Kickoff:** _to be written_
Whole-row checks, cleared-aisle collapse, progress track, "Sam got it" sync between
shoppers, the three-column wall view + presence line — and **offline**. The SW is
network-first for `/api`, so today the list fails in the exact place it is used; the
SW has bitten twice — treat the offline half as its own reviewable chunk. **Check wall
column re-flow on the physical fridge before closing.** _Reads: `design.md` §M5/7,
`apps/shell/public/sw.js`, `logs/2026-07-19-dev-sw-cache-strategy.md`._
_Depends on: M5/6._

---

### Watchdog: deploy-quiescence window

**Type:** infra (small, **now urgent — 2 for 2 on recent deploys**) ·
**Kickoff:** _to be written_
A minute-cadence health check can't tell "SSD gone" from "containers
restarting". PR #119's deploy tripped it and the Pi rebooted under a deploy
that had already succeeded; **PR #120 (2026-08-22) was worse** — the reboot
landed mid-`api` recreate, killed the runner (deploy shows "canceled"), and
left prod down ~15 min until the watchdog's own `compose up -d` loop finished
the rollout. Teach the watchdog to stand down while a deploy is in flight
(touch-file from deploy.yml, or a longer unhealthy grace before the reboot
path). See `logs/2026-08-20-fix-auto-bug-116-118.md` §Deploy and
`logs/2026-08-22-design-dev-olive-primary.md` §Deploy incident.
_Depends on: none._

### Prod storage off USB: NVMe HAT for the Pi 5

**Type:** infra (small, needs a purchase) · **Kickoff:** _to be written_
The 2026-08-20 outage was the USB enclosure again (UAS hang → xHCI controller
death; `logs/2026-08-20-infra-ssd-outage-selfheal.md`). Mitigations are live
(UAS quirk, watchdog + external dead-man ping), but the durable fix is an NVMe
HAT on the Pi 5's PCIe port: buy HAT + NVMe drive, rsync the storage roots
(runbook Part C9 pattern), swap fstab, retire the enclosure. _Depends on: none._

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

> Two-line index; full detail in the linked log.

- **2026-08-22 — Design+dev: the Vireo commit — olive primary (ADR 065, PR
  #120).** Primary/ring terracotta → deep olive; clay neutrals → oat; icon set
  re-rendered; latent shadcn accent-hover + colour-only tab state fixed. See
  `logs/2026-08-22-design-dev-olive-primary.md`.

- **2026-08-20 — Fix: home widget clamping + layouts (auto-bug #116 #117 #118,
  PR #119).** Fit-rows gaps closed (feed, hidden-variant re-measure, meals empty
  groove); day list stacks headers on narrow; kid grid reworked; seeded
  `default_layout_*` config rows unseeded + deleted in prod. See
  `logs/2026-08-20-fix-auto-bug-116-118.md`. **Owed:** `deployed` flips for
  reports `5a6cfca1…`, `67345432…`, `f21228f7…` (in-app, with resolutions).

- **2026-08-20 — Audit: doc staleness sweep (ad-hoc, docs only).** 24 issue
  groups fixed across 30 files (−~700 lines): dead refs, post-renumber/post-ship
  claims, queue + log pare-downs. See `logs/2026-08-20-audit-docs-staleness.md`.

- **2026-08-20 — Infra: SSD outage + self-heal watchdog (ad-hoc, no PR).** UAS
  hang recovered; watchdog + dead-man ping live, NVMe HAT queued as the durable
  fix. See `logs/2026-08-20-infra-ssd-outage-selfheal.md`.

- **2026-08-19 — Fix: shared weekly events qualify as activities (auto-bug #114,
  PR #115).** `is_activity` widened to any-attendee weekly (ADR 038 amended).
  See `logs/2026-08-19-fix-auto-bug-114.md`.

- **2026-08-17 — Fix: mobile nav overflow + calendar canvas (auto-bug #112 + #111,
  PR #113).** Bottom bar caps at 5 tabs (ADR 033); `--container-wide` 1100→1400px.
  See `logs/2026-08-17-fix-auto-bug-111-112.md`.

- **2026-08-13 — Dev: meals iPad tweaks (ad-hoc, PR #106).** Kind-first drawer
  plus a `useFitRows` offsetTop bug fixed in the primitive. See
  `logs/2026-08-13-dev-meals-ipad-tweaks.md`.

- **2026-08-13 — Dev: Week Plan + Tonight's Dinner (M5/2, PR #105).** The meals
  plugin ships; P$ dropped from meals entirely. See
  `logs/2026-08-13-dev-meals-week-plan-tonight.md`.

- **2026-08-11 — Design: Meals & Groceries (M5/1, ADR 063/064).** All 16 gates
  settled; spec at `docs/modules/meals/design.md`. See
  `logs/2026-08-11-design-meals-groceries.md`.

- **2026-08-08 — Design: Companion gear + asset library (M4.5/2).** V1 art
  complete: 20 bodies + 15 gear items; 4 parked pending renderer extensions. See
  `logs/2026-08-08-design-companion-gear-assets.md`.

- **2026-08-07 — Design: XP Sink direction (was M4/9 → now M4.5 Companion, ADR
  061/062).** XP's sink is a per-kid critter; five sessions queued. See
  `logs/2026-08-07-design-xp-sink-direction.md`.

- **2026-08-06 — Fix: recurring up-for-grabs chores stuck to the last claimer,
  punch-card row squeezed on mobile (auto-bug #102 + #103, PR #104).** Uncompleted
  claims now release on roll-forward. See `logs/2026-08-06-fix-auto-bug-102-103.md`.

- **2026-08-05 — Design+Dev: Parent Bonus Grant (M4/7, PR #101).** Tickets became
  **Wallets**; the grant is its own ledger entry. **Only M4/9 remains in M4.**
  See `logs/2026-08-05-design-dev-parent-bonus-grant.md`.

- **2026-08-02 — Dev: punch cards joy rework (PR #100).** The kid's tab rebuilt to
  the gated artifact; punch jitter was a stale-cache frame, fixed at the mutation.
  See `logs/2026-08-02-dev-punch-joy.md`.

- **2026-08-02 — Dev: punch-card emoji set (PR #99).** `PUNCH_EMOJI_GROUPS` is
  habit-shaped and separate from the reward set. See
  `logs/2026-08-02-dev-punch-emojis.md`.

- **2026-08-01 — Design+Dev: Punch Cards (M4/6, PR #98, deployed).** Punching lives
  on a Chores **Today · Punch cards** tab. **M5/5 try bites is unblocked.** See
  `logs/2026-08-01-design-dev-punch-cards.md`.

- **2026-07-31 — Arch: family pseudo-profile exposure (docs only, ADR 060).** The
  network is the boundary; the anonymous dashboard stays. Closes the #92 triage
  flag. See `logs/2026-07-31-arch-family-profile-exposure.md`.

- **2026-07-31 — Fix: the widget counted the offer board as your work (auto-bug
  #94, PR #97).** Gate D6's own-work-only rule now reaches the widget too. See
  `logs/2026-07-31-fix-auto-bug-94.md`.

- **2026-07-30 — Design+Dev: recurring chores + up for grabs (ad-hoc, PRs #90 +
  #91, ADR 058/059).** Routines stamp out real `Task` rows lazily on read; unowned
  chores are claimed first. See `logs/2026-07-30-design-dev-recurring-chores.md`.

- **2026-07-30 — Design+Dev: parent ticket corrections (ad-hoc, PR #89).** A tier-4
  **Tickets** tab carrying `restore` + revoke. **Never live-reviewed.** See
  `logs/2026-07-30-design-dev-parent-ticket-corrections.md`.

- **2026-07-29 — Dev: new calendar event notifies the other parent (ad-hoc, PR #88).**
  `calendar.event.created` → `notify()` at `alert` to tier-4 non-creators. See
  `logs/2026-07-29-dev-calendar-event-created-notification.md`.

- **2026-07-29 — Dev: the household had no photo, and no row to hold one (auto-bug #86,
  PR #87).** Migration backfills the missing `family` profiles row (ADR 021). See
  `logs/2026-07-29-dev-auto-bug-86-household-avatar.md`.

- **2026-07-28 — Dev: the two lists that grow forever (auto-bug #81, #82, PR #85).**
  Shared collapsed `Done · N` on `TaskeeView`; `GET /bug-reports` paginated. See
  `logs/2026-07-28-dev-auto-bug-81-82-unbounded-lists.md`.

- **2026-07-28 — Design+Dev: Recurring daily time-window events (ADR 057, PR #83).**
  A third event shape, compute-on-read. Closes auto-bug #77. See
  `logs/2026-07-28-design-dev-recurring-daily-time-window.md`.

- **2026-07-28 — Infra: Remote access off-LAN (PR #84).** Tailscale subnet route;
  the network enforces "family" (ADR 021), plus PIN lockout + Secure cookies.
  See `logs/2026-07-28-infra-remote-access.md`.

- **2026-07-26 — Design+Dev: XP Derived from P-Bucks (M4/8, ADR 056).** xp = 5 +
  coinReward × 10, server-derived; the XP sink split out to M4/9. See
  `logs/2026-07-26-design-dev-xp-derived-from-pbucks.md`.

- **2026-07-26 — Dev: History Sheet + Ripples ∥ Parent Drawer Words (M4/5c+d).** The
  purse's "Where'd it go?" sheet — no new endpoint needed. See
  `logs/2026-07-26-dev-rewards-history-ripples-parent-words.md`.
- **2026-07-26 — Dev: Ticket Store + Pocket UI (M4/5b).** The kid surface built to
  ADR 055. **Merging the branch is the launch; M4/8 gates the PR.** See
  `logs/2026-07-26-dev-rewards-ticket-store-ui.md`.

- **2026-07-26 — Dev: chores widget's "today" never checked the date (auto-bug
  #73, PR #74).** Scoped to `isToday()` across all six variants; deployed and
  confirmed live. See `logs/2026-07-26-dev-auto-bug-73-chores-widget-today.md`.

- **2026-07-26 — Dev: Ticket Lifecycle (M4/5a).** ADR 055 in the API: buy debits
  and lands `owned`, use is explicit, revoke refunds-and-deletes. See
  `logs/2026-07-26-dev-rewards-ticket-lifecycle.md`.

- **2026-07-26 — Design: Rewards Store Rework (mid-M4/5 review, ADR 055).** A
  redemption is a **ticket**; M4/5 re-cut as M4/5a–d. See
  `logs/2026-07-26-design-rewards-store-rework.md`.

- **2026-07-25 — Dev: chores widget clipped its family list (auto-bug #70, PR #72).**
  Every chores list now measures its slot via a new shared **`useFitRows`**. See
  `logs/2026-07-25-dev-chores-widget-family-overflow.md`.

- **2026-07-25 — Dev: Catalog + Redemption (M4/4, PR #71).** Catalog + redemption
  flow + the module's first frontend, shipped **dormant** until M4/5 flips it. See
  `logs/2026-07-25-dev-rewards-catalog-redemption.md`.

- **2026-07-24 — Ad-hoc: Pritchett Bucks (ADR 054, PR #68).** The currency is
  renamed; four registers from `packages/ui/src/lib/currency.ts`, no migration.
  See `logs/2026-07-24-adhoc-pritchett-bucks.md`.

- **2026-07-24 — Dev: Payout Approval (M4/3b, PR #65).** Per-chore `requiresApproval`
  holds the payout in `pending_payouts` (ADR 048); XP now awarded once per task. See
  `logs/2026-07-24-dev-rewards-payout-approval.md`.

- **2026-07-23 — Dev: Chores Earn + the XP re-strike (M4/3, PR #64).** `coinReward`
  credits the ledger off chore events (ADR 048); XP re-struck per ADR 051. See
  `logs/2026-07-23-dev-chores-earn-xp-restrike.md`.

- **2026-07-22 — Dev: Ledger + Balance (M4/2, PR #63).** Append-only `ledger_entries`
  - a `balances` cache; **overdrafts permitted**, which queued M4/3b. See
    `logs/2026-07-22-dev-rewards-ledger-balance.md`.

- **2026-07-22 — Design: Rewards & Wallet (M4/1).** The economy priced from **~10
  P-Bucks a week**; ADRs 051/052/053. See `logs/2026-07-22-design-rewards-wallet.md`.

- **2026-07-21 — Planning: Rewards & Meals (docs only).** Roadmap renumbered — the
  reward economy pulled forward to **M4**, Meals up to **M5**; ADRs 047–050.
  _[log](logs/2026-07-21-planning-rewards-meals.md)_
- **2026-07-21 — Push toggle stuck off, from auto-bug #53 (PRs #54–#58).** Push had
  never worked in prod; the blind-`catch {}` lesson became a standing convention.
  _[log](logs/2026-07-21-dev-push-toggle-stuck.md)_
- **2026-07-20 — Docker storage onto the SSD (ad-hoc infra, no PR).** Both roots
  moved to `/mnt/data` and verified across a reboot.
  _[log](logs/2026-07-20-infra-ssd-storage-move.md)_
- **2026-07-21 — In-situ bug reporting (PRs #47, #49). ADR 046.** "Report a problem"
  opens an `auto-bug` GitHub issue best-effort and tells the reporter when it ships.
  _[log](logs/2026-07-21-design-dev-bug-reporting.md)_
- **2026-07-21 — Deploy hardening: E3 auto-deploy + faster builds (PRs #45, #46).**
  Merging to `main` now deploys itself; release wall-clock ~15 min → **4m20s**.
  _[log](logs/2026-07-21-infra-deploy-hardening.md)_
- **2026-07-20 — LIVE: Part C go-live + day-picker fix.** Family OS is deployed on
  the Pi at **`https://vireohome.app`**; first prod bug fixed (PR #43).
  _[log](logs/2026-07-20-deploy-golive.md)_
- **2026-07-19 — Containerize (deployment Part B, PR #42).** Two GHCR images the
  Pi pulls (api via `tsx`, web via Caddy); Compose + `ci.yml` + `release.yml`.
  _[log](logs/2026-07-19-dev-containerize.md)_
- **2026-07-19 — Production Serve (deployment Part A).** A2 verified — federated
  plugins render from the flat prod tree, no `base` override.
  _[log](logs/2026-07-19-dev-prod-serve.md)_
- **2026-07-19 — Service Worker Cache Strategy (prod).** `sw.js` network-first for
  navigations + `/api`; build-stamped cache name so every deploy purges the old.
  _[log](logs/2026-07-19-dev-sw-cache-strategy.md)_
- **2026-07-19 — Event Reminders (story 6, PR #41). M3 MVP-complete.** 60s in-process
  poll + a sparse `calendar.reminder_log` ledger. **ADR 045.**
  _[log](logs/2026-07-19-dev-event-reminders.md)_
- **2026-07-12 — Identity Hue Assignment (PR #40).** Member hue is now persisted +
  unique (`resolveHue`). **ADR 044.**
  _[log](logs/2026-07-12-design-dev-identity-hue-assignment.md)_
- **2026-07-12 — Chores Overhaul (PR #39).** Spine carries identity in every state,
  status moved to the row field; chores' first 17 tests. **ADR 043.**
  _[log](logs/2026-07-12-design-dev-chores-overhaul.md)_
- **2026-07-11 — Avatar Images (PR #38).** Uploadable/croppable photos; a photo is a
  face, not a hue (no ring — chrome beside the avatar carries identity); client-side
  crop→WebP, bytes in Postgres. **ADR 042.** _[log](logs/2026-07-11-design-dev-avatar-images.md)_
- **2026-07-11 — Family Fill Re-home / Span Primitive / Type Floor (PR #37).**
  Reserved `family` "Hearth" hue (**ADR 041**); shared `SpanBand`.
  _[log](logs/2026-07-11-design-dev-family-fill-rehome.md)_
- **2026-07-10 — Home Dashboard Elevation Ladder (PR #34).** Three prominence rungs
  (feature/card/quiet) on `WidgetSlot`, one feature per surface re-ranked per profile.
  **ADR 039.** _[log](logs/2026-07-10-design-dev-home-dashboard-elevation-ladder.md)_
- **2026-07-09 — Calendar Recurring Activities (story 5, PR #32).** Activities lens
  (`GET /calendar/activities`), `ActivitiesView` Roster/Seasons, two-tier chrome, new
  `TabBar` primitive. _[log](logs/2026-07-09-dev-recurring-activities.md)_
- **2026-06-24 — Mobile Event Creation (story 4, PR #31).** `AgendaView` mobile read
  surface; `CalendarPage` branches by viewport; full-width drawer sheet; `MobileCanvas`.
  _[log](logs/2026-06-24-dev-calendar-mobile-event-creation.md)_
- **2026-06-23 — Event Create / Edit (story 3, PR #30).** Reused RHF `CreateEventDrawer`;
  multi-owner + Family; weekly repeat + Until; recurring remove this-week/series;
  centralized `FAMILY_PROFILE_ID`. _[log](logs/2026-06-23-dev-calendar-event-create-edit.md)_
- **2026-06-23 — Tablet Month View (story 2, PR #28).** Glanceable month grid,
  split/Family fills, multi-day span bars, `+N more` drill-in; first plugin RTL infra.
  _[log](logs/2026-06-23-dev-calendar-tablet-month-view.md)_
- **2026-06-23 — Event Model + Plugin Scaffold (story 1, PR #27).** `calendar` plugin;
  events/attendees/exceptions; computed-on-read weekly recurrence + per-occurrence skip.
  **ADR 038.** _[log](logs/2026-06-23-dev-calendar-event-model.md)_
- **2026-06-22 — M3 Design: Calendar.** Locked six calendar surfaces; multi-person
  split fill pulled into M3; date picker → react-day-picker (**ADR 037**).
  _[log](logs/2026-06-22-design-calendar.md)_
- **2026-06-21 — M3 Product Planning: Calendar.** Opened M3 against the paper wall
  calendar; 8 dependency-ordered stories; 3 owed ADRs logged.
  _[log](logs/2026-06-21-product-m3.md)_
- **2026-06-20 — Today Widget Rework.** Ran the UI gate `chores.today-summary` skipped;
  hero split, real XP wiring, family-data fix. _[log](logs/2026-06-20-design-dev-today-widget-rework.md)_
- **2026-06-19 — Bug Bash (M2 chores + shell).** Four post-M2 bugs (parent
  self-notify, settings mobile, due-date field); push-toggle deferred to the SW story.
  _[log](logs/2026-06-19-dev-bug-bash-m2-shell.md)_
- **2026-06-19 — XP Award + Parent Notification + Today Widget + rename.**
  `chores.xp_balances`, shared server `notify()`, realtime bell; `chore-engine → chores`.
  _[log](logs/2026-06-19-dev-chores-xp-widget-rename.md)_
- **2026-06-18 — Platform Architecture: Plugin Styling.** First-party plugins styled
  utility-first; shell `@source`-scans plugin src. **ADR 035.**
  _[log](logs/2026-06-18-arch-plugin-styling.md)_
- **2026-06-17 — M2 Completion Flow.** Complete/reopen routes + events; taskee XP
  flight; tier-4 admin check-off. _[log](logs/2026-06-17-dev-chores-completion.md)_
- **2026-06-16 — M2 Task Model + Creation.** `chores` plugin scaffold; tasks table;
  create/list API; admin board / taskee list / family read-only.
  _[log](logs/2026-06-16-dev-chores-task-model.md)_
- **2026-06-15 — M2 Design: Chores.** Full chores UX — Focus/Agency taskee variants,
  admin lanes, XP flight, create drawer. _[log](logs/2026-06-15-design-chores-ux.md)_
- **2026-06-15 — M2 Product Planning.** 5 chores stories; one-shot tasks, running-total
  XP, auto-accept. _[log](logs/2026-06-15-product-m2.md)_
- **2026-06-15 — M1 mobile-brand-top-bar.** Brand top bar (avatar · wordmark · bell).
  **ADR 034.** _[log](logs/2026-06-15-dev-mobile-brand-top-bar.md)_
- **2026-06-14 — M1 mobile-surface (dev).** `BottomTabBar`, sidebar hidden `md:`,
  mobile top bar. _[log](logs/2026-06-14-dev-mobile-surface.md)_
- **2026-06-14 — M1 Design: mobile-surface.** Bottom-tab-bar pattern; `md:` breakpoint.
  **ADR 033.** _[log](logs/2026-06-14-design-mobile-surface.md)_
- **2026-06-13 — M1 Design: widget-slot-states.** Three-state widget language
  (live / not-installed / error); identity-in-widget rule.
  _[log](logs/2026-06-13-design-widget-slot-states.md)_
- **2026-06-13 — M1 Design: shell-chrome-interaction-states.** `--primary` owns
  active; `--accent` locked to module identity. **ADR 031.**
  _[log](logs/2026-06-13-design-shell-chrome-interaction-states.md)_
- **2026-06-09 — M1 settings-permissions.** `/settings` guard to tier 2+; admin
  sections gated inside the page. _[log](logs/2026-06-09-dev-settings-permissions.md)_
- **2026-06-08 — M1 Design: typography-scale.** 11-token major-2nd scale; Lora display
  / DM Sans UI. _[log](logs/2026-06-08-design-typography-scale.md)_
- **2026-06-07 — M1 family-feed-read.** Feed plugin scaffold; posts API + widget + page.
  _[log](logs/2026-06-07-dev-family-feed-read.md)_
- **2026-06-07 — M1 web-push.** VAPID lifecycle, subscriptions, push on alert priority.
  _[log](logs/2026-06-07-dev-web-push.md)_
- **2026-06-06 — M1 pwa-installable.** Manifest, manual SW, icons.
  _[log](logs/2026-06-06-dev-pwa-installable.md)_
- **2026-06-06 — M1 notification-infrastructure.** `useNotify()`, toast + tray,
  notifications table. _[log](logs/2026-06-06-dev-notification-infrastructure.md)_
- **2026-06-06 — M1 accessibility-radix-audit.** `ConfirmDialog` → Radix alert-dialog.
  _[log](logs/2026-06-06-dev-accessibility-radix-audit.md)_
- **2026-06-06 — M1 permission-overrides.** Profile edit drawer; override routes + CASL
  merge; last-admin guard. _[log](logs/2026-06-06-dev-permission-overrides.md)_
- **2026-06-06 — M1 profile-management (+ tests).** Profile CRUD, PIN reset; E2E + API
  tests. _[log](logs/2026-06-06-dev-profile-management.md)_
- **2026-06-06 — M1 family-onboarding (+ tests).** 3-step onboarding; `packages/schemas`
  shared Zod. _[log](logs/2026-06-06-dev-family-onboarding.md)_
- **2026-06-05 — M1 home-surface.** Widget grid live; per-tier seeding; dark mode
  toggle. _[log](logs/2026-06-05-dev-home-surface.md)_
- **2026-06-04 — M1 Product Planning.** 9 platform/feed stories; RHF + Zod settled.
  _[log](logs/2026-06-04-product-m1.md)_
- **2026-06-04 — Notification & States Design.** Toast + tray model, error levels,
  empty-state anatomy, motion tokens. _[log](logs/2026-06-04-design-notifications-states.md)_
- **2026-06-03 — Home Surface Design.** Three-bucket default layouts; reserved core
  slots. **ADR 028.** _[log](logs/2026-06-03-design-home-surface.md)_
- **2026-06-02 — Visual Language Design.** Lora + DM Sans; Terracotta & Teal; warm-clay
  dark mode. _[log](logs/2026-06-02-design-visual-language.md)_
- **2026-06-01 — M0 Implementation.** All six M0 stories; plugin contract exercised
  end-to-end on the tablet.
- **2026-05-30 — Development: event-bus.** Typed `EventBus` + `@fastify/websocket`
  bridge; `useEventBus` hook. _[log](logs/2026-05-30-dev-event-bus.md)_
- **2026-05-30 — Architecture: Testing Strategy.** Vitest + RTL/jsdom, `fastify.inject()`,
  Playwright, Storybook 10. **ADRs 023–026.** _[log](logs/2026-05-30-architecture-testing-strategy.md)_
- **2026-05-29 — Widget Composition Design.** Sidebar nav, React Grid Layout, six sizes,
  manifest shape. **ADR 022.** _[log](logs/2026-05-29-design-widget-composition.md)_
- **2026-05-29 — Login / Profile-Switch UX Design.** Family dashboard default; single
  global PIN; contextual auth. **ADR 021.** _[log](logs/2026-05-29-design-profile-switcher.md)_
- **2026-05-28 — M0 Architecture.** Auth session, CASL, Prisma, plugin generator.
  **ADRs 017–020.** _[log](logs/2026-05-28-architecture-m0.md)_
- **2026-05-25 — M0 Product.** M0 broken into 6 stories; pnpm + Turborepo (**ADR 016**).
  _[log](logs/2026-05-25-product-m0.md)_
- **2026-05-25 — System Design.** shadcn/Tailwind, state layers, permission layer,
  plugin design contract. **ADRs 011–015.** _[log](logs/2026-05-25-design-system.md)_
- **2026-05-24 — Platform Architecture.** TS/React/Fastify, Module Federation, event
  bus, Postgres schemas, PWA. _[log](logs/2026-05-24-architecture-platform.md)_
- **2026-05-23 — Initial Vision.** Vision, core modules, currency + agency models,
  roadmap. **ADRs 001–005.** _[log](logs/2026-05-23-planning-initial.md)_
