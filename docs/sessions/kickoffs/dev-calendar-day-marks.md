# Kickoff — M5/4 · Dev (platform): Calendar Day Marks

**Type:** Development (platform) · **Modules:** `platform` + `calendar` + `meals`
**Branch:** `dev/platform-day-marks` · **Depends on:** M5/2 ✅ (`owner_id`, `kind`)

> The queue lists this as depending on M5/3. **It does not** — the nudge poll and the
> provider contract share no code. Only `planned_meals` as shipped in M5/2 is needed.
>
> One merge-order edge, not a blocker: `isCovered()` is frontend-only today, and M5/3
> is what relocates it somewhere the API can import. If decision 1 lands server-side
> as recommended, **merge after M5/3** (the wave plan already does) or duplicate the
> check and delete the copy on rebase. Build in parallel regardless.

## Pre-session checklist

- [ ] Read `CLAUDE.md`, **ADR 050** (the whole contract), **ADR 066** (the
      visibility gate — settled, not yours to reopen), **ADR 044** (never hue-only),
      `docs/modules/meals/design.md` §M5/4 (the exact render)
- [ ] Read `apps/api/src/plugins/calendar.ts` `GET /calendar/events` (range shape,
      permission check) and `packages/platform/src/server.ts` (what a registry would
      sit beside)
- [ ] Read `plugins/calendar/src/components/MonthGrid.tsx` (cell anatomy, `MAX_CHIPS`,
      past-day dimming), `AgendaView.tsx` (day header), `pages/CalendarPage.tsx`
      (query keys)
- [ ] Read `plugins/meals/src/lib/meals.ts` — `isCovered()` decides which days mark
- [ ] Worktree: copy `.env` in or `turbo dev` dies

## Session scope

_One sentence:_ Build the read-time day-mark provider contract at the platform level
and land `meals` as its first consumer — a disc in the month cell, a label in the
agenda day header — with `plugins/calendar` knowing nothing about meals.

## Acceptance criteria

1. A range query returns at most **one mark per provider per day**; a month cell
   renders at most **two** — capped **after** permission filtering (ADR 066), so a
   caller never loses a mark they can see to one they cannot.
2. `meals` registers a provider; `plugins/calendar` never imports
   `@family-os/plugin-meals` and `meals` never writes `calendar.events`.
3. **Month cell:** 16px identity-**tint** disc carrying the owner's initial
   (`aria-hidden`) + utensils glyph at a 3px gap, glyph ~75% muted so the pair reads
   as one object. Owner's name lives in the cell's accessible text.
4. **Agenda day header:** _"Zach's got dinner"_ — right-aligned, avatar 16px + text,
   attribution only, **never the meal name**.
5. **Unclaimed days make no mark**, and neither do `isCovered()` days — an ownerless
   mark has no who, and the who is the whole payload.
6. Claiming dinner in `meals` refreshes the calendar's marks without a reload.
7. Past days recede with the cell's existing treatment; no photo avatar at 16px.

## Constraints coming in

- **Visibility is settled — ADR 066.** Two gates, conjunctively:
  `calendar.event.view` gates the surface (the range endpoint 403s exactly as
  `GET /calendar/events` does), and each provider's own `(action, subject)` gates
  its own marks. Registration is `{ name, action, subject, fetch }` — the subject is
  **required** (`meals` registers `view meals.PlannedMeal`), no permissive default. The aggregator filters **server-side before
  calling `fetch`**, which settles decision 1 in favour of server-side fan-out; a
  client-side gate is not an option.
- ADR 050 is settled and **small**: no start time, no duration, no overlap, no spans,
  no reminders, no positioning. Anything wanting one of those is an event.
- The second consumer is **M7 School** ("no school Monday"). Design the registration
  shape so School plugs in without editing `plugins/calendar` — that is the whole
  reason this is a platform story.
- Never hue-only (ADR 044): the initial is the required second channel, and the disc
  is judged at `tint` because that is the layer it is painted on.
- Server data via TanStack Query (ADR 013); marks must share a key **prefix** with
  whatever a meals mutation invalidates, or AC6 fails silently.
- **Parallel run:** wave 1 alongside M5/3 and M5/6. You own `plugins/calendar/**` and
  `packages/platform/**`; your only touch in `apps/api/src/plugins/meals.ts` should be
  the provider registration — keep it to one block so the rebase is trivial. You add
  **no meals migration**.

## Decisions to make

1. **The cap tie-break** — which two marks win when a third provider lands. Fix the
   rule now (registration order is the cheap honest answer).
2. **Payload shape** — `{ date, ownerId?, glyph, label }` per ADR 050, plus the
   `action`/`subject` ADR 066 requires at registration; decide whether
   the glyph is an icon name resolved by the shell's `ICON_MAP` or a provider-supplied
   node, and how the initial is derived when `ownerId` is a profile the client
   already has.

## Outputs (required before closing)

- [ ] Live-app review: month grid + agenda on a real week, claimed and unclaimed
- [ ] Tests: provider aggregation + the one-mark/two-mark caps (`fastify.inject()`),
      RTL over the cell and the agenda header
- [ ] `docs/architecture.md` gains the provider contract; `design-system.md` gains the
      mark's render rules if they generalize
- [ ] `pnpm typecheck` + `pnpm test` clean; progress row ✅, session log, `CLAUDE.md`,
      queue, PR; delete this kickoff
