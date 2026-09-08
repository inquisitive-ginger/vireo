# 029 — Notification System Model

**Status:** Decided

**Decision:** All in-app and push notifications flow through a single
`platform.notify()` API. Plugins never render their own toasts, trays,
or push payloads. The platform routes each notification to the
appropriate delivery channel (toast, notification tray, Web Push) based
on the notification's declared priority and the active profile's tier.

```typescript
platform.notify({
  title: string,
  body?: string,
  variant: 'success' | 'info' | 'warning' | 'error',
  priority?: 'info' | 'alert',  // default: 'info'
  actions?: Array<{ label: string; href: string }>
})
```

**Routing rules:**

| Channel           | Condition                                                        |
| ----------------- | ---------------------------------------------------------------- |
| Toast             | Always, for all tiers with access to the originating module      |
| Notification tray | Tier 2+ profiles; all priorities                                 |
| Web Push          | Tier 4 (default on) or tier 3 (opt-in); `priority: 'alert'` only |

`priority: 'info'` never triggers Web Push regardless of tier.

**Bell badge:** Displays unread count. Badge color reflects `max(severity)`
across unread items — `--accent` (info/success), `--warning`, or `--error`.
Resets on tray **close** (not open — unread state must be visible during review).

**Routing decisions settled (2026-06-07):**

1. **Family Feed vs. Notification System** — entirely separate systems.
   Notifications are ephemeral, pull-based, profile-specific. Family Feed is
   a persistent shared activity stream. A plugin may produce both independently
   (e.g. chore completion → notify parent + create feed post), but they never
   share routing or storage.

2. **Broadcast targeting** — `platform.notify()` targets the active profile
   only for M1. Broadcast use cases (family-wide reminders, scheduled alerts)
   are deferred to a follow-on story. No API change needed for M1.

3. **Family profile (tier 1) tray access** — tier 2+ gate on the tray is
   correct. The family profile is an ambient display surface, not a user
   reviewing notification history. It receives toasts for modules it has
   access to (unchanged). A dedicated notification surface for shared/TV
   devices was carried as an open question until 2026-09-07, when it was
   recycled unbuilt; toasts remain the tier-1 surface.

4. **Per-profile read state** — marking notifications as read for one profile
   does not affect other profiles. Implemented correctly; confirmed settled.

**Why:** "Calm by default" requires global rate-limiting, deduplication,
and tier-appropriate filtering — only possible if every notification flows
through one point. Plugins cannot know which delivery channel is
appropriate; that depends on the active profile's tier and preferences,
which is a platform concern. A single API also makes Web Push transparent
to plugin authors — they declare intent (`priority: 'alert'`), the
platform handles mobile delivery.

**Alternatives considered:**

- Plugins call shadcn/ui `toast()` directly — rejected: no global rate
  limit, inconsistent UX, no tray history, no Web Push path.
- Shell listens to all events and derives notifications — rejected: too
  implicit, requires a central event-to-notification mapping in shell
  code; loses the plugin's signal about whether an event is user-visible.

**Do not revisit unless:** A plugin legitimately needs a delivery channel
the platform cannot mediate (no known case in the local-first architecture).
