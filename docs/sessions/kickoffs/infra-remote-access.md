# Kickoff — Infra: Remote access (off-LAN) + auth hardening

**Type:** Infra (ad-hoc — written at session open, not pre-queued)
**Proposed branch:** `infra/remote-access`
**Origin:** User ask, 2026-07-28 — "enable access to the Vireo app outside of my
house but keep it secure so only my family can access it."

## Pre-session checklist

- [x] Read `CLAUDE.md`
- [x] Read `docs/deployment.md` (Parts C, E, F)
- [x] Read ADR 021 (global family PIN + family pseudo-profile)
- [x] Read `apps/api/src/plugins/auth.ts`, `apps/shell/Caddyfile`,
      `docker-compose.prod.yml`
- [x] Confirm current network state on the live Pi

## Session scope

_One sentence:_ Make `https://vireohome.app` reachable from outside the house for
family devices only, without exposing the Pi to the public internet — and close
the auth gaps that a network boundary was silently covering for.

## Findings coming in — why the app cannot simply be published

Read on the live code, not assumed:

1. **No credential is required to reach the app.** `auth.ts` resolves an
   unauthenticated request to the `family` pseudo-profile (ADR 021 — correct as
   a LAN design, since the fridge tablet is the unattended default).
2. **`POST /auth/switch` grants any tier 1–3 profile with no credential at all.**
   Only tier 4 is gated. Anyone who can reach the origin can become a kid.
3. **`POST /auth/verify-pin` has no rate limit and no lockout.** The PIN is four
   digits (`ProfileGrid.handlePinChange` submits at length 4) — 10,000
   combinations, brute-forceable in minutes over HTTP.
4. **The session cookie is `secure: false`** and sets no `sameSite`.
5. **`SESSION_SECRET` falls back to a hardcoded dev constant** when unset.

Items 1 and 2 are deliberate product decisions (ADR 021), not bugs — but they
mean **"only my family" has to be enforced at the network layer.** Items 3–5 are
defence in depth, and 3 has an in-house threat regardless of network: the
realistic attacker on a family PIN is a kid, and a kid is already inside any VPN.

## Current deployment state (verified on the box)

- Pi `vireo-pi`, `aarch64`, eth1 `192.168.0.31` (+ wlan0 `192.168.0.30`).
- Public DNS: `vireohome.app A 192.168.0.31`, DNS-only (grey cloud) — an RFC 1918
  address, unroutable from the internet.
- No port forwarding. No `tailscale`, no `cloudflared` installed.
- Compose stack: `postgres` + `api` + `web` (Caddy publishes 80/443 to the LAN).
- Cert is Let's Encrypt via **Cloudflare DNS-01**, which needs no inbound
  reachability — so it keeps working no matter how clients route in.

## Decision taken at the gate

**Tailscale subnet route**, chosen by the user over Cloudflare Tunnel + Access
and over port-forwarding 443.

- Tailscale on the Pi advertising **`192.168.0.31/32` only** — not the whole LAN.
- Family phones install the Tailscale client and sign in once.
- **DNS, cert, URL and PWA install are all untouched.** `vireohome.app` resolves
  to `192.168.0.31` everywhere; at home that is a plain LAN route, away it is
  carried by the subnet route over WireGuard.
- The fridge iPad needs **no client and no change**, and keeps working if the
  house loses internet.

Rejected: **Cloudflare Tunnel + Access** — every family member needs an email
identity and the kids have none, and an expired Access session answers the PWA's
`/api` fetches with an HTML login page, which fails silently inside a standalone
install. **Port forward 443** — puts an unrate-limited 4-digit PIN, and
no-credential kid profiles, on the public internet.

## Acceptance criteria

- **AC1** — The Pi is on the tailnet and advertises `192.168.0.31/32`; the route
  is approved and shows as active.
- **AC2** — A family device off the home wifi loads `https://vireohome.app` with
  a valid cert, signs in, and uses the app normally.
- **AC3** — The fridge iPad's path is unchanged: no client installed, LAN only.
- **AC4** — No port forwarding exists; the Pi has no publicly reachable listener.
- **AC5** — `/auth/verify-pin` locks out after repeated wrong PINs, keyed to the
  real client, and the UI says so rather than showing "Incorrect PIN".
- **AC6** — The session cookie is `Secure` + `SameSite` in production.
- **AC7** — The API refuses to boot in production without `SESSION_SECRET`.

## Constraints

- **Do not change the origin.** One hostname keeps one PWA install, one session,
  one push subscription. A second `away.` hostname would split all three.
- **The fridge tablet must not depend on the tailnet** — it is the always-on
  household surface and must survive an internet outage.
- ADR 021 stands. This session does not re-litigate the no-PIN kid switch; it
  makes the network boundary the thing that holds.

## Required outputs

- [ ] Tailscale live on the Pi, route approved, key expiry disabled
- [ ] `auth.ts` hardening + tests
- [ ] `docs/deployment.md` — new part covering remote access
- [ ] Session log
- [ ] `CLAUDE.md` Current Status updated
- [ ] This kickoff deleted
