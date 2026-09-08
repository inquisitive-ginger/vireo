# 2026-09-07 — Audit: the queue, the kickoffs and the specs

**Type:** audit · **Trigger:** ad-hoc (Zach) — "audit them and present them back as a
_does this get built?_ list; recycle the no's and clear the refs."

## What it covered

Every kickoff on disk (7), every queue entry (Up Next 7 + Deferred Backlog ~15), and
the story specs those entries pointed at. 27 items were put to Zach one by one.

## What survived

| Item                                  | Why                                    |
| ------------------------------------- | -------------------------------------- |
| M4.5/3 Companion — Design: Feature UX | active milestone, ready                |
| M4.5/4 Companion — Dev: Foundation    | blocked on /3                          |
| M4.5/5 Companion — Dev: Surfaces      | blocked on /4, the launch PR           |
| M5.5/6 Shopping — Dev: offline        | ready, closes M5.5                     |
| Ten ADRs over the 6000-byte cap       | docs, no kickoff yet                   |
| family-feed test addendum             | zero test files behind a `test` script |

## What was recycled

Deleted outright: `kickoffs/dev-try-bites.md`, `kickoffs/product-design-beacon.md`,
`kickoffs/dev-push-multi-profile-device.md`, `kickoffs/design-family-profile-notifications.md`
(already deleted on disk, uncommitted — this session committed it),
`modules/platform/stories/push-multi-profile-device.md`,
`modules/platform/stories/family-profile-notifications.md`,
`modules/calendar/stories/suggested-events-inbox.md`, `modules/shopping/salvage.md`.

Queue entries removed with no file behind them: the four auto-bug `deployed` flips
(done), the NVMe HAT (happening, but wants no doc here), retiring the Pi 3B, shrinking
the api image, the three test/tooling findings out of the polish, the shopping polish
decision set (SH-04, SH-05, quantity, dashboard composition — its kickoff was never
written), and **the entire Deferred Backlog**: three owed ADRs, bug-report screenshots,
the autonomous fix agent, push-subscription reconciliation, offline plugin render, the
unseen app-icon set, the `name: family-os` compose pin, the permission-override
condition bug, the Zod validation sweep, hardening `turbo gen plugin`, plugin suites
never running in CI, `@db.Uuid` on profile columns, `Profile` literals dropping
`identityHue`, Storybook stories → Tailwind, and family-wall feed typography.

## Consequences worth knowing

- **M5 — Meals is done.** Try Bites was its last story; recycling it closes the
  milestone. The `try_bite` **field** on a planned meal ships and renders — only the
  punch-card half was unbuilt. `meals.trybite.taken`, `meals.trybite.take` and the
  `rewards` subscriber row were removed from both specs.
- **M3 — Calendar is done**, not "MVP-complete, story 8 deferred". The `status` /
  `source` columns story 1 shipped stay in the schema, unused, and the external-ingest
  ADR is no longer owed.
- **Two ADRs kept their text.** ADR 049 argues punch cards from try bites as the
  motivating case and ADR 048 from the earn contract; punch cards shipped, so the
  reasoning is a record of a real decision, not a plan. Rewriting them would falsify
  why the primitive exists. ADR 029's dangling pointer to the deleted
  family-profile-notifications story **was** fixed.
- **Artifacts and logs were left alone.** They record sessions that happened. Only
  forward-looking plans were recycled.

## Docs amended

`sessions/queue.md` (rewritten), `CLAUDE.md`, `roadmap.md`, `architecture.md`,
`decisions/029-notification-system.md`, `modules/{meals,shopping,calendar,platform}` —
progress boards and specs, `modules/meals/design.md`, `modules/rewards/spec.md`.
