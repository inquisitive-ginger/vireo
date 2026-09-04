# 070 — `CaptureField` joins `ComposeForm`, with a rule for choosing

**Status:** Decided (2026-09-03, M5.5/1 shopping surface design) ·
**Amended 2026-09-04** (M5.5/5 live review) — the autofocus rule is withdrawn;
the taxonomy and every other clause stand.
**Applies:** ADR 063's taxonomy method to the capture primitives
**Consumers at decision time:** `shopping` (the list page, the wall, the Home widget)

## Decision

`@family-os/ui` gains a second capture primitive, **`CaptureField`**: a single-line,
always-open field that submits on Enter and **stays open with its value cleared**, with
an optional trailing slot for a scope control. `ComposeForm` is unchanged.

**The rule, written down:**

> **`ComposeForm`** when the thing being written is **authored** — it has an author, it
> is worth a second draft, and submitting it ends the act.
> **`CaptureField`** when the thing being written is **caught** — it is one noun, it has
> no author worth showing, and submitting it should leave you ready to catch the next one.

First consumers, the rule applied rather than exceptions to it:

- **Shopping capture → `CaptureField`.** "tortillas" is one noun. The bar is Google Keep,
  so the field must be live on arrival with no tap to open it, and must not close on
  submit — a family unloading four things from a fridge should type four times, not
  open the field four times.
- **Family feed compose → `ComposeForm`.** A note to the family is authored: it carries
  the writer's avatar and hue, it is multi-line, it has Cancel, and posting ends it.

## Amendment — 2026-09-04, no surface autofocuses

The rule made autofocus a **surface** decision: focus on an ambient screen someone
walked up to in order to type, never on a route they navigated to. Both surfaces it
named as yes-cases turned out to be no-cases, so **nothing autofocuses, and
`CaptureField` no longer takes a prop to ask.**

- **The Home widget.** A phone dashboard stacks and the shopping tile is fifth, so
  claiming focus scrolled the reader **1272 px** on every load, to a surface they
  had not asked for.
- **The wide `/shopping` layout.** The family profile's dashboard carries the same
  widget, so the always-on kitchen display claimed the keyboard on every load. A
  screen left on in a room is not a screen someone walked up to — which is the
  premise the original rule rested on, and it does not hold for ambient hardware.

Both were measured in the real shell. Neither was visible to a component test, and
two mechanisms underneath them are worth keeping: React renders `autoFocus` as the
DOM attribute, which browsers honour **only while parsing the document** (inert for
any federated remote, which mounts later), and focusing a **disabled** input — which
this field is while its first read is in flight — is a silent no-op. Both are pinned
by tests in `capture-field.test.tsx`.

Unchanged: the taxonomy, the scope slot, clear-and-stay, the height floors, and the
filing echo.

## Decision (as originally written)

`CaptureField` carries **no author avatar and no identity hue** — on shopping because
ADR 064 says so, and in general because a primitive whose whole claim is speed cannot
also be a place a person is displayed.

## Why

- **The two were one control in the first draft, and the seam was invisible.** The
  shopping capture was drawn as "a `ComposeForm` but smaller", which is how a primitive
  quietly grows a `variant` prop that means "be a different component".
- **The lifecycles are opposites.** `ComposeForm` opens, is submitted, and closes;
  `CaptureField` never closes. That is not a size difference or a `rows` difference, and
  no prop makes one honestly the other.
- **The scope slot has no analogue in `ComposeForm`.** Shopping's field carries the
  destination as a trailing chip, so what you type and _where it lands_ are stated
  together on one line. A compose form has no scope — a note goes to the family.
- **It is where the acceptance bar lives.** M5.5's spec says a surface slower than Keep
  will not be used. Capture speed is a property of this primitive, not of the page, which
  is exactly why it belongs in `@family-os/ui` where the Home widget and the wall can
  reach it too.

## Alternatives considered

- **`ComposeForm` with a `compact`/`lines={1}` variant.** Rejected: the divergence is the
  lifecycle (stays open vs. closes) and the anatomy (scope chip vs. author avatar), and a
  variant flag that changes both is two components sharing a name.
- **Let `shopping` hand-roll its own field.** Rejected: the widget and the wall need the
  same field, so "plugin-local" would be three copies before the milestone closed — the
  condition that produced ADR 063 and the `ItemCard` reconciliation.
- **No primitive; use a plain `Input` with an onKeyDown.** Rejected: it is the recipe, not
  the absence of one — clear-and-stay-focused, the scope slot, the filing echo, and the
  48/56 px height floors are exactly what drifts when six call sites each retype it.

## Do not revisit unless

A capture appears that is neither authored nor caught — a multi-field quick-add, say —
at which point decide whether it is a third primitive or the taxonomy is wrong, in an
ADR, not a prop.
