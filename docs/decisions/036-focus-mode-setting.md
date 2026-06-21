# 036 — Focus Mode: a per-profile setting on the Profile model

**Status:** Decided

**Decision:** The taskee surface's **Focus-vs-Agency** variant is chosen by a
**per-profile `focusMode` setting** stored as a **nullable boolean column on the
platform `Profile` model** (`focus_mode BOOLEAN`, Prisma `focusMode Boolean?`):

- `null` → **derive from tier** (the default). The tier default is **tiers 1–2 →
  Focus on; tiers 3–4 → Agency** (decided in the M2 Dev: Focus Mode gate,
  2026-06-20).
- `true` / `false` → an explicit **parent override** that wins over the tier
  default.

A shared pure helper resolves the effective value:

```ts
// @family-os/platform
resolveFocusMode(focusMode: boolean | null | undefined, tier: number): boolean
  => focusMode ?? tier <= 2
```

`GET /api/auth/me` returns the **resolved effective boolean** as `focusMode` (the
page and widget branch on it directly via `useAuth`). `GET /api/profiles` returns
the **raw nullable** `focusMode` so the parent-override UI can distinguish
"Default" from an explicit choice. `PATCH /api/profiles/:id` accepts
`focusMode: boolean | null` (tier-4 only, via the existing `UpdateProfileSchema`).

**Why:** This is the **exact precedent set by `darkMode`** (ADR-era widget-layouts
migration) — a nullable per-profile preference where `null` means "follow the
sensible default." Reusing that shape means:

- A `null` setting **automatically re-derives** when a profile's tier changes — no
  migration of stored overrides on tier change (unlike permission overrides, which
  are cleared). The override only persists when a parent has _deliberately_ set it.
- No new table, join, or generic settings store to maintain for a single boolean.
- The setting rides the **already-fetched** `/auth/me` and `/profiles` payloads —
  no extra round-trip for the page or the widget.

**Alternatives considered:**

- **Generic per-profile settings table** (`profile_settings(profile_id, key,
value)`). More flexible, but premature for one boolean; adds a join and a
  read/write surface with no second consumer yet. Revisit if/when several
  per-profile module preferences accumulate — at which point `darkMode` and
  `focusMode` could both migrate into it.
- **Tier alone decides the variant** (no per-profile setting). Rejected in M2
  Design (2026-06-15): "a focused 6yo and a scattered 10yo don't split cleanly by
  age." Tier is the _default_, not the _rule_.
- **Store the resolved boolean** (no `null`). Loses the "follow tier default"
  semantic — a profile that never opted in would freeze its variant at creation
  tier and silently diverge from the default if the threshold ever changes.

**Do not revisit unless:** a second or third per-profile module preference appears
(then consolidate `darkMode` + `focusMode` into a generic settings store), or the
tier-default threshold needs to vary per family (then it moves to family config,
not the per-profile override).
