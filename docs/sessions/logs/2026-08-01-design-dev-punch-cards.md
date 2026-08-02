# 2026-08-01 — Design+Dev: Punch Cards (M4/6, PR #98)

**Type:** design + development (one session, two full design passes) · **Output:**
PR #98, the design artifact, `@family-os/ui` ticket + punch-card extraction

## What this was

M4/6 built end to end — then sent back mid-review and **reworked around two product
reversals**: the punch surface moved out of rewards onto the chores page, and the
fixed prize became a parent-curated option set the kid chooses from. Eight review
rounds against the live dev app; every round's finding is recorded below because
four of them were real bugs the tests had not caught.

**Design artifact (hi-fi, token-accurate — the ticket-rework treatment):**
https://claude.ai/code/artifact/493910d0-4002-42fa-b88f-939aa65ba708

## What was decided (all gated)

- **Punching lives on the chores surface** — a second kid-view tab, **Today ·
  Punch cards** (shared TabBar; no badge; Focus view untouched; parents keep the
  untabbed board). Earn beside the doing; earned tickets, stubs, and finished-card
  chips stay in rewards My stuff. ADR 049's data ownership is unchanged — chores
  reads `/api/rewards/punch-cards` over HTTP (the wallet-XP-footnote precedent) and
  the card render lives in `@family-os/ui` (the Coin precedent).
- **The parent curates options; the kid names their prize** — `payout_option_ids`
  on the template (or a fixed coins amount; kinds never mix). Picked **at the
  start, changeable anytime**; the finish line carries the pick, an unpicked card
  wears the **wrapped gift**. The **mint waits on the pick**: a picked card mints at
  completion, an unpicked one completes UNCLAIMED and claims through the picker.
  All-options-retired claims coins at the priciest option's cost. Zero-cost
  tickets read **"Earned"**, never "Bought"; out-of-stock still mints (stock caps
  store purchases, not earned promises).
- **The prize picker is a Modal**, not a Sheet — re-decided at review: the Sheet is
  the ledger's read-only surface; Modal is the focused-decision register the buy
  confirm and the tear already use. Options wear the real die-cut `TicketFrame`
  (single, no roll) with a `selected` variant.
- **Instant stamp, no confirm** (the paper sheet's joy); finished cards are
  stub-chip history in My stuff; **no approval gate** — ADR 049's trust model
  stands, and ask-first prizes already gate at USE via ADR 055.
- **Take-down + audience sweep** — Tickets tab "Take it down" deletes the open card
  AND removes the kid from the template's audience (an "everyone" audience freezes
  to the explicit list minus them; a template with nobody retires). Audience edits
  sweep untouched zero-punch cards.
- **Tickets tab order: Pocket · Recently used · Punch cards** — ticket lifecycle
  contiguous, put-it-back restores into the shelf above it. All three per-kid
  shelves clamp (lead 3 + Disclosure, the shared `ClampedList`); **Recently used now
  defaults CLOSED**, superseding #89's open-by-default — three shelves per kid made
  open history dominate.
- Catalog tab: heading **Rewards**, both stocking lists clamped.

## Review-round bugs worth remembering

1. **Deleting a card is not removing it.** Lazy materialization (ADR 058 pattern)
   re-creates any missing open card for an eligible (template, kid) pair — so both
   the take-down AND the unclaimed-finish flow resurrected cards until the
   _eligibility_ (audience) or the _occupancy rule_ changed. Occupancy is now
   "prize business unsettled" (`prize_claimed_at IS NULL`), and the fresh card
   opens only when the payout settles. **Any future delete against a materialized
   row must answer: what stops the materializer from putting it back?**
2. **`createMany` rows share a timestamp** — ordering by `created_at` alone let
   Postgres flip ties on every punch (each UPDATE rewrites the heap tuple), so the
   kid's list shuffled per punch. Deterministic `id` tie-break on both card queries.
3. **An invented cap**: options capped at 8 while the seed catalog is 9 — "select
   all" was guaranteed to 400. Caps that aren't product rules need a reason.
4. **900-second "test failures" were machine sleep**, rotating across unrelated
   files; CI (clean machine) passed the full suite first try. Don't chase local
   wall-clock timeouts at 3am.

## What was built

Migration `20260731120000_add_punch_cards` (edited in place pre-merge, the
unshipped-migration rule): `punch_card_templates` / `punch_cards` (with
`chosen_reward_id`, `prize_claimed_at`) / `punches`, one OPEN card per
(template, kid) via partial unique index, punches idempotent on
`(source_type, source_id)`. Lib `apps/api/src/lib/punch-cards.ts`; routes:
template CRUD + audience sweep, cards GET (lazy materialization; tier-4 all),
punch POST, prize POST (name/change/claim), undo DELETE (`:id/punch`), take-down
DELETE (`:id`). Events `rewards.card.punched/completed/prize-claimed`; permission
`rewards.card.punch` (tier 1+, own; ADR 049 baseline). `@family-os/ui` gains
`PunchCard`/`PunchSquares`, `TicketFrame`/`CostStub`/`EmojiStub`/`AskLine`
(+`selected`), `animate-stamp-in`. Chores: `PunchCardsTab` + `lib/punch-cards.ts`
hooks sharing rewards' query keys verbatim (one QueryClient spans plugins).
Rewards: `PunchTemplateDrawer` (multi-select options), `PunchTemplateRow`,
`ClampedList`, Tickets-tab corrections, `earnedLabel`. Tests: 32 API + 9 chores
RTL + 64 rewards RTL.

## What the next session needs to know

- **M5/5 try bites is unblocked**: publish `meals.trybite.taken`, subscribe in
  rewards, call `punchCard()` with the event's `(source_type, source_id)` — the
  punch path takes event-sourced punches unchanged. The card a trybite punches
  still needs a linkage decision (which template) — that was always M5/5's.
- The dev DB keeps two demo templates (Try bites, Reading nights — reactivated
  after review testing) and assorted completed cards on both kids; clear at will.
- `docs/modules/rewards/spec.md` schema/events sections updated to the shipped
  shapes in this closeout.
- The M4/1 exploration stories (`rewards-exploration.stories.tsx`) still carry the
  superseded fixed-payout PunchCard story; the artifact is the living record.
