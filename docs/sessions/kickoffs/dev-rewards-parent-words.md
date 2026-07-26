# Kickoff — M4/5d Dev: Parent Drawer + Queue Words

**Type:** development · **Interjects into `dev/rewards-store-wallet`.** Small.
_Depends on: M4/5a (queue renders use requests); parallel with M4/5c._

## Pre-session reads

- Artifact Part 8 · `RewardDrawer.tsx`, `ApprovalsQueue.tsx` ·
  `logs/2026-07-26-design-rewards-store-rework.md`

## Scope

- **`RewardDrawer` gains the description field** — "What they get", one line,
  optional; placeholder "Friday night is yours — you pick the movie."; hint "One
  line, on the ticket and the confirm." (Audit finding: the column has existed
  since M4/1 and nothing captures it, so no reward can ever have one.)
- **Approval toggle hint rewords** to the ADR 055 meaning: "They'll ask before
  using it — buying is always allowed."
- **Queue cards change tense**: "Teddy wants to **use** Ice cream run · bought
  today · asked 10 minutes ago" · actions **Not now…** (opens the optional note,
  quoted to the kid verbatim) and **Yes — enjoy!**. The fulfil button disappears
  (M4/5a deleted the state); payout cards (M4/3b) unchanged.
- Catalog rows/manager show the description line where it fits.

## Outputs

- [ ] Code + tests on the branch; live review with M4/5c before closeout
- [ ] Session log + queue/progress updates; delete this kickoff
