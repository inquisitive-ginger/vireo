# Ad-hoc — The Currency Is Named Pritchett Bucks (ADR 054, PR #68)

**Type:** ad-hoc (naming + design + dev) · **Merged:** 2026-07-25 → `main` (`b19e63b`)
**Decision:** `docs/decisions/054-pritchett-bucks.md`

## What was decided

The kid currency is **Pritchett Bucks**, and the coin bears a **struck P-mark** — a `P`
whose stem is crossed by a bar, the standard way a letter becomes a currency (₽, ₱, ₦, ₴
all do it) — at **0.66 of the face, stroke 2.5**.

**Four registers**, one per medium, in `packages/ui/src/lib/currency.ts`:

| Register              | Where                                                            |
| --------------------- | ---------------------------------------------------------------- |
| the struck mark       | the coin face                                                    |
| **`P$`**              | compact text beside a number — chips, buttons, prose, the ledger |
| **`P-Bucks`**         | any sentence a person reads or **hears**                         |
| **`Pritchett Bucks`** | the wallet hero, settings, first use                             |

A register is chosen by **naming an export**, never by typing two characters — that is
the whole reason the module exists, since `P$` is shorter to type than it is correct.

## The three findings worth keeping

**1. The audit's most valuable result was that the rename was nearly free, and that the
window was closing.** Nobody in the house had ever seen "F$": every currency surface sits
behind `REWARDS_UI_ENABLED` (off in prod) and the ledger is dormant because nothing sets
`coinReward > 0`. So the rename cost **zero re-learning** — and M4/4 and M4/5 triple the
copy surface, so this was the last moment that would be true. **The schema needed no
migration at all**: `delta` / `balance` / `amount` / `coin_reward` were already
currency-agnostic, which is ADR 048's plugin-agnosticism paying an unplanned dividend.

**2. Weight was decided by measurement, not by taste — and the measurement said the
question was smaller than it looked.** The bowl's arms run y=4→12 and the bar crosses at
y=8, so each of the mark's two counters is exactly **(4 − stroke)** units tall. Struck at
0.66, **every weight closes on a 16px coin**, stroke 2 included (2 units → 0.88px, under
one device pixel). On a chore row the mark is therefore a **silhouette, not a letter** —
which is what a struck coin looks like from across a kitchen — so going heavy costs
nothing at the sizes that ship most, and the decision is really made at **26px and up**,
where 2.5 is the heaviest that still holds an open counter at 44px.

**3. I mis-measured the mark and "fixed" a problem that did not exist.** I read
`a4 4 0 0 1 0 8` from (14,4) as ending the bowl at x=14, concluded the glyph sat 2 units
left of centre, and added a `translate(2 0)` that actually knocked it off — which the
user caught on the first render. The arc is a **semicircle bulging right**: centre (14,8),
radius 4, so it reaches **x=18**. Extents 5→19, centre exactly 12; vertically 3→21. **The
mark as supplied was already centred and needed nothing.** The general lesson is that the
exploration was rendering the glyph against a rounded square with one vertical rule — a
disc is what would have exposed it, because a circle has one obvious centre and the eye
checks it. _Judge a mark inside the shape it will be struck into._

## Two alignment bugs, different causes, same symptom

The user's second catch — "the strike and value aren't aligned" — was two independent
defects:

- **The numeral rode high.** `items-center` centres the text's **line box**, and a line
  box reserves descender space that a digit never uses. `leading-none` on the value
  collapses it. Same structure, same fix, in `KidPayoutBadge`.
- **The mark sat on a half pixel.** `Math.round(size * 0.66)` gave an **odd** glyph box
  inside an **even** disc — 11px in 16px centres at 2.5px, which the browser smears.
  Rounded to an even size.

## The copy rule the user's change forced out

The user switched the inline surfaces to `No P$ this time` and
`[◉] 10 P$ when Mom or Dad checks`, which contradicted the drafted rule that a coin
beside a value means the text is the amount alone. **Both are right, and the boundary is
grammatical:** a bare value lets the coin state the unit; **a value inside a sentence has
to name what it counts**, because "10 when Mom or Dad checks" does not parse. Recorded in
ADR 054 as the exception rather than left as an inconsistency.

That change also created an a11y problem it then had to solve: a screen reader handed
`P$` says **"P dollar sign"**, and gets nothing at all from a decorative coin. Every such
chip is now written **twice** — an `aria-hidden` rendering for the eye, an `sr-only` one
built from `CURRENCY.short` for the ear.

## A pre-existing bug the rename surfaced

**The chores widget rendered a completed row's `coinReward` raw**, so an auto-credited
payout, one still **held** for a parent, and one the parent **declined** all rendered as
`[◉] 10` — the widget told a kid they had money that was waiting, or that had been
refused. Found by the user in the live app.

**Not from this session:** `git show --stat a79e072` confirms M4/3b taught the _page_ the
difference (`KidPayoutBadge` + the payout index) and never touched the widget. The widget
now fetches payouts on the shared `['rewards/payouts']` prefix and renders the same
badge, via a new `RowReward` that splits the two cases — a pending row shows the
**promise**, a completed row shows the **outcome**. Four tests, including the declined
case. Worth noting `kidPayoutView` derives held-vs-earned **from the task alone**, so the
row is right before the payouts query even resolves; the payout row only refines it once
a parent has decided.

## Scope deliberately held

`--coin-*`, `Coin`/`CoinValue` and `coinReward`/`coin_reward` **keep their names** — they
name the **object**, not the currency. The token rename alone means editing **three theme
blocks**, the ADR 041 trap that has already shipped a half-renamed palette once, and the
column rename costs a migration plus Prisma regenerate churn for no visible gain.

ADR bodies for 047/048/049/052/053 (and 005/009) and every session log mentioning F$ are
**dated records**: they carry a naming-amendment banner pointing at ADR 054 rather than a
rewrite. ADRs 002 and 051 — the two whose _decisions_ actually changed — got full
amendment banners.

## Gotcha worth remembering

**Prettier mangles a single-line markdown blockquote containing inline code spans or
several bold runs.** It ate the spaces around `` `P$` `` (rendering `` `P$`in compact
text ``) and escaped a closing `**` as `\*\*`. The 14 amendment banners were rewritten
with plain quotes and a single leading bold; `prettier --check 'docs/**/*.md'` is clean.

## Open

- **The live-app review was driven by the user via screenshots**, which is how both bugs
  above were found — but the coin has still only been judged at desk distance. The
  **fridge-iPad review is still owed and still blocked**: the earn surfaces are flagged
  off in prod until M4/5. If the mark fails at that distance, **deepen the brass; do not
  retire marigold** (ADR 044 paid for the eighth hue and it is the household cap).
- **"Pritchett" hardcodes a surname** into a platform whose vision extends to "any family
  that wants to run it". Mitigated, not solved: every string lives in one module, so the
  multi-family version is a config read rather than a refactor.

Green: 170 ui · 51 chores (4 new) · 43 platform · 326 api; typecheck and lint clean.
