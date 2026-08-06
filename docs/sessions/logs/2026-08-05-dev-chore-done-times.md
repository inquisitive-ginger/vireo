# 2026-08-05 — dev, chores/done-timestamps (ad-hoc)

**Ask:** show when a done chore was completed, on every done surface.

**Built:** UI-only — `completedAt` was already written on complete, cleared on
reopen, and serialized to the client, so no API or migration work.

- `doneLabel(completedAt)` in `plugins/chores/src/lib/dates.ts`: time of day if
  completed today ("7:42 PM"), else backward `relativeDayLabel` ("yesterday",
  weekday, "Jul 20"). Mirrors `finishedLabel` in `PunchCardsTab`.
- Focus `MiniRow`: muted label in the due-date slot on done rows.
- Agency `TaskStatusLine`: "Done Thursday · Back tomorrow" — one muted span,
  `·`-joined per Zach's review note. Retires the "nothing on a completed row"
  stance in `TaskMeta.tsx`'s header comment.
- `AdminBoard` `rowTimingText`: bare "Done" → "Done 7:42 PM" (+ " · back
  tomorrow" for ongoing).

**Tests:** new `dates.test.ts` (5 cases, fake timers); `TaskeeView` "back
tomorrow" assertion loosened to the joined string. 113 pass; lint + tsc clean.

**Review:** live in the worktree dev shell, signed off after one change (the
`·` separator). Merged to main direct (no PR) at Zach's call — `1216a46`.

**Next session needs to know:** nothing outstanding; no queue change.
