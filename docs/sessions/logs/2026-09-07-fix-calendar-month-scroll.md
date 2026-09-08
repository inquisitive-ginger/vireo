# 2026-09-07 — Fix: the month grid fills its frame instead of scrolling it

**Type:** development (ad-hoc, no kickoff) · **Branch:** main, direct ·
**Reported:** "the month view on the calendar page is scrolling unexpectedly"
after the spacing audit and refresh.

## What was actually wrong

Not padding. Both surfaces compose `PageContainer`, which owns the gutter and
does not take it as a prop, so Home and Calendar were already identical there.

What Home has that the calendar's tablet surface did not is the **height
contract**: `md:h-full` on the frame plus a `md:min-h-0 md:flex-1` body, so the
grid fills the viewport it is given. The calendar had none, so the month grid
summed a fixed `min-h-32` (128px) per cell — six weeks plus the frame and header
lands around 1005px — and overshot a laptop viewport by a few pixels. Five-week
months fit, which is why it read as intermittent rather than broken.

## Built

- `CalendarPage.tsx` — the tablet surface takes Home's contract:
  `flex flex-col md:h-full` on the frame, `flex min-h-0 flex-1 flex-col` on the
  tabpanel, `min-h-0 flex-1` on `MonthGrid`.
- `MonthGrid.tsx` — root is a flex column and accepts a `className`; the weekday
  header is `shrink-0` and each week row is `flex-1`, so the weeks share the
  height they are handed rather than summing a constant. Cell floor
  `min-h-32` → `min-h-24`: on a roomy screen rows grow past the old 128, on a
  short one they compress instead of pushing the page into scroll.
- `Home.tsx` — `md:pb-6` on the existing className override, so the dashboard is
  24 on all four sides at `md:+`.

147 calendar tests, 23 shell tests, `check-spacing.sh` and
`check-context-budget.sh` all pass.

## Decided

**Why the dashboard's bottom looked wrong and the calendar's didn't.** ADR 074
split the ownership — the frame insets, the header leads — so a titled route
reads 24 + `PageHeader`'s 16 = 40 at the top against the frame's 48 at the
bottom, which scans as symmetric. Home renders no header, so it showed the
frame's raw 24/24/24/48 and the 2x bottom was visible. The asymmetry was always
there; only Home displays it.

**The 48 at `md:` has no recorded argument.** ADR 074's "Why" reasons the _phone_
bottom **down** to 24 (the shell already reserves the tab bar beneath `<main>`;
a full 48 inside that left 104px of dead space under every mobile list). It never
argues _for_ 48 above `md:` — that value predates the ADR and rode through the
rewrite unexamined, in a session whose whole subject was the frame.

**Scoped to Home, not the frame.** The house-wide version was built first
(`PageContainer` losing `md:pb-12`, ADR 074 and design-system.md amended) and
then reverted on Zach's call: only the dashboard's bottom changes. Every other
surface keeps 48.

## Open

- **Home now overrides the frame's bottom inset, and ADR 074 says "padding is not
  a prop."** The exception is explained in a comment on the call site but is not
  recorded in the ADR, so the next session to read 074 will find a rule the code
  contradicts. Two lines in the ADR would close it. Offered and not taken this
  session; queued.
- **The cell floor was picked from arithmetic, not a render.** `min-h-24` is the
  one number here that was not verified against a real month on a real screen.
  Worth a look at the wall tablet and a laptop.
