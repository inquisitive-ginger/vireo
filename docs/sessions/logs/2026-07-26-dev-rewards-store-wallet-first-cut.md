# 2026-07-26 — Dev: Store + Wallet Widget (first cut) — the initial M4/5, HANDED OFF

**Type:** development · **Branch:** `dev/rewards-store-wallet` (worktree
`../family-os-store-wallet`) · **Status:** handed off, not merged. The kid UI built here
was reviewed live and **re-cut by ADR 055** (see
`2026-07-26-design-rewards-store-rework.md`) into **M4/5a–d**; this log is the record of
the first cut and what survives the rework. No code committed by this session — the
branch handoff is separate.

## What was built (the first cut)

- **Design gate** — a token-accurate UX artifact iterated across four rounds: store
  frames, wallet frames, the coin softening, and XP co-display. Landed on a sectioned
  store + balance-led wallet + P$-hero-with-XP-footnote.
- **Backend** — `GET /rewards/store` (tier 1+, own-scope; whole catalog + balance, no
  affordability pre-filter; family 403). Dev-seed of the 9-reward starter catalog (raw
  SQL against the `rewards` schema — no plugin import → no workspace cycle; INSERT path
  verified on an empty DB).
- **Frontend** — the kid **Store** (progressive disclosure: "You can get" grid +
  "Saving up for" collapsed to the closest goal + "See all"; a **balance hero plate**
  matching the chores XP ScorePlate; a "Yours" in-flight strip; a "Rewards you've earned"
  collection), a redeem **Modal**, `AskPill` (seal + label), the **`rewards.wallet`
  widget** (compact/standard self-sizing, adaptive affordability line + XP footnote).
- **`@family-os/ui`** — a new reusable **`Modal`** primitive (centered decision surface,
  distinct from Drawer/ConfirmDialog); the **Coin softened** (sweep + inner-rim gloss
  removed — an ADR 051/054 refinement, "too glossy / pirate coin" at store scale).
- **Prod flip wiring** — `rewards` registered in `plugins.json`, `load-plugin.ts`
  (plugin + widget), `federation.d.ts`; manifest `navItem.minTier` 1 + `widgets[]`; vite
  exposes `./widgets/Wallet`; wallet slot in the tier 1–2 default layout; `REWARDS_UI`
  flipped to **default-on** (`.env` is gitignored, so a code default is the only flip
  that reaches prod).
- **Balance-refresh fix** — chore completion/reopen now invalidate `['rewards/store']` +
  `['rewards/wallet']` (the earn path changed the balance with nothing telling the wallet
  to refetch).

## Live-review iterations (before the pivot)

Fonts bumped off the 10px floor to the close-up scale; tier-4 Store tab removed (parents
get Approvals + Catalog); the redeem Drawer → centered Modal; a "Yours" strip + a
"Rewards you've earned" collection added; non-approval rewards auto-fulfilled to kill the
parent "mark as given" busywork; the store re-cut to progressive disclosure (a nine-tile
wall was overwhelming, esp. for a kid with ADHD); the balance promoted to a hero plate.

## What survives the ADR 055 rework vs. what's superseded

- **Carries forward into M4/5b–d:** the prod-flip wiring, the code-seed (now with
  descriptions), the softened Coin, the `Modal` primitive, the store endpoint, the
  balance-refresh invalidation, the wallet widget's adaptive line, the affordability
  helpers, the XP co-display idea.
- **Superseded by the ticket model:** the redeem afford/ask/nudge flow and auto-fulfil
  (→ buy/own/use tickets, M4/5a); the single-scroll store IA and the Yours/Earned
  sections (→ two tabs Store · My stuff, a pocket, and a history sheet, M4/5b–c).

## What the next session needs to know

- **M4/5a (Ticket Lifecycle, ADR 055) is ✅ done** on the branch. **M4/5b** builds the
  ticket store + pocket UI to the rework artifact and **carries the prod flip**; **M4/5c**
  the history sheet + ripple fixes; **M4/5d** the parent drawer/queue words. Kickoffs are
  written.
- Tests at handoff (first cut): API 347 (+3 store), rewards 22–23, chores 56, platform
  43 — all green; typecheck/lint/build clean; federation build exposes `./widgets/Wallet`.
  Note the frontend test/UI details will shift under the ticket rework.
- The dev stack runs from the worktree; it needs the gitignored root `.env` copied in
  (DATABASE_URL + SESSION_SECRET).
