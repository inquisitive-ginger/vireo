# Story: Identity Hue Assignment (retire the name hash)

**Status:** ⬜ Not Started
**Module:** platform
**Raised by:** Design + Dev: Chores Overhaul (2026-07-12, ADR 043)

---

## Problem

`getIdentityHue(name)` hashes a member's name into **six** buckets
(`IDENTITY_HUES`). A household of four can therefore hand **two members the same
hue** — and already does: in the chores fixtures, **"Zach" and "Emma" both resolve
to terracotta.**

Colour = person (ADR 030) is the load-bearing convention of the whole app: a
calendar chip is a coloured pill and nothing else. When two members share a hue,
that mapping is not degraded, it is **wrong** — the colour points at two people at
once, and nothing on the surface disambiguates.

**ADR 043 raised the stakes.** The chores admin board now puts the assignee's hue
on **every row spine**, and adjacent member groups sit directly above one another.
Two same-hued members side by side is precisely the case this colour language
cannot survive. The bug predates the board rework, but the board rework is what
makes it visible and consequential.

## Proposed direction

Assign a hue **explicitly, at profile creation**, and persist it:

- Take the **first free hue** from `IDENTITY_HUES` at create time; fall back to the
  hash only when all six are taken (a 7+ member household, where a collision is
  unavoidable and should at least be _deliberate_).
- Persist on `Profile` (an `identityHue` column). The plumbing already exists on the
  read side — `ProfileAvatar` takes an explicit `identity` prop, and `identityToken`
  accepts an `OwnerHue` — so the hash becomes a **fallback**, not the source.
- `FAMILY_HUE` stays reserved and unassignable (ADR 041).
- Backfill existing profiles; a parent should be able to **change** a member's hue
  in Settings (the switcher and member list are the app's legend — ADR 042 — so the
  hue is a visible, editable property of a person, not an implementation detail).

## Acceptance criteria (draft)

- [ ] No two members of a household share an identity hue while ≤ 6 members exist
- [ ] A member's hue is stable across renames (the hash is not — renaming "Zach" to
      "Zachary" silently re-colours them everywhere today)
- [ ] Existing profiles are backfilled without changing any member's current colour
      where that colour is already unique
- [ ] A tier-4 parent can reassign a member's hue in Settings
- [ ] `getIdentityHue` remains as the fallback for profiles with no assigned hue

## Notes

- **Renames are the second bug here.** Because the hue is derived from the name,
  editing a member's name today silently changes their colour across the calendar,
  the feed, and the chores board. Nobody has hit it yet because nobody has renamed
  a profile.
- Reads: ADR 030 (member identity colors), ADR 041 (the reserved family hue),
  ADR 042 (the switcher/settings list as the legend), ADR 043 (why rows now depend
  on hue harder than before), `packages/ui/src/lib/identity.ts`.
