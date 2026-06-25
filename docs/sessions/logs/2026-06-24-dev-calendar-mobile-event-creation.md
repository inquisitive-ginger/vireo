# M3 Dev: Calendar — Mobile Event Creation (story 4)

**Date:** 2026-06-24 · **Type:** development · **Module:** calendar · **PR:** #31 (merged)

## What was built

The mobile PWA surface for the calendar (story 4) — capture-once: an event added
on a phone shows on the wall tablet in realtime (shared `['calendar/events']`).

- **`AgendaView`** (calendar plugin) — the mobile read surface: forward-looking,
  day-grouped agenda led by an **"Up next" hero** (owner-colour wash), then
  full-width **`AgendaRow`** `ItemCard`s with a **leading time column**. Warm
  Today / Later today / Tomorrow / weekday headers; empty + read-only states.
  Hero + rows are tap-to-edit for tier 4.
- **`CalendarPage`** branches by viewport (`useIsTabletUp`, `md:`/768px): **agenda
  below `md:`**, the existing **month/week/day at `md:`+** — each with its own
  query range (`agendaRange` forward window vs `rangeFor`), so **one query per
  device**. Tier-4 **Add** CTA in the mobile header opens the reused
  `CreateEventDrawer`.
- **`Drawer`** (shared `@family-os/ui`) → **full-width sheet below `md:`** (440px
  rail returns at `md:`+) + safe-area top; `CreateEventDrawer` footer gets
  safe-area bottom. The chores drawer inherits the mobile full-width too.
- **`MobileCanvas`** (`apps/shell`) — reusable Storybook canvas composing the
  **real** `MobileBrandTopBar` + nav-only `BottomTabBar` at a phone viewport, so
  any surface can be previewed as it lives on a device.
- Deleted the leftover **story-3 event-drawer UX exploration** (missed at #3's
  close-out).

## Acceptance criteria status

1. ✅ Mobile Add → full-width sheet, pickers work, persists
2. ✅ Mobile-created event shows on the tablet in realtime (shared invalidation)
3. ✅ Tier-4 gating on the mobile entry point + same Zod validation
4. ✅ Agenda read surface (hero + day-grouped rows)
5. ✅ ≥44px targets, safe-area insets, no horizontal overflow
6. ✅ Tests — AgendaView (hero/grouping/empty/tap-to-edit/Family); CalendarPage
   mobile branch (agenda renders, tier gating, drawer opens, agenda range)

## Decisions made

- **UX frame: "Up Next hero"** (gated via a phone-frame playground). A tinted
  owner-colour hero for the next event + day-grouped full-width `ItemCard` rows —
  reads as "a family's day in motion," not a stack of receipts. (Day-Thread rail
  variant rejected once rows had to reuse `ItemCard`.)
- **Agenda rows reuse the shared `ItemCard`** full-width; the **leading
  time-column** layout is the only new arrangement (built inline on `ItemCard`,
  not a fork).
- **Surface chosen by JS viewport branch**, not CSS show/hide — avoids a double
  query and lets each device fetch the right range.
- **Typography:** one Lora moment per route (the page title); hero title is DM
  Sans `text-heading`; micro-labels on `text-section-label`.

## Scope additions (folded in)

- **Tap-to-edit on the mobile agenda** (hero + rows, tier 4) — reuses the drawer's
  edit mode; cheap and consistent with the tablet agenda.
- **`MobileCanvas`** reusable Storybook device canvas (requested) — composes the
  real shell chrome at a phone viewport.
- **Shared `Drawer` full-width on mobile** — benefits chores' drawer too.

## New stories created

None.

## Open questions raised

None.

## What the next session needs to know

- **Story 4 done.** Next M3 dev is **story 5 — Recurring Activities** (named
  Activities load-lens; depends on #1, #3) or **story 6 — Event Reminders** (gated
  by the still-owed **reminder-scheduling ADR**). Story 7 (Up Next Widget) is also
  open; its exploration (`calendar-up-next`) is still in `packages/ui/src/explorations`.
- **`AgendaWhenLabel` / `agendaRange` / `upcomingByDay` / `pickNextUp`** live in
  `lib/grid.ts`; `useIsTabletUp` in `lib/use-is-tablet.ts`.
- **ADR 037** (shared themed `DatePicker` + native time input) supersedes the
  story's "native date pickers" wording — the #3 form was reused, not forked.
