# 2026-09-04 — Dev: the page frame insets, the header leads

**Type:** development · **Story:** spacing-contract (audit follow-up) · **PR #139**
**Outcome:** shipped. Six commits, ADR 074, and a CI guard.

## What was wrong

Two root causes explained sixteen findings.

**The frame budgeted for a title it cannot see.** `33c67ce` answered "spacing
around headers is too narrow at the top" with the right amount on the wrong
owner — the complaint was a header's, the fix went on `PageContainer`. Five of
eight surfaces render a title there, so five looked right. The rest paid for a
header they lack: Home and the calendar's tablet lens carried 40px of dead
gutter (the reported shift), and the shopping hero, which subtracted the frame
by hand, overran the wall tablet it exists for.

**The frame stepped at `sm:`, the chrome at `md:`** — a 128px band wearing
desktop gutters under mobile chrome.

## What shipped

|           |                                                                                      |
| --------- | ------------------------------------------------------------------------------------ |
| `cdffd24` | Frame reseat: symmetric inset stepping at `md:`; `PageHeader` takes the title's lead |
| `cdf1e31` | One breakpoint; `BREAKPOINT_MD` shared with the JS that measures                     |
| `2964984` | `PageHeader` owns the title and the nav strip                                        |
| `49fa188` | `gap-7`/`gap-3` sweep; `SectionLabel` primitive                                      |
| `c9ee17d` | Token debt + `check-spacing.sh`                                                      |
| `5c05793` | Reconciles with the shopping polish                                                  |

A titled route is **pixel-identical** to before at every width (16+8 phone,
24+16 above). Only untitled surfaces move.

## Decisions

- **F-06** — the calendar's tablet lens strip reads **below** the page title
  now. Zach's call at a rendered gate; it was the one strip that outranked its
  own page name. Its chevrons moved into the right cluster as a consequence — a
  control cannot sit inside the `h1` the primitive owns.
- **F-16** — frame bottom is `pb-6 md:pb-12`. The shell already reserves the tab
  bar on a phone; a full 48 inside that left 104px of nothing under every mobile
  list.

## Two deviations from the kickoff's literal ACs

Both deliberate, both recorded in `design-system.md` so the next sweep does not
re-derive them.

- **`SectionLabel` took 7 of 33 `text-section-label` sites, not all 33.** The
  rest are widget headers, picker chrome, dense grid cells and inline card meta
  whose containers already own their space. Forcing them through a spacing
  primitive hands each 28px it never asked for — the frame's own mistake, one
  layer down. Same for the four remaining `text-page-title` users.
- **ADR 074 §3 was rewritten mid-session.** It first said a surface sizing itself
  against the frame should subtract the _tokens_. Rebasing onto the shopping
  polish found the better answer it had reached independently (`b7a0a8c`): fill
  the parent. `h-full` inside the shell's `h-dvh` chain has no constant to drift
  and tracks a tablet's browser chrome and keyboard, which `svh` does not. Both
  fix the stale copy; only one removes it. The six `--page-frame-*` tokens were
  deleted rather than left as a second home for a number `PageContainer`
  declares — a doc naming two homes for one number is where this bug started.

## The guard

`scripts/check-spacing.sh` — CI + `PostToolUse`, modelled on the context-budget
check. Fails on raw type classes, raw named radii, and bracket spacing not
derived from `var()`/`env()`. Stories and tests exempt; component-internal
geometry exemptible in the script with its reason (ADR 068's `inset-y-[3.5px]`
is the only entry).

It earned itself twice: two side-specific radii the sweep missed on its first
run, and four more in the polish's new files on first contact after the rebase.

## Notes for the next session

- **The polish landed first and had to be reconciled.** Its capture hero, aisle
  header (which gained a tappable complete-open state) and row actions all
  changed under this branch. All four aisle states now hold `ListRow`'s `px-4`
  edge — a collapsed aisle renders its name _inside_ a `ListRow`, so without it
  expanded and collapsed disagreed by 16px down one list.
- **`ListRow` gained `px-4`** (F-10) to match `ItemCard`. Any surface pairing a
  bare label with `ListRow` owes that label the same edge.
- Closes the queue's _"`section-label` has no block-spacing rule"_ entry.
- Verified live at 390/700/834/1280 and signed off, then re-verified post-rebase.
  791 tests, typecheck, lint, build, both guards clean.
