# 2026-07-21 — Planning: Rewards & Meals

**Type:** planning · **Outcome:** docs only, no code
**Produced:** ADRs 047–050 · `docs/modules/rewards/` · `docs/modules/meals/` ·
roadmap renumber · queue restructure

---

## Why this session happened

Two gaps the family actually feels. **XP has been minted since M2 with nothing to spend
it on** — the loop has a first half and no second. And **dinner is invisible until it is
on the plate**, which is where the try-bite fight starts.

Ad-hoc session; no kickoff existed, so this log is the record.

---

## What was decided

### The currency question was already answered

The obvious first move was to decide what the reward currency is — one wallet or a
separate non-monetary point? **ADR 002 and ADR 005 already settle it**: two currencies,
XP never converts, F$ is the earnable/redeemable one, and the system is a **ledger,
never a bank**. So no new currency decision was made and none was needed. Worth
recording as a near-miss: the recommendation drafted in this session was identical to
ADR 002 and would have been written as a fresh ADR if the decisions folder hadn't been
read first. **Check `docs/decisions/` before proposing, not after** — CLAUDE.md rule 3
earned its place today.

What _is_ new is the shape of the ledger, which ADR 002 doesn't cover.

### Splitting M6 Finance

The old M6 had four bullets that were two unrelated features welded together:

| Old M6 bullet            | Really            |
| ------------------------ | ----------------- |
| F$ earning + balance     | kid economy       |
| In-app reward redemption | kid economy       |
| Cashout, parent approval | household finance |
| Monarch sync             | household finance |

The kid economy became **M4 — Rewards & Wallet**. Real money stayed in **M8 — Finance**.
The binding constraint on the split: the wallet must be built so **cashout is another
sink, not a second balance** — otherwise M8 forks the economy.

### XP is not the thing you spend

XP is a lifetime progression score (it drives the M2 score plate); a spendable balance
is a wallet. One number cannot be both — spending would erase achievement, which is the
wrong lesson. A chore completion mints **both**, XP only ever goes up, and nothing
shipped in M2 is touched.

### ADR 047 — the ledger is append-only

Every F$ movement is an immutable row; the balance is a cache. **A balance a kid cannot
explain is a balance a kid will argue with.** `chores.xp_balances` is the wrong
precedent to copy — a bare mutable total is fine for a number that only goes up and
insufficient the moment it goes down. `(source_type, source_id)` is unique, which puts
idempotency in the schema as a constraint rather than in a handler as a convention.

### ADR 048 — earning is contributed, not owned

`rewards` never imports another plugin. The earning plugin owns the **amount**
(`coinReward` sits on the chores `Task`, because pricing a chore is a decision made
where the chore is set up); `rewards` owns the **ledger**.

The test of the contract is already scheduled: **cooking dinner is a chore**, and it is
filed under `meals`. If the contract only fits chores, it is a chores hook wearing a
costume — so M5/3 is deliberately sequenced as the proof.

### ADR 049 — punch cards are a rewards primitive

The paper try-bite sheet (15 squares → small reward → reset) is a **punch card**, not a
currency. It lives in `rewards`, not `meals`, because teeth-brushing streaks and reading
sessions are the obvious second and third consumers and none of them are about food —
and because the payout is a catalog reward or F$, which are both rewards concepts.

**The kid punches their own card.** The joy of the paper sheet is drawing the check;
don't take that and hand it to an adult. A parent can undo.

### ADR 050 — a day mark is not an event

This was the session's real argument, and the first proposal was wrong.

The initial recommendation was a general "plugins contribute items to the calendar"
extension point, justified by _a third-party plugin can't write into calendar's schema_.
**The user rejected the justification and was right to** — meals and school are both
first-party, so the marketplace argument was speculative and doing more work than it had
earned.

The better argument was the user's: **the shapes don't match.** A family with a full
schedule and traffic lands within maybe ±30 minutes of anything, so dinner has no time.
Making it an all-day event claims a precision the fact doesn't have and takes an event
slot. The valuable fact is **who is responsible** — cooking it or calling it in — and
that is attribution, which renders as a **mark on the day**.

That reframing made the extension point **much smaller** than the one first proposed:
no positioning, no overlap, no spans, no reminders. Just _for a date range, at most one
small mark per day_. It still has two consumers — meals, and M7 School's "no school
Monday" / half day / inservice, which are also day-level facts and are served better by
marks than by events.

**Right conclusion, wrong reason, corrected by the user.** Recorded because the failure
mode is generalizable: an architectural argument that reaches for a speculative future
consumer is usually covering for not having examined the shape of the data.

### Naming: "who's cooking" → "who's got dinner"

The user's phrasing settled it — _even if it's calling in for takeout_. Responsibility
is the fact; cooking is one mechanism. Hence `kind`:
`cooked | takeout | leftovers | out`.

### The empty state is the most valuable state

A day with no dinner owner at 4pm on a Thursday is **not blank** — it is _nobody has
dinner_, the exact fact a full-schedule family needs shoved in its face. It renders as a
muted, tappable **unclaimed**, one tap to claim. Arguably the highest-value single
interaction in M5.

### Anti-ambush is timing plus the title/try-bite split

The named scenario: kid walks in from school, asks what's for dinner, hears "creamy
sausage rigatoni with veggies", goes _ugggghhhhhhhh_.

Two mechanisms, neither needing a new field:

- **Timing.** Reading it at 3pm doesn't prevent the reaction — it **relocates** it to
  the hallway, alone, with three hours to get over it, instead of at the table.
- **The title/try-bite split** (which exists for punch cards) does double duty: `title`
  = "Rigatoni", `try_bite` = "the veggies". The kid gets a thing they like plus **one
  named, bounded ask** they can see coming, instead of one intimidating compound noun.

**How the parent phrases the title is the feature**, and no schema change fixes it — the
design session makes the placeholder do the teaching.

### Groceries: build mode and shop mode are two different apps

Build is at home, over a week, many contributors, three-second adds. Shop is in a store,
one person, one hand, cart moving, bad signal. Most apps design for build and ship a
miserable shop mode. **Design for shop**: aisle grouping (re-sorting forty items by hand
is why people go back to paper), big targets, checked items **dim in place** rather than
vanish, live sync between two shoppers.

**Offline is a requirement.** The SW is network-first for `/api`, so today the list would
fail in the exact place it is used. That is a story, not a surprise to find in an aisle.

**No recipe bank.** A free-text `needs` list typed while planning pushes to groceries and
deletes the ingredient-parsing problem that stalls recipe features. The bank becomes
genuinely optional and moved to Meals v2.

**Kids can add**, deliberately — low-stakes tier 1–2 participation that closes the loop:
kid adds a vegetable they want to try → it lands on the plan → it's the try bite → they
get the punch. The kid started it.

---

## Roadmap changes

```
M4 — Rewards & Wallet      (top half of old M6)
M5 — Meals & Groceries     (was M7, grew groceries + try bites)
M6 — Smart Home            (was M4)
M7 — School                (was M5)
M8 — Finance               (bottom half of old M6)
M9 — Marketplace           (was M8)
```

Every milestone that moved was **unstarted**, so no shipped work is affected. A banner
was added to `roadmap.md` mirroring the 2026-05-30 renumber note, and the M2 bullet that
said "F$ earning is wired in M6" was corrected — as was the same line in
`chores/spec.md`.

---

## Open questions raised

- **Punch-card payout when the catalog reward is out of stock** — falls back to coins,
  or blocks? Left to M4/6.
- **Whether M5/7's offline work should be a platform story** rather than a meals story,
  since it touches the service worker. Flagged; deferred to the kickoff.
- **Grocery aisle taxonomy** — fixed list, per-family editable, or learned from use?
  Left to M5/1 design.
- **Whether the wallet widget belongs on the family pseudo-profile layout** at all — a
  household has no balance. Left to M4/1.

---

## What the next session needs to know

**M4/1 (Design: Rewards & Wallet) is the gate for the milestone**, and its most
important output is **not visual** — it is the **pricing model**. Pick the weekly earn
rate first, then price the small reward at ~1 week and the big one at ~1 month, and seed
the catalog with real numbers. The economy dies in either direction: unaffordable is
demoralising, instantly affordable is worthless. No amount of good UI survives bad
pricing.

M4/2 (the ledger) depends on the design gate only for surfaces and can start
immediately.
