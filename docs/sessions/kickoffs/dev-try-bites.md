# Kickoff — M5/5 · Dev: Try Bites

**Type:** Development · **Modules:** `meals` + `rewards` · **Branch:** `dev/meals-try-bites`
**Depends on:** M5/2 ✅ (`try_bite` ships on the meal), M4/6 ✅ (punch cards live 2026-08-01)

## Pre-session checklist

- [ ] Read `CLAUDE.md`, **ADR 049** (punch cards) and **ADR 048** (earning is
      contributed), `docs/modules/meals/design.md` §M5/5, `spec.md` §Events
- [ ] Read `apps/api/src/lib/punch-cards.ts` — `punchCard()`, lazy per-profile
      materialization, idempotency on `(source_type, source_id)`, the completion path
- [ ] Read `apps/api/src/plugins/rewards.ts` §"Event subscribers" — the
      `chores.task.completed` subscriber is the pattern to copy (log-and-swallow)
- [ ] Read `packages/ui/src/components/punch-card.tsx` + the rewards punch surfaces
      (`WalletsView.tsx`) — the stamp vocabulary already exists; do not mint a second
- [ ] Worktree: copy `.env` in or `turbo dev` dies

## Session scope

_One sentence:_ A kid taps their own try bite at the table, `meals` publishes
`meals.trybite.taken`, and `rewards` punches their card — with `meals` still knowing
nothing about cards, ledgers, or payouts.

## Acceptance criteria

1. A kid with `meals.trybite.take` can take tonight's try bite from the surface this
   session builds; a parent can undo it. Taking is **row-level own** — nobody takes a
   bite for someone else.
2. Taking publishes `meals.trybite.taken` `{ mealId, date, profileId, tryBite }`.
3. `rewards` subscribes and punches the taking profile's card. Idempotent: a
   double-tap, a replay, or a re-take after undo punches **once**.
4. At the goal the card completes and pays out through the existing path — no new
   payout code in this session.
5. `meals` imports nothing from `rewards` and no card concept leaks into meals code
   or its schema.
6. On meals surfaces the try bite stays a quiet **accent chip** — `Try bite · the
veggies`, accent at 12% wash, accent ink. **No gold**; gold is XP/reward only.
7. A subscriber failure logs and never fails the take.

## Constraints coming in

- ADR 049: the **kid punches their own card** — the joy of the paper sheet is drawing
  the check; do not hand it to an adult. A parent undoes.
- The stamp/punch vocabulary (dashed square, sunken plane, slam) belongs to the
  table-time surface, not the widget — design it against the existing punch wall.
- **The UI design gate applies.** The table-time surface is new: playground with 2–4
  labelled frames, sign-off, then Storybook, then integration.
- Server data via TanStack Query with a shared key prefix — a take must refresh both
  the meals surface and the kid's card.
- **Parallel run:** wave 2, alongside M5/7. You own `apps/api/src/plugins/rewards.ts`,
  `apps/api/src/lib/punch-cards.ts`, `plugins/rewards/prisma/`, and the meals widget +
  week-page views. You share `apps/api/src/plugins/meals.ts` and
  `plugins/meals/prisma/` with M5/7 — rebase and `prisma generate` before merging,
  committing only schema-derived generated files.

## Decisions to make

1. **Which card a try bite punches.** Templates today carry name, glyph, goal, payout,
   audience — and **no source binding**. Add one (a `sourceEvent` / `sourceType`
   column on the template, matched by the subscriber) or designate a well-known
   template. This is the load-bearing decision; it also decides what happens when a
   family has authored no try-bite template — silently no-op, or a seeded template.
2. **How a take is recorded in `meals`.** `try_bite` is one free-text field per meal
   but every kid at the table takes their own — a `try_bite_takes(meal_id, profile_id)`
   table with a unique pair is the obvious answer, and it hands AC3 a natural
   `sourceId` (`mealId:profileId`).
3. **Where the kid taps.** The `Tonight` widget chip, a week-page row action, or a
   dedicated table-time view — the design gate answers this; note that the fridge
   tablet is unattended and cannot claim as a person.
4. **Undo semantics.** Does undoing the take remove the punch (and can it, once the
   card has completed and paid out)? Decide before writing the subscriber.
5. **Audience** — offered to the template's audience, or to every tier 1+ kid.

## Outputs (required before closing)

- [ ] Design gate: playground → sign-off → Storybook story; playground file deleted
- [ ] Live-app review as a kid profile: take, see the punch land, undo
- [ ] Tests: subscriber idempotency + the undo path (`fastify.inject()`, real
      `familyos_test`), RTL over the tap surface
- [ ] Manifest `events.publishes` updated (`meals.trybite.taken`) and the rewards
      manifest's `subscribes`
- [ ] `pnpm typecheck` + `pnpm test` clean; progress row ✅, session log, `CLAUDE.md`,
      queue, PR; delete this kickoff
