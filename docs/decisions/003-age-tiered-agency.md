# 003 — Age-Tiered Agency Model

**Status:** Decided

**Decision:** Four trust tiers, referenced internally by level (1–4).
Display names are family-configurable strings with system defaults.
Capability rules are bound to levels, not names. Tiers are
parent-assigned based on trust, not age-locked.

**Why:** Kids are participants, not subjects. A binary parent/child
permission model doesn't reflect how trust actually grows. Tiers let
the system evolve with the child without the implementation caring
about what a family calls each level.

**Alternatives considered:** Binary parent/child roles (too rigid);
age-locked permissions (trust isn't age, it's earned); configurable
number of tiers (unnecessary complexity — four maps well to
developmental stages).

**Do not revisit unless:** Core philosophy on kids' agency changes.
