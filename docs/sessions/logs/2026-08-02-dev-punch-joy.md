# 2026-08-02 — Dev: Punch Cards Joy Rework (PR #100)

**Type:** development (ad-hoc rework of the shipped M4/6 surface) · **Branch:**
`dev/punch-joy` · **Spec:** the gated hi-fi artifact
(<https://claude.ai/code/artifact/cd78f89f-233d-44d7-b803-8d88e633f5dc>)

## What was built

- **API** — `resolveCards` attaches `lastPunchedAt` (one `punch.groupBy` max per
  card, so punch/prize responses carry it too); `listCards` resolves each shelf
  group's latest finish to `prizeName`/`prizeCoins`. No migration.
- **`@family-os/ui` `PunchCard`** — new anatomy: fluid 5-wide stamp wall
  (`grid-cols-5`, cells aspect-square, 44px minimum), habit-glyph stamps at fixed
  per-index rotations (`STAMP_ROT`, no randomness) pressed with `--shadow-inset`;
  the dashed breathing `+` square is the only tap target; `prizeRail` slot replaces
  `finish`/`onFinishTap` (FinishLine and `PunchFinish` are gone); `gold` and `meta`
  props. Wall : rail split is flex `1.15 : 1` — the punch side always ≥ half.
- **Animations** (`styles.css`, all reduced-motion gated) — `stamp-slam` +
  `stamp-press` run in sync over 420ms (glyph drops in oversized, squashes home at
  55% as the square dips and an ink ring washes out); `breathe`; `confetti-fall`.
  The old 200ms `stamp-in` had no users left and was removed.
- **Chores tab** — three rail variants (picked / coins / unpicked-washed with the
  tab's only primary CTA), countdown header + "Last punched …" meta, gold
  full-unclaimed card into the existing claim picker, `FinishedMoment` in the same
  gold with contained confetti (identity + coin colours), finished shelf (latest 3
  gold-edged stubs, "See all N in My stuff ›" → `/rewards`), footnote. Prize picker
  Modal unchanged.
- **Stories** — new `Primitives/PunchCard` (picked/coins/gold/narrow); superseded
  M4/1 exploration story deleted from `rewards-exploration.stories.tsx`.
- **Tests** — 13 chores RTL (rewritten), +2 API. Full suites green: 430 API ·
  108 chores · 192 ui · 64 rewards; typecheck clean.

## Acceptance criteria status

All twelve met, two with interpretation worth recording:

- **AC 7 (no mid-session reshuffle)** — the list re-sorts only when its
  _membership_ changes: order freezes in a ref keyed by card-id set, so a landing
  punch never moves cards under the kid's finger even when it changes who is
  closest; the fresh order applies on the next visit.
- **AC 2 (stamp-in stays)** — upgraded, not kept: replaced at review by the
  richer slam (user-requested "fun micro animation").
- **AC 9** — celebration stays client-held; the gold full-card state is the
  durable fallback for a picked-prize refresh loss. No server state.

## Decisions made

- **Live-review tweaks over the artifact** (all user-gated): cards full-width in
  the list container (no 560px clamp); **no Lora in cards** — rail prize names are
  `text-card-title` sans, not `font-display`; wall squares fluid and larger; rail
  CTAs flow under the text instead of pinning to the card bottom.
- **Jitter fix** — punch/prize `onSuccess` writes the response card into
  `['rewards/cards','mine',id]` **before** the pending flag drops. Invalidate-only
  left a stale frame where the optimistic +1 reverted and the stamp replayed. The
  convention invalidation still runs; structural sharing makes it render-free.
  This predates the rework — any optimistic-count surface should copy the pattern.
- Shelf stubs show the **latest** finish's prize per template; a coins stub quotes
  the template's _current_ `payoutCoins` (historical edits aren't tracked — the
  ledger has the truth if it ever matters). Fallback claims (fully-retired option
  set) show date only.
- Gold pill/tile ink is a fixed `oklch(0.30 0.09 74)`, not `--coin-ink` — it sits
  on always-light coin metal, the Coin's own theme-invariance argument.

## Open questions raised

None.

## What the next session needs to know

- `PunchCard`'s API changed (`prizeRail`/`gold`/`meta`/`gridLabel`; `PunchFinish`
  gone). Chores is the only component consumer; rewards' parent surfaces read data
  only and are untouched.
- The stamp wall's `role="img"` wraps a focusable punch button — ARIA keeps
  focusable descendants exposed, so the button survives; don't "fix" it to
  `aria-hidden`.
- Dev DB still carries the demo templates and finished cards on both kids.
