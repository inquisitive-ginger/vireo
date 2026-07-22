# 2026-07-22 — Design: Rewards & Wallet (M4/1)

**Type:** design · **Outcome:** ADRs 051–053 · `design-system.md` §Currency marks +
§Rewards surfaces · seeded catalog · a Storybook exploration (`Explorations/Rewards &
Wallet`) · one Storybook config fix

The gate for M4. Pricing was taken first, because every surface is a rendering of the
economy and a bad number invalidates the UI work.

---

## What was decided

### Pricing (ADR 052)

**A normal week earns about 10 F$.** Chores **opt in** to paying — `coinReward` defaults
to **0** and a parent ticks the ones that pay when setting them up. Ladder: routine 0 ·
weekly effort 2 · real effort 5 · big/unpleasant 10. Catalog: impulse 5 · small 10 (≈1
week) · choice 15 · outing 25 · big 40 (≈1 month), eight rewards seeded with real
numbers. Balances stay in **tens** — a kid has to do the subtraction in their head at
the moment of spending, and a four-digit balance stops meaning anything.

Paying for routine participation was rejected on the grounds that it makes chores
transactional **and** inflates the currency with the chore list: add ten small chores and
the weekly earn doubles without anyone deciding it should.

No real-money exchange rate. M8 may set one; nothing in M4 assumes it.

### The currency mark (ADR 051) — the session's real finding

The exploration turned up something not in the plan: **XP already owned gold, the coin
disc and the `Coins` glyph**, settled in M2 when nothing was spendable and the conflict
could not appear. So the score looked like money, and the money arrived second with
nothing left to wear. Worse, XP's gold was `oklch(0.74 0.13 80)` against
`--identity-marigold`'s `oklch(0.71 0.12 78)` — **whoever is assigned marigold is already
wearing the XP colour**, a live collision nobody had noticed.

There was also **no ninth hue to give F$ instead**: the identity palette occupies
35/78/117/148/188/235/268/330 and red is `--error`. A currency cannot take a colour
without taking it from a person.

Three options were rendered on a real chore row and gated. The cheap one (F$ as a
neutral "note", no M2 rework) was recommended and **rejected by the user in favour of the
truthful one**: **F$ takes the coin, XP demotes to a quiet star.** The reasoning holds up
better than the recommendation did — the swap only gets more expensive with every new XP
surface, and M4 is the cheapest it will ever be.

Gold then moved off marigold to brass (hue 90, higher chroma), and the rest of the
separation was pushed onto **form**, per ADR 044's second channel: a spine is a flat 4px
bar and can never be struck metal.

### Who holds money (ADR 053)

**Only a person holds a balance.** No ledger row may carry the `family` pseudo-profile,
enforced in the route — a household pot is a second balance by another name, arriving
before there is any rule for who may spend it, and the fridge tablet sits on that exact
profile. **Tier 1 holds a wallet**, which required amending the settled tier table: "no
financial data" was written before any in-app currency existed and means the
**household's** money (M8), not a kid's own F$.

### Provisional, not settled

Store (tile grid, affordable-first, **distance not denial**), wallet widget (adaptive
second line), redemption confirm (**before → after**, three unblurrable end states),
punch card (squares + finish line) are recorded as **build targets revisable without an
ADR** — each is a different rendering of the same fields.

Two data facts fell out of them and are **not** revisable: the store endpoint returns the
**whole catalog plus the balance** (filtering server-side would delete the feature), and
two nullable columns the mocks assumed but the spec lacked — `rewards.description` and
`redemptions.decided_note` (an **optional** decline reason, quoted back verbatim; a
forced field gets "no" typed into it). A nullable column today is free; the same column
after the household is live is a migration against real data.

---

## What was produced

- `docs/decisions/051-the-coin-belongs-to-fdollars.md`
- `docs/decisions/052-fdollar-pricing-model.md`
- `docs/decisions/053-a-balance-belongs-to-a-person.md`
- `design-system.md` — §Currency marks (coin anatomy, XP star), §Rewards surfaces
  (provisional), tier-table amendment, header date
- `docs/modules/rewards/spec.md` — pricing tables, seed catalog, two new columns, the
  household exclusion, the store payload rule
- `packages/ui/src/components/rewards-exploration.stories.tsx` — five stories, rendered
  inside the real `ItemCard` / `WidgetSlot` / `PageContainer`
- `packages/ui/.storybook/main.ts` — `viteFinal` alias fix

---

## Three things worth keeping

**The coin took four passes, and every rejection was about what it resembled, not what
it was.** Milled edge → _"looks like a gear"_ (machinery, not money). Disc-inside-a-ring
→ a visible pale step, so it read as a **washer**. A `Coins` glyph on a 72px face → a
coin depicting coins. The fix each time was the same move: **one struck disc**, with the
rim as a masked outer sliver of the same circle rather than a separate element behind a
smaller one. Nothing about that is discoverable from a token list — it only appears when
the thing is on screen at real size, which is why it went to Storybook before it went to
a doc.

**Storybook had been broken on `main` since 2026-07-21** and nobody knew. It globs the
shell's stories, the shell uses an `@` → `src` alias that only `apps/shell/vite.config.ts`
declares, and `ReportProblemDrawer` started importing `@/lib/report-context` during the
bug-reporting session. A design session is the first thing to notice, because it is the
only session type that opens Storybook. Fixed with a `viteFinal` alias.

**The recommendation lost and the decision is better for it.** The cheap currency option
optimised for not reworking M2; the user took the option that pays a bill now to stop it
growing. Recorded because the same shape recurs — the "cheap" choice was cheap only in
the current session, and the ledger of deferred cost was not on the table until the
option list forced it.

---

## Open questions raised

- **Does the brass coin survive at across-the-room distance** on the fridge iPad next to
  a marigold spine? Checked at desk distance and it holds; the wall tablet has not seen
  it. If it fails there, deepen the coin's gold — do not retire marigold (ADR 044 paid
  for the eighth hue and it is the household cap).
- **Punch-card payout when the catalog reward is out of stock** — still open, still
  M4/6.
- **Where the gold constants live** once XP gives them up: `plugins/chores/src/lib/gold.ts`
  is the wrong home for a currency mark that `rewards` owns. M4/3 decides.

---

## What the next session needs to know

**M4/2 (Ledger + Balance) is unblocked and needs nothing from this session** beyond the
two new columns and the household exclusion. **M4/3 now carries a second job** — ADR
051's re-strike of the M2 XP surfaces (`ScorePlate`, `XpPill`, `FlightChip`, `FocusView`,
`CreateTaskDrawer`) — because it is already in those files adding `coinReward`.

The exploration stories are the reference render for M4/4–M4/6; delete them when the real
components land.
