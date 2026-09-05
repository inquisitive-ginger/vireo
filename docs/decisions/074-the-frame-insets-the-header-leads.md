# 074 — The Frame Insets, the Header Leads

**Status:** Decided (2026-09-04, spacing contract session) · Reverses the
mechanism of `33c67ce` while keeping its outcome · Constrains `PageContainer`
and `PageHeader`; does not change which role a page picks (ADR 067 / §Page
containers)

## Decision

**1. `PageContainer` insets the page. It budgets for no content it cannot see.**
The frame is symmetric on three sides and steps once, at `md:`, with the shell
chrome:

| Side   | Utility         | Phone | ≥ 768 |
| ------ | --------------- | ----- | ----- |
| Sides  | `px-4 md:px-6`  | 16    | 24    |
| Top    | `pt-4 md:pt-6`  | 16    | 24    |
| Bottom | `pb-6 md:pb-12` | 24    | 48    |

**2. `PageHeader` owns the air on both sides of its title** — `pt-2 md:pt-4`
above, `mb-6` below. A titled route therefore renders exactly where it did
before: 16 + 8 = 24 on a phone, 24 + 16 = 40 at `md:`. A route that renders no
title pays neither, which is the whole point.

**3. A surface that must fill the frame FILLS ITS PARENT. It does not compute
against the viewport at all.** `h-full` inside the shell's own `h-dvh` /
`flex-1 overflow-auto` chain has no constant to drift, and it tracks a tablet's
browser chrome and on-screen keyboard, which `svh` does not.

This is the shopping capture hero's answer (`b7a0a8c`), reached independently
during the M5.5 polish, and it is better than the one this ADR first gave —
subtracting the frame from tokens rather than from a literal. Both fix the stale
copy; only one removes the copy. A subtraction is still a duplicate of a number
owned elsewhere, and the frame's values are declared by `PageContainer`'s
utilities, so there is nothing else to read them from.

**4. Chrome and the page frame step at `md:`. Content may reflow at any
breakpoint.** The frame had been stepping at `sm:` while every piece of shell
chrome stepped at `md:`, so between 640 and 767 the page wore the desktop gutter
under mobile chrome.

## Why

- `33c67ce` answered a real complaint — "spacing around headers is too narrow at
  the top" — and put the fix in the right _amount_ on the wrong _owner_. The
  complaint was about a **header**; the fix went on the **page frame**. Five of
  eight surfaces have a header there, so five of eight looked right.
- The other three paid for a header they do not render: Home's widget grid and
  the calendar's tablet lens strip each gained 40px of dead top gutter — the
  shift reported on both Dashboard and Calendar — and Shopping's wall hero,
  which subtracts the frame by hand, was 16px too tall at every width ≥ 640 and
  scrolled to nothing on the tablet it exists for.
- That is the general failure: **a container that budgets for its likeliest child
  taxes every other child.** The frame cannot see whether a title is coming, so
  it must not reserve space for one. The header can, so it does.
- The stale `4.5rem` is the same mistake one layer down. A literal sum is a copy
  of two numbers that live somewhere else, and it went wrong within a day. ADR
  068 settled the general form — the token is authoritative and one owner reads
  it — but the frame admits a stronger answer than a token: a child can inherit
  the height instead of naming it, and then there is no second copy to go stale.
- The bottom is the one asymmetry, and it is earned: the shell already reserves
  `--spacing-tab-bar` + safe area beneath `<main>` on a phone. Adding a full 48
  inside that put 104px of nothing under the last row of every mobile list. 24 is
  the gap a person actually sees above the bar.

## Alternatives considered

- **Keep `sm:pt-10` and let the three untitled surfaces negate it** (`-mt-4`).
  Every new untitled surface would owe the negation, and nothing would say so.
  Padding is not a prop, and a negative margin is a prop with worse manners.
- **A `hasHeader` prop on `PageContainer`.** It re-states in the parent what the
  child already knows, and gets it wrong the first time a route renders its
  header conditionally.
- **Give `PageContainer` the symmetric inset and drop the extra air entirely.**
  Titled routes would lose 16px at `md:` and re-open the complaint `33c67ce`
  correctly closed. The air was right; only its owner was wrong.
- **Move the frame's step to `sm:` for the chrome too**, rather than the frame to
  `md:`. The chrome breakpoint is load-bearing — it is where the sidebar replaces
  the bottom tab bar — and 640 is too narrow for a sidebar. The frame is the
  cheaper thing to move.
- **One bottom value (48) at every width**, and accept 104px on a phone. Defensible
  in isolation; the two owners are simply unaware of each other, and the sum is
  what a person sees.

## Do not revisit unless

The shell's chrome breakpoint moves off 768 (the frame follows it, by rule 4), or
a surface appears that renders a page title _without_ `PageHeader` — which means
it wants a different primitive, not a different frame.
