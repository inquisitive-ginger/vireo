# 018 — CASL Permission Model

**Status:** Decided — extends and supersedes the permission-check mechanism in ADR 015

**Decision:** Authorization uses CASL with an `(action, subject)` model.
ADR 015's intent (tier baseline + grants − revocations, `TierGate` +
`PermissionGate`) is preserved; this ADR replaces the flat
`module.noun.verb` string model for capability checks with CASL abilities.
The `module.noun.verb` convention is retained for **event names only**
(ADR 008).

**Why:** `@casl/prisma` provides `accessibleBy()`, which converts a CASL
ability into a Prisma `WHERE` clause automatically. Without this, every route
handler in every module must manually filter database rows by `profileId` — a
pattern that must be duplicated across all 7+ planned modules and is easy to
omit. CASL's condition model (`can('read', 'Task', { assignedProfileId: profile.id })`)
expresses row-level ownership rules that a flat boolean model cannot. The
`PERMISSION_REGISTRY` const object serves both compile-time type derivation
and runtime enumeration for the parent permission management UI.

**Permission model:**

`createAbility(profile, overrides)` builds a typed CASL `AppAbility` from:
1. The tier baseline rule set for `profile.tier`
2. Per-profile grants and revocations stored in `platform.permission_overrides`

Subjects are namespaced strings to avoid module collisions:
`'platform.Profile'`, `'chores.Task'`, `'finance.Transaction'`, etc.

Actions are plain verbs: `'view'`, `'create'`, `'complete'`, `'manage'`, etc.

**PERMISSION_REGISTRY shape (M0 — `platform.*` namespace only):**

```typescript
export const PERMISSION_REGISTRY = {
  'platform.profile.view':   { label: 'View profiles',         module: 'platform', action: 'view',   subject: 'platform.Profile' },
  'platform.profile.switch': { label: 'Switch active profile', module: 'platform', action: 'switch', subject: 'platform.Profile' },
  'platform.plugin.view':    { label: 'Use plugins',           module: 'platform', action: 'view',   subject: 'platform.Plugin'  },
} as const

export type PermissionString = keyof typeof PERMISSION_REGISTRY
```

Each module adds its entries to this registry when it is implemented.

**Tier baselines (M0):**

| Tier | Baseline abilities |
|------|--------------------|
| 1 (child) | `view platform.Plugin` |
| 2 (child, older) | `view platform.Plugin` |
| 3 (teen) | `view platform.Plugin`, `switch platform.Profile` |
| 4 (parent) | `manage all` |

**`TierGate` vs `PermissionGate`:**

- `TierGate` — hard structural ceiling; checks tier level directly; not
  overridable by parent grants. Use for sections that should never exist
  below a tier (admin panels, family settings).
- `PermissionGate` — checks the full CASL ability (tier baseline + overrides).
  Use for capabilities a parent might reasonably grant early or revoke as a
  consequence.

**Alternatives considered:**

- **Flat TypeScript union type:** compile-time safe but erased at runtime —
  the parent permission management UI cannot enumerate permissions; also
  cannot express row-level conditions
- **Plain `string` type with runtime registry:** no compile-time safety;
  typos in `can()` calls silently return `false`
- **Drizzle ORM + CASL:** no official adapter; community package
  `casl-drizzle-query-adapter` is v0.1.2 (Jan 2026), lacks `accessibleBy()` —
  manual SQL conversion required, eliminating the primary reason to adopt CASL

**Do not revisit unless:** The permission set grows large enough that a
central barrel file becomes unmanageable — at that point evaluate a
code-generation approach.
