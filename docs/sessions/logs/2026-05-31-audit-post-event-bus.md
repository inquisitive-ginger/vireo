# Session Log — Audit: Post-Event-Bus Consistency Pass

![Type](https://img.shields.io/badge/Type-Audit-yellow) ![Date](https://img.shields.io/badge/Date-2026--05--31-lightgrey) ![Milestone](https://img.shields.io/badge/Milestone-M0-informational) ![Status](https://img.shields.io/badge/Status-Complete-brightgreen)

---

## What Was Audited

Consistency pass after three M0 implementation sessions (dev-environment,
shell-skeleton, event-bus). Goal: catch any drift before auth-and-profiles starts.

---

## Issues Found and Resolved

| # | Issue | Fix |
|---|-------|-----|
| 1 | `auth-and-profiles` story AC #3: `system_config.value` typed as `text` — architecture.md was corrected to `jsonb` in the 2026-05-30 audit but the propagation missed the story spec | Updated AC #3 to `value (jsonb)` |
| 2 | `design-system.md` showed `PermissionGate` with a single `permission` prop — predates ADR 018 settling the CASL `(action, subject)` model | Updated both examples to `action`/`subject` props |
| 3 | `progress.md` listed auth-and-profiles as "Blocked on M0 Architecture" — that session completed 2026-05-28 | Removed stale blocker note |
| 4 | `design-system.md` To Be Defined table had a row for "Permission string registry (full enumeration)" deferred to "M0 Architecture session" — that session is done; registry grows per-module organically | Removed the row |
| 5 | `architecture.md` documents `useEventBus()` as a `@family-os/platform` export returning `{ publish, subscribe }` — currently a callback-based dev hook in `apps/shell`, not yet in the platform package | Added note to architecture.md; added `useEventBus` promotion to `auth-and-profiles` story scope |
| 6 | ADR 018 prose correctly named subjects as namespaced (`'platform.Profile'`) but all code examples used bare nouns (`'Profile'`, `'Plugin'`) — inconsistency would have caused a mid-build collision risk as modules multiply | Updated ADR 018 code examples, architecture.md PERMISSION_REGISTRY, auth-and-profiles story ACs and tier table, and design-system.md hook example to use namespaced subjects throughout |

---

## Key decisions made

- **Namespaced CASL subjects** — `'platform.Profile'`, `'chores.Task'`, `'finance.Transaction'` etc. The ADR 018 prose was right; the code examples were wrong. Namespacing prevents collisions in the shared global `AppAbility` as modules multiply. Bare nouns are CASL's default convention but don't scale to a multi-module system with a single shared ability instance.
- **`useEventBus` is deferred to auth-and-profiles** — the event-bus story built the WS bridge and a dev hook in the shell. The full platform-exported hook with `{ publish, subscribe }` is in scope for auth-and-profiles, which is when all `@family-os/platform` hooks are built out.

## Issues deferred

None.

## What the next session needs to know

- `auth-and-profiles` scope now includes promoting `useEventBus` from `apps/shell` to `@family-os/platform` with the `{ publish, subscribe }` shape documented in architecture.md. The existing shell hook can be deleted or replaced.
- All CASL subjects must use the `module.Noun` namespace format — see ADR 018 and architecture.md PERMISSION_REGISTRY for examples.
- `system_config.value` is `jsonb` — confirmed in both architecture.md and the story AC.
