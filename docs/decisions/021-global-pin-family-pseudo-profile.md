# 021 — Global Family PIN + Family Pseudo-Profile

**Status:** Decided
**Amends:** ADR 017 (pin storage and verification behavior)

---

## Decision

Two related decisions settled in the Login / Profile-Switch UX design session:

**1. Single global family PIN.** One PIN gates all upward profile switching for the
whole family. It is stored in a `platform.system_config` table, not on individual
profiles. Any tier-4 profile can set or reset it.

**2. Family pseudo-profile.** A `family` pseudo-profile is a permanently seeded system
record. It is the active profile when no family member has identified themselves. It is
tier 1 with all write permissions removed via the CASL model. This is the tablet's
default unattended state — not a lock screen.

---

## Why — Global PIN

Per-profile PINs (the ADR 017 original) require parents to remember multiple
credentials and create ambiguous UX copy ("whose PIN?"). A single family PIN
is simpler, more memorable, and accurately reflects the intent: the PIN gates
upward switching, not individual identity. Any tier-4 profile can change it,
so there is no single-owner dependency.

## Why — Family Pseudo-Profile

The tablet is an always-on family information center. A lock screen that gates
all access is friction without benefit — shared content (upcoming events, chore
leaderboard, shared goals) is safe to show to any household member or guest.

Modeling this as a pseudo-profile means modules render tier-appropriate content
uniformly; there is no special null-auth code path. The family pseudo-profile is
tier 1 with no write permissions. `TierGate min={1}` renders normally; write
actions fail permission checks and trigger contextual profile selection.

---

## Schema changes from ADR 017

Remove `pin_hash` from `platform.profiles`.

Add `platform.system_config`:

```sql
CREATE TABLE platform.system_config (
  key         text PRIMARY KEY,
  value       text,
  updated_by  uuid REFERENCES platform.profiles(id),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
```

The family PIN is stored as `key = 'family_pin_hash'`.

Seed a `family` pseudo-profile:

```ts
{ id: 'family', name: 'Family', tier: 1, avatar_url: null }
```

The family profile is never shown in the profile picker grid. It is activated
automatically on inactivity; it cannot be selected by a user.

---

## `POST /auth/verify-pin` behavior

Endpoint signature is unchanged: `{ pin, targetProfileId }`.

The server verifies `pin` against `system_config` where `key = 'family_pin_hash'`
rather than a per-profile hash. `targetProfileId` is still required to complete
the switch after verification.

If no family PIN has been set, the endpoint returns 423 (Locked) — upward
switching is unavailable until a tier-4 profile sets one.

---

## Future extension point

Biometrics (Touch ID / Face ID) would replace PIN entry as the verification
pathway on the `POST /auth/verify-pin` flow. The session/switch model is
unchanged; it is a UI-layer swap. No architectural accommodation needed now.

---

## Alternatives considered

- **Per-profile PINs** (original ADR 017): rejected — multiple credentials,
  ambiguous copy, no practical benefit for a home system
- **No PIN at all:** rejected — upward switching must be parent-gated
- **Tier 0 pseudo-profile:** considered — rejected in favor of tier 1 read-only,
  which avoids extending the tier numbering in ADR 003 and requires no new
  TierGate API surface

---

## Do not revisit unless

The platform needs per-profile authentication (e.g., remote access, individual
privacy between co-parents), or biometric authentication is added as an
alternative verification pathway.
