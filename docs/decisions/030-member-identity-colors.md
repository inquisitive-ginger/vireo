# ADR 030 — Member Identity Color System

**Status** — Decided (2026-06-11, Family Feed visual language session)

## Decision

Every family member is represented by one of **six fixed identity hues**
harmonized with the Terracotta & Teal palette:

`terracotta` · `marigold` · `sage` · `teal` · `sky` · `plum`

Each hue ships as three CSS custom property layers (light + dark aware),
defined in `packages/ui/src/styles.css`:

- `--identity-{hue}` — base: spines, rings, markers
- `--identity-{hue}-tint` — avatar fill, soft backgrounds
- `--identity-{hue}-ink` — initials/text on tint

Modules consume the palette through `@family-os/ui` helpers
(`getIdentityHue`, `identityToken`, `identityColor`) or the
`ProfileAvatar identity` prop — never raw oklch values.

**Assignment:** name-hash fallback today (`getIdentityHue`). The planned
evolution is an explicit `identityHue` field on the platform profile,
assigned round-robin at profile creation and editable by parents in
Settings. Component APIs already accept an explicit hue, so the upgrade
is non-breaking.

## Why

- A family app's most emotionally resonant material is its people. A
  stable per-person color makes authorship legible at a glance — across
  feed posts, calendar chips, chore assignments — without reading a name.
- The previous implementation hashed names to an arbitrary 0–360 hue,
  which produced off-palette colors that fought the Terracotta & Teal
  scheme and gave visually identical colors to similar names (both "Z"
  names in the seed family rendered the same mint green).
- Six hues is enough for a household while keeping every hue nameable,
  distinguishable at small sizes, and tuned for both modes.

## Alternatives considered

- **Arbitrary hash hue (status quo)** — rejected: off-palette results, no
  dark-mode tuning, invisible collisions, no path to user control.
- **Free color picker per profile** — rejected for now: invites off-palette
  choices that break the visual language; a constrained picker over the six
  hues can ship later in Settings.
- **Avatar photos as the identity carrier** — insufficient: photos don't
  scale down to spines, dots, and chips, and not every profile has one.

## Do not revisit unless

- The household size regularly exceeds six members and collisions become a
  practical problem (then: extend the palette deliberately, don't open it).
- User research shows children cannot distinguish or don't identify with
  the assigned hues.
