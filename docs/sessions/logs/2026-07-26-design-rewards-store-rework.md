# 2026-07-26 — Design: Rewards Store Rework (mid-M4/5 review)

**Type:** design (ad-hoc review of the in-flight M4/5 branch) · **Output:** ADR 055,
the rework artifact, four interjected sessions M4/5a–d

## What this was

A full design review of the kid rewards experience as built on
`dev/rewards-store-wallet` (uncommitted, in the `../family-os-store-wallet`
worktree), run against the live dev app in a driven browser — Zoë (10 P$), Teddy
(35 P$), and the family profile — plus a code audit of the store, dialogs, wallet
widget, and the parent surfaces. The user opened with four critiques; all four
held, and the review traced three of them to the fourth.

**Artifact (hi-fi, token-accurate — embedded audit screenshots + rework mockups):**
https://claude.ai/code/artifact/b34e0c21-e40d-4185-a83a-864e065a4865

## What was decided — ADR 055, all four directions gated and approved

**A redemption is a ticket.** Buying and using are two moments:

- **Buy** debits once, no parent gate at any price (it's the kid's money, ADR 053).
- **Own** — the ticket sits in a pocket; anticipation is the feature the old model
  skipped (non-approval rewards auto-fulfilled at purchase, so nothing was ever
  _yours_).
- **Use** is explicit; `requiresApproval` gates **use, not purchase**. A parent's
  "not now" returns the ticket to the pocket — **money stays spent, nothing is
  confiscated**. Tier-4 revoke-and-refund survives as the exception.
- **Used is fulfilment** — the parent's third action (fulfil) is deleted.
- Statuses: `owned · use_requested · used`.

Also gated: **IA = two kid tabs** (Store · My stuff, badge = tickets waiting) with
**history as a bottom sheet** off the purse, and **the ticket visual system**
(perforated stub carrying the cost, brass wash for affordable, the tear as the
module's single flourish, torn-stub chips as the memory shelf).

## The critique in one line each

- **A — IA:** four time-horizons (coming / now / saving / all-time) flattened into
  one scroll; a store has one job — spend. Owning and remembering move to My
  stuff; explaining moves to the history sheet.
- **B — Feel:** white tile + centered product shot + price = storefront grammar,
  wrong register for pocket money. The fix is a physical metaphor (tickets), not
  louder colours.
- **C — Words:** `description` was specced in M4/1, landed in the schema, and no
  form ever captured it — no reward could have a description, end to end.
- **D — Lifecycle:** the root fault. Purchase-consumes-instantly left nothing to
  design between the register and the trophy row, and put the parent's gate on the
  wrong question ("may I spend my money?" instead of "is now a good time?").

## Audit findings beyond the critiques

- **Family profile `/rewards` is a dead screen** — infinite spinner over nine 403
  retries (ADR 053 correctly denies the wallet; the page has no state for it), on
  the fridge tablet's default profile. → M4/5c chooser.
- **Teen (tier 3) home has no wallet widget** — only tier 1–2 gained it. → M4/5c.
- **No kid surface reads the ledger**, though ADR 047's argument is "a balance a
  kid cannot explain is a balance a kid will argue with". → M4/5c history sheet.
- **"Coming soon" was a dead end** — a granted redemption gave the kid nothing to
  hold or do. Dissolved by the ticket model.
- Worth keeping (and kept): affordability shelves cheapest-first, distance in full
  colour, the before→after arithmetic, the chores nudge, the wallet widget's
  adaptive line, `Modal`, `affordability.ts`.

## Process notes

- Review was driven headless (playwright-core against the running dev servers,
  persistent profile for the session cookie); tier-4 surfaces were reviewed at
  code level only — the family PIN is hashed and off-limits, which is correct.
  The parent queue/catalog were live-reviewed in M4/4 anyway.
- The artifact embeds the app's real faces (Lora 600 + DM Sans variable, woff2 as
  data URIs — CSP blocks font CDNs) and the verbatim light-theme tokens, struck
  P-mark included; mockups pinned light (the fridge's reality), per "judge a
  colour on the layer that renders it".

## What the next sessions need to know

Cut as **M4/5a–d**, replacing the single M4/5 entry (kickoffs written):

1. **M4/5a — Ticket lifecycle (API).** Status rework in place on the branch
   (unmerged + prod-dormant = edit the migration, don't stack one).
2. **M4/5b — Store + pocket UI.** Build to the artifact; carries the original
   M4/5 prod flip (register plugin, `REWARDS_UI` on, M4/8 lands with it) and the
   code-seed **with descriptions**.
3. **M4/5c — History sheet + ripples** (widget ticket-ready line, family-profile
   chooser, teen layout). Parallel with d after a.
4. **M4/5d — Parent words** (description field, toggle hint, queue tense,
   fulfil button removed).

`design-system.md` §Rewards surfaces: the store/redemption subsections are
superseded by the ticket system — M4/5b rewrites them (the three-end-states table
becomes owned/use_requested/used; "Granted = celebration" becomes the tear).
