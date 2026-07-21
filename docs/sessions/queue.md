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

### Deployment: Part F — offsite backups (most important)

**Type:** infra · **Kickoff:** _to be written_
The app is **live** and the whole household now lives in one Postgres volume on
the Pi with **no backup**. Nightly `docker compose exec -T postgres pg_dump` →
compressed → **off the Pi** (offsite bucket / second disk), on a systemd timer or
cron; test a restore once. _Reads: `docs/deployment.md` Part F._ _Depends on:
none (live)._

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

### Bug reporting: live UI review + the follow-ups it left

**Type:** qa / dev · **Kickoff:** _to be written_
ADR 046 shipped and is verified end-to-end **on the API**, but the **UI has never
been seen by a human** — the drawer, the tier-4 triage board, and the "Fixed —
live" notification are integration-tested only. File one from the fridge iPad and
review it. Two loose threads to close while there: **(1)** the bridge PAT was
pasted into a chat transcript and should be **rotated**; **(2)** `prisma generate`
locally emits a **minified** `runtime/*` where the committed client is
pretty-printed, so ~19k lines of churn must be stripped by hand on every
regenerate — reconcile the two before it gets committed by accident. _Reads:
`logs/2026-07-21-design-dev-bug-reporting.md`, ADR 046._ _Depends on: none._

> The "`sw.js` has no cache name" worry raised at closeout was a **false alarm** —
> the grep searched for a literal `family-os-<hash>` but the worker builds it as a
> template literal. Verified live: `VERSION = 'DtOQCrRD'` matches the deployed
> bundle, and the worker calls `skipWaiting()` + `clients.claim()`, so an installed
> PWA picks up a deploy on one fresh navigation.

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
- **The household pseudo-profile has no `profiles` row in prod** — it works because
  auth synthesizes one, but it means any FK or join to the _default_ profile fails in
  production and passes in dev. Bug reporting hit this (#49). Decide whether the
  household should be a real row everywhere or stay synthetic everywhere; today it is
  environment-dependent, which is the worst of both. _Reads:
  `logs/2026-07-21-design-dev-bug-reporting.md`._
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
  (`safeParse` → 400 flatten). **Known offender: `chores`** (`POST`/`PATCH
/chores/tasks`). _Reads: `packages/schemas/src/index.ts`, `apps/api/src/plugins/calendar.ts`
  as the aligned example._
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
