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

### M3 Dev: Event Reminders (story 6) — last MVP story

**Type:** development · **Kickoff:** _to be written_ ·
[story](../modules/calendar/stories/event-reminders.md)
Time-based reminders via `platform.notify()` + Web Push — the rung that lets the
family retire Google. **Resolve the reminder-scheduling ADR first** (Owed ADRs
below): the event bus is an in-process `EventEmitter` with no timer/cron, so the
firing mechanism + restart durability must be chosen. _Depends on stories #1, #3._
Shipping this makes M3 MVP-complete (only story left standing).

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

- **Service Worker cache strategy (prod)** — non-stale SW caching for the shell
  (network-first or build-stamped cache name) so installed PWAs update without a
  manual clear. Folds in the push-toggle-stuck-OFF bug (#4): the dev tunnel runs the
  dev build where the SW guard tears the worker down, so the toggle can't read ON
  until a real SW exists. _Reads: `docs/modules/platform/stories/sw-cache-strategy.md`,
  `apps/shell/public/sw.js`; origin `logs/2026-06-19-dev-bug-bash-m2-shell.md`._
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
  \_Reads: `turbo/generators/config.ts` + `templates/plugin/*`.*
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
