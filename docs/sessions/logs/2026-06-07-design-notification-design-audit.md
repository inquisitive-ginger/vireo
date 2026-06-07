# Session: notification-design-audit

**Date:** 2026-06-07
**Type:** Design (with implementation)
**Story:** `platform/notification-design-audit`

---

## What was decided

### NotificationItem — Frame B selected

Four frames were presented in a Storybook playground
(`notification-item.playground.stories.tsx`, now deleted). Frame B was chosen:

- **Left accent bar:** 3px `--accent` (teal) when unread; transparent when read
- **Title weight:** 600 (unread) · 400 (read); color shifts to `--muted-foreground` when read
- **Icon opacity:** full (unread) · 0.45 (read)
- **Timestamp:** right-aligned on the title row (not below body) — saves vertical space

**Rationale:** Left bar is a touch-safe unread signal (no precise interaction
required). Inline timestamp reduces row height. Bold title is a familiar
read/unread convention. Cleanest read/unread distinction of the four frames.

### Mark-all-read timing fix

The original implementation fired `POST /notifications/read` on tray **open**,
which meant all items were marked read before the list rendered — the unread
visual state was invisible. Moved to tray **close** (fire-and-forget).

### Per-item delete

- **Touch/pen:** swipe-left via `@use-gesture/react` (`axis: 'x'`, `pointer: { mouse: false }`). Reveals red backdrop. Auto-dismisses past 100px threshold or on flick (velocity > 0.5). Snaps back otherwise.
- **Mouse:** hover × button (`Button variant="ghost" size="icon-sm"`) top-right of item.
- New API routes: `DELETE /notifications/:id` and `DELETE /notifications` (clear all).
- Optimistic updates: list empties immediately in the UI before server confirms.

### Clear all

"Clear all" button added to tray header (right side), visible when list is non-empty.

### Routing model decisions (all settled)

1. **Family Feed vs. notifications** — separate systems, no structural overlap needed.
2. **Broadcast targeting** — `platform.notify()` targets active profile only for M1. Broadcast deferred.
3. **Tier 1 tray gate** — current behavior (toasts only, no tray) is correct.
4. **Per-profile read state** — confirmed correct; documented in ADR 029.

---

## What was produced

- `packages/ui/src/components/notification-item.tsx` — Frame B design + swipe gesture + hover delete
- `packages/ui/src/components/notification-tray.tsx` — Clear All button + `onDeleteNotification` / `onClearAll` props
- `packages/ui/src/components/button.tsx` — new `icon-sm` size (`h-4 w-4 rounded p-0`)
- `apps/api/src/plugins/notifications.ts` — two new DELETE routes
- `apps/shell/src/components/Sidebar.tsx` — mark-all-read timing fix + delete handlers with optimistic updates
- `packages/ui/src/components/notification.stories.tsx` — updated stories for Frame B design
- `apps/api/src/plugins/notifications.test.ts` — 7 new tests for DELETE routes
- `packages/ui/src/components/notification-tray.test.tsx` — 5 new tests for Clear All + per-item delete
- `docs/decisions/029-notification-system.md` — updated with all 4 routing decisions
- `docs/design-system.md` — Notification System section updated with Frame B spec + interaction model
- `docs/modules/platform/stories/family-profile-notifications.md` — stub story for shared-device notification surface

---

## Acceptance criteria status

| Criterion                            | Status                    |
| ------------------------------------ | ------------------------- |
| Updated `NotificationItem` design    | ✅ Done — Frame B         |
| Notification routing ADR recorded    | ✅ Done — ADR 029 updated |
| `docs/design-system.md` updated      | ✅ Done                   |
| Queue updated with follow-on stories | ✅ Done                   |

---

## Decisions made

- Frame B chosen (see above)
- Swipe + hover × delete chosen over per-item read toggle — delete is semantically simpler and the 50-item cap means storage isn't a concern
- `@use-gesture/react` chosen over hand-rolled pointer events — axis disambiguation and pointer capture are non-trivial to get right

---

## New stories created

- `platform/family-profile-notifications` — design + dev story for shared household device notification surface (tier 1, kitchen tablet / TV Pi display)

---

## Open questions raised

- **Family profile notification surface shape:** ambient strip? floating badge? in-memory only? Needs a design session before implementation. See stub story.
- **Broadcast targeting:** what's the right API shape for `notify({ audience: 'family' })`? Blocked on family-profile-notifications design.

---

## What the next session needs to know

- notification-design-audit is complete and merged to main
- `NotificationItem` now requires `isRead` and optionally `onDelete` — existing usages without these props render as "unread" (left bar always visible) which is the safe default
- Next in queue: **M1 Dev: web-push** (depends on notification-infrastructure + pwa-installable, both done)
- The `family-profile-notifications` story is queued but not time-sensitive for M1
