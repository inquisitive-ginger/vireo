# Kickoff — Product+Design: Beacon (paired friend lamps)

**Type:** Product + Design (combined — the deadline doesn't allow separate sessions)
**Module (working name):** `beacon`
**Origin:** 2026-07-29 brainstorm. Both kids' best friends — siblings in one
family — are moving cross-country in about a week. **A commercial stopgap covers
the goodbye** (4× LuvLink Infinity, light-only, two Group-ID pairs, set up at our
house before the move; the kids picking signature colors together is the ritual).
**The custom build's deadline is the friends' December visit** — gifted and paired
in person then, replacing the LuvLinks with voice as the headline upgrade.

---

## The concept (settled 2026-07-29, with Zach)

A paired ambient beacon per kid — friendship-lamp pattern plus async
walkie-talkie, self-hosted through the Pi. Tap yours → your friend's glows your
color and fades over ~an hour. Hold → short voice drop, friend taps to play,
only the last message or two kept.

**Decisions already made — do not re-litigate:**

- **Hardware:** Pi Zero 2 W + mic/speaker/LED/touch per unit. The full sensory
  ceiling ships day one — software OTAs across the country forever; hardware
  can't.
- **Count:** 4 identical units — one per kid, per-kid pairing (2 local, 2 remote).
- **Software sequence:** with the December runway, **voice ships at gifting** —
  it's the upgrade over the LuvLink and the reason the swap is worth making.
  OTA remains the channel for everything after.
- **Color continuity:** each kid's LuvLink signature color (chosen at the
  goodbye) becomes their beacon color — the totem inherits the meaning.
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
   at the December visit is the one chance to make this zero-support.
4. **Glow grammar.** Signature color per kid (reuse identityHue), fade curve,
   the simultaneous-tap moment (both tap within a window → both pulse
   together — reward coincidence, never punish absence), night behavior
   (light-sensor auto-dim; it lives in a bedroom).
5. **Parent surface.** Widget scope: link health + a light activity trace.
   Decide how much trace is visible without turning it into surveillance.
6. **Voice-drop spec:** max length, ephemerality rules, chirp-and-glow announce
   pattern, hold-to-talk on the same button as tap.
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
- This track is out-of-milestone — a deadline-driven side track alongside M4;
  don't let scope creep past what the December gifting needs.

## Stories to cut (expected shape)

1. **beacon/1 — Relay + device registry** (plugin API on the Pi: pairing
   tokens, tap events, link heartbeat)
2. **beacon/2 — Device image v1** (glow loop, tap, captive-portal WiFi, OTA
   channel, read-only rootfs)
3. **beacon/3 — Widget: link health + trace**
4. **beacon/4 — Assembly + in-house dogfood** (run a pair between the kids'
   rooms for a few days before gifting)
5. **beacon/5 — Voice drops** (in scope for gifting — the December headline)

## Hardware BOM — order within a few weeks; December is the deadline, not the move

Per unit ×4 (+1 spare HAT and SD cards; sourced 2026-07-29):

| Part                                                                                                                                                              | ~Each |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| [Pi Zero 2 W w/ headers](https://www.pishop.us/product/raspberry-pi-zero-2w-with-headers/) (also Adafruit 6008 / SparkFun if quantity-capped)                     | $18   |
| [ReSpeaker 2-Mics Pi HAT v2.0](https://www.seeedstudio.com/ReSpeaker-2-Mics-Pi-HAT.html) — check ship-from; Amazon B0BG29HMCN is the equivalent v1 (WM8960), fine | $14   |
| [Mono speaker 8Ω JST-PH 2.0 — Adafruit 5986](https://www.adafruit.com/product/5986)                                                                               | $4    |
| LEDs: one [BTF SK9822 strip 1m/30](https://www.amazon.com/BTF-LIGHTING-Individually-Addressable-Non-Waterproof-Separately/dp/B07C979QJD) cut into 4 segments —    |       |
| **SPI-driven; NeoPixels need GPIO18, which the HAT's I2S audio occupies**                                                                                         | $3.50 |
| [60mm dome arcade button](https://www.adafruit.com/product/1192) — one per kid's signature color (Adafruit 1190–1194)                                             | $10   |
| [Official Pi 12.5W micro-USB PSU](https://www.raspberrypi.com/products/micro-usb-power-supply/)                                                                   | $9    |
| 32GB A1 microSD (SanDisk, Amazon)                                                                                                                                 | $8    |
| [IKEA FADO 10" opal globe lamp](https://www.ikea.com/us/en/p/fado-table-lamp-white-70096377/) — the classic friendship-lamp shell                                 | $32   |

≈ $100/unit, ≈ $400 all-in (the FADO is most of the delta over a bare build; a
generic opal globe shade + printed base saves ~$20/unit). If the ReSpeaker HAT is
unobtainable: Adafruit I2S MEMS mic (SPH0645) + MAX98357A amp breakout is the
fallback pair.

## Outputs (required before closing)

- [ ] Open questions 1–7 answered and recorded (glow grammar via visual
      exploration + AskUserQuestion gate, per standing design practice)
- [ ] Relay-protocol ADR written
- [ ] Story specs in `docs/modules/beacon/stories/` + `progress.md`
- [ ] `docs/sessions/queue.md` updated with the dev sessions, deadline noted
- [ ] Session log + `CLAUDE.md` status updated
