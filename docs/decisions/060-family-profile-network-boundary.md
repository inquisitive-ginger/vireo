# 060 — The network is the boundary for the family pseudo-profile

**Status:** Decided
**Relates to:** ADR 021 (family pseudo-profile, credential-free switch),
`logs/2026-07-28-infra-remote-access.md` (PR #84)

---

## Decision

The unauthenticated family dashboard — cookie-less request → family
pseudo-profile → household-wide read (`seesAll`) — remains as ADR 021 designed
it, with **no app-side gating by source network**. The exposure boundary is the
network: home LAN plus enrolled tailnet devices, nothing else.

The #92 triage flag ("the whole family answers to anyone who can reach
`vireohome.app`") is resolved by verification, not code: `vireohome.app`
resolves to `192.168.0.31` in public DNS (`192.168.0.42` since the 2026-08-16
Pi 5 migration), the Pi has no publicly reachable
listener, and off-LAN access exists only through the Tailscale subnet route
advertising that single address. The app is not on the public internet.

## Why

- **Wifi guests are inside ADR 021's stated trust model.** The family
  dashboard was designed to be safe for "any household member or guest";
  a guest on the wifi is exactly that.
- **Gating the anonymous read alone is theater.** `POST /auth/switch` grants
  any tier 1–3 profile with no credential, by design. Anyone positioned to see
  the family dashboard can become a kid profile in one request; an app-side
  read-gate changes nothing an attacker cares about.
- **The lost-phone case has a control, and it isn't in the app.** An enrolled
  tailnet device that leaves the family's hands is revoked in the Tailscale
  admin console (already recorded in PR #84's log as the only revocation that
  exists). A PIN-gate on non-LAN sessions would not remove that device's
  access; revocation does.
- **Source-network auth is brittle.** Distinguishing tailnet (`100.x`) from
  LAN sources embeds routing topology in auth logic and silently breaks under
  any SNAT or route change — a failure of the same shape as the
  `X-Forwarded-Proto` cookie drop.

## Alternatives considered

- **PIN-gate session establishment from non-LAN sources:** rejected — costs
  topology-coupled auth logic and buys nothing against the two real actors
  (a guest is on the LAN; a lost phone is revoked at the tailnet, not the app).
- **Scope the family pseudo-profile's read app-wide:** rejected — degrades the
  fridge, whose unattended household dashboard is the point of ADR 021.

## Do not revisit unless

The origin becomes publicly reachable (port forward, tunnel, or any inbound
listener), the tailnet grows beyond family-held devices, or ADR 021's
credential-free `/auth/switch` is itself revisited.
