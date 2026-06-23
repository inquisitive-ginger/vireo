# Session Queue

> Owned by planning sessions. Updated at the end of every planning
> session. All other session types read but don't modify this file.
>
> Each queued session has a kickoff doc in `docs/sessions/kickoffs/` that
> pre-loads context, constraints, and decisions-to-make. Open the kickoff
> before starting work — don't fill out a template live.

---

## Up Next

> **M3 Design: Calendar landed 2026-06-22** — all six surfaces locked against the
> real design system in a Storybook playground (`Calendar Exploration/…`), captured
> in `docs/modules/calendar/design.md`. **Dev is now unblocked** (start with #1).
> Two scope/decision changes from design: **multi-person events were pulled into
> M3** (split fill; needs an `event_attendees` join — folded into the recurrence
> ADR), and **react-day-picker** was adopted as the shared date picker (ADR 037,
> components already in `@family-os/ui`; #3 retrofits chores). See
> `logs/2026-06-22-design-calendar.md`.

### M3 Dev sessions: Calendar ← next (dependency-ordered; kickoffs written just-in-time)

> Scope per the story specs in `docs/modules/calendar/stories/` **+ the locked UX in
> `docs/modules/calendar/design.md`** and the `Calendar Exploration/` Storybook
> stories (delete those once the real components land). Each is a dev session.
> **Resolve each story's owed ADR first.** Stories 1–7 are M3 MVP; story 8 is the
> deferred north star.

1. **Event Model + Plugin Scaffold** — ✅ **Done 2026-06-23 (PR #27).** `calendar`
   plugin + `events`/`event_attendees`/`event_exceptions` + computed-on-read weekly
   recurrence + per-occurrence skip + CRUD API + events/permissions namespaces.
   Settled **ADR 038** (recurrence storage). See `logs/2026-06-23-dev-calendar-event-model.md`.
2. **Tablet Month View** ← **next.** [stories/tablet-month-view.md](../modules/calendar/stories/tablet-month-view.md). The hero glanceable month grid; color-by-owner; truncation; drill to week/day. Renders the occurrences from `GET /api/calendar/events?from=&to=`. _Depends on #1 ✅ + Design._
3. **Event Create / Edit** — [stories/event-create-edit.md](../modules/calendar/stories/event-create-edit.md). One reused drawer — **multi-select** owner picker (members + Family, required), inline Multiple-days→range, inline All-day, weekly repeat + "(Every Tuesday)", 30m default reminder; **wires the shared react-day-picker `DatePicker`/`DateRangePicker` (ADR 037) and retrofits the chores due-date field onto them**; tier 4. _Depends on #1, #2 + Design._
4. **Mobile Event Creation** — [stories/mobile-event-creation.md](../modules/calendar/stories/mobile-event-creation.md). The create form on the mobile PWA + a mobile read surface. _Depends on #3._
5. **Recurring Activities** — [stories/recurring-activities.md](../modules/calendar/stories/recurring-activities.md). Recurring series surfaced/managed as named Activities (`is_activity`). _Depends on #1, #3._
6. **Event Reminders** — [stories/event-reminders.md](../modules/calendar/stories/event-reminders.md). Time-based reminders via `platform.notify()` + Web Push. **Gated by the reminder-scheduling owed ADR.** _Depends on #1, #3._
7. **Up Next Widget** — [stories/up-next-widget.md](../modules/calendar/stories/up-next-widget.md). `calendar.up-next` (family + mine framings, sizes, empty states); fills the reserved slot. _Depends on #1 (#2 ideal) + Design._
8. **Suggested Events Inbox** — [stories/suggested-events-inbox.md](../modules/calendar/stories/suggested-events-inbox.md). ⬜ **Deferred north star.** Model reserved in #1 (`status`/`source`); email/newsletter parsing build is post-MVP. **Gated by the external-ingest owed ADR.** _Schedule after the MVP is in daily use._

---

## Deferred — Platform v2

Platform/tooling follow-ons that aren't milestone work. The first two were scoped
for M1 but don't map to M1's done-when criteria (kickoff docs exist — review for
staleness before scheduling); the last two were deferred out of the post-M2 "Up
Next" on 2026-06-21 so M3 — Calendar can run uninterrupted.

### Platform: Service Worker Cache Strategy (prod)

**Type:** development (+ possible ADR if the chosen strategy warrants it)
**Kickoff:** _to be written_
**Reads:** `docs/modules/platform/stories/sw-cache-strategy.md`, `apps/shell/public/sw.js`, `apps/shell/src/main.tsx` (dev SW guard shipped 2026-06-19)
**Produces:** non-stale SW caching for the app shell (network-first or build-stamped cache name); installed PWAs update without a manual cache clear; **+ push-toggle verification (was bug #4):** confirm the Settings push toggle reads ON for an enabled subscription in the installed PWA once a SW exists
**Depends on:** none
**Note:** Surfaced during the M2 chores live review (2026-06-19) — cache-first `sw.js` with a static `family-os-v1` cache pinned a stale bundle on an installed PWA, making the realtime notification bell look broken. Dev mitigation already shipped; this is the production fix. **Bug #4 (push toggle stuck OFF in the tunneled PWA) was folded in here** — its root cause is that the dev tunnel runs the dev build, where the SW guard tears the service worker down, so push can't function and the toggle can't read ON; the hook was hardened in the Bug Bash (`getRegistration()` + refocus re-sync) but the user-facing fix needs an SW restored by this story. See `2026-06-19-dev-bug-bash-m2-shell.md`.

---

### Tooling: Retry Design-Sync to claude.ai/design

**Type:** tooling (`/design-sync`)
**Kickoff:** _none — re-invoke the `/design-sync` skill_
**Target:** existing empty claude.ai/design project **"Vireo Design System"** (`projectId 2b03615c-ed0f-44cf-a83c-0a2186f31496`) — reuse it rather than creating a duplicate. Scope was **full sync, all stories** (packages/ui's 21 + apps/shell's 2 + plugins' 7).
**Blocker to resolve first:** the converter's export detection returned **0 exports**, dropping all components as `[TITLE_UNMAPPED]`. Root cause: `@family-os/ui` is a **TS-source package** (`exports['.'] = "./src/index.ts"`, no `dist`/`.d.ts`/`types` field), so the converter's `exportedNames()` → `findTypesRoot()` falls back to a non-existent `packages/ui/index.d.ts`. Fix belongs in sync **config** (e.g. point export detection at `src/index.ts` / source-scan fallback) — do **not** hand-patch generated output. Two secondary issues seen: preview decorator bundle "Could not resolve tailwindcss" (likely needs `cfg.provider`), and verify the Storybook CSS is inlined not remote-`@import`'d.
**Origin:** 2026-06-19 first-sync attempt cancelled mid-run; local scratch (`.ds-sync/`, `ds-bundle/`) cleaned up 2026-06-20. Nothing was uploaded (remote project is empty).

---

### Tooling: Storybook stories → Tailwind utilities

**Type:** tooling / chore
**Kickoff:** _to be written_
**Reads:** `packages/ui/.storybook/preview-styles.css` (the `@source` scan), `docs/decisions/035-*` (utility-first standard), `packages/ui/src/components/color-tokens.stories.tsx` + `typography.stories.tsx` + `elevation.stories.tsx` (the heaviest offenders)
**Produces:** existing stories migrated from hand-rolled inline `style={{}}` layout (grid/flex/spacing/sizing) to **Tailwind utilities**, matching how the app actually runs (ADR 035) and how the calendar exploration is authored. **Keep inline `style` only for genuinely dynamic token values** (e.g. `identityToken()` → `var(--identity-…)`, container-query sizes) per ADR 035 — this is not a blanket "remove all inline styles." Heaviest first: `color-tokens` (23), `form-primitives` (22), `typography` (19), `elevation` (19), `profile-avatar` (18), `motion` (17), `profile-list-item` (13); decorator-level `background`/`padding` wrappers are fine to leave.
**Depends on:** none — unblocked by the 2026-06-22 fix below.
**Origin:** Raised in **M3 Design: Calendar** (2026-06-22). The calendar exploration's `grid-cols-7` silently failed to emit because `preview-styles.css` `@source`-scanned the shell + plugins but **not `packages/ui/src` itself** — ui's own source rode on Tailwind auto-detection, which drops novel single-use utilities when the dev server starts before the file exists. **Fixed now** (added `@source "../src/**/*.{ts,tsx}"`), so utilities in ui stories/components emit reliably; this session capitalizes on that by moving the legacy inline-style stories onto the standard authoring model.

---

### Tooling: Validation audit — align routes to shared Zod schemas

**Type:** tooling / chore
**Kickoff:** _to be written_
**Reads:** `packages/schemas/src/index.ts` (the established pattern), `apps/api/src/plugins/profiles.ts` + `setup.ts` (reference: `Schema.safeParse(body)` → `400 { error: result.error.flatten() }`), `apps/api/src/plugins/calendar.ts` (the aligned example, 2026-06-23).
**Produces:** every API route that hand-rolls request-body validation moved onto a Zod schema in `@family-os/schemas`, matching the profiles/setup/calendar pattern. **Known offender: `chores`** — `POST`/`PATCH /chores/tasks` parse `title`/`assigneeId`/`dueDate`/`xpReward` by hand (the divergence calendar's PR review surfaced). Audit the rest of `apps/api/src/plugins/*` for the same and fold in. Keep DB-existence checks (404s) in the route, separate from the 400 shape check; put any client-reused schemas in the shared package so forms can validate against the same source (the reason the package is shared).
**Depends on:** none.
**Origin:** Raised in PR #27 review (calendar Event Model, 2026-06-23). Zod was introduced for family-feed and standardized in `@family-os/schemas`, but chores hand-rolled its validation; calendar initially mirrored chores, then realigned to Zod before merge. This chore back-fills chores (and any other gaps) so the pattern is uniform.

---

### Tooling: Harden the plugin generator (`turbo gen plugin`)

**Type:** tooling / chore
**Kickoff:** _to be written_
**Reads:** `turbo/generators/config.ts` + `templates/plugin/*`, a data-backed plugin
for the target shape (`plugins/chores`), the standing "new plugin" conventions in `CLAUDE.md`.
**Produces:** a generator that scaffolds a _working_ plugin, not a frontend-only remote.
Gaps found while scaffolding `calendar` (2026-06-23), in priority order:

1. **No data layer.** Template emits no `prisma/schema.prisma`, `prisma.config.ts`, or
   `src/db.ts`, and `package.json` lacks the `"exports": { "./db": … }` subpath, the
   `prisma` block, prisma/pg deps, and `db:generate`/`db:migrate` scripts — so an API
   route's `import { …Prisma } from '@family-os/plugin-x/db'` can't resolve. Add these
   behind a **"needs a database?" prompt**.
2. **Federation `shared` is the wrong shape.** Template uses the array form
   (`shared: ['react', …]`) — needs the **singleton object** form
   (`react: { singleton: true, requiredVersion: '^19.0.0' }`) and is missing
   `react-router-dom`, or React duplicates across remotes (silent runtime break).
3. **`dev` script can't serve a federated remote** (`vite` → no `remoteEntry.js` until
   build); needs the `vite build && concurrently "vite build --watch" "vite preview"` form.
4. **Backend wiring is manual.** Generator only patches `plugins.json`; auto-patch the
   other four registration points (`apps/api/src/server.ts`, the API route file,
   `apps/shell/src/lib/load-plugin.ts`, `federation.d.ts`, shell `ICON_MAP` in `main.tsx`).
   **Depends on:** none. **Origin:** the gap was flagged in M2 (chores scaffold, 2026-06-16/17)
   and re-confirmed scaffolding `calendar` — each data-backed plugin has hand-patched around it.

---

### M1 Design+Dev: Family Profile Notifications

**Type:** design + development
**Kickoff:** [kickoffs/design-family-profile-notifications.md](kickoffs/design-family-profile-notifications.md)
**Reads:** `docs/modules/platform/stories/family-profile-notifications.md`, ADR 029, notification-design-audit log
**Produces:** design decision on surface shape; `FamilyNotificationStrip` component; ADR 029 amended with `audience` field
**Depends on:** notification-infrastructure ✅, family-feed-read ✅

---

### M1 Dev: Push Multi-Profile Device

**Type:** development
**Kickoff:** [kickoffs/dev-push-multi-profile-device.md](kickoffs/dev-push-multi-profile-device.md)
**Reads:** `docs/modules/platform/stories/push-multi-profile-device.md`, web-push session log
**Produces:** schema migration (composite key); updated subscribe/unsubscribe/410 routes; updated tests
**Depends on:** web-push ✅

---

## Deferred — Owed ADRs

> Settled-but-unscoped decisions owed by a future session. No kickoff yet — scope
> when the dependent work is actually picked up.

### Architecture: Member capacity

**Type:** architecture (ADR)
**Raised by:** M2 Design: Chores (2026-06-15)
**Question:** Where does per-member capacity live, and who sets it?
**Gates:** the capacity-aware admin workload meter (chores 1.5 — a post-MVP
enhancement to the existing count + XP-load meter). Blocks none of the M2 MVP stories.
**Reads:** `docs/modules/chores/design.md` §1 (admin lane / workload meter) + "Open / owed"

---

### Architecture: Calendar recurrence storage model ✅ RESOLVED → ADR 038 (2026-06-23)

**Resolved** in the Event Model dev session (2026-06-23): canonical event row +
computed-on-read weekly expansion (no `occurrences` table); per-occurrence skip via
an `event_exceptions` overlay (`kind = 'cancelled'`); attendees via a join (no
`owner_id` column); `is_activity` derived on write. See `docs/decisions/038-recurrence-storage.md`.

---

### Architecture: Time-based reminder scheduling

**Type:** architecture (ADR)
**Raised by:** M3 Product Planning: Calendar (2026-06-21)
**Question:** How does a "remind me N minutes before" fire? The event bus is an
in-process `EventEmitter` with no timer/cron primitive (ADR 008), so the mechanism
(a scheduler tick, a DB-backed due-queue poll, a job table, …) must be chosen —
including durability across server restarts.
**Gates:** **Event Reminders** (#6). Blocks no earlier calendar story.
**Reads:** `docs/modules/calendar/stories/event-reminders.md`, ADR 008 (event bus), ADR 029 (notification routing)

---

### Architecture: External-ingest / suggested-events extension point

**Type:** architecture (ADR)
**Raised by:** M3 Product Planning: Calendar (2026-06-21)
**Question:** What's the contract by which an external source (email/newsletter
parsing first; iCal/Google sync later) lands events as `status: 'suggested'` with
a `source` provenance, for human review/confirm? Keep it source-agnostic, not
email-only.
**Gates:** **Suggested Events Inbox** (#8, the deferred north star). The `status`/
`source` columns ship in #1, but the ingest contract is settled here when #8 is
scheduled.
**Reads:** `docs/modules/calendar/stories/suggested-events-inbox.md`, `docs/modules/calendar/spec.md` (deferred / north star)

---

## Recently Completed

- **2026-06-23 — M3 Dev: Calendar Event Model + Plugin Scaffold (story 1)** ![Type](https://img.shields.io/badge/Type-Development-orange)
  Opened M3 dev. Scaffolded `@family-os/plugin-calendar` (mirroring `chores` — the `turbo gen plugin` generator is known-incomplete, so a **generator-hardening** chore is queued) with the full data backbone: `events` + `event_attendees` + `event_exceptions`, CRUD API, CASL subject `calendar.Event` (view tier 1+, write tier 4), registry keys, and `calendar.event.{created,updated,deleted}` emits. **ADR 038 — recurrence storage:** a recurring event is one canonical row, **expanded computed-on-read** within `GET ?from=&to=` (no `occurrences` table); synthetic occurrence id `{eventId}:{date}`. **Per-occurrence skip pulled into MVP** (the one scope change, at the user's call) via an `event_exceptions` overlay — `DELETE …?occurrence=YYYY-MM-DD` cancels one week (idempotent), bare `DELETE` removes the series; per-occurrence **field edits** stay deferred. **Attendees = join-only** (no `owner_id`): API takes `attendeeIds[]` (0 = Family · 1 = solo · 2+ = shared), payload `ownerId` derived; `is_activity` derived on write. **PR-review course-correction:** validation realigned to the established **shared-Zod** pattern (`EventInputSchema` in `@family-os/schemas`, `safeParse` → `400 flatten()`) — chores' hand-rolled parsing was the outlier, so a **validation audit** chore is queued to back-fill it. 24 calendar tests; full API suite **200** green; typecheck/lint/federation build clean. Migration applied **non-destructively** (shared `public._prisma_migrations` → `migrate diff` + `db execute` + `migrate resolve`, no reset). `/calendar` placeholder + `calendar.up-next` widget **stub** (real surfaces are stories 2 + 7); story 7 owes the `calendar.today → calendar.up-next` home-slot rename. PR #27 merged.
  _See:_ `docs/sessions/logs/2026-06-23-dev-calendar-event-model.md`

- **2026-06-22 — M3 Design: Calendar** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  Locked all six calendar surfaces via an interactive Storybook playground built against the **real design system** (`Calendar Exploration/…`). **Month view (hero):** filled hue pills (highlighter analog), continuous multi-day **span bars** (flush + ←/→), today = filled `--primary` date circle, past = **dim-events**, `+N more` density → day/week drill-in; across-the-room legibility is carried by **colour, not text**. **Multi-person events pulled INTO M3** (was deferred): 2+ owners → **split fill** (gradient/dots compared on the grid and rejected) — needs an `event_attendees` join, folded into the recurrence ADR. **Event drawer:** reshaped so each modifier sits on its field (inline Multiple-days→range, inline All-day, +60m end default, "(Every Tuesday)" inline); **multi-select** owner picker, **required, never defaulted to Family**; **30m default reminder** (the point of retiring Google). **Date picker → ADR 037:** adopted **react-day-picker v10** themed by token — shipped `Calendar`/`Popover`/`DatePicker`/`DateRangePicker` to `@family-os/ui` (chores due-date retrofits). **Activities → a _load lens_:** Activity = a person's standing seasonal commitment (derive, don't categorize); grouped-by-owner roster + per-kid **weekday-load** + family **season timeline** ("what frees up in November?"); first consumer of the owed member-capacity ADR. **`calendar.up-next` widget:** two framings (Family/Mine), three sizes, owner-hue spine (split/neutral), day-grouped agenda, all-clear empty. **Two engineering fixes shipped:** `cn` registers `text-*-token` as font-size in tailwind-merge (size was being dropped beside `text-{color}`); Storybook `preview-styles.css` `@source`-scans `../src`. `design.md` + `design-system.md` + `spec.md` updated. **Dev unblocked** (start #1; resolve owed ADRs first).
  _See:_ `docs/sessions/logs/2026-06-22-design-calendar.md`

- **2026-06-21 — M3 Product Planning: Calendar** ![Type](https://img.shields.io/badge/Type-Planning-orange)
  Opened M3 with a **requirements brainstorm** against the family's real paper wall calendar (photo). Read the analog system: the **recurring activity backbone** (T&T/gymnastics/karate weekly) dwarfs one-offs; **color = person** (= ADR 030); **multi-day spans** (travel/camp arrows) are first-class; tracking woven in (antibiotics-checkmark — left out of MVP). Strategic read: the "separate calendar" being retired (Google) is really a **notification engine** — events are duplicated there "to capture the notification aspect." **8 decisions settled via gates:** glanceable tablet mirror leads (augment, don't replace — main user is a technophobe); **simple weekly recurrence**; **recurring activities first-class**; email/newsletter parsing is the **north star** (model reserved now, build deferred); **month** tablet default w/ week/day drill-in; **one shared calendar, one owner per event + Family tag**; **mobile capture + reminders ship in M3** so Google can actually be retired; **tier-4 creates** (teen propose-flow deferred, mirroring chores). Stood up `docs/modules/calendar/` (spec + progress + **8 dependency-ordered stories**). **3 owed ADRs logged** (recurrence storage, reminder scheduling, external-ingest). Queue updated: **M3 Design: Calendar** next (kickoff tightened), then the 7 MVP dev stories; story 8 deferred. `CLAUDE.md` status updated.
  _See:_ `docs/sessions/logs/2026-06-21-product-m3.md`

- **2026-06-20 — Design + Dev: Today Widget Rework** ![Type](https://img.shields.io/badge/Type-Development-orange)
  Ran the UI design gate the `chores.today-summary` widget skipped when it shipped via the agent team (#22). Restored the deleted exploration as a Storybook playground, gated **"Hero split"** (direction A) for both framings, then integrated and deleted the playground. **`TodaySummaryView` rebuilt:** hero `text-metric` count, filled `+XP` task rows, **daily XP restored** (the §4 element the agent build dropped) beside the lifetime coin. **Real XP wiring:** lifetime now reads the persisted `GET /api/chores/xp` (the container's "no /xp call" comment was stale post-#23). **Shell widget sizing:** the grid sizes rows to fill the viewport (180–400px/row) so an `h=2` slot is ~600–800px — Home rendered `<Widget />` with no `size`, so it fell back to `standard` and scattered; Home now derives `size` from the layout cell (`h≥2 → large`) via a typed `WidgetProps`. **Family data bug fixed:** the standard layout's 2-row cap + "overdue-priority" filter was **hiding every non-overdue member**; all members now render, sorted urgent-first, in fill-height/clip lists. **All-done celebration** added (🎉 + gold earned-XP pill). **Bug fix:** `MemoryRouter` added to the Today Widget stories (they'd thrown `LinkWithRef … basename of null` since the widget shipped without the gate). **Typography aligned:** all-done headings moved off `display-lg` (Lora, reserved for full-size empty states) to `card-title` per `design-system.md`. **Focus widget variant (direction C, "Next up") folded into M2 Dev: Focus Mode** — needs the `focusMode` setting to branch on. typecheck/lint/builds green; 163 API tests pass; live-review signed off.
  _See:_ `docs/sessions/logs/2026-06-20-design-dev-today-widget-rework.md`

- **2026-06-19 — Dev: Bug Bash (M2 chores + shell)** ![Type](https://img.shields.io/badge/Type-Development-orange)
  Four post-M2 bugs. **#5 parent self-notification (logic + tests):** `chores.task.completed` now carries `completedBy`; `handleParentNotification` skips when `completedBy === createdBy` (a parent's own admin check-off). 2 tests added; 163 API tests green. **#3 settings mobile:** `SettingsLayout` padding responsive; `ProfileListItem` name truncates + Edit/Remove go icon-only below `sm` (shared `packages/ui`). **#6 due-date field:** `appearance-none` + `display:none` on the webkit picker/clear/spin pseudo-elements (kills the Chrome calendar button **and** the Android down-chevron) with one overlaid `CalendarDays` icon + `pr-10`; whole-field tap still opens the picker. **#4 push toggle — deferred:** root cause is the dev tunnel running the dev build, where the SW guard tears the service worker down → no subscription + `serviceWorker.ready` hangs → toggle stuck at a disabled OFF. Hardened the hook (`getRegistration()` instead of `.ready`; re-sync on `visibilitychange`/`focus`) but the user-facing fix needs an SW — **folded into the prod SW cache-strategy story.** #3/#5/#6 signed off live (mobile + Android).
  _See:_ `docs/sessions/logs/2026-06-19-dev-bug-bash-m2-shell.md`

- **2026-06-19 — M2 Dev: XP Award + Parent Notification + Today Widget (agent team) + rename** ![Type](https://img.shields.io/badge/Type-Development-orange)
  Ran the last two M2 chores stories in parallel as an agent team, then renamed the plugin. **XP Award (#23):** `chores.xp_balances` + idempotent `chores.task.completed` subscriber + `GET /api/chores/xp` + lifetime gold score plate in the page header. **Parent Notification (#23):** extracted a shared server-side `notify()` helper (persist + prune-to-50 + Web Push gate) — the subscriber had raw-inserted and skipped push; both `POST /notifications` and the chores subscriber now route through it. **Realtime bell:** `notify()` emits `platform.notification.created`; `NotificationBell` subscribes via `useEventBus` (the prior `window` listener was dead — nothing dispatched it). **Today Widget (#22):** `chores.today-summary` (taskee + family framings, sizes, empty states). **Home render fix:** resolve the widget loader by federation remote name via a manifest map (was splitting the widget id; `chores.*` ≠ the remote name). **Rename (#24):** `chore-engine → chores` — remote/package (`@family-os/plugin-chores`) + Postgres schema `chore_engine → chores` (migrations rewritten; dev/test re-migrated). **Ride-alongs:** proxy `changeOrigin` (federated plugins load via Cloudflare tunnel), dev service-worker guard (stale-PWA fix). 161 API tests green. **Queued:** prod SW cache-strategy; Focus Mode.
  _See:_ `docs/sessions/logs/2026-06-19-dev-chores-xp-widget-rename.md`

- **2026-06-18 — Platform Architecture: Plugin Styling** ![Type](https://img.shields.io/badge/Type-Architecture-blue)
  Settled the plugin styling standard (raised in PR #20 review). **ADR 035 — Option 1:** first-party plugins are styled **utility-first like the shell**; the shell's `styles.css` gains `@source "plugins/*/src/**/*.{ts,tsx}"` so plugin utilities emit (they were silently no-op'ing — plugins are JS-only federated remotes rendered against the shell's single stylesheet). This brings the shell to **parity with Storybook**, which already scanned plugins — the source of the "works in a story, breaks in the shell" footgun (the `grid`/`place-items-center` completion-circle bug). **Third-party plugins → deferred Option 2** (per-plugin utilities-only Tailwind build shipped with the remote) when community distribution is scoped — named in ADR 035, not built. **Reconciliation done now** (user opted in; kickoff had scoped it as a fast-follow): migrated chore-engine (9 components) + family-feed (5) from inline `var(--token)` chrome to utilities at exact visual parity — dynamic identity/gold/animation values + `container-type: size` stay inline. `CLAUDE.md` + `design-system.md` updated (the latter's stale never-wired "plugin `@import 'tailwindcss'`" setup replaced). Verified: canary `h-64` emits with the `@source` and not without (negative test); typecheck + lint + both plugin builds green; live review confirmed parity on `/chores` + `/family-feed`. No backend change → API/E2E not rerun. **Owed:** Option 2 ADR (community plugins); keep shell + Storybook `@source` in sync. **Out:** `demo-plugin` (M0 demo, still hardcoded hex).
  _See:_ `docs/sessions/logs/2026-06-18-arch-plugin-styling.md`

- **2026-06-17 — M2 Dev: Completion Flow** ![Type](https://img.shields.io/badge/Type-Development-orange)
  Second chores story shipped. `PATCH /api/chores/tasks/:id/complete` (assignee completes own via row-level `complete` rule — now baseline for all tiers; tier-4 completes any via `manage all`; 404/403/409) emits `chores.task.completed { taskId, assigneeId, xpReward, completedAt }`. `PATCH …/reopen` (tier-4 only; new `reopen` action; 403/409) emits `chores.task.reopened`. **Taskee XP flight** (design §2): `ScorePlate` (gold lifetime plate, grow + count-up), `FlightChip` (portal, ~760ms arc), `TaskeeView` orchestrator (`pending → inFlight → done+banked`, locked order, optimistic + revert, reduced-motion/off-screen → quiet bank). **Admin = Option A** (decided via an interactive Storybook exploration the user reviewed): tier-4 plain per-row check-off completes anyone's task (no flight); a completed row's check is the **tier-4 reopen** (resurfaces on the assignee's list; kids can't self-reverse). Row ownership enforced explicitly (typed `@casl/prisma` can't carry namespaced `subject()`). **Live-review fixes:** completion circle CSS (plugin Tailwind doesn't emit `grid`/`place-items-center` → inlined), admin order-lock (no live resort), faster flight, create-form breathing room + full-width date. **Score plate is local/optimistic** — XP Award owes the persisted balance + claw-back on reopen. E2E added (`chore-engine` preview added to Playwright `webServer`). 149 API tests + chores E2E green. **Queued at user request:** M2 Dev: Focus Mode. **Open:** `turbo gen plugin` bug.
  _See:_ `docs/sessions/logs/2026-06-17-dev-chores-completion.md`

- **2026-06-16 — M2 Dev: Task Model + Creation** ![Type](https://img.shields.io/badge/Type-Development-orange)
  First chores story shipped. `chore-engine` plugin scaffolded (`turbo gen` + extended to the family-feed structure) and registered (port 3012). `chore_engine.tasks` table; `POST /api/chores/tasks` (tier-4 create, validates title/assignee, emits `chores.task.created`) + `GET /api/chores/tasks`. **List scope (settled in live review):** tiers 1–3 see own tasks; tier 4 (admin) **and the family pseudo-profile** see all (explicit tier filter, **not** `accessibleBy` — namespaced subjects don't map). `/chores` view: **tier-4 admin board** (by-assignee lanes, workload meter, per-lane add, right-drawer create) / **tiers 1–3 taskee** status-encoded list (Agency variant; Focus deferred) / **family dashboard** = read-only board. `chores.task.{view,create,complete}` in `PERMISSION_REGISTRY` (`complete` rule deferred to Completion Flow). `check-square` icon; Playground deleted; real `Chores/…` stories. **Live-review fixes:** family-dashboard 500, shell `load-plugin`/federation wiring, profile-switch refetch, "Family" filtered from assignees. **Reusable `EmptyState`** added to `packages/ui` and applied across chores / family-feed / notifications tray. `db:reset --module chore-engine`. Dev session template gained a **live-app review gate** before close-out. 203 tests green. **Open:** `turbo gen plugin` generator bug; admin-completion question carried to Completion Flow.
  _See:_ `docs/sessions/logs/2026-06-16-dev-chores-task-model.md`

- **2026-06-15 — M2 Design: Chores** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  Full chores UX locked across 4 groups via an interactive Storybook playground. **Page layout:** two taskee variants (Focus / Agency, by a per-profile "Focus mode" setting defaulting from tier) + admin grouped-by-assignee lanes with workload meter, scope/hide-completed/pulse-filter controls. **Completion:** the "XP flight" — the gold badge lifts off the chore and arcs to the lifetime score plate (count-up on landing); `pending → inFlight → done+banked` sequencing keeps the points tethered to their chore. **Create/assign:** right drawer, one form for create / per-person prefill / edit+remove (gold reward presets). **Widget:** `chores.today-summary` read-only tap-through (inline-complete = 1.5), standard+large for taskee & family (+ compact taskee), completion surfaced in the family summary. New cross-cutting conventions added to `design-system.md` (gold/XP "treasure" semantic; status-vs-identity colour rule). Dev-facing spec in `docs/modules/chores/design.md`. Playground retained as the visual reference until real components ship. **Owed:** ADR on member capacity (gates 1.5 capacity-aware load meter).
  _See:_ `docs/sessions/logs/2026-06-15-design-chores-ux.md`

- **2026-06-15 — M2 Product Planning** ![Type](https://img.shields.io/badge/Type-Planning-orange)
  5 stories defined across the `chores` module. `docs/modules/chores/` created (spec, progress board, 5 story specs). Open questions resolved: one-shot tasks only (no recurrence), XP as running total (no levels), auto-accept completion (no approval step), one assignee per task (tier 4 assigns). XP Award + Parent Notification combined into one dev session. M2 Design: Chores queued ahead of all dev sessions.
  _See:_ `docs/sessions/logs/2026-06-15-product-m2.md`

- **2026-06-15 — M1 Dev: mobile-brand-top-bar** ![Type](https://img.shields.io/badge/Type-Development-orange)
  Settled the mobile bell/profile placement left open by ADR 033. Built a 4-option UX playground, chose **Option 1 — brand top bar** (avatar · Family OS wordmark · bell), and wired it into `App.tsx` (`grid`, `safe-area-inset-top`; floating bell removed; `ProfileGrid` re-anchored as a top dropdown). `BottomTabBar` is now nav-only (profile slot + props removed). ADR 034 added; ADR 033 superseded clauses annotated. Story gains autodocs + mobile-frame variant; tests updated; playground deleted. typecheck + 30 tests green.
  _See:_ `docs/sessions/logs/2026-06-15-dev-mobile-brand-top-bar.md`

- **2026-06-14 — M1 Dev: mobile-surface** ![Type](https://img.shields.io/badge/Type-Development-orange)
  `BottomTabBar` in `packages/ui` (tier filtering, profile avatar tab, safe-area insets, 10 RTL tests). Sidebar hidden `md:`. Mobile top bar (`flex md:hidden`) with page title + bell. Shell layout restructured (flex column for mobile top bar + main). Bell=Option A (top bar, always visible). Page transitions: no slide, same cross-fade as tablet. `design-system.md` updated. `MobileNav.stories.tsx` deleted; `BottomTabBar` has permanent story in `packages/ui`.
  _See:_ `docs/sessions/logs/2026-06-14-dev-mobile-surface.md`

- **2026-06-14 — M1 Design: mobile-surface** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  Bottom tab bar pattern settled (Frame A over hamburger drawer). `md:` (768px) as canonical tablet/mobile breakpoint. Profile avatar as rightmost tab. Single-column widget stack on mobile. `env(safe-area-inset-bottom)` on tab bar. ADR 033. Open: bell placement + page slide animations deferred to mobile dev session.
  _See:_ `docs/sessions/logs/2026-06-14-design-mobile-surface.md`

- **2026-06-13 — M1 Design: widget-slot-states** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  `WidgetSlot flat` prop strips card chrome for non-content slots. `ErrorCard` component (Level-2 error state). `FeedPostCard variant="widget"` adds identity spine without card chrome; `FeedWidgetView` switched to it. Three-state visual language settled: elevated (live), flat muted (not installed), flat muted + AlertTriangle (error). Identity-in-widget rule documented for all future content widgets. Shell wiring (`flatSlots`) and error boundary hookup are dev follow-ons.
  _See:_ `docs/sessions/logs/2026-06-13-design-widget-slot-states.md`

- **2026-06-13 — M1 Design: shell-chrome-interaction-states** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  Sidebar surface → `--secondary` (bug fix; was `--background`). Active nav → `bg-primary/20 text-primary`. Hover unified → `bg-primary/10`. `--accent` locked to module identity only. All sidebar hairlines removed. ADR 031. Design-system.md updated; color-tokens story reconciled; Sidebar.tsx updated.
  _See:_ `docs/sessions/logs/2026-06-13-design-shell-chrome-interaction-states.md`

- **2026-06-07 — M1 Dev: family-feed-read** ![Type](https://img.shields.io/badge/Type-Development-orange)
  Family Feed plugin scaffold. `family_feed.posts` Prisma schema + `db push`. `GET /api/family-feed/posts` with cursor pagination + platform profile join. `FeedWidget` (CSS container queries, Frame A — dividers). `FeedPage` with load-more. `FeedPostCard`, `FeedEmptyState` in plugin. Unified Storybook glob covers plugin stories. Shell wired: `getLazyWidget`, `Suspense` fallback, `family-feed` in `plugins.json`. 8 API unit tests.
  _See:_ `docs/sessions/logs/2026-06-07-dev-family-feed-read.md`

- **2026-06-07 — M1 Dev: web-push** ![Type](https://img.shields.io/badge/Type-Development-orange)
  VAPID key lifecycle. `push_subscriptions` table. Subscribe/unsubscribe routes. `sendPushToProfile()` hooked into `POST /notifications` for `priority: 'alert'`. Service worker push event handler. `usePushSubscription` hook in `@family-os/platform`. Push Notifications toggle in Settings (tier 3+ via `TierGate`). 12 API unit tests + 5 E2E tests.
  _See:_ `docs/sessions/logs/2026-06-07-dev-web-push.md`

- **2026-06-06 — M1 Dev: pwa-installable** ![Type](https://img.shields.io/badge/Type-Development-orange)
  `manifest.webmanifest` (name, icons, standalone, start*url, theme/background colors). Manual service worker (cache-first for shell assets, network-first for `/api/`, `/events`, `/plugins/`). 192px + 512px PNG icons. SW registration in `main.tsx`. 3 Playwright tests (manifest fields, icons, SW registration). Chose manual SW over `vite-plugin-pwa` to avoid Module Federation build conflicts.
  \_See:* `docs/sessions/logs/2026-06-06-dev-pwa-installable.md`

- **2026-06-06 — M1 Dev: notification-infrastructure** ![Type](https://img.shields.io/badge/Type-Development-orange)
  `useNotify()` hook exported from `@family-os/platform`. Sonner toast (variant timing, max 3 visible). `notifications` DB table with 50-item pruning. Four API routes (POST/GET/GET-unread/POST-read). `Toast`, `BellBadge`, `NotificationItem`, `NotificationTray` in `packages/ui`. Bell integrated in Sidebar (tier 2+). 17 API + 14 UI tests. Storybook stories for all components.
  _See:_ `docs/sessions/logs/2026-06-06-dev-notification-infrastructure.md`

- **2026-06-06 — M1 Dev: accessibility-radix-audit** ![Type](https://img.shields.io/badge/Type-Development-orange)
  `ConfirmDialog` replaced with `@radix-ui/react-alert-dialog` (focus trap, Escape dismiss, scroll lock). Full audit confirmed `Drawer` and `Switch` were already on Radix. `PinInput` documented as Radix-exempt (numeric input mask, no open/closed/expanded state). `BackdropDismiss` story replaced with `EscapeKeyDismiss`.
  _See:_ `docs/sessions/logs/2026-06-06-dev-accessibility-radix-audit.md`

- **2026-06-06 — M1 Dev: permission-overrides** ![Type](https://img.shields.io/badge/Type-Development-orange)
  Drawer-based profile edit (autosave name, role buttons). `GET/POST/DELETE` override routes with CASL baseline merge. `Switch`, `Drawer`, `PermissionToggleItem`, `PermissionToggleList` in `packages/ui`. Last-admin guard (409). Tier change atomically clears overrides. React.memo + pendingKey fix for switch re-render. 79 API unit tests + 8 E2E tests. `dev/reset` now seeds layout config + family profile layout.
  _See:_ `docs/sessions/logs/2026-06-06-dev-permission-overrides.md`

- **2026-06-06 — M1 Dev: profile-management-tests** ![Type](https://img.shields.io/badge/Type-Development-orange)
  Written as part of the profile-management session. 11 E2E tests (route guard, family name, profile CRUD, PIN reset) in `profile-management.spec.ts`; API integration tests covering `GET /auth/pin-exists`, `POST /auth/pin/check`, `PATCH /settings/family-name` in `profiles.test.ts`. All 62 API tests and 11 E2E tests passing.
  _See:_ `docs/sessions/logs/2026-06-06-dev-profile-management.md`

- **2026-06-09 — M1 Dev: settings-permissions** ![Type](https://img.shields.io/badge/Type-Development-orange)
  Lowered `/settings` route guard to tier 2+. Wrapped admin sections (Family, Profiles, Security) with `TierGate min={4}` inside the page. Settings nav item visible for tier 2+. 15 new E2E tests. Fixed 4 pre-existing E2E failures (shell-skeleton settings assertion, demo-plugin profile selector, profile-management partial match + dialog text). Fixed `ProfileAvatar` CSS shorthand/longhand React warning. Fixed E2E test DB: `packages/e2e` now loads `.env.test` (`familyos_test`) via `node --env-file`.
  _See:_ `docs/sessions/logs/2026-06-09-dev-settings-permissions.md`

- **2026-06-08 — M1 Design: typography-scale** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  11-token major 2nd scale (base 16px, ratio 1.125). Lora for `page-title`, `display-lg`, `display-xl`; DM Sans for all other tokens. All tokens defined as `@utility` classes in `styles.css`. `h1–h6` blanket Lora rule removed; 5 components updated to token classes.
  _See:_ `docs/sessions/logs/2026-06-08-design-typography-scale.md`

- **2026-06-06 — M1 Dev: family-onboarding tests** ![Type](https://img.shields.io/badge/Type-Development-orange)
  Setup + auth unit tests (28 passing), onboarding E2E spec, `POST /api/dev/reset` endpoint. Fixed test DB (missing migration + seed) and vitest parallelism race (singleFork). Playwright project dependencies for onboarding-first ordering.
  _See:_ `docs/sessions/logs/2026-06-06-dev-family-onboarding-tests.md`

- **2026-06-06 — M1 Dev: family-onboarding** ![Type](https://img.shields.io/badge/Type-Development-orange)
  3-step onboarding flow (family name + parent, add members, PIN). `packages/schemas` with shared Zod v4 schemas. `ProfileAvatar`, `Input`, `Label`, `Badge`, `ghost-destructive` Button variant in `packages/ui`. `RequireSetup` route guard. `db:reset` script. PIN gate narrowed to tier < 4 → tier 4 only. Husky + lint-staged pre-commit formatting hook.
  _See:_ `docs/sessions/logs/2026-06-06-dev-family-onboarding.md`

- **2026-06-05 — M1 Dev: home-surface** ![Type](https://img.shields.io/badge/Type-Development-orange)
  Widget grid live end-to-end: `WidgetGrid`, `WidgetSlot`, `PlaceholderCard` in `packages/ui`; layout API with per-tier seeding; dark mode toggle in Settings; 18 E2E tests passing.
  _See:_ `docs/sessions/logs/2026-06-05-dev-home-surface.md`

- **2026-06-04 — M1 Product Planning** ![Type](https://img.shields.io/badge/Type-Planning-orange)
  9 stories defined across `platform` and `family-feed` modules. Form library settled: React Hook Form + Zod with `packages/schemas` for shared schemas. Dark mode toggle scoped to all tiers. Queue updated with M1 implementation sessions.
  _See:_ `docs/sessions/logs/2026-06-04-product-m1.md`

- **2026-06-04 — Notification & States Design** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  Notification and alert patterns (toast + tray model, bell badge severity, `platform.notify()` API), error states (three levels), empty states (anatomy + tier-aware copy tone), and motion tokens (duration + easing tokens, M1 prohibition list).
  _See:_ `docs/sessions/logs/2026-06-04-design-notifications-states.md`

- **2026-06-03 — Home Surface Design** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  Three-bucket default layouts (family pseudo-profile, tiers 1–2, tiers 3–4) with Chores/Calendar as the dominant widget per tier. Family Feed, Chores, Calendar reserved in all layouts; uninstalled slots render a muted placeholder card. Family Feed widget spec: `standard`/`large`/`banner`, text-only MVP, compose gated by write permission.
  _See:_ `docs/sessions/logs/2026-06-03-design-home-surface.md`

- **2026-06-02 — Visual Language Design** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  Typography: Lora (display) + DM Sans (UI). Palette: Terracotta & Teal — burnt orange primary, teal accent. Dark mode: warm clay background via `prefers-color-scheme: dark`. Tokens committed to `styles.css`, fonts loaded in `index.html`.
  _See:_ `docs/sessions/logs/2026-06-02-design-visual-language.md`

- **2026-06-01 — M0 Implementation** ![Type](https://img.shields.io/badge/Type-Frontend-orange) ![Type](https://img.shields.io/badge/Type-Backend-red)
  All six M0 stories complete: dev-environment, shell-skeleton, event-bus, auth-and-profiles, plugin-loader, demo-plugin. Full plugin contract exercised end-to-end on the tablet. M0 done definition satisfied.

- **2026-05-30 — Development: event-bus** ![Type](https://img.shields.io/badge/Type-Backend-red)
  Typed `EventBus` (in-process `EventEmitter` + runtime `module.noun.verb` validation). `@fastify/websocket` bridge fans all events to connected browser clients. `useEventBus` hook with exponential-backoff reconnect. `POST /trigger-event` demo + live event log in shell. 17 tests passing.
  _See:_ `docs/sessions/logs/2026-05-30-dev-event-bus.md`

- **2026-05-30 — Architecture: Testing Strategy** ![Type](https://img.shields.io/badge/Type-Architecture-blue)
  Vitest (shares Vite pipeline) + RTL + jsdom for unit/component tests. `fastify.inject()` for route tests. Playwright for E2E (deferred to M1). Storybook 10 in `packages/ui` (ships in M0). Test conventions: colocated files, no coverage thresholds, real PostgreSQL for integration tests, `packages/test-utils` for shared factories. ADRs 023–026. Architecture template amended to require story spec updates as an output.
  _See:_ `docs/sessions/logs/2026-05-30-architecture-testing-strategy.md`

- **2026-05-29 — Widget Composition Design** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  Left sidebar nav (220px, profile chip at top). React Grid Layout, static mode in M1, drag-and-drop M1+. Six named widget sizes (compact → full). Widget manifest shape settled (extends ADR 007/014). Two-level role model: shell filters by minTier + requiredPermission; widget handles internal rendering. Per-user layout stored as {widgetId, x, y, w, h}[]; tier-gated edit rights; parent override. ADR 022.
  _See:_ `docs/sessions/logs/2026-05-29-design-widget-composition.md`

- **2026-05-29 — Login / Profile-Switch UX Design** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  Family dashboard as default unattended state (pseudo-profile, tier 1 read-only). Corner chip + inactivity as entry points to the profile grid. Single global family PIN (not per-profile) — amends ADR 017. Contextual auth pattern: write actions on the family dashboard trigger profile selection inline. ADR 021.
  _See:_ `docs/sessions/logs/2026-05-29-design-profile-switcher.md`

- **2026-05-28 — M0 Architecture** ![Type](https://img.shields.io/badge/Type-Architecture-blue)
  Auth mechanism (`@fastify/session` + `connect-pg-simple`), CASL permission model (replaces flat strings, enables `accessibleBy()` row-level filtering), Prisma ORM, Turborepo plugin generator. ADRs 017–020. Auth-and-profiles story unblocked.
  _See:_ `docs/sessions/logs/2026-05-28-architecture-m0.md`

- **2026-05-25 — M0 Product** ![Type](https://img.shields.io/badge/Type-Product-green)
  M0 broken into 6 stories: dev-environment, shell-skeleton, event-bus,
  auth-and-profiles, plugin-loader, demo-plugin. Monorepo tooling settled:
  pnpm + Turborepo (ADR 016). Bulletin board deferred to M1. Login/profile-switch
  UX flagged as a required design session before auth implementation.
  _See:_ `docs/sessions/logs/2026-05-25-product-m0.md`

- **2026-05-25 — System Design** ![Type](https://img.shields.io/badge/Type-Design-blueviolet)
  Component library (shadcn/ui + Tailwind CSS v4), typography direction
  (two fonts, warmer feel — specific fonts deferred), shell composition
  model (role-aware widget grid, M0 home screen is placeholder), state
  management (Context + Zustand + TanStack Query), permission layer
  (tier baseline + grants/revocations, TierGate + PermissionGate),
  plugin design contract (import-based). ADRs 011–015.
  _See:_ `docs/sessions/logs/2026-05-25-design-system.md`

- **2026-05-24 — Platform Architecture** ![Type](https://img.shields.io/badge/Type-Architecture-blue)
  Tech stack (TS/React/Fastify), Vite Module Federation, EventEmitter + @fastify/websocket
  event bus, PostgreSQL with plugin schemas, PWA mobile strategy. Hardware topology
  established: x86 laptop primary server, Pi(s) as M2+ edge devices, MQTT bridge designed
  as extension point.
  _See:_ `docs/sessions/logs/2026-05-24-architecture-platform.md`

- **2026-05-23 — Initial Vision** ![Type](https://img.shields.io/badge/Type-Planning-orange)
  Established vision, core modules, plugin architecture, currency
  model, agency model, real-time strategy, workspace structure,
  milestone roadmap, and ADRs 001–005.
  _See:_ `docs/sessions/logs/2026-05-23-planning-initial.md`
