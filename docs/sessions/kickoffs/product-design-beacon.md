# Kickoff — Product+Design: Beacon (paired friend lamps)

**Type:** Product + Design (combined — the deadline doesn't allow separate sessions)
**Module (working name):** `beacon`
**Origin:** 2026-07-29 brainstorm. Both kids' best friends — siblings in one
family — are moving cross-country **in weeks**. The deadline is the move date:
devices are gifted and paired **in person before they leave**.

---

## The concept (settled 2026-07-29, with Zach)

A paired ambient beacon per kid — friendship-lamp pattern plus async
walkie-talkie, self-hosted through the Pi. Tap yours → your friend's glows your
color and fades over ~an hour. Later (OTA, post-move): hold → short voice drop,
friend taps to play, only the last message or two kept.

**Decisions already made — do not re-litigate:**

- **Hardware:** Pi Zero 2 W + mic/speaker/LED/touch per unit. Full sensory
  ceiling ships day one even though v1 software is glow-only — software OTAs
  across the country forever; hardware can't.
- **Count:** 4 identical units — one per kid, per-kid pairing (2 local, 2 remote).
- **Software sequence:** glow-only at gifting; voice drops arrive later as an
  OTA update ("the lamp learned to talk" is a feature, not a compromise).
- **Design principles:** sending costs one second, receiving requires nothing;
  no obligation mechanics (no streaks, read receipts, unread counts — a missed
  glow just fades); kid-sovereign (always on, no login, no parent unlock);
  closed pair (the device knows exactly one friend); when usage fades, it's a
  nice lamp, not a monument to a lapsed streak.
- **Link health is parent-only.** The worst failure mode is a silently dead
  link read as "she never taps back." Health shows in a Family OS widget
  ("last seen 2h ago"), never on the device as an "offline" state a kid can
  read as rejection.
- **Ages are mixed** — design to the younger kid: zero text on the device,
  color/sound/touch only.

## Pre-session reads

- [ ] `CLAUDE.md`
- [ ] ADR 044 (identityHue — each kid's signature color should travel to their beacon)
- [ ] ADR 022 (widget manifest + invalidation), ADR 045 (in-plugin scheduler precedent)
- [ ] `plugins/family-feed/` structure (new-plugin template per conventions)
- [ ] `docs/deployment.md` — Caddy/Compose topology the relay endpoints join
- [ ] Memory: `project-poc-hardware` (Pi 3B, undervoltage) — the relay load is trivial but be honest about it

## Open questions to resolve

1. **Name.** `beacon` is provisional.
2. **Relay protocol — needs an ADR.** MQTT over WSS vs plain HTTPS
   poll/long-poll from the devices to `vireohome.app`. Devices are outbound-only
   either way; the other family opens nothing.
3. **Pairing + provisioning.** Device tokens minted where and shown how; WiFi
   onboarding for a non-technical remote household (captive portal — comitup —
   vs config file on the SD's FAT partition as fallback). The in-person pairing
   before the move is the one chance to make this zero-support.
4. **Glow grammar.** Signature color per kid (reuse identityHue), fade curve,
   the simultaneous-tap moment (both tap within a window → both pulse
   together — reward coincidence, never punish absence), night behavior
   (light-sensor auto-dim; it lives in a bedroom).
5. **Parent surface.** Widget scope: link health + a light activity trace.
   Decide how much trace is visible without turning it into surveillance.
6. **Voice-drop spec** (design now, build post-move): max length, ephemerality
   rules, chirp-and-glow announce pattern, hold-to-talk on the same button as tap.
7. **Enclosure.** 3D print vs modded opal-glass globe lamp; must survive a kid's
   bedroom and read as a lamp, not a gadget.

## Constraints

- Remote family's total lifetime burden: plug in, join WiFi once. No app, no
  account, no maintenance. Everything else is OTA from the Pi.
- Devices: read-only rootfs (overlayfs) — cords will be yanked; SD corruption
  is a cross-country RMA.
- Plugin follows all standing conventions (TanStack Query, event names
  `beacon.tap.sent` / `beacon.voice.dropped` / `beacon.link.lost`, widget via
  manifest, mirror family-feed structure).
- This track is out-of-milestone — a deadline-driven side track. M4 resumes
  after gifting; don't let scope creep past what the move date needs.

## Stories to cut (expected shape)

1. **beacon/1 — Relay + device registry** (plugin API on the Pi: pairing
   tokens, tap events, link heartbeat)
2. **beacon/2 — Device image v1** (glow loop, tap, captive-portal WiFi, OTA
   channel, read-only rootfs)
3. **beacon/3 — Widget: link health + trace**
4. **beacon/4 — Assembly + in-house dogfood** (run a pair between the kids'
   rooms for a few days before gifting)
5. **beacon/5 — Voice drops** (post-move OTA; hardware already carries it)

## Hardware BOM — **order before this session runs; shipping is the long pole**

Per unit ×4 (+1 spare kit recommended):

| Part                                                                                                | ~Cost |
| --------------------------------------------------------------------------------------------------- | ----- |
| Raspberry Pi Zero 2 W (with header)                                                                 | $18   |
| ReSpeaker 2-Mics Pi HAT (mics, button, speaker out, 3 onboard APA102)                               | $13   |
| 8Ω ~2W speaker w/ JST                                                                               | $4    |
| APA102/DotStar LED ring — **SPI-driven; NeoPixels need GPIO18, which the HAT's I2S audio occupies** | $10   |
| Big soft-top button (tap = glow, hold = talk)                                                       | $4    |
| 32GB A1 microSD + 5V 2.5A PSU                                                                       | $16   |
| Enclosure (globe lamp or print)                                                                     | $10   |

≈ $65–75/unit, ≈ $300–350 all-in. If the ReSpeaker HAT is unobtainable:
Adafruit I2S MEMS mic (SPH0645) + MAX98357A amp breakout is the fallback pair.

## Outputs (required before closing)

- [ ] Open questions 1–7 answered and recorded (glow grammar via visual
      exploration + AskUserQuestion gate, per standing design practice)
- [ ] Relay-protocol ADR written
- [ ] Story specs in `docs/modules/beacon/stories/` + `progress.md`
- [ ] `docs/sessions/queue.md` updated with the dev sessions, deadline noted
- [ ] Session log + `CLAUDE.md` status updated
