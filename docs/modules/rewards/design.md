# Rewards — visual language

Extracted from `docs/design-system.md` 2026-09-04. These two sections govern one
module, so they live with the module; the shared vocabulary they draw on —
[the gold semantic](../../design-system.md#reward--the-gold-semantic), type,
colour, `ItemCard` — stays in the design system.

---

## Currency marks

**Settled** — ADR 051 (2026-07-22) and ADR 054 (2026-07-24).

Two currencies appear on the same row (a paying chore shows both), so they are told
apart by **metaphor**, not by shade.

| Currency            | Mark                                                   | Meaning                     |
| ------------------- | ------------------------------------------------------ | --------------------------- |
| **Pritchett Bucks** | A struck **brass coin** bearing the P-mark + the value | Money. Goes up and down.    |
| **XP**              | A **quiet star** + the value, in `--muted-foreground`  | A score. Only ever goes up. |

### The four registers

Each exists because a medium ruled the others out. Pick one by **naming it** — the
exports in `packages/ui/src/lib/currency.ts` — never by typing two characters.

| Register              | Where                                                                 |
| --------------------- | --------------------------------------------------------------------- |
| The struck mark       | the coin face — anywhere a value renders with its coin                |
| **`P$`**              | compact text beside a number: chips, buttons, prose, the ledger       |
| **`P-Bucks`**         | any sentence a person reads or **hears** — push, toasts, `aria-label` |
| **`Pritchett Bucks`** | the wallet hero, settings, first use — where the name is taught once  |

**A coin beside a value means the text is the amount alone** — `[◉] 10`, never
`[◉] 10 P$`. The coin states the unit, and the chore row is the tightest surface in the
app. **A value inside a sentence is the exception**: a sentence has to name what it
counts, so the held chip reads `[◉] 10 P$ when Mom or Dad checks` and the declined chip
reads `No P$ this time`. The coin is decorative either way, so every such chip pairs an
`aria-hidden` rendering with an `sr-only` one spelling `P-Bucks`.

**XP kept its pill shape and gave up its metal.** It held gold, the disc and the coin
glyph from M2 — assigned when nothing was spendable and the conflict could not appear.
A score is a fact about you; money is a thing you hold.

### Coin anatomy

The coin's gold is **brass, not marigold**: `hi oklch(0.95 0.09 96)` ·
`base oklch(0.79 0.155 90)` · `deep oklch(0.55 0.125 74)` · `tint oklch(0.96 0.05 95)` ·
`ink oklch(0.44 0.105 78)`. The old XP gold sat at hue 80 against
`--identity-marigold`'s 78 — the same colour saying two different things.

**It is ONE disc**, built from a single element:

- a radial face (light at 34%/28%, deepening to the edge),
- an outer **rim** — a conic metallic sweep masked to the outer ~9% of the same circle,
- a **specular gloss** crossing the face,
- a **raised relief** ring just inside the rim,
- the **P-mark** struck at **66%** of the diameter, stroke **2.5**.

Two things it is **not**, both tried and rejected on sight: a smaller disc nested inside
a ring (the pale step between them reads as a **washer**), and radial notches (milling
reads as a **gear** — machinery, not money). Relief holds down to 18px, so the row mark
and the 64px celebration coin are the same object at different sizes.

**The mark's weight is set by where its counters close.** The bowl's arms run y=4→12 and
the bar crosses at y=8, so each counter is **(4 − stroke)** units tall. At a 0.66 share on
a **16px coin every weight closes** — the mark is a **silhouette, not a letter**, which is
what a struck coin looks like from across a kitchen. Weight is therefore decided at 26px
and up, where **2.5 is the heaviest that still holds an open counter at 44px**. The mark
also needs **no centring transform**: its bowl arc is a semicircle bulging right to x=18,
so extents are 5→19 and the centre is exactly 12.

**The separation from a member's identity hue is form, not colour** (ADR 044's second
channel). A spine is a flat 4px bar; it can never be struck metal. That is what allows
brass to sit two millimetres from a marigold-spined row without the colour meaning two
things at once.

**Rendered hierarchy check.** XP is always the larger number (1,240 vs 24) and gold puts
the smaller one on top. That is the true reading — the small number is the one that can
be spent — and any future currency treatment has to preserve it.

---

## Rewards surfaces

The kid surfaces are the **ticket system** (ADR 055, gated 2026-07-26 on the rework
artifact): a redemption is a ticket — buy → own → explicit use. The wallet widget
(M4/5c, 2026-07-26) and punch card (M4/6, 2026-08-01) are both shipped — the punch
card's settled anatomy is [Punch card — the stamp wall](#punch-card--the-stamp-wall).

### The ticket

One anatomy renders the store, the pocket, and the loading skeleton (`TicketFrame`): a
**perforated stub** (2px dashed brass) beside the body — emoji, name, **description**.
The stub carries the **cost** in the store (coin + numeral) and the **emoji** once
owned: it's paid for; the price is history.

- **The notches are die-cut, not drawn** — a mask punches real holes through the card
  (border, wash and all) and the shadow is a `drop-shadow` recomputed off the cut
  silhouette, so nothing can extend past an edge at any width.
- **Affordable = a brass-warmed border, no wash.** The two-shelf split already carries
  affordability (only reachable tickets sit under "Get it now"), so a fill would restate
  it; the money-warmth lives in the border, the coin, and the stub numeral. Never the
  green success edge — affordability is a fact of the wallet, not a status of the
  reward.
- **Ask-first = a quiet corner seal** (`AskSeal` + "ask to use") — informational, never
  a gate. The seal means "you'll ask when you **use** it"; buying is always allowed.
- Out-of-reach rewards stay calm rows in full colour with quiet `N more P$` text —
  **distance, not denial** — under "Almost there", two-up at `md:`. **No meter and no
  pill on the shelf**: a balance-fed bar drops on every spend, taxing every goal at
  once, and a distance is not a collectible (the chip rule). The meter survives where
  it answers a one-time "how close?" — the nudge modal and the wallet widget's
  next-up line.

**At width, a store ticket is a unit off THE ROLL** (gated 2026-07-26 addendum): the
live ticket keeps a fixed 430px — the tap target never stretches — and the rest of the
row is the same ticket echoing at the perforation, dimmed in two steps, bleeding off
the cut edge (no right border). Echoes are decoration (`aria-hidden`, no pointer); the
phone shows none and is unchanged. Pocket tickets are already off the roll, so they
stay single and cap at 560px; the purse caps at the roll's 430px — a purse is
hand-sized, not a banner.

The store endpoint returns the **whole catalog plus the balance** — never a pre-filtered
affordable list. Affordability is a rendering decision, not a server one.

### Two kid tabs — Store · My stuff

**Store spends, My stuff owns and remembers, the history sheet explains** (sheet lands
M4/5c). The tabs are the shared **`TabBar`** — a top-level split between peer surfaces,
per the TabBar/SegmentedControl rule — with a `badge` option carrying the pocket's
ready count (the parent page's Approvals tab rides the same badge). The purse is the
store's hero — whose money, the struck coin, the metric numeral. "My stuff" holds the
pocket (ready tickets → "Use it" / "Ask to use"; an asked ticket quiets down under a
waiting pill) and the **stub shelf** — torn-stub chips with counts, the trophy row
moved out of the shop. Punching happens on the Chores "Today · Punch cards" tab;
finished cards and their outputs land in My stuff — that's why it isn't
"My tickets".

### The moments

The buy confirm keeps the **before → after arithmetic** (`35 → 20 P$ left`) and says
where the ticket goes ("It goes in your pocket"). The ask happens at **use time** and
talks about timing, never money. **The tear is the module's one flourish** — the ticket
splits at the perforation (480ms settle, skipped under reduced motion) and the stub
joins the shelf. A parent's **"not now" is deliberately soft**: the ticket returns
whole, the optional note is quoted verbatim, nothing needs an error state.

### Wallet widget — adaptive, never a dead end

`compact` leads with the balance and follows it with **one line that changes with
state**: _"3 rewards you can get"_ when something is affordable, otherwise _"3 more for
🍿 Pick the movie"_ with a meter. A bare balance is a score plate, not a wallet, and an
always-on next-goal line tells a kid who can afford three things that they are short of a
fourth. **The zero state decides this widget** — it is where a kid spends most of their
time. (M4/5c adds the top-priority ticket-ready line: the thing you already have beats
the thing you could buy.)

`standard` moves the balance into the header's trailing slot and makes **what you can
have** the body.

### Punch card — the stamp wall

Reworked 2026-08-02 (PR #100, built to the gated joy artifact): a **fluid 5-wide
stamp wall** where every punch stamps the habit's own glyph at a fixed per-index
angle, pressed into the paper (`--shadow-inset`). The next square is the **only
dashed element** — breathing, carrying a `+`, the one tap target; **the kid punches
their own card** (ADR 049) and the stamp lands with a 420ms slam (glyph squash,
square dip, ink ring — reduced-motion silent). The prize lives in an always-visible
**rail** beside the wall (picked emoji / coin disc / unpicked wash with the tab's
only primary CTA), the countdown in the header. A full card goes **gold**
(coin-metal border, pill, gold gift tile) and the celebration wears the same gold —
full → won is one arc. A meter with a count was rejected: a meter is a progress bar
for an adult, and the fridge sheet works because each square is a thing you did,
countable by eye. Rail prize names are UI sans, never the display serif.
