# Story: Notification Design Audit

**Module:** platform  
**Type:** Design  
**Status:** ⬜ Not Started

---

## Goal

Revisit two open questions surfaced after the notification-infrastructure implementation session (2026-06-06).

---

## Open Questions

### 1. NotificationItem — design alternatives

`NotificationItem` was implemented without presenting alternatives. Before it becomes a fixture in the tray, explore at least two other approaches for the repeating unit:

- Density (compact vs. spacious)
- Icon placement and sizing
- Read/unread visual distinction (currently none — all items render identically)
- Timestamp position (inline vs. below body)
- Whether a dismiss/swipe action belongs on the item itself

### 2. Notification routing model

The current implementation routes notifications to the active profile only. Several open questions need a design decision before they influence any further implementation:

- **Family feed vs. notification system** — what is the distinction? Notifications are pull-based ephemeral alerts for the current user. Family feed is a shared activity stream. Are there cases that genuinely belong in both?
- **Broadcast notifications** — some events (family-wide announcements, scheduled reminders visible to all) may need to target multiple profiles at once. Does a notify call accept a target list, or does the caller fire one per profile?
- **Family profile / tier 1 tray access** — tier gates the current tray (tier 2+), but profile type and tier are orthogonal. Should the family profile (always tier 1) have access to a notification surface? If so, what shape — ephemeral only, in-memory session log, or persistent tray?
- **Per-profile read state** — confirmed correct: marking read for one profile does not affect other profiles. Document as settled.

---

## Outputs

- Updated `NotificationItem` design (or confirmed current is correct)
- Notification routing decision recorded as ADR
- `docs/design-system.md` updated if tray/item visual language changes
- Queue updated with any follow-on implementation story if the design diverges from current implementation
