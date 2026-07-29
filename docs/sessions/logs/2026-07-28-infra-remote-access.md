# 2026-07-28 — Infra: Remote access (off-LAN) + auth hardening

**Type:** Infra (ad-hoc — no queued session existed; kickoff written at open)
**Branch:** `infra/remote-access` → **PR #84**
**Outcome:** Family devices reach `https://vireohome.app` from anywhere, over a
Tailscale subnet route. The Pi gained no publicly reachable listener.

---

## The finding that decided the architecture

The ask was "let us in from outside, but only family." Reading `auth.ts` first
turned that into a different question, because **the app has no authentication at
its boundary and is not built to have any**:

- An unauthenticated request resolves to the `family` pseudo-profile.
- `POST /auth/switch` grants **any tier 1–3 profile with no credential at all**.
- Only tier 4 is gated, by a **four-digit** PIN, with **no rate limit or lockout**.
- The session cookie was `secure: false`, and `SESSION_SECRET` fell back to a
  hardcoded dev constant.

The first two are not bugs — they are ADR 021 working as designed for an
appliance on a trusted LAN, where the fridge tablet's unattended default state is
the whole point. But they mean **"only my family" cannot be an app-level
guarantee**. Any option that publishes the origin — port forward, or a tunnel
whose identity layer is misconfigured for even a minute — puts a no-credential
kid profile on the internet.

So the boundary is the network, and the app's own auth is defence in depth behind
it. That reframing is what ruled out the two rejected options rather than taste.

## Decision — Tailscale subnet route (gated with the user)

Pi advertises **`192.168.0.31/32` only**, not the LAN `/24`: a tailnet device
gets a route to the app and to nothing else in the house.

**Nothing about the origin changes** — same hostname, same Let's Encrypt cert
(DNS-01 needs no inbound reachability), same PWA install, same session, same push
subscription. This was the constraint that killed the obvious alternative of a
second `away.` hostname, which would have split all four.

**The fridge iPad deliberately runs no client.** It is the always-on household
surface, so it must not acquire a dependency on the tailnet, on Tailscale's
coordination server, or on the house having internet at all. Advertising a route
to the Pi — rather than pointing DNS at the Pi's `100.x` address — is what buys
that: the tablet's path stays a plain LAN hop.

**Rejected: Cloudflare Tunnel + Access.** Every family member needs an email
identity and the kids have none. Worse, an expired Access session answers the
PWA's `/api` fetches with an HTML login page — a silent failure inside a
standalone install, which is the exact failure class this repo has already paid
three round trips to learn about.

**Rejected: port forward 443.** States the problem: an unrate-limited 4-digit PIN
and no-credential kid profiles, on the public internet.

## The one that nearly bit — a 200 with no cookie

Turning on `secure: true` looked like a one-word change. `fastifySession.js:169`:

```js
const isInsecureConnection = cookieOpts.secure === true && request.protocol !== 'https'
if (!saveSession || isInsecureConnection) {
  /* silently skip */
}
```

The API-to-Caddy hop is **plain HTTP**, so the whole production login path hangs
on `X-Forwarded-Proto`. Verified in prod mode before merging rather than assumed:

| request                         | status  | `Set-Cookie`                        |
| ------------------------------- | ------- | ----------------------------------- |
| with `X-Forwarded-Proto: https` | 200     | `…; HttpOnly; Secure; SameSite=Lax` |
| without it                      | **200** | **none**                            |

**A `200` with no cookie is house-wide profile switching that stops sticking with
no error anywhere** — the same shape as every bug in the push saga. Three things
now stand between us and it: the Caddyfile records the dependency in a comment,
`auth.ts` logs once if a production request ever arrives non-https, and the
post-deploy check below is a real observation rather than a green pipeline.

**Do not set the headers explicitly.** The first attempt added
`header_up X-Forwarded-Proto {scheme}` / `X-Forwarded-For {remote_host}`.
Validating against the real web image (which has the Cloudflare DNS module
compiled in, so stock `caddy` cannot validate this file) returned:

```
warn: Unnecessary header_up X-Forwarded-Proto: the reverse proxy's default
      behavior is to pass headers to the upstream
```

Caddy sends both by default; the explicit lines were no-ops that would have
logged a warning on every prod start. **The comment was the valuable half of that
edit, not the code** — it survives, the lines did not.

## Also built — the PIN lockout, and why it is not about the VPN

Five wrong PINs in 15 minutes → `429` + `Retry-After`; a correct PIN clears the
counter, and a locked-out client is refused **even with the correct PIN**, so
timing cannot leak a hit.

This earns its place independently of remote access: **the realistic attacker on
a family PIN is a kid, and a kid is already inside any VPN.** A tailnet does
nothing about them.

It forced `trustProxy: 1`, which is the part worth remembering. Without it
`request.ip` is Caddy's container IP on **every** request, so the limiter would
have had exactly one bucket for the whole household — the first kid to guess
wrong five times locks out both parents. One hop (not `true`) means Caddy's
appended peer address is the rightmost entry and wins, so a client cannot forge
`X-Forwarded-For` to hand itself a fresh bucket.

The UI got a `pin-locked` phase. A lockout that renders as "Incorrect PIN" is a
lie the user will act on by trying again, which is exactly wrong.

## Verification

- **AC1** ✅ Pi on the tailnet (`100.98.135.99`), route approved —
  `PrimaryRoutes: ['192.168.0.31/32']`, and the prefix is live in `AllowedIPs`.
- **AC2** ✅ user confirmed the app live on a phone with **wifi off, cellular on**.
- **AC3** ✅ the fridge iPad was never touched — it has no client to install.
- **AC4** — probing the public IP from a machine on the same LAN is **not** proof:
  most routers don't hairpin, so a forwarded port still reads as closed. But the
  hostname cannot expose anything regardless of the router, because
  `vireohome.app` resolves to `192.168.0.31` **for everyone** — a stranger who
  looks it up gets an unroutable private address.
- **AC5–AC7** ✅ 355 API tests (+3 lockout), typecheck + lint clean, and the
  prod-mode cookie behaviour measured directly (table above).

**Confirmed on the deployed stack, not inferred from a green pipeline.** The two
changes that could only fail in production were observed there:

```
POST https://vireohome.app/api/auth/switch
  → 200  set-cookie: sessionId=…; Path=/; HttpOnly; Secure; SameSite=Lax
```

so Caddy's `X-Forwarded-Proto` does reach Fastify and the Secure cookie survives
the plain-HTTP hop. And the lockout keys **per client**, tested from two hosts at
once — the Pi at `192.168.0.31` locked (403 ×5 → **429**) while the Mac at
`192.168.0.6` still got **403** in the same window. Had `trustProxy` been wrong,
both would have shared a bucket and **one kid fumbling the PIN would lock out
both parents**; that is the specific thing this proves did not happen.

Note the deploy 502s for ~70s here (migrate + `tsx` boot), longer than the ~40s
in Part C. Not a regression — retry rather than diagnose.

## Environment notes

- `sysctl` is not on the login `PATH` on the Pi; use `/usr/sbin/sysctl`.
- Tailscale's UDP GRO tuning is a **runtime** `ethtool` change and is lost on
  reboot — persisted as `tailscale-gro.service` rather than left to decay.
- `--accept-dns=false` on the Pi: MagicDNS buys a server nothing, and Caddy's
  DNS-01 renewals depend on the resolver it would have replaced.
- `docker run` on the Pi works (a throwaway container for `caddy validate`), even
  though memory `project-pi-container-exec-blocked` records `docker cp` / `npx
tsx` **into** the api container being refused.

## What this does not buy

Reducing "who can reach the app" from everyone to tailnet devices does **not**
change what someone can do once there — a tailnet device can still become any kid
with no credential, by design. **A lost phone signed into the tailnet is a
full-access device**, and removing it in the admin console is the only revocation
that exists; there is no per-device sign-out in the app.

## Open / handed back

- ~~Disable key expiry on `vireo-pi`~~ ✅ **done in-session** — confirmed
  `KeyExpiry: DISABLED`, node online, route still advertised. Left recorded
  because it was the single most likely way this setup fails: on expiry the Pi
  drops off the tailnet **silently**, six months after the session that built it,
  and re-auth needs `tailscale up` **on the box**. Anyone rebuilding this node
  must set it again — there is no CLI path, only the admin-console toggle.
- Enrol the remaining family devices. The phone test passed on one handset.
- Unchanged from before: Part F offsite backups is still the most important infra
  follow-up — the household still lives in one un-backed-up Postgres volume, and
  it is now reachable from more places.
