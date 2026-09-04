# 2026-09-04 — Fix: the up-next widget's day labels lead their events (auto-bug #135, PR #137)

Ad-hoc fix session off the `auto-bug` queue — the only open one. Report
`69863d86` from Dad (tier 4), route `/`, build `DjR5JucL`, 2560×1352. Kickoff
written in-session and deleted at close-out; this log is the record.

## What was asked

> The calendar widget on the home dashboard should move its day labels from the
> left gutter and stack vertically with the event items. Same as how the mobile
> agenda does it. Also, reuse of components here is strongly encouraged where
> possible.

Two asks, and the second one is the interesting half.

## The fix is a deletion

The stacked anatomy already existed. Auto-bug #117 built it in August for the
narrow slot — below `WIDGET_CQ.narrowMaxWidth` the day list gave each day its own
header line because the 84px gutter left mobile event titles ~150px and truncated
most of them. It was gated as a **narrow-slot** variant, on the premise that a
wide tile could afford the gutter. Dad's report says the wide tile shouldn't want
it either, which retires the premise rather than adding a case.

So `stackedDays` stops being a prop and becomes the only anatomy, and the fallout
is all subtraction:

- the gutter branch of `DayList`, and the `GUTTER_INSET` / `GUTTER_LEAD` geometry
  that mirrored the row band to land a label on a row's centre line — the whole
  reason that arithmetic existed was the gutter;
- `.cun-narrow`, which now renders exactly what `.cun-large` renders. The mobile
  stack is just large;
- `WIDGET_CQ.narrowMaxWidth`, whose only caller was that container query. It is
  gone from `@family-os/ui` rather than left as a shared constant documenting an
  anatomy nobody has.

## The reuse ask was real

"Where possible" turned out to be one clean seam. The mobile agenda's section
header and the widget's stacked day line were the same object drawn twice:
lead + secondary date on a baseline row. They differed in type rank
(`text-card-title` vs `text-base-token font-semibold`), in the gap, in a `· `
separator the widget had and the agenda didn't — and in one thing that was not a
deliberate difference at all: **the agenda tinted today's heading with the primary
hue and the widget didn't.**

`plugins/calendar/src/components/DayHeading.tsx` is now that object, with a `rank`
prop for the two type sizes. `AgendaView` and `UpNextView` both use it. The widget
picks up the today tint it was quietly missing, and the `· ` separator goes so the
two surfaces state a day the same way.

Worth noting for the next person: the widget's `Row` had to start carrying `today`
to feed the tint. `buildRows` already computed it — it was being used to decide
whether an empty today gets a band, then thrown away.

## Verification

calendar 147/147 (2 new — the gutter's absence, and the today tint), ui 213/213,
typecheck + lint clean on `@family-os/ui` and `@family-os/plugin-calendar`.
Live-reviewed on the dev shell at 2560×1352, narrowed past 440px to confirm the
mobile stack is unchanged, and on `/calendar` to confirm the shared component
didn't move the agenda. Approved first round.

## Notes for whoever runs next

**The dev stack is single-tenant across worktrees.** Every port in it is
`strictPort` — shell 5173, api 3000, plugins 3011–3016 — so a `turbo dev` left
running in another worktree blocks yours entirely, and a 200 on 5173 proves some
branch is serving, not yours. Check `lsof` before believing a live review.

**`CLAUDE.md`'s "Owed in-app" bullet was stale again.** It named reports
`2b882a8c` (#128) and `cfc58841` (#129) as owing the `deployed` flip; the database
had both at `deployed` already. The bullet is gone as of the M5.5/4 close-out —
this is the second time that block has outlived its facts, which is what
`fix-it-playbook.md` §"Checking what is actually owed" exists to prevent. Query
the table.
