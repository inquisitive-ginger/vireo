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

| Channel | Condition |
|---------|-----------|
| Toast | Always, for all tiers with access to the originating module |
| Notification tray | Tier 2+ profiles; all priorities |
| Web Push | Tier 4 (default on) or tier 3 (opt-in); `priority: 'alert'` only |

`priority: 'info'` never triggers Web Push regardless of tier.

**Bell badge:** Displays unread count. Badge color reflects `max(severity)`
across unread items — `--accent` (info/success), `--warning`, or `--error`.
Resets on tray open.

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
