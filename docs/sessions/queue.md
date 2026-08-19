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

> **M4 — Rewards & Wallet is the active milestone** as of the 2026-07-21 planning
> session, followed by **M5 — Meals & Groceries**. The infra items below still come
> first in wall-clock terms where they are cheap (Part F is a real risk to the
> household's data), but the feature work is what the family is waiting on.

> **P-BUCKS IS LIVE (2026-07-26, PR #75).** `dev/rewards-store-wallet` (M4/5a–d +
> M4/8, ADR 055/056) merged with a merge commit — main was merged into the branch
> first (two conflicts: the cherry-picked ec2303e, and both sides adding the same
> `ResizeObserver` stub). Deploy verified on prod: `rewards` in `/api/plugins`, its
> remote served (remotes live at `/plugins/<name>/assets/remoteEntry.js`), and the
> deployed chores chunk carries the M4/8 markup (`chore-pays`, "Scores").

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

- **2026-08-19 — Fix: shared weekly events qualify as activities (auto-bug #114,
  PR #115).** `is_activity` widened to any-attendee weekly (ADR 038 amended,
  rows backfilled); a shared activity fans into each attendee's roster group.
  See `logs/2026-08-19-fix-auto-bug-114.md`.

- **2026-08-17 — Fix: mobile nav overflow + calendar canvas (auto-bug #112 + #111,
  PR #113).** Bottom bar caps at 5 tabs (Home + three pinned + a More sheet;
  ADR 033's trigger fired early); `--container-wide` 1100→1400px. See
  `logs/2026-08-17-fix-auto-bug-111-112.md`.

- **2026-08-13 — Dev: meals iPad tweaks (ad-hoc, PR #106).** Kind-first drawer,
  optional takeout owner, post-dinner past tense, headline down a rung — and a
  `useFitRows` offsetTop bug fixed in the primitive (was also chores'
  flakiness). See `logs/2026-08-13-dev-meals-ipad-tweaks.md`.

- **2026-08-13 — Dev: Week Plan + Tonight's Dinner (M5/2, PR #105).** The meals
  plugin ships: week page, drawer, tonight widget, one-tap claim. P$ dropped
  from meals entirely (paid dinners become chores — M5/3 loses the earn
  wiring). See `logs/2026-08-13-dev-meals-week-plan-tonight.md`.

- **2026-08-11 — Design: Meals & Groceries (M5/1, ADR 063/064).** All 16 gates
  settled over three rounds + an external critique — menu-card grammar, `sides`
  column, localised escalation, grocery mode split retired onto one `ListRow`
  list, hue rule narrowed. Spec: `docs/modules/meals/design.md`. See
  `logs/2026-08-11-design-meals-groceries.md`.

- **2026-08-08 — Design: Companion gear + asset library (M4.5/2).** V1 art
  complete: 20 curated bodies + 15 gear items with per-species × per-stage fit
  data; 4 body-conforming items parked pending renderer extensions. See
  `logs/2026-08-08-design-companion-gear-assets.md`.

- **2026-08-07 — Design: XP Sink direction (was M4/9 → now M4.5 Companion, ADR
  061/062).** XP's sink is a per-kid critter (Whisp/Skitter/Sprout, kid-tested),
  milestone 1-of-3 picks, generated-art pipeline; five sessions queued. See
  `logs/2026-08-07-design-xp-sink-direction.md`.

- **2026-08-06 — Fix: recurring up-for-grabs chores stuck to the last claimer,
  punch-card row squeezed on mobile (auto-bug #102 + #103, PR #104).** A
  claimed-but-uncompleted up-for-grabs occurrence kept its assignee across
  every roll-forward instead of releasing; the Wallets punch-card row's two
  text buttons never yielded space to the title. See
  `logs/2026-08-06-fix-auto-bug-102-103.md`.

- **2026-08-05 — Design+Dev: Parent Bonus Grant (M4/7, PR #101).** Gated to the
  wallet-shelf option: Tickets became **Wallets** (leftmost, landing) — every kid
  seeded with balance + "Give a bonus"; the grant is its ledger entry (`grantId`
  idempotency), reason verbatim to the kid's alert and history row. **Only M4/9
  remains in M4.** See `logs/2026-08-05-design-dev-parent-bonus-grant.md`.

- **2026-08-02 — Dev: punch cards joy rework (PR #100).** The kid's tab rebuilt to
  the gated artifact — glyph stamp wall with slam, always-visible prize rail, gold
  full→won arc + confetti, finished shelf; `lastPunchedAt` with no migration. Punch
  jitter was a stale-cache frame — mutations now write the response card into the
  cache before the pending flag drops. See `logs/2026-08-02-dev-punch-joy.md`.

- **2026-08-02 — Dev: punch-card emoji set (PR #99).** The template drawer was
  picking from the _reward_ set, so a card could only wear its prize — "try bites"
  had no 🥦. `PUNCH_EMOJI_GROUPS` is habit-shaped and separate. See
  `logs/2026-08-02-dev-punch-emojis.md`.

- **2026-08-01 — Design+Dev: Punch Cards (M4/6, PR #98, deployed).** Punching lives
  on a Chores **Today · Punch cards** tab; the parent curates prize options and the
  kid names their pick (Modal ticket picker, mint waits on the pick); take-down ends
  audience eligibility. **M5/5 try bites is unblocked.** See
  `logs/2026-08-01-design-dev-punch-cards.md`.

- **2026-07-31 — Arch: family pseudo-profile exposure (docs only, ADR 060).** The
  app is not on the public internet (`vireohome.app` → `192.168.0.31`, no public
  listener); the network is the boundary, the anonymous dashboard stays as ADR 021
  designed it. Closes the #92 triage flag. See
  `logs/2026-07-31-arch-family-profile-exposure.md`.

- **2026-07-31 — Fix: the widget counted the offer board as your work (auto-bug
  #94, PR #97).** Gate D6's own-work-only rule reached the page and not the
  `chores.today-summary` widget; unclaimed work also grouped as a **member row**
  in the family framing and is a header chip now. See
  `logs/2026-07-31-fix-auto-bug-94.md`.

- **2026-07-30 — Design+Dev: recurring chores + up for grabs (ad-hoc, PRs #90 +
  #91, ADR 058/059).** Routines stamp out real `Task` rows lazily on read
  (client-local `?today=`; ongoing = back tomorrow; missed days roll); unowned
  chores are claimed before completion and live on the kid's surface as a sunken
  offer board, own-work-only meter. See
  `logs/2026-07-30-design-dev-recurring-chores.md`.

- **2026-07-30 — Design+Dev: parent ticket corrections (ad-hoc, PR #89).** A tier-4
  **Tickets** tab — the module's first parent-facing ticket surface — carrying
  `restore` ("put it back", no ledger movement) and M4/5a's revoke, which had shipped
  buttonless. `Disclosure`/`RevealMore` extracted to `@family-os/ui` at the third
  caller. **Never live-reviewed.** See
  `logs/2026-07-30-design-dev-parent-ticket-corrections.md`.

- **2026-07-29 — Dev: new calendar event notifies the other parent (ad-hoc, PR #88).**
  `calendar.event.created` subscriber → `notify()` at `alert` (Web Push, ADR 029) to
  every tier-4 profile except the creator; recurring series notify once at creation.
  See `logs/2026-07-29-dev-calendar-event-created-notification.md`.

- **2026-07-29 — Dev: the household had no photo, and no row to hold one (auto-bug #86,
  PR #87).** Two defects: `AvatarField` had been household-aware and unreachable since
  ADR 042, and prod had no `family` profiles row at all because only the seed scripts
  ever wrote the one ADR 021 calls permanently seeded — so the upload 404'd before the
  tier guard ran. Migration backfills it; the affordance sits in the tier-4 Family
  section. **Retires the "household has no row in prod" backlog item — ADR 021 had
  already decided it.** See `logs/2026-07-29-dev-auto-bug-86-household-avatar.md`.

- **2026-07-28 — Dev: the two lists that grow forever (auto-bug #81, #82, PR #85).**
  Agency `TaskeeView` (tier 3) was the one chores framing with no completed-chore
  treatment — now a shared collapsed `Done · N` with a count clamp, and the progress
  meter counts today (the #73 defect on the page, not the widget). `GET /bug-reports`
  gained `status`/`limit`/`cursor`, retiring a `take: 100` that dropped the oldest
  silently. See `logs/2026-07-28-dev-auto-bug-81-82-unbounded-lists.md`.

- **2026-07-28 — Design+Dev: Recurring daily time-window events (ADR 057, PR #83).**
  "M–F 9:30–3:30, Aug 3–21" is a third event shape — `recurrence: 'daily'` + a
  weekday-offset set, compute-on-read from one shared expansion module; month bars,
  stated-once band + today-hero, gate-4 band/grammar rework. Closes auto-bug #77.
  See `logs/2026-07-28-design-dev-recurring-daily-time-window.md`.

- **2026-07-28 — Infra: Remote access off-LAN (PR #84).** Tailscale subnet route
  advertising `192.168.0.31/32`; origin, cert and PWA install unchanged, fridge iPad
  runs no client. The app has no boundary auth to enforce "family" with (ADR 021), so
  the network does — plus a PIN lockout, `trustProxy: 1`, and Secure cookies.
  See `logs/2026-07-28-infra-remote-access.md`.

- **2026-07-26 — Design+Dev: XP Derived from P-Bucks (M4/8, ADR 056).** One value at
  assignment: xp = 5 + coinReward × 10, XP picker gone, server derives and ignores the
  client; Pays/Cost align on a shared `CoinAmountField` (typed amount · taught presets).
  **The `dev/rewards-store-wallet` PR is unblocked.** The XP sink split out to M4/9.
  See `logs/2026-07-26-design-dev-xp-derived-from-pbucks.md`.

- **2026-07-26 — Dev: History Sheet + Ripples ∥ Parent Drawer Words (M4/5c+d).** The
  purse's "Where'd it go?" sheet (no new endpoint — `/rewards/wallet` already was the
  ledger), widget ticket-ready line, family-profile chooser, tier-3 wallet layout,
  drawer description field + tear-grammar hint. See
  `logs/2026-07-26-dev-rewards-history-ripples-parent-words.md`.
- **2026-07-26 — Dev: Ticket Store + Pocket UI (M4/5b).** The kid surface built to
  ADR 055: TabBar tabs, die-cut tickets, the roll at fridge width, the tear, the stub
  shelf — plus the queue's use-tense pulled forward from M4/5d (a decline button still
  promised the deleted refund). **Carries the prod flip: merging the branch is the
  launch, M4/8 gates the PR.** See `logs/2026-07-26-dev-rewards-ticket-store-ui.md`.

- **2026-07-26 — Dev: chores widget's "today" never checked the date (auto-bug
  #73, PR #74).** `todayCompleted`/daily-XP filtered on `status === 'completed'`
  alone, no `completedAt` check — with no archive, completions from any day ever
  kept accumulating as "today," forever. Scoped to `isToday()` across all six
  size×framing variants (fixing the numerator alone would have broken the family
  framings' `total - done` pending math). Deployed and confirmed live; **report
  #73 still needs a tier-4 parent to move it to `deployed`** on the triage board
  (no CLI path exists). See `logs/2026-07-26-dev-auto-bug-73-chores-widget-today.md`.

- **2026-07-26 — Dev: Ticket Lifecycle (M4/5a).** ADR 055 in the API: buy always
  debits and lands `owned`, use is explicit (`POST :id/use`), not-now keeps the ticket,
  tier-4 `DELETE` revoke refunds-and-deletes. Migration **stacked, not edited** — the
  M4/4 one is merged and applied in prod, contrary to the kickoff. See
  `logs/2026-07-26-dev-rewards-ticket-lifecycle.md`.

- **2026-07-26 — Design: Rewards Store Rework (mid-M4/5 review, ADR 055).** Live-drove
  the in-flight store and reworked it around one idea: a redemption is a **ticket** —
  buy debits once, owning is a state, the ask moves to use-time, "not now" keeps the
  ticket. M4/5 re-cut as M4/5a–d. See `logs/2026-07-26-design-rewards-store-rework.md`.

- **2026-07-25 — Dev: chores widget clipped its family list (auto-bug #70, PR #72).** The
  family framing had 185px of list room in a 363px slot and sliced the fourth member. The
  aggregate above it drops to one line (~46px back, a whole tile), and every chores list
  now measures its slot via a new shared **`useFitRows`** — whole rows plus `+N more`,
  never a mid-tile crop. Extracted from calendar's `DayList`, which had solved it first.
  **Deployed and confirmed live; report moved to `deployed`, closing ADR 046's loop.**
  See `logs/2026-07-25-dev-chores-widget-family-overflow.md`.

- **2026-07-25 — Dev: Catalog + Redemption (M4/4, PR #71).** Reward catalog (tier-4 CRUD,
  retire-not-delete) + redemption flow (debit on request, refund on decline, cost
  snapshotted) + the module's first frontend: a **by-kid approvals queue** deciding chore
  payouts + redemptions via one shared `CoinDecisionTray`, and a Faces-&-seal catalog with
  a **"?" seal** for approval and a **grounded, scoped `EmojiPicker`**. Frontend ships
  **dormant** — not registered in `plugins.json`/`load-plugin.ts` until M4/5 flips it. See
  `logs/2026-07-25-dev-rewards-catalog-redemption.md`.

- **2026-07-24 — Ad-hoc: Pritchett Bucks (ADR 054, PR #68).** The currency is renamed and
  the coin bears a struck **P-mark**; four registers (mark · `P$` · `P-Bucks` ·
  `Pritchett Bucks`), one per medium, from `packages/ui/src/lib/currency.ts`. Free to do
  because nothing had shipped visibly and the schema was already currency-agnostic — no
  migration. Also fixed an M4/3b gap: the chores widget showed **held** and **declined**
  payouts as banked. See `logs/2026-07-24-adhoc-pritchett-bucks.md`.

- **2026-07-24 — Dev: Payout Approval (M4/3b, PR #65).** Per-chore `requiresApproval`
  holds the P-Bucks payout in `pending_payouts` (rewards stays plugin-agnostic, ADR 048);
  approve releases the normal entry with the same provenance pair, decline writes
  nothing. Reopen-before-decision **voids**, reopen-after-payout **debits** (clawback
  confirmed with the resulting balance), delete voids a held payout. **Review-driven:**
  XP now awarded **once per task** (`xp_awarded` — reopen/complete no longer farms XP;
  P-Bucks nets correctly), a **Redo** state for reopened tasks, and a "chip = reward" meta
  rework (only P-Bucks is a chip; shared `TaskMeta` unifies Focus + Agency). Editing a
  completed chore is locked — reopen is the way back. Behind `REWARDS_UI_ENABLED`.
  See `logs/2026-07-24-dev-rewards-payout-approval.md`.

- **2026-07-23 — Dev: Chores Earn + the XP re-strike (M4/3, PR #64).** `coinReward` on the
  task credits/debits the ledger off chore events (ADR 048), keyed by the completion
  **instance** `taskId@completedAt` so reopen→re-complete re-earns. XP re-struck to a quiet
  star, P-Bucks takes the brass coin (ADR 051, shared `Coin`/`CoinValue`). **P-Bucks surfaces behind
  `REWARDS_UI_ENABLED` — off in prod until M4/5.** P-Bucks tiers landed as `1/2/5/10` (minor ADR 052
  deviation). See `logs/2026-07-23-dev-chores-earn-xp-restrike.md`.

- **2026-07-22 — Dev: Ledger + Balance (M4/2, PR #63).** Append-only `ledger_entries` +
  a `balances` cache behind `GET /rewards/wallet`; the ledger service every later story
  calls. **Overdrafts are permitted** — a symmetric reversal is legitimate and
  affordability belongs at the spend site, which is what queued **M4/3b**.
  See `logs/2026-07-22-dev-rewards-ledger-balance.md`.

- **2026-07-22 — Design: Rewards & Wallet (M4/1).** Pricing settled first: **~10 P-Bucks a
  week**, chores opt **in** to paying (`coinReward` default 0), small reward 10 · big 40,
  catalog seeded. Three ADRs — **051** the coin belongs to the currency that buys things
  (P-Bucks takes gold and the disc; **XP demotes to a quiet star**) · **052** the economy is
  priced from a weekly earn rate · **053** a balance belongs to a person (no household
  pot; **tier 1 holds a wallet**, amending the tier table). Store/wallet/punch renders are
  **provisional build targets**, revisable without an ADR.
  See `logs/2026-07-22-design-rewards-wallet.md`.

- **2026-07-21 — Planning: Rewards & Meals (docs only).** Roadmap renumbered — the old
  M6 Finance **split**, with the reward economy pulled forward to **M4** and
  allowance/cashout/Monarch left in **M8**; Meals moved up to **M5** and grew groceries.
  Four ADRs: **047** append-only P-Bucks ledger · **048** earning is contributed over the bus,
  not owned by chores · **049** punch cards are a rewards primitive (try bites are one
  instance) · **050** a day mark is a property of a day, not an event — dinner has no time
  a family can honour to ±30 min. **ADR 002/005 already settled the currency**, so no new
  currency decision was made. _[log](logs/2026-07-21-planning-rewards-meals.md)_
- **2026-07-21 — Push toggle stuck off, from auto-bug #53 (PRs #54–#58).** **Push had
  never worked in prod**: a dismissed permission prompt read as a denial, and the
  service worker was never registered (a `load` listener added after `load` fires never
  runs). Alerts now send `urgency: 'high'` — Doze was batching them ~4 min late.
  **The lesson is the blind `catch {}`**: four bugs hid behind swallowed errors, costing
  three round trips through a human with a phone; the fix that broke it open (#55) fixed
  nothing and only made the failure speak. Now a standing convention.
  _[log](logs/2026-07-21-dev-push-toggle-stuck.md)_
- **2026-07-20 — Docker storage onto the SSD (ad-hoc infra, no PR).** Both roots
  moved to `/mnt/data` and verified across a reboot — **`data-root` alone would have
  moved 48 MB**: Docker 29 uses the containerd image store, so the 2.8 GB of layers
  live under `containerd`'s own `root`. `RequiresMountsFor` drop-ins stop a missing
  SSD from silently handing Postgres an empty data dir.
  _[log](logs/2026-07-20-infra-ssd-storage-move.md)_
- **2026-07-21 — In-situ bug reporting (PRs #47, #49). ADR 046.** "Report a problem"
  in the tray footer captures route/build/viewport/errors, opens an `auto-bug` GitHub
  issue best-effort, and tells the reporter when it ships. **Live check on prod caught
  a 500**: no `profiles` row exists for the household pseudo-profile — the default
  profile — so the `reporterId` FK made the likeliest report in the house fail.
  _[log](logs/2026-07-21-design-dev-bug-reporting.md)_
- **2026-07-21 — Deploy hardening: E3 auto-deploy + faster builds (PRs #45, #46).**
  Merging to `main` now deploys itself (`release` → `deploy` on a self-hosted runner
  on the Pi); release wall-clock ~15 min → **4m20s** (web builds native via
  `$BUILDPLATFORM` + cross-compiled Caddy; buildx GHA cache). Splitting the api
  install into `pnpm fetch` + `--offline` **took the API down in prod** — reverted;
  rollback via `TAG` worked. _[log](logs/2026-07-21-infra-deploy-hardening.md)_
- **2026-07-20 — LIVE: Part C go-live + day-picker fix.** Family OS is deployed on
  the Pi 3B at **`https://vireohome.app`** (Docker Compose, GHCR images, Cloudflare
  DNS-01 Let's Encrypt cert, PWA installed on the fridge iPad). Fixed the first prod
  bug — the calendar date-picker rendered unstyled because `react-day-picker`'s CSS
  was JS-imported inside `@family-os/ui` and orphaned in the federated build (PR #43);
  moved it to `ui/styles.css`. _[log](logs/2026-07-20-deploy-golive.md)_
- **2026-07-19 — Containerize (deployment Part B, PR #42).** Two GHCR images the
  Pi pulls: **api runs via `tsx`** (imports workspace TS at runtime; driver-adapter
  Prisma clients are arch-independent) with an entrypoint that `migrate deploy`s all
  four schemas; **web** = shell/plugins served flat by Caddy (Cloudflare DNS-01).
  Compose + `ci.yml` (E1, green) + `release.yml` (E2, arm64→GHCR). Fixed two clean-
  checkout bugs: pnpm `allowBuilds` placeholder + platform's uncommitted Prisma
  client. _[log](logs/2026-07-19-dev-containerize.md)_
- **2026-07-19 — Production Serve (deployment Part A).** A2 verified in a real
  browser — federated plugins render under `/plugins/<name>/` from the flat prod
  tree, no `base` override (relative via `import.meta.url`); `db:deploy` added to
  all four Prisma packages; `family-feed`'s missing init migration baselined. Part
  B (containerize) + E1 CI is next. _[log](logs/2026-07-19-dev-prod-serve.md)_
- **2026-07-19 — Service Worker Cache Strategy (prod).** First deployment-critical
  story. `sw.js` → network-first for navigations + `/api`·`/events`·`/plugins/*`,
  cache-first for hashed assets; a Vite build-stamp plugin bakes the entry hash into
  the cache name so every shell deploy reinstalls the SW and purges the old cache.
  Installed PWAs now update without a manual clear. _[log](logs/2026-07-19-dev-sw-cache-strategy.md)_
- **2026-07-19 — Event Reminders (story 6, PR #41). M3 MVP-complete.** 60s in-process
  poll computing due reminders on read + a sparse `calendar.reminder_log` ledger (dual of
  `event_exceptions`, so ADR 038 holds); `notify()` at `alert`, audience = attendees +
  tier-4 parents / everyone for Family; edit re-arms on time/lead change. **ADR 045.**
  Native push still blocked by the deferred SW story. _[log](logs/2026-07-19-dev-event-reminders.md)_
- **2026-07-12 — Identity Hue Assignment (PR #40).** Member hue is now persisted +
  unique (`Profile.identityHue`, `resolveHue`), palette grew to eight, the tint layer
  was rebuilt, and the calendar chip gained an owner-initial second channel for
  colour-blindness. **ADR 044.** _[log](logs/2026-07-12-design-dev-identity-hue-assignment.md)_
- **2026-07-12 — Chores Overhaul (PR #39).** Spine carries identity in every state,
  status moved to the row field; extracted `ItemCard onActivate` / `RowActions` /
  `MemberGroupHeader` and `PageContainer` (4 roles); chores' first 17 tests. **ADR 043.**
  _[log](logs/2026-07-12-design-dev-chores-overhaul.md)_
- **2026-07-11 — Avatar Images (PR #38).** Uploadable/croppable photos; a photo is a
  face, not a hue (no ring — chrome beside the avatar carries identity); client-side
  crop→WebP, bytes in Postgres. **ADR 042.** _[log](logs/2026-07-11-design-dev-avatar-images.md)_
- **2026-07-11 — Family Fill Re-home / Span Primitive / Type Floor (PR #37).**
  Reserved `family` "Hearth" hue (**ADR 041**); shared `SpanBand` (groove/panel); type
  floor rescoped by viewing distance; home-layout composition centralized and
  served-not-persisted. _[log](logs/2026-07-11-design-dev-family-fill-rehome.md)_
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
