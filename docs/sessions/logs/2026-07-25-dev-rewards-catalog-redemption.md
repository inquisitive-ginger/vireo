# Dev — Rewards Catalog + Redemption (M4/4)

**Shipped** 2026-07-25, PR #71 (squash `5bc1691`). Branch/worktree `dev/rewards-catalog-redemption`.

## What was built

**Backend.** `Reward` + `Redemption` models (migration `20260724120000_add_catalog_redemptions`, hand-applied to dev + `familyos_test`; prod runs it via `migrate deploy`). Tier-4 catalog CRUD; redemption flow in `apps/api/src/lib/redemptions.ts`: request **debits** P-Bucks, parent **grant / decline (refund) / fulfil**, cost **snapshotted** so repricing can't move a pending request. Every ledger move goes through `postEntry` (ADR 047); `rewards` imports no other plugin (ADR 048). CASL `rewards.Reward` / `rewards.Redemption`; `notify()` parents on request, kid on decision (ADR 029). Registry key `rewards.redemption.create`.

**Frontend** — the rewards module's **first frontend**, tier-4. Approvals **queue** (held chore payouts M4/3b **+** redemptions, **grouped by kid**, inline decline note) and catalog **manager** (Faces-&-seal rows, create/edit drawer). Shared **`CoinDecisionTray`** + **`AskSeal`** + **`EmojiPicker`** added to `@family-os/ui`; the chores board adopts the tray so it and the queue can't drift.

## Decisions made (design gate — rendered token-accurate exploration)

- **Queue: grouped by kid** (`MemberGroupHeader` per kid; both decision kinds beneath).
- **Decline note: inline expand** (button carries "refund N P-Bucks").
- **Catalog row: Faces & seal** — cost coin · audience **faces** · warm stock count · a gold **"?" seal** for "needs a parent's yes" (a lock read as _forbidden_, a check as _already-approved_, a star as merely _special_; "?" = _ask_, crisp at seal size). User's call.
- **Emoji picker: scoped, grounded.** Shared `EmojiPicker` with two modes — **scoped** (a local grouped set, no network) for the reward field, **full** (frimousse) for family-feed later. The reward set is **grounded in real rewards** (one emoji per reward, not an emoji keyboard); six shelves incl. 👑 yes day, 💰 cash out, 🔄 chore-to-a-parent, 💺 front seat.

## Scope decisions

- **Kid store deferred to M4/5** — M4/4 = redemption backend + tier-4 queue; the kid `request` path is verified via API/tests. Live review used seeded redemptions.
- **Prod gate = registration, not a build flag.** The shell derives nav from the manifest and reads a static `plugins.json`, so a build flag can't hide the plugin. `rewards` is deliberately **left out of `plugins.json` + `load-plugin.ts`** (the two dev-only files, uncommitted); the frontend ships as **dormant code**. M4/5 registers it + flips `REWARDS_UI` at the store launch.

## Fixes found in live review

- **Bodyless DELETE 400** — `jsonFetch` sent `Content-Type: application/json` on every request; Fastify 400s an empty JSON body. Now only sets it when there's a body. (Would have hit prod.)
- **Catalog shows active-only** so retiring a redeemed reward clears it from the manager (row + snapshot preserved in the DB).
- **Popover-in-drawer** clicks fell through (Radix Dialog sets `body{pointer-events:none}`, portaled popover isn't interactive) → emoji picker is **inline expand**, not a popover.
- Shared-primitive reuse audit: reward drawer now uses **`MemberChip`** (kid pill) + **`Chip`** (cost presets, brass-selected) + **`EmptyState`** (queue/catalog empties); copy "grown-up" → **"parent"**.

## Tests

API 344 · UI 178 · rewards 5 · chores 56 · platform 43. Typecheck + lint clean. New: rewards route/lib suite (19), `CoinDecisionTray`, `AskSeal`, `RewardRow`, `EmojiPicker` (scoped).

## What the next session needs to know

- **M4/5 (Store + Wallet)** owns: register `rewards` in `plugins.json` (order: after chores) + `load-plugin.ts`; flip `REWARDS_UI` on in prod; build the kid store (the redemption **request** UI) + `rewards.wallet` widget; **code-seed** the grounded starter catalog (spec table updated this session). The queue's redemption side only had seeded data — the store closes that loop.
- **Full `EmojiPicker` mode fetches emojibase from a CDN** — self-host the data before family-feed adopts it (scoped mode, used by rewards, is fully local — no concern there).
- `familyos_test` still can't take `migrate deploy` (P3009) — the new migration was hand-applied.
