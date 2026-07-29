# 2026-07-29 — Product: Beacon concept (ad-hoc brainstorm)

## What was decided

Both kids' best friends — siblings in one family — move cross-country in weeks.
Concept settled: a paired ambient beacon per kid (friendship-lamp pattern plus
async walkie-talkie), self-hosted through the Pi since `vireohome.app` is already
publicly reachable — no vendor cloud between two children.

Four forks were gated through Zach:

- **Timeline: weeks away** → glow-only software at gifting, voice arrives
  post-move as an OTA update. In-person pairing before the move is the ritual.
- **Ages: mixed** → design to the younger kid; zero text on the device.
- **Hardware: Pi Zero 2 W build** (~$65–75/unit) over ESP32/tablets/commercial —
  the deciding argument: software OTAs across the country forever, hardware
  can't, so the full sensory ceiling (mic/speaker/LED/touch) ships day one.
- **Count: 4 devices, per-kid pairs** over per-household — the totem must be
  owned, not shared infrastructure.

Design principles recorded in the kickoff: one-second sends, nothing required to
receive, no obligation mechanics, kid-sovereign, closed pair, link health
parent-only (a silently dead link read as "she never taps back" is the worst
failure mode), graceful fade.

## Open questions raised

Deferred to the product+design session (`kickoffs/product-design-beacon.md`):
name, relay protocol (ADR), pairing/provisioning, glow grammar, parent widget
scope, voice-drop spec, enclosure.

## What the next session needs to know

The hardware order is the long pole — the BOM is in the kickoff and should be
placed before the session runs. This track is out-of-milestone and
deadline-driven; M4 resumes after gifting.

## Addendum (same day) — the move is ~a week away; stopgap + December re-plan

A week isn't buildable, and the friends visit in December. Revised: **4× LuvLink
Infinity (light-only, no subscription, two Group-ID pairs)** are gifted at the
goodbye — set up at our house pre-move, kids pick signature colors together as
the ritual; the other family only rejoins WiFi after the move. The custom build's
deadline moves to the **December visit**, gifted and paired in person there, and
now **ships with voice at gifting** (its headline over the LuvLink). Each kid's
LuvLink color becomes their beacon color — the totem inherits the meaning.
Deliberately skipped the LuvLink "Infinity Voice" variant so voice stays the
custom build's gift. BOM in the kickoff is now link-sourced; ~$100/unit, ~$400.
