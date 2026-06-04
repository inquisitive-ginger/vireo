# 028 — Home Surface Default Layouts

**Status:** Decided
**Amends:** ADR 022 (fills in default layout definitions deferred to M1)

---

## Decision

Three tier-appropriate default widget layouts are defined for the home surface. New
users are seeded from platform config with the layout matching their tier bucket.
Family Feed, Chores, and Calendar are **reserved modules** — their slots appear in
every default layout. When a reserved module's plugin is not installed, the shell
renders a placeholder card in the slot rather than collapsing it.

---

## Default layouts

Stored in platform config as `{ widgetId, x, y, w, h }[]` — React Grid Layout's
native serialization format. The `widgetId` values must match the `id` fields in
each plugin's `manifest.json`.

**Family pseudo-profile** (unattended tablet):

| `widgetId` | x | y | w | h | Named size |
|-----------|---|---|---|---|------------|
| `family-feed.feed` | 0 | 0 | 4 | 1 | `banner` |
| `chores.today-summary` | 0 | 1 | 2 | 1 | `standard` |
| `calendar.today` | 2 | 1 | 2 | 1 | `standard` |

Family Feed spans full width — maximally legible from across a room. Chores and
Calendar are equal peers below it.

**Tiers 1–2** (child profiles):

| `widgetId` | x | y | w | h | Named size |
|-----------|---|---|---|---|------------|
| `chores.today-summary` | 0 | 0 | 2 | 2 | `large` |
| `family-feed.feed` | 2 | 0 | 2 | 1 | `standard` |
| `calendar.today` | 2 | 1 | 2 | 1 | `standard` |

Chores dominates — it is the primary daily action for child profiles.

**Tiers 3–4** (parent/teen profiles):

| `widgetId` | x | y | w | h | Named size |
|-----------|---|---|---|---|------------|
| `calendar.today` | 0 | 0 | 2 | 2 | `large` |
| `family-feed.feed` | 2 | 0 | 2 | 1 | `standard` |
| `chores.today-summary` | 2 | 1 | 2 | 1 | `standard` |

Calendar dominates — scheduling is the primary concern for parent and teen profiles.

These are initial defaults. The platform config seed data can be updated at any time
without an ADR revision.

---

## Core module reservation

Reserved modules hold positions in every default layout regardless of install state.
In M1 the reserved set is: Family Feed, Chores, Calendar.

The shell evaluates reserved slots at render time: if the plugin owning a `widgetId`
is absent from the registry, the slot renders the placeholder component at the same
`{ w, h }` dimensions. The saved layout record is preserved and the real widget
renders when the plugin is later installed.

This is a shell-level concern. Plugins do not handle their own absent state.

---

## Placeholder card spec

See `docs/design-system.md` Home Surface section for the full visual spec. Summary:
`--muted` background, `--muted-foreground` label, Lucide icon, one-line description,
no install CTA.

---

## Why

Defining the default layouts explicitly prevents each implementation session from
making undocumented ad-hoc layout choices. Pinning the `widgetId` values here creates
a stable contract between the platform config seed and the plugin manifests — if a
plugin author renames a widget ID, the mismatch is immediately visible.

Reserved slots with placeholders communicate that the home screen is a coherent
system under construction, not a sparse single-widget surface. The placeholder avoids
a "where did everything go?" experience when Chores and Calendar aren't installed yet.

---

## Alternatives considered

**Single universal default layout** — simpler, but ignores the core principle that
kids and parents have meaningfully different primary surfaces. Chores-first for a
7-year-old; calendar-first for a parent.

**No reservation — layout fills as modules install** — clean but leaves the home
screen feeling sparse and unintentional in M1. A parent setting up the system would
see only the Family Feed widget.

**Per-profile custom layouts from first login** — maximum flexibility, but requires
a configuration UI before there are modules to configure. The seeded defaults with
parent editability (ADR 022) is the right order of operations.

---

## Do not revisit unless

The reservation model itself needs to change (e.g., allowing plugins to declare
themselves as reserved rather than the shell hardcoding the set), or the tier bucket
groupings (1–2 vs 3–4) prove wrong after real-world use.

The default layout seed data is not covered by this ADR — it is tunable at any time.
