# 2026-09-07 — Docs: ten ADRs rewritten under the 6000-byte cap

**Type:** docs · **Kickoff:** `kickoffs/docs-adr-cap.md` (written at session start, ad-hoc)

## What was done

Ten grandfathered ADRs were rewritten concise, in place. Every one is now under the
`docs/decisions:6000` per-file cap that `scripts/check-context-budget.sh` enforces on changed
files, and the script passes with all ten in the changed set.

| ADR                              | before | after |
| -------------------------------- | ------ | ----- |
| 042 avatar-images                | 9704   | 5952  |
| 044 identity-hue-assignment      | 9292   | 5995  |
| 043 identity-edge-status-field   | 8744   | 5997  |
| 031 interaction-state-language   | 7596   | 5960  |
| 035 plugin-styling               | 6993   | 5994  |
| 046 in-situ-bug-reporting        | 6901   | 5997  |
| 041 family-identity-hue          | 6891   | 5994  |
| 022 widget-system                | 6655   | 5981  |
| 040 sunken-surface-plane         | 6352   | 5939  |
| 057 daily-time-window-recurrence | 6246   | 5987  |

Nothing else was touched. No decision was reopened, no cap was raised, no ADR under the cap
was edited.

## How the words came out

The constraint was "same arguments, fewer words — never cut reasoning" (Zach, 2026-09-04).
What went, in rough order of yield:

- **Restatement.** Every ADR said its rule two or three times — once in Decision, once as the
  conclusion of a Why paragraph, once as a Consequence. The Consequence keeps the binding
  form; the others lost their echo.
- **Alternatives that repeat the Why.** 044's "Palettes A and C" bullets restated the
  trilemma verbatim and became one line pointing at it; 042's rejected identity band moved its
  two extra costs (the 3px face tax, the second concentric ring) into the Why paragraph that
  already killed it, and the bullet went.
- **031's superseded clauses.** The 2026-07-11 amendment records both the old and the new
  value for every clause it supersedes, so the Decision section no longer carries the
  superseded text as well. The dated amendment block stays — it is the record of what changed
  and when.
- **Connective tissue.** Framing sentences ("Two things had to be decided…"), meta-commentary
  ("this is why this ADR is interesting"), and the second half of sentences whose first half
  already carried the claim.

Every rejected alternative, every recorded live-review mistake, every "do not revisit"
trigger and every consequence another file leans on survived. Spot-checked after the fact:
042's spine/avatar corollary, 043's edge/field rule plus the `ItemCard` withdrawal and the
2026-09-04 meter exception, 044's `resolveHue` / `nextFreeHue`-returns-`null` / second-channel
rules, 046's ring buffer, 035's `@source` and keep-in-sync pair. The one anchor link into this
set — 041 → `040#alternatives-considered` — still resolves, as do all relative links.

## Observations for a future session

- **A rewrite pass converges slowly.** Rephrasing a paragraph saves ~5%; deleting a clause
  saves what the clause costs. The productive move was to name the redundant sentence and
  remove it, not to say the same thing more tightly.
- **The cap is roughly the right size, and these ten were roughly 25% over it.** After the
  cut, none reads thin — which is the evidence that the original length was habit, not need.
- **Four more sit at 5972–5974** (068, 072, 073) — one paragraph from the cap. The check only
  reads changed files, so they will bite whoever edits them next. Not queued; not worth a
  session on its own.

## Next

Nothing owed. The queue's next items are M4.5/3 (design: companion feature UX) or M5.5/6
(dev: shopping offline).
