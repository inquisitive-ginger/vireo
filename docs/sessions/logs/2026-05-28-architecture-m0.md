# Session Log — M0 Architecture

![Type](https://img.shields.io/badge/Type-Architecture-blue) ![Date](https://img.shields.io/badge/Date-2026--05--28-lightgrey) ![Milestone](https://img.shields.io/badge/Milestone-M0-informational) ![Status](https://img.shields.io/badge/Status-Complete-brightgreen) ![ADRs](https://img.shields.io/badge/ADRs-017–020-blue)

---

## What Was Decided

| Decision | ADR |
|----------|-----|
| Auth session mechanism: `@fastify/session` + `connect-pg-simple`; cookie-based server-side sessions; session stores `activeProfileId`; profile switching enforces tier-gate PIN model (switching up requires PIN) | 017 |
| Permission model: CASL `(action, subject)` replaces flat `module.noun.verb` strings for capability checks; `PERMISSION_REGISTRY` const object for compile-time types + runtime enumeration; ADR 015 mechanism extended | 018 |
| ORM: Prisma; `@casl/prisma` `accessibleBy()` for automatic row-level filtering; per-plugin `schema.prisma` files aligned with ADR 009 schema isolation | 019 |
| Plugin dev toolchain: Turborepo generator (`pnpm turbo gen plugin`); per-plugin Vite dev servers; no custom CLI | 020 |

Key nuances recorded:

- **Profile model confirmed:** each family member is a `Profile` row (`id`, `name`, `tier`, `pin_hash nullable`). The session is per-device and stores one active `profileId`. "Login" is profile activation, not credential authentication.
- **Tier-gated switching:** switching to a lower or equal tier is unblocked; switching to a higher tier requires a PIN from a profile at or above the target tier. The UX mechanism is a separate design session — M0 ships a dev-mode selector.
- **CASL replaces flat strings for permissions only.** Event names retain `module.noun.verb` (ADR 008). The permission `(action, subject)` model was chosen primarily for `accessibleBy()` — row-level filtering across all modules without manual `WHERE` clauses.
- **Drizzle evaluated and ruled out** — no official CASL adapter; community package lacks `accessibleBy()`.
- **`TierGate` vs `PermissionGate`** distinction confirmed: `TierGate` is a hard structural ceiling (not overridable by parent grants); `PermissionGate` checks the full CASL ability including parent overrides.
- **ADR 015 status:** intent preserved (tier baseline + grants − revocations, both gate primitives); permission-check mechanism superseded by ADR 018.

## What Was Produced

- ADRs 017–020
- `docs/architecture.md` — settled decisions table updated; Platform API, Auth, and Plugin Dev Toolchain sections added; stale To Be Defined items removed
- `docs/decisions/015-permission-layer.md` — status updated to note extension by ADR 018

## Open Questions Raised

- **`platform.permission_overrides` DB schema** — the table columns for CASL's `(action, subject, conditions?)` model were not fully specified. Deferred to auth-and-profiles implementation story.
- **Ability type definition** — the full `AppAbility` type (all subjects across all modules) will grow as modules land. A code-generation approach may be warranted at M3+; flag then.

## What the Next Session Needs to Know

- **Auth-and-profiles story is now unblocked.** The mechanism is settled: `@fastify/session`, CASL ability built from tier baselines + `permission_overrides` rows, `usePermissions()` returns the `AppAbility` instance.
- The login/profile-switch UX design session (queue item 2) must still complete before auth-and-profiles is *implemented* — but the infrastructure decisions are no longer blocking the story spec.
- Every plugin that reads data from PostgreSQL should use `accessibleBy(request.ability, action).SubjectName` in its Prisma queries — this is the pattern, not optional.
- The demo plugin must exercise `accessibleBy()` to validate the full CASL + Prisma integration end-to-end before M1 begins.
