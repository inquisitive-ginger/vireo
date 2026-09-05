# 2026-09-04 — Dev: Shopping polish (M5.5, PR #138)

The critique's SH-01…SH-14 plus a long live pass with Zach. Shopping is **announced** —
nav item back, Home tile deliberately not. Two devs, one branch, one checkout.

## The decision set — settled before any code

The critique left four calls to the build session. They were answered up front, not in situ:
**D1** reveal-then-tap (undo would re-create the row with a new id and reset `added_at`);
**D2** `--input` is the interactive-control outline at 3:1 — light `0.88→0.62` (1.37:1 → **3.48:1**),
dark `0.30→0.52` (1.45:1 → **3.58:1**), `--border` untouched, so chores' `CompletionToggle` and
every form field came up with it; **D3** feed yields its cell — **reversed by Zach at the end**,
see below; **D4** errors sticky and counted, precedence error > notice > idle.
Also **D5** rename is `manage`-only (a lower-tier "fix my own row" key is a product decision),
**D6** the widget keeps its house-wide count, **D7** SH-14 is motion only, **D8** `section-label`
spacing stays out — its queue entry is still open.

## Zach's live pass — what changed after the build

Capture: `Just added` deleted (SH-09/SH-02 moved take-back onto the rows, so the capability
moved rather than went); `Hold to speak` replaced by `↵ Enter to add` in the trailing slot;
block centred; placeholder `milk, eggs, bread` at `font-normal`. **Comma-separated multi-add**
(client parses, `POST …/items/batch`, non-atomic, no input dedup). List: reveal strip clipped,
inline sheet ≥768, aisles fold when complete, rename edits the row in place, **throw away /
remove checked items** (`POST …/clear`), always-painting bar reading `{n} items left`.

## Reversals — each amended in the same PR

- **The filing echo** — `design.md` §Anatomy 3 + ADR 070's amendment. Five places said it shipped.
- **The cumulative count** — `design.md` §Anatomy 1.
- **The list name on the sticky line** — recorded as **spent, not overlooked**: SH-11 put it
  there because the pills scroll away.
- **ADR 043** — narrow, named amendment: the shopping meter renders from first paint because it
  anchors the `⋯`. The general rule still binds everywhere else.
- **`Just added` + the reserved voice slot** — `design.md` §W2, §Anatomy 4, §"does not do".
  Voice now **owes a placement decision** whenever it is scoped.
- **D3** — Zach pulled the Home tile at the end; feed restored, grid back to pre-M5.5 3/3/4.
  `WIDGET_META.shopping` and the nav item **stay**: absent from a layout is reversible, absent
  from the meta is a booby trap. One commit (`c231be0`), one revert to undo.

## Defects found that predate this session

- **`shopping.item.removed` was emitting to nobody.** The plugin subscribed to `checked` and
  `added` only, so since ADR 073 a tier-4 delete left the row on every other screen.
- **A hollow test.** `does not close the aisle you are standing in` mocked `onToggle`, so the
  status never changed and the assertion was never about the behaviour it named. **General shape:
  a test that mocks a handler then asserts on state that handler would change can only pass.**
  A bounded scan of shopping's seven suites (65 `fireEvent` sites) found no others.
- **Three duplicated constants, all drifted or drifting** — the removal verb stated twice (the
  sheet's copy wrong; now `lib/removal-verb.ts`), and the hero's hardcoded `4.5rem` copy of
  `PageContainer`'s padding, which went stale the same day the container gained `sm:pt-10` and
  was the entire 16px scroll.
- **The capture scroll was a constant, not a layout problem** — 16px at both orientations.

## Known, accepted, recorded

The notice stack is **uncapped**; with the capture surface now height-bound it **clips** rather
than overflowing the seam. `RowSwipe`'s gesture is untested — jsdom implements no `PointerEvent`,
so thresholds, axis lock, snap-back and `onGestureStart` are read-and-screen only; the limit is
written at the top of the suite. The on-screen-keyboard case was never reachable here.

## Process

`git add -A` in a shared checkout swept one dev's files into the other's commit; split by the
lead into `decf7ba`/`5b36d4d` (backup branch kept, tree verified). **Explicit pathspecs are the
rule.** The split was done while a dev was still writing after reporting "holding" — one
intermediate commit may not build standalone.

**`check-context-budget.sh` only ever sees uncommitted work** (`git diff HEAD` + untracked), so
in CI the tree is clean and the per-file caps for `logs/`, `kickoffs/` and `decisions/` catch
nothing. ADR 043 went 7833 → 8743 against a 6000 cap and sailed past.

## Also fixed here

`chores.test.ts` had **13 fixed-sleep races** — sleep 50ms, then read what an async
subscriber was supposed to write. One lost on CI and surfaced as a TypeError on `[0]`.
Nine positive waits became polls that name what they waited for; four assert an absence
and kept a delay, commented. `:1460` left alone and **routed**: its `resolves.toBeUndefined()`
resolves unconditionally, so it may be vacuous — diagnosing that changes what it asserts.
The API suite is ~30s faster as a side effect. `b597425`.

## Suites

ui 230 · shopping 154 (local only — plugin suites still don't run in CI) · shell 23 ·
platform 59 · api 593 · typecheck 12/12 · eslint clean.
