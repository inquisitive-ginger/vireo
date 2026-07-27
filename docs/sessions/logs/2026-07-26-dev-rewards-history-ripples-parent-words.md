# 2026-07-26 — Dev: History Sheet + Ripples ∥ Parent Drawer Words — M4/5c + M4/5d

**Branch:** `dev/rewards-store-wallet` (worktree `../family-os-store-wallet`), commit
`[rewards/store-wallet] history sheet + ripples, parent drawer words (M4/5c+d)`. The
two parallel kickoffs run as one session (user call). All three M4/5c ACs verified
live; M4/5d's remaining scope (shrunk by M4/5b) landed with it. **M4/8 is now the
only thing between the branch and its PR — and it gates the PR.**

## The kickoff deviation worth recording

The kickoff specced a **new `GET /rewards/ledger`**. It was not built, because
`GET /rewards/wallet` has returned exactly this since M4/2 — balance **plus**
cursor-paginated entries, own-wallet at every tier, `?profileId=` tier-4 only,
family profile 403. A second endpoint would have been the same route under a second
name, and the ADR 047 point is stronger this way: **the promise (balance) and its
explanation (entries) are one response.** The sheet reads it via a new
`useLedger(enabled)` infinite query on the `['rewards/wallet']` prefix — a purchase
invalidates the story too, and the query only runs while the sheet is open.

## What was built

- **`Sheet` in `@family-os/ui`** — the third dialog surface, each with one job:
  `Drawer` is the create/edit capture rail, `Modal` a centered one-tap decision,
  `Sheet` the answer-a-question surface — rises from the bottom, caps at 85dvh,
  scrolls inside, grab bar, `sheetUp` respecting reduced motion.
- **`HistorySheet`** — tap the purse ("Where'd it go? ›" now lives on it). Rows are
  `reason` **verbatim** off the ledger; the row **glyph is told by `sourceType`,
  never parsed from the text** (🎟️ redemption/refund, ↩️ reversal, 🧹 chores, 🎁
  anything else — a future grant renders right with zero changes). Earned rows green
  and signed, spent plain, grouped by local day (`relativeDayLabel` backward). A
  released payout's row says **"checked by {parent}"** — `createdBy` is the approving
  parent on exactly those entries, the payout tray's provenance retold. **AC1 is a
  rendered sentence:** when the last page is loaded the footer states "That's the
  whole story — it adds up to N P$"; while pages remain it offers "Further back ›"
  instead of claiming the story is whole.
- **Widget ticket-ready line (AC3)** — `WalletView` takes `tickets` (owned only);
  the adaptive line becomes ticket-ready › affordable › next-goal › first-earn, the
  longest-held ticket's emoji leading ("🎧 A ticket's waiting in your pocket ›").
  The standard body carries the same line above "You can get".
- **Family-profile chooser (AC2)** — `/rewards` on the household profile renders
  "Wallets are personal. / Whose pocket?" with the kids' faces and **fetches no
  wallet at all** (the page forks before `Store` mounts). Tapping a face is the
  shell switcher's own move — `POST /api/auth/switch`, no PIN for tier < 4 — and the
  store re-renders as that kid. Parents are excluded: switching to one needs the PIN
  this surface doesn't carry. Rows carry the identity spine (the legend rule, ADR
  042 — this surface pairs faces with names).
- **Teen home layout** — new `default_layout_tier_3`. (Reworked later the same
  day — see the addendum.) **The `default_layout_tier_3_4` key survives as
  the tier-4 layout under its stale name** — deployed `system_config` geometry
  overrides are looked up by key (and `POST /dev/reset` seeds one per key), so
  renaming it would orphan them; a comment says so. The new key simply falls through
  to the in-code default anywhere no config row exists.
- **M4/5d** — `RewardDrawer` gains "What they get" after the name (placeholder
  "Friday night is yours — you pick the movie.", hint "One line, on the ticket and
  the confirm."), submitted as `description` (trimmed, empty → null; edit re-seeds
  it). The approval toggle's hint now speaks ADR 055's grammar: **"They'll ask
  before using it — buying is always allowed"**. `RewardRow` shows the line under
  the name, so the manager reads what the ticket will say.

## Live review (headless, playwright against the dev stack)

Family → chooser (phone + fridge; **zero `/api/rewards/*` requests recorded** on the
family profile) → tap Teddy → store → **bought a real ticket through the UI** →
pocket ("Ready when you are", "Bought today") → sheet: −15 −15 +60 −25 **= 5, the
header's balance — AC1 checked against live data, not a fixture** → home widget
flips from the affordability line to "🎧 A ticket's waiting in your pocket ›" (AC3)
→ switch to Zoë (tier 3): wallet widget present under the calendar column (dark +
phone + fridge screenshots throughout). One visual defect found and fixed:
**buttons don't inherit `text-align`** (UA default is center), so the chooser names
centered despite the wrapper's `text-left` — the class moved onto the button. The
tier-4 drawer was **not** live-driven (family PIN hashed and off-limits — the
settled precedent); its four component tests are the record. Teddy's bought ticket
was deliberately left: dev now holds owned + waiting + stub fixtures at once.

## Gotchas

- **jsdom has no `ResizeObserver`, and mounting `RewardDrawer` under test reaches
  for it** (Radix Drawer machinery) — rewards' `test.setup.ts` now carries the same
  no-op stub calendar's already did.
- The `use_requested` fixture from M4/5b belongs to **Zoë**, not Teddy — a widget
  showing no ticket line for Teddy was correct data, not a bug; verified in the DB
  before touching anything.

## Verification

rewards **54** (+13: sheet grammar/sum/pagination · widget priority · chooser
renders-at-tier-1 / no-wallet-fetch / switch call · drawer description + hint) ·
platform **44** (+1: teen layout, parent stays wallet-free) · ui 180 · api 350 ·
chores 56 · calendar 105; typecheck + lint clean workspace-wide.

## What the next session needs to know

- **M4/8 is the last gate on `dev/rewards-store-wallet`** — the branch still
  carries the prod flip, merge = launch.
- `CURRENCY.name`'s "taught once" spot (ADR 054) is **still open** — the sheet kept
  to `CURRENCY.short`/`code` per the artifact; candidates remain settings or the
  wallet hero.
- The widget is one `Link` to `/rewards`, so the ticket-ready line lands on the
  Store tab, not My stuff — fine at this size; a `?tab=` deep link is a cheap later
  nicety if it ever grates.

## Addendum (same day)

- **Kid grids reworked at the user's direction**: both tier-1/2 and tier-3 now
  rank **wallet > chores > feed = calendar**, each as **four equal 2×1 tiles** —
  kids see these on tablets/desktops, where a 2×2 slot is mostly air (user catch,
  twice: first the tier-3 desktop, then tier 2 by the same reasoning). The tier-1/2
  **feature moved from chores to the wallet** (the payoff is what a kid opens the
  app for) and rides elevation + position, not size; tier 3 is the same grid with
  no feature (a teen's surface declines to shout, like the parent's); calendar and
  feed sit as equal quiet peers on the bottom row. Dev's stale
  `system_config` `default_layout_*` rows were deleted (a cache of the old default —
  `/dev/reset` rewrites them from code). Live-checked as Teddy and Zoë at fridge +
  phone. The 2×2 wallet reads airy on a near-empty balance — the same breathing-room
  language as the chores celebration slot; revisit only if it grates with real data.
- **Cherry-picked `ec2303e`** (the notification tray blanked the whole app on any
  `variant: 'rewards'` row) onto the branch — the fix landed on main **after** the
  branch was cut, so dev still crashed on open while prod was fixed. The rewards.ts
  conflict was resolved by keeping the ADR 055 routes and applying the fix's
  semantic mapping (the parent's yes → `success`; asks, not-nows, refunds → `info`).
  Verified live: the tray opens as Teddy, old `'rewards'` rows render with the info
  fallback. api 350 · ui 181 green.
- **The widget's standard body now leads with the coin + metric numeral** (user
  call): compact always had the balance as its headline, but standard tucked it
  into a corner `BalanceChip` — fine in a side slot, underselling once the grid
  rework made the widget the kid home's lead tile. The chip's only consumer was
  that corner, so `BalanceChip` is deleted; shelves and the ticket line stay
  (a bare number is a scoreboard, not a wallet).
- **The ticket line dresses as a ticket** (user catch: it weighed the same as the
  saving-up line — two tenses in the same clothes). The goal stays full-colour
  ("distance, not denial"), so the owned ticket elevates instead: the pocket's
  coin-tint + brass border as a pill, which the chip rule permits — a chip is a
  collectible, and an owned ticket is one.
