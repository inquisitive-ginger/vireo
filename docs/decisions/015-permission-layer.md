# 015 — Permission Layer on top of Tier Model

**Status:** Decided — permission-check mechanism extended by ADR 018 (CASL); intent and gate primitives unchanged

**Decision:** Trust tier (ADR 003) defines a baseline permission set.
Individual permissions can be granted above or revoked below that
baseline by a parent. The UI and capability checks operate on the
*effective* permission set — never on tier alone.

```
effective permissions = tier_baseline ∪ granted_permissions − revoked_permissions
```

The user object carries three fields:

```ts
interface User {
  tier: 1 | 2 | 3 | 4;
  grantedPermissions: string[];  // above-tier grants
  revokedPermissions: string[];  // below-tier revocations
}
```

The platform computes effective permissions at auth time and exposes
them via `usePermissions()`. Plugins and shell components never
access the raw tier permission table directly — they check effective
permissions only.

Two rendering primitives coexist:

```tsx
// TierGate — checks tier level directly
// For coarse structural gating (admin nav, management sections)
<TierGate min={3}>
  <AdminPanel />
</TierGate>

// PermissionGate — checks effective permissions
// For specific capabilities that can be granted/revoked independently
<PermissionGate permission="tasks.create">
  <NewTaskButton />
</PermissionGate>
```

**Why:** Trust is earned and lost incrementally, not in tier-sized
jumps. A parent may want to trial a specific capability with a child
before committing to a full tier promotion — granting `tasks.create`
to a Tier 2 child to see if they're ready for Tier 3 without fully
elevating them. Equally, a consequence may mean temporarily revoking
a specific capability without demoting the child's tier. The tier
remains the stable baseline; permissions are the fine-grained
adjustment layer on top.

This extends ADR 003 (capability rules bound to levels) without
contradicting it — tier still defines the default capability set.
The permission layer adds the ability to deviate from that default
in both directions.

**Alternatives considered:** Tier-only (no individual permission
grants/revocations) — too coarse for the trust-building use case;
full RBAC with no tier concept — loses the semantic clarity of tiers
as developmental stages that the family understands intuitively;
permissions only with no tier baseline — every capability must be
explicitly assigned, high administrative overhead for a household.

**Do not revisit unless:** The trust tier concept (ADR 003) is
abandoned, or a future use case requires permissions that cannot be
modelled as grants/revocations from a tier baseline.
