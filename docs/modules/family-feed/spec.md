# Family Feed — Module Spec

> Stub from Home Surface Design session (2026-06-03).
> Full story breakdown in M1 Product Planning session.

---

## What it is

A home screen widget and associated feed view for shared family text posts. Serves
as the social layer of the home surface — a lightweight shared bulletin that anchors
the family dashboard without requiring any other module to be installed.

## M1 scope (MVP)

- Text posts only
- Posts visible as a home screen widget
- Full feed view accessible via widget tap-through
- Compose flow for profiles with write permission

## Deferred to Family Feed v2

- Activity feed aggregation (chore completions, calendar events, P-Bucks milestones
  surfaced as feed items via event subscriptions)
- Richer post types (images, links)
- Reactions
- Post targeting (all family vs. specific members)

---

## Widget spec

### `family-feed.feed`

| Field                | Value                         |
| -------------------- | ----------------------------- |
| `id`                 | `family-feed.feed`            |
| `displayName`        | Family Feed                   |
| `defaultSize`        | `standard`                    |
| `supportedSizes`     | `standard`, `large`, `banner` |
| `minTier`            | 1                             |
| `requiredPermission` | — (none)                      |
| `description`        | Recent family posts.          |

### Content at each size

Widget components use CSS container queries — layouts adapt to actual rendered slot
width, not viewport width.

**`standard` / `banner`** (1 row, ~180px tall): Latest post — avatar, author name,
timestamp, truncated post text. Tap navigates to the full feed view.

**`large`** (2 rows, ~376px tall): 2–3 posts stacked, same card pattern per post.

### Empty state

"No posts yet — be the first to share something."

Compose button rendered only when the active profile has write permission. Hidden for
the family pseudo-profile (tier 1, no writes) and any tier-1 profile.

---

## Home surface placement

Reserved in all three default layouts (see ADR 028):

| Tier bucket           | Size       | Position           |
| --------------------- | ---------- | ------------------ |
| Family pseudo-profile | `banner`   | Full-width top row |
| Tiers 1–2             | `standard` | Top-right          |
| Tiers 3–4             | `standard` | Top-right          |
