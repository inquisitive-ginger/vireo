# 2026-07-31 — Architecture/Security: family pseudo-profile exposure off-LAN

**Type:** architecture / security (decision session, docs only — no code change)
**Outcome:** **ADR 060** — the network is the boundary; the unauthenticated
family dashboard stays as ADR 021 designed it.

---

## What was decided, and on what evidence

The queue entry (from #92 triage) asked whether the family pseudo-profile
belongs "on the public internet." The session's first move was to check whether
it is on the public internet. It is not:

- `dig vireohome.app` → `192.168.0.31` — public DNS hands everyone a private,
  unroutable address (DNS-01 certs need no inbound reachability).
- PR #84 gave the Pi no public listener; off-LAN access exists only via the
  Tailscale subnet route advertising `192.168.0.31/32`.

So the real audience for the cookie-less fallback (`auth.ts:135` →
`FAMILY_PROFILE_ID`; `chores.ts:319` `seesAll`) is wifi guests and enrolled
tailnet devices. Two findings collapsed the option space:

1. **Gating the anonymous read alone is theater.** `POST /auth/switch` grants
   any tier 1–3 profile with no credential (ADR 021, by design). Anyone who
   can see the family dashboard can become a kid profile in one request.
2. **The lost-phone case is controlled at the tailnet**, not the app — device
   revocation in the admin console removes access; an app-side PIN gate would
   not.

Decision gated with the user (options: accept-and-record · PIN-gate non-LAN
sessions · scope the anonymous read): **accept and record**. ADR 060 carries
the reasoning and the rejected alternatives; its revisit triggers are a public
listener, a tailnet beyond family-held devices, or a revisit of ADR 021's
credential-free switch.

ADR 021's "do not revisit unless" names remote access, which shipped
2026-07-28 — so revisiting was procedurally clean; the outcome reaffirms it.

## What the next session needs to know

- The #92 triage flag and the queue's "anonymous-exposure decision" item are
  **closed** by ADR 060. Nothing is owed in code.
- If remote access is ever widened (any inbound listener, non-family tailnet
  members), ADR 060's revisit clause fires **before** that work, not after.
