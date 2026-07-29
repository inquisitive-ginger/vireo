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
