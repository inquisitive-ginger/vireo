# Kickoff — M4.5/4 · Dev: Companion foundation

**Type:** Development · **Module:** `companion` · **Proposed branch:**
`dev/companion-foundation` · **Depends on:** M4.5/3 (gated designs; may start
after M4.5/1 if wall-clock demands — see spec §Session plan)

## Pre-session checklist

- [ ] Read `CLAUDE.md` (standing conventions apply in full), `docs/modules/companion/spec.md`
- [ ] Read ADR 061 (ownership, level function, fresh-start-at-hatch), ADR 062
      (asset serving, duotone, compositing)
- [ ] Read the M4.5/1 style-bible duotone prototype and M4.5/2 anchor-fit JSON
- [ ] Read the M4.5/3 artifact + recorded curve constants
- [ ] Study `plugins/family-feed/` end-to-end — **the structural template**
      (db export, prisma config, federation singletons, manifest) — plus the
      registration set: `plugins.json`, `load-plugin.ts`, `federation.d.ts`,
      shell `ICON_MAP`
- [ ] Read `apps/api/src/plugins/chores.ts` — `handleXpAward` + the subscriber
      registration site (the threshold subscriber slots beside it), and the
      `@family-os/plugin-chores/db` import pattern
- [ ] Read `apps/api/src/plugins/preferences.ts` + `AuthProvider` dark-mode path
      (the per-profile state template)

## Session scope

_One sentence:_ Stand up the `companion` plugin — schema, routes, permissions,
level engine, threshold detection, the portrait renderer, and the hatch flow —
end to end with tests.

## Constraints coming in

- **Schema (new `companion` Postgres schema):** a companion row (profile 1:1 —
  species, name, `hatchedAt`, `xpAtHatch` snapshot), milestone picks
  (level, offered ids, chosen id, timestamps — the offer is persisted so it
  cannot reroll), equipped state per slot. Exact shape is this session's to
  finalize against the gated design; keep ADR 047's spirit — derived things
  (level, mood) are computed, not stored.
- **Level + mood are pure functions** of (`chores.xp_balances.total_xp` −
  `xpAtHatch`, `updatedAt`) and the curve constants — one definition module, the
  `economy.ts` precedent.
- Threshold detection: subscribe to `chores.task.completed`; on level-up,
  `notify()` per the M4.5/3 decision and mint the pick's 3 offers server-side.
- Portrait renderer: a shared component compositing body + gear layers with the
  duotone filter — build it where both the plugin page and widget import it
  (plugin-local; the widget is the same remote).
- Permissions: CASL namespaced subjects + `PERMISSION_REGISTRY` (ADR 018);
  hatch/equip/pick are own-row tier 1+; the family pseudo-profile is excluded in
  the route (ADR 053's enforcement pattern).
- Events: `companion.*` per `module.noun.verb` — declare in the manifest
  (e.g. hatched, levelup.reached, item.picked, item.equipped).
- Validation via `@family-os/schemas` Zod (standing memory), TanStack Query with
  profile-scoped keys sharing a prefix between page and widget.
- Tests: API suite on `familyos_test` (see memory `project-running-tests` +
  `project-test-db-migrate-p3009` — hand-apply new migration SQL to the test DB),
  RTL for the hatch flow.

## Outputs (required before closing)

- [ ] The plugin scaffolded, registered, migrated; hatch works end-to-end in the
      real shell — **live review before close-out** (standing feedback)
- [ ] PR per convention; session log + progress row + queue update; delete this
      kickoff
