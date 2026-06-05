# Session Log — Notification & States Design
**Date:** 2026-06-04
**Type:** Design

---

## What was decided

### Notification delivery model
Toast (ephemeral) + notification tray in the sidebar (persistent history).
The tray sits between nav items and settings; opens as a right-side overlay
panel that dims the main content behind it. Tray is tier 2+ only.

No nav item badges — bell icon is the sole badge indicator. Nav item badges
were considered but dropped: the tray is one tap away and the sidebar is
always visible, so per-item badges add noise without meaningful information gain.

### Bell badge
Unread count + `max(severity)` color: `--accent` (info/success), `--warning`
(warning), `--error` (error/alert). Resets on tray open. Single clear signal
rather than multiple scattered indicators.

### Platform notify API (ADR 029)
All notifications flow through `platform.notify({ title, body?, variant, priority? })`.
Plugins never render their own toasts. The platform routes to toast / tray /
Web Push based on priority + tier. `priority: 'alert'` is the only level that
crosses the Web Push boundary.

### Web Push routing
Tier 4: on by default. Tier 3: opt-in per profile. Tiers 1–2: excluded.
`priority: 'info'` never triggers Web Push. Opt-in stored as boolean per
profile in platform settings.

### Error states — three levels
1. **Inline:** `--error` text + `CircleAlert` icon below input; border shifts to `--error`
2. **Component:** muted card (`--muted` bg, `AlertTriangle` icon, Retry button) in
   the same widget slot — calm, not alarming, distinguished from placeholder by icon
3. **Page:** centered in main content; Lora heading, one-line body, Back/Retry action

### Empty states
Consistent anatomy: Lucide icon (40px, muted) + Lora heading + optional DM Sans
body + optional PermissionGate-wrapped CTA. Copy tone splits by tier: warm/encouraging
for tier 1 ("All done!"), neutral for tier 2+ ("No tasks scheduled"). CTA absent
entirely if permission check fails — no locked/disabled state.

### Motion & animation
Three duration tokens (`--duration-fast: 100ms`, `--duration-normal: 200ms`,
`--duration-slow: 300ms`) and three easing tokens (`--ease-out`, `--ease-in`,
`--ease-in-out`). `prefers-reduced-motion` disables all transitions — non-negotiable.
Explicit M1 prohibition list: no page slides, no springs, no list staggers, no
entrance animations on widget grid, no parallax.

---

## What was produced

- `docs/design-system.md` — four new sections added: Notification System, Error
  States, Empty States, Motion & Animation; To Be Defined table updated
- `docs/decisions/029-notification-system.md` — new ADR

---

## Open questions raised

- None blocking M1.

---

## What the next session needs to know

- `platform.notify()` expands the Platform API (`@family-os/platform`) — the M1
  platform-shell implementation session needs to add this to the client exports.
- The notification tray opt-in preference (tier 3 Web Push) needs a home in the
  platform data model — a boolean field on the profiles table or a `system_config`
  key per profile. Defer to M1 implementation planning.
- Motion tokens (`--duration-*`, `--ease-*`) need to be added to
  `packages/ui/src/styles.css` alongside the color tokens.
- **M1 Product Planning** is next in the queue — now unblocked.
