# Design System

> Last updated: 2026-09-04 — **`--input` is the interactive-control outline, at 3:1**
> (shopping polish, D2) ([Core tokens](#core-tokens--light-mode)).
>
> Prior: 2026-09-03 — ADR 068 (`ListRow` lands; row height belongs to
> the primitive) ([The scanned-list primitive](#the-scanned-list-primitive--listrow)),
> ADR 070 (`CaptureField` beside `ComposeForm`)
> ([Capture primitives](#capture-primitives--capturefield-and-composeform));
> 2026-08-20 — ADR 063 (ListRow), ADR 064 (identity-hue trigger narrowed); 2026-07-28 — ADR 057, daily time-window recurrence
> ([Daily time-window series](#daily-time-window-series--a-condition-with-a-clock-settled--2026-07-28));
> 2026-07-24 — ADR 054, currency named Pritchett Bucks
> ([Currency marks](modules/rewards/design.md#currency-marks)); 2026-07-22 — ADR 051, gold and coin to
> P-Bucks ([Currency marks](modules/rewards/design.md#currency-marks)); 2026-07-12 — ADR 044, hues
> assigned, unique, never the sole channel
> ([Member identity palette](#member-identity-palette)).

This document records settled design decisions. Deferred items are
explicitly marked — do not treat absence of a spec as a free choice.

---

## Contents

- [Principles](#principles)
- [Technology Stack](#technology-stack)
- [Typography](#typography)
- [Color & Tokens](#color--tokens)
- [Spacing](#spacing)
- [Surfaces](#surfaces)
- [Role-Aware Rendering](#role-aware-rendering)
- [Login / Profile Switch](#login--profile-switch)
- [Tablet Nav Layout](#tablet-nav-layout)
- [Widget Composition System](#widget-composition-system)
- [Home Surface](#home-surface)
- [Notification System](#notification-system)
- [Error States](#error-states)
- [Empty States](#empty-states)
- [Motion & Animation](#motion--animation)
- [Plugin Design Contract](#plugin-design-contract)
- [Mobile Surface](#mobile-surface)
- [Status vs identity colour](#status-vs-identity-colour)
- [Page containers](#page-containers)
- Rewards surfaces + currency marks → [`docs/modules/rewards/design.md`](modules/rewards/design.md)
- [To Be Defined](#to-be-defined)

---

## Principles

Every design decision should be checkable against these. They flow
directly from the project vision.

| Principle                             | What it means in practice                                                                             |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Kids are participants**             | Kid-facing views are first-class UI, not simplified adult UI                                          |
| **Legible at a glance**               | Tablet is often across a room — key info must read without approaching                                |
| **Tier-appropriate, not age-locked**  | UI adapts to trust tier, not birth year                                                               |
| **Calm by default**                   | No unnecessary motion, badges, or urgency cues                                                        |
| **Touch-first, pointer-friendly**     | Tablet and mobile are touch surfaces; mouse/keyboard work but are secondary                           |
| **Plugins feel native**               | Community-built plugins use the same component library and tokens as first-party modules              |
| **No AI aesthetic**                   | Vireo should have its own visual character — avoid the generic Inter/Geist/hyper-minimal look         |
| **People are color**                  | Every family member maps to a stable identity hue, used consistently across all modules               |
| **The family voice is serif**         | User-authored words (posts, notes) render in Lora via `prose`; UI chrome stays DM Sans                |
| **Surfaces lift, backgrounds recede** | Content cards float on the warm background via elevation tokens — depth, not lines, creates hierarchy |

---

## Technology Stack

**Settled** — see ADR 012.

| Layer                | Choice                                           |
| -------------------- | ------------------------------------------------ |
| Component primitives | Radix UI (via shadcn/ui)                         |
| Component library    | shadcn/ui — copy-paste model, owned by this repo |
| Styling              | Tailwind CSS v4 — CSS variable tokens            |
| Icons                | Lucide                                           |
| Date inputs          | react-day-picker v10 — themed by token (ADR 037) |

Components live in `packages/ui/` once the monorepo is scaffolded.
Adding a component means running the shadcn CLI and editing the
output — not upgrading a dependency.

---

## Typography

**Settled** — fonts: Visual Language session 2026-06-02; scale locked 2026-06-08.

### Font families

| Role                                        | Font        | Fallback                            |
| ------------------------------------------- | ----------- | ----------------------------------- |
| Display — page titles and emotional moments | **Lora**    | Georgia, 'Times New Roman', serif   |
| UI — all other text                         | **DM Sans** | 'Helvetica Neue', Arial, sans-serif |

**Pairing rationale:** Lora gives page titles and narrative moments warmth and editorial character. DM Sans keeps UI text clean and legible without the generic Inter/Geist feel.

**Lora scope:** `page-title`, `display-lg`, `display-xl`, and `prose` (user-authored content — see below). All other tokens — including `heading`, `card-title`, `section-label` — use DM Sans. Structural headings that don't carry emotional weight stay in DM Sans.

```css
--font-display: 'Lora', Georgia, 'Times New Roman', serif;
--font-ui: 'DM Sans', 'Helvetica Neue', Arial, sans-serif;
```

Loaded from Google Fonts in `apps/shell/index.html`. Plugins must use `var(--font-display)` and `var(--font-ui)` — never hardcode a font family.

### Type scale

Major second ratio (1.125), base 16px. 11 tokens.

**Viewing distance rule (amended 2026-07-11):** the floor is set by **how far away the reader is**, not by which component they're looking at.

- **Close-up — anything you're holding or sitting at.** Phone, laptop, a tablet you're using with your hands. This is UI chrome (sidebar, settings, dialogs, forms) _and_ the widgets on the home dashboard. Tokens down to `base` (14px) are appropriate for primary content; `sm`/`xs-body` for meta.
- **Across the room — the wall tablet, glanced from the kitchen.** The family pseudo-profile and any always-on ambient surface. `body` / `prose` (18px) is the minimum for primary content text, and key values want `heading` (20px) or `metric`.

The rule used to name **widgets** as the across-the-room category, which was too broad: a widget is a _container_, not a distance. The same `calendar.up-next` tile is read at arm's length on a parent's laptop and from six feet away on the kitchen wall — so the floor belongs to the surface it's rendered on, not the tile. At desk distance 14px `base` is the right size for an event title, and forcing 18px there costs rows without buying legibility.

**Structural labels have their own floor, and it is not 18px (settled — 2026-09-04, M5.5/5).** The distance rule above floors _primary content_; it used to say nothing about the labels that name it, which is why `section-label` at 11px went to the wall tablet unreadable at six feet while the rows beside it cleared 18px. The answer is a distance variant, `section-label-lg` — **not** promotion to `heading`:

- **The family is the meaning.** Uppercase, 700, 0.1em tracked, muted — that is what says _this names a group, it is not part of one_. `heading` is sentence-case content type; a label promoted to it stops reading as structure and starts competing with the surface's actual subject. On the wall, a structural label at `heading` would sit one step under `What do we need?` and read as a second question.
- **14px, because optical size is what the distance floor is really about.** All-caps has no descenders and no x-height gap — cap height is the whole glyph — so uppercase 700 at 0.1em reads roughly one step larger than its px suggests: 14px here carries the optical size of 18px lowercase regular. Taking labels to a literal 18px would size them level with the content they subordinate, which inverts the hierarchy the token exists to state.
- **Where it applies:** any surface under the across-the-room rule — the wall tablet, the family pseudo-profile, an always-on ambient screen. `section-label` stays 11px everywhere you are holding or sitting at. A component does not choose between them; the **surface** does, the same way autofocus does (§Capture primitives).
- **It has no call site today** (2026-09-04, shopping polish): the wall's `Just added` strip that motivated it was deleted, and capture mode now carries no structural label at all. Kept deliberately — the distance problem it answers is unchanged, and the next across-the-room label needs the token to exist rather than the argument re-run.

**This does not soften the wall tablet.** If anything it sharpens it: the family-profile surface is now the _named_ place the 18px floor applies, rather than one instance of a vaguer rule (see [Tablet — Primary Hub](#tablet--primary-hub)). A widget that renders on both surfaces should scale its type with its prominence — which is what [Widget prominence](#widget-prominence) already gives it.

All tokens are defined as CSS utilities in `packages/ui/src/styles.css` and are available as Tailwind classes throughout the codebase. Use the utility name — never raw pixel values.

| Token              | Utility class           | px  | Weight | Line-height | Tracking | Font                       |
| ------------------ | ----------------------- | --- | ------ | ----------- | -------- | -------------------------- |
| `xs`               | `text-xs-token`         | 10  | 600    | 1.4         | 0        | DM Sans                    |
| `xs-body`          | `text-xs-body`          | 11  | 400    | 1.4         | 0        | DM Sans                    |
| `section-label`    | `text-section-label`    | 11  | 700    | 1.4         | 0.1em    | DM Sans · always uppercase |
| `section-label-lg` | `text-section-label-lg` | 14  | 700    | 1.4         | 0.1em    | DM Sans · always uppercase |
| `sm`               | `text-sm-token`         | 13  | 400    | 1.5         | 0        | DM Sans                    |
| `base`             | `text-base-token`       | 14  | 400    | 1.5         | 0        | DM Sans                    |
| `prose-sm`         | `text-prose-sm`         | 15  | 400    | 1.5         | 0        | **Lora**                   |
| `card-title`       | `text-card-title`       | 16  | 600    | 1.3         | 0        | DM Sans                    |
| `body`             | `text-body`             | 18  | 400    | 1.6         | 0        | DM Sans                    |
| `prose`            | `text-prose`            | 18  | 400    | 1.65        | 0        | **Lora**                   |
| `heading`          | `text-heading`          | 20  | 600    | 1.2         | −0.01em  | DM Sans                    |
| `page-title`       | `text-page-title`       | 26  | 600    | 1.2         | −0.02em  | **Lora**                   |
| `display-lg`       | `text-display-lg`       | 29  | 600    | 1.2         | −0.01em  | **Lora**                   |
| `metric`           | `text-metric`           | 32  | 700    | 1.0         | −0.01em  | DM Sans                    |
| `display-xl`       | `text-display-xl`       | 36  | 400    | 1.15        | −0.01em  | **Lora**                   |

**Usage notes:**

- `xs-body` — smallest regular-weight text: placeholder/error-card descriptions, tier pills, meta captions (added 2026-07-10 audit — the settled placeholder/error anatomies specified 11px/400 with no token to express it)
- `section-label` — `--muted-foreground` by default; `--accent` when naming a module surface (widget identity headers, feed day markers); uppercase is baked into the utility
- `section-label-lg` — the same label at across-the-room distance (the wall). Same family, one size step that clears six feet; never mix the two on one surface
- `prose` — user-authored content only (feed posts, notes, messages). The family's own words get the warmth of the display face; text _about_ the UI never does. Same 18px viewing-distance floor as `body`
- `prose-sm` — the family voice at 15px for **dense** contexts (multi-post feed widget rows) where 18px crowds. Same Lora face; use `prose` on roomy surfaces (feed page, across-room banner). Not for UI chrome
- `page-title` — one per route; renders in Lora
- `display-lg` — empty state headings, error page headings
- `display-xl` — greeting text ("Good morning, Zach"), hero moments
- `metric` — widget key numbers and counts (XP, task count, etc.)

---

## Color & Tokens

**Settled** — Visual Language design session, 2026-06-02. Primary re-cut from
terracotta to deep olive 2026-08-22 (**ADR 065**); everything else unchanged.

**Palette: Olive & Teal.** A deep olive primary — the vireo's own plumage —
paired with a muted sage-teal accent over warm oat neutrals. Deliberately two
distinct hues rather than a single-hue scale.

Theming is cascade-based via CSS custom properties defined in
`packages/ui/src/styles.css`. No JavaScript overhead. Plugins consume
semantic tokens only — never raw oklch values.

### Core tokens — light mode

| Token                    | Value                    | Role                                                                   |
| ------------------------ | ------------------------ | ---------------------------------------------------------------------- |
| `--background`           | `oklch(0.985 0.008 100)` | Page background — warm off-white                                       |
| `--foreground`           | `oklch(0.18 0.03 100)`   | Primary text                                                           |
| `--primary`              | `oklch(0.5 0.11 122)`    | Deep olive — main actions, active states                               |
| `--primary-foreground`   | `oklch(0.99 0 0)`        | Text on primary                                                        |
| `--secondary`            | `oklch(0.93 0.02 100)`   | Inset / structural surfaces — sidebar, grouped rows, settings sections |
| `--secondary-foreground` | `oklch(0.28 0.04 100)`   | Text on secondary                                                      |
| `--muted`                | `oklch(0.93 0.016 100)`  | Subtle backgrounds                                                     |
| `--muted-foreground`     | `oklch(0.52 0.035 100)`  | Subdued labels, timestamps                                             |
| `--accent`               | `oklch(0.47 0.07 185)`   | Muted sage-teal — module identity only (see Accent scope below)        |
| `--accent-foreground`    | `oklch(0.99 0 0)`        | Text on accent                                                         |
| `--border`               | `oklch(0.88 0.02 100)`   | Hairlines and dividers — the edge _between_ things                     |
| `--input`                | `oklch(0.62 0.02 100)`   | The outline of an interactive control, ≥3:1 (see below)                |
| `--ring`                 | `oklch(0.5 0.11 122)`    | Focus ring (matches primary)                                           |

#### `--border` and `--input` are not the same value (settled — 2026-09-04)

They shipped identical, which is how the check ring came to fail contrast without
anything being obviously wrong: whoever read the tokens saw one colour with two
names.

- **`--border`** is a hairline **between** things — a row separator, a card edge, a
  section rule. It carries no contrast floor, because nothing is aimed at it.
- **`--input`** is the **outline of an interactive control** — a field, a chip, a
  check ring. It is what tells a person where to press, so **WCAG 1.4.11 applies to
  it: ≥3:1 against the surface behind it.**

Re-measured against `--background` at the polish session: light went 1.37:1 →
**3.48:1** (`oklch(0.88 0.02 100)` → `oklch(0.62 0.02 100)`), dark 1.45:1 →
**3.58:1** (`oklch(0.3 0.018 105)` → `oklch(0.52 0.018 105)`). On `--card`, where
the widget tile draws its rings, the shipped values measure 3.62:1 light and
3.22:1 dark. `--border` is unchanged.

Its blast radius is every form field and `CompletionToggle`, which is to say all
of chores — that is the point, not a side effect: the same defect was on all of
them.

### Surface elevation

**Settled** — Family Feed visual language session, 2026-06-11.

The original token set had no depth layer — `--secondary` (oklch 0.93) on
`--background` (oklch 0.985) read as nearly flat, which made every surface
look like the same beige. Elevation now carries surface hierarchy:

| Token               | Light                    | Dark                     | Role                                       |
| ------------------- | ------------------------ | ------------------------ | ------------------------------------------ |
| `--surface-sunken`  | `oklch(0.955 0.006 100)` | `oklch(0.175 0.008 105)` | A recess cut _into_ a card (ADR 040)       |
| `--shadow-inset`    | warm inner shadow        | deep inner shadow        | The depth cue that makes the tint a groove |
| `--card`            | `oklch(0.999 0.004 100)` | `oklch(0.21 0.018 105)`  | Content cards — lifts _above_ background   |
| `--card-foreground` | `var(--foreground)`      | `var(--foreground)`      | Text on cards                              |
| `--shadow-card`     | warm-tinted, subtle      | deep black, subtle       | Resting cards, widget slots                |
| `--shadow-raised`   | warm-tinted, pronounced  | deep black, pronounced   | Compose forms, overlays, pickers           |

Rules:

- Light-mode shadows are **warm-tinted** (`oklch(0.35 0.05 100 / …)`), never
  neutral gray — gray shadows go cold against the warm palette
- `--card` is _lighter_ than `--background` in light mode (lift toward white);
  in dark mode it is lighter than the clay background by ~0.06 L
- `--secondary` remains for inset/structural surfaces (sidebar, grouped
  settings rows); content that "sits on the table" uses `--card` + shadow
- Never hardcode `box-shadow` values — use the two shadow tokens
- `WidgetSlot` renders `--card` + `--shadow-card`; widgets get elevation
  for free and must not add their own card chrome at the slot level

Where each level applies:

| Level              | Surfaces                                                                                                                                                             |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--shadow-raised`  | Compose forms, notification tray, drawers, dialogs, toasts, profile picker, onboarding card — surfaces above the page                                                |
| `--shadow-card`    | Live widget slots, feed post cards, settings sections, sidebar profile chip — content at rest                                                                        |
| No shadow (flat)   | Sidebar rail + nav items, inset rows, placeholder slots, error slots — structural chrome is flat (the profile chip is the one elevated exception, ADR 031 amendment) |
| `--surface-sunken` | Recesses cut into a card — the calendar widget's "all week" span band. The one step _down_                                                                           |

#### The sunken plane (settled — ADR 040, 2026-07-11)

The ladder used to have no bottom rung, so anything needing to read as
_recessed_ reached for `--secondary`. That stopped being safe once
`--secondary` picked up a second meaning: under the identity palette it was
the fill a **no-owner (Family) event** wore. A `--secondary` band beneath a
Family-owned hero was the _same beige_ as the hero — one surface saying
"belongs to everyone", the other "sits underneath", with no seam between them.

(The Family fill has since moved to its own reserved hue — ADR 041 — so
`--secondary` is chrome again. This rung stays: a recess must not borrow the
hover/rest surface either, or depth reads as an interaction state.)

- **Always pair `--surface-sunken` with `--shadow-inset`.** The tint alone is a
  grey rectangle; the inner shadow at the top lip is what makes it a groove.
- **Only inside a card.** A recess needs something to be recessed into —
  sunken surfaces are illegal directly on `--background`.
- **The near-achromatic chroma (0.006) is load-bearing.** Every identity fill
  is chromatic by construction, so a deliberately desaturated plane can never
  be mistaken for one, whichever member's hue lands beside it. Don't "warm it
  up" to match the palette; that's the property being bought.
- **It marks depth, nothing else** — never a hover, active, or disabled state.

#### Multi-day spans — one primitive, two containers (settled — 2026-07-11)

A multi-day event is a **condition, not an appointment**: state it **once**, as
standing context, never re-emitted on each day it covers. (Both calendar read
surfaces used to bucket events by every day they _touched_, so one week-long camp
claimed five rows and swamped the actual appointments.)

`SpanBand` is the shared primitive — one anatomy (title · date range · owners; no
clock, because a span's "when" is a range and "all day" is implied). It ships two
containers, chosen by **the ground underneath it**:

| Container | Surface                                    | Treatment                                        |
| --------- | ------------------------------------------ | ------------------------------------------------ |
| `groove`  | inside a card (the up-next widget)         | full-bleed `--surface-sunken` + `--shadow-inset` |
| `panel`   | directly on `--background` (mobile agenda) | resting `--card` + hairline + `--shadow-card`    |

The `panel` exists **because** of the rule above: a recess is illegal on
`--background`, so the same rows get an elevated container rather than a sunken
one. Same primitive, same anatomy — a different claim about depth, because the
ground is different. Don't "fix" the panel by sinking it; that inverts the ladder.

**Both surfaces pin only what is already RUNNING** and state the rest **inline,
once, on the day it begins** (revised 2026-07-28, gate 4 — the widget used to pin
everything overlapping its week, and a real summer week put five rows in the band
with camps that were next week's wearing the "All week" label). In the widget, an
upcoming span/series takes a day-list row whose time slot carries its range
("Aug 3 – 7"); in the agenda it joins its start day's section, as it always has.

**Date grammar is decided by distance, never mixed in one label:** a date within
the next seven days keeps the weekday form ("through Fri 31"); anything past that
takes the month ("Aug 3 – 7", "through Aug 21"). Bare day-of-month across a month
boundary made the reader do month arithmetic.

#### Daily time-window series — a condition with a clock (settled — 2026-07-28)

A **daily time-window series** (ADR 057 — "M–F 9:30–3:30, Aug 3–21") is a
condition **and** an appointment, so it takes the span rule with one carve-out:

- **Stated once**, in the `SpanBand` / Ongoing panel, with its own "when" grammar:
  **day-set · window · bound** — `Weekdays 9:30 – 3:30 · through Fri 21`. Day-set
  names: _Every day_ / _Weekdays_ / _Weekends_ / `Mon · Wed · Fri`
  (`daySetLabel`, `plugins/calendar/src/lib/series.ts`).
- **Day rows never repeat it** — the exact swamping the band exists to end.
- **Only today's occurrence is hero-eligible.** The hero exists to answer
  "what's next?", and at 8:45 the answer is camp in 45 minutes; an occurrence on
  a later day is the band's business. The series may therefore appear twice —
  hero and band — which is deliberate: they say different things (_now_ vs.
  _standing_).
- **Month grid: bars, not chips.** Occurrences fold into consecutive-day runs in
  the span lanes — weekends bare, a skipped day a visible hole — so the cells
  keep their chip slots for one-offs. The clock lives one tap down, where a
  span's dates already do.
- **Day drill-in / week view:** an occurrence is a normal timed row.

### Member identity palette

**Settled** — see ADR 030, amended by **ADR 044**. Helpers: **`resolveHue`**,
`identityToken`, `nextFreeHue`, `isIdentityHue` from `@family-os/ui`. The palette
list itself lives in `@family-os/schemas` — the API allocates hues and the UI paints
them, and that is the only leaf package both can import.

**Eight** fixed hues harmonized with Olive & Teal. Every family member maps to
one hue and keeps it **everywhere** — avatar fill, feed post spine, calendar chips,
chore assignments. Three layers per hue, light + dark aware:

| Layer | Token pattern           | Use                                        |
| ----- | ----------------------- | ------------------------------------------ |
| base  | `--identity-{hue}`      | Spines, rings, markers, indicators         |
| tint  | `--identity-{hue}-tint` | **Fills** — calendar chips, avatar, washes |
| ink   | `--identity-{hue}-ink`  | Initials/text on tint                      |

Hues: `terracotta` · `marigold` · **`moss`** · `sage` · `teal` · `sky` ·
**`indigo`** · `plum`

**The hue is ASSIGNED, not derived** (ADR 044). It is persisted per profile
(`Profile.identityHue`), **unique across the family**, and **travels with the data** —
every payload carrying a person carries their hue. `getIdentityHue(name)` is a
**fallback only**: it collides (`"Zach"` and `"Emma"` hash alike, at six hues _and_ at
eight) and it moves on rename (`"Teddy"` is terracotta, `"Ted"` is sage).

```tsx
// ✅ the one way to ask "which hue is this person"
identityToken(resolveHue(task.assigneeName, task.assigneeHue))
// ❌ never re-derive from a name when the profile is in hand
identityColor(task.assigneeName)
```

Because hues are unique, **`IDENTITY_HUES.length` is a hard cap on household size**.
`nextFreeHue` returns `null` on a full palette and callers must **say the palette is
full** — a duplicate hue does not degrade "colour = person", it points it at **two
people at once**. Plugins must never invent member colours outside this palette, and
there is deliberately **no free colour input**.

> **Judge a colour on the layer that renders it.** Hues get quoted at `base`, but the
> calendar month grid — the surface where colour does the most work — paints at
> `tint`. The tint layer used to flatten every hue to L≈0.92/C≈0.04, where all eight
> converge on off-white; it now inherits the base's lightness order and carries real
> chroma. This has now bitten twice (ADR 041, ADR 044).

#### Colour is the primary channel, not the only one (ADR 044)

Eight _nameable_ hues do not fit in the ~305° left once red is reserved for `--error`,
so **two pairs collide under red-green colour-blindness** — which about **1 in 12 men**
have. That is an accepted, deliberate trade.

**So any surface where a hue is the ONLY thing distinguishing two people owes a second
channel.** The calendar month chip carries its owner's **initial** (the family case
already had one — the `Users` glyph). A selection state must never ride on colour alone
either: the `ColorPicker` swatch carries a ring and a check, not just a fill.

**A capability with no surface is not a capability.** `platform.profile.color` is
update-own for _every_ tier, so the picker lives in Settings → **Your colour**
(self-serve, any tier), not only in the tier-4 profile drawer — exactly as ADR 042's
photo does.

#### The family hue — reserved (settled — ADR 041, 2026-07-11)

The household has a **seventh entry, `family`** — _Hearth_, a warm stone. Same
three layers, so it resolves through the same `identityToken(hue, layer)` path as
any member:

| Token                    | Light                  | Dark                    |
| ------------------------ | ---------------------- | ----------------------- |
| `--identity-family`      | `oklch(0.55 0.022 65)` | `oklch(0.72 0.022 68)`  |
| `--identity-family-tint` | `oklch(0.90 0.018 70)` | `oklch(0.285 0.014 65)` |
| `--identity-family-ink`  | `oklch(0.36 0.020 62)` | `oklch(0.90 0.018 70)`  |

It is **reserved**: `IDENTITY_HUES` (the rotation the name hash draws from)
excludes it, so `getIdentityHue()` can never hand the household's colour to a
person. Surfaces that can hold either accept the wider `OwnerHue`
(`IdentityHue | 'family'`).

Its low chroma is deliberate: the family is the **ground its members stand on,
not a seventh sibling**. It reads as the household's own material, and sits
behind the six.

**Compare the layer that renders.** Fills use the **tint**, where the six members
run `0.035`–`0.05` — so Hearth's tint is `0.018`, roughly half the least
saturated of them. (Judging it against the members' _base_ layer, `0.09`–`0.13`,
is the trap: it makes almost any warm hue look recessive. Hearth's first values
did exactly that and shipped a peach that was indistinguishable from terracotta's
fill — caught in live review, see ADR 041.) Chroma has no room between chrome's
`0.022` and the members' `0.035`, so Hearth separates from **chrome** on
_lightness_ instead — `0.90` against `--secondary`'s `0.93`.

- Use `FAMILY_HUE` for the household pseudo-profile's avatar
  (`<ProfileAvatar identity={FAMILY_HUE} />`) — without it, the family's _name_
  hashes into a member's hue.
- It must stay **chromatic**. [ADR 040](decisions/040-sunken-surface-plane.md)'s
  guarantee — a desaturated plane can never be mistaken for an identity fill —
  holds only while every identity fill has colour in it.

#### Multiple people & no-owner (settled — Calendar M3 Design, 2026-06-22; amended ADR 041)

When an item belongs to **2+ specific members** (a shared calendar event, a
multi-assignee task later), express it as a **split fill** — hard-stop segments of
each member's `tint`, one per person — not a gradient (two tints blended read as a
single new muddy hue) and not a dot cluster (abandons the colour fill). Text uses
neutral `--foreground` (legible on any pale tint).

When it belongs to **no one** (a whole-house "Family" item), it belongs to the
**household** — paint it in the reserved `family` hue above (+ a small `Users`
glyph), not in a chrome neutral. There is no "no owner" branch: `huesForEvent([])`
resolves to `[FAMILY_HUE]`, so fills, spines, pills and avatars all take one path.
In a **widget-slot spine**, the same logic applies vertically (single hue · split
segments · the family hue for Family).

> Superseded detail: this used to specify `--secondary` for the Family fill. That
> made one token mean two things (chrome _and_ an identity), and the two collided —
> see ADR 041. `--secondary` is now chrome only.

#### Day marks (settled — ADR 050, ADR 066, M5/4)

A day mark (a plugin's read-time contribution to the calendar — "Zach's got
dinner", later "no school Monday") is the smallest instance of the second-channel
rule above, and generalizes past the calendar:

- **A 16px identity-tint disc, carrying the owner's initial, `aria-hidden`.**
  Never a photo — at 16px an avatar carries neither hue nor letter at a glance,
  so any surface rendering identity that small takes the same disc, not
  `ProfileAvatar` scaled down.
- **The owner's name lives in the mark's accessible text**, not the disc — a
  screen reader gets the name from the label (visible in the agenda, `sr-only`
  in the month cell), matching the initial/`aria-hidden` pattern the calendar
  chip already set.
- **The month cell pairs the disc with a glyph** at a 3px gap, the glyph ~75%
  opacity so the two read as one object, not a disc and an unrelated icon.
- **No owner, no mark.** A mark's entire payload is the who — an unclaimed or
  ownerless-but-covered day (`meals`' `isCovered()` without an owner) makes
  none, never a placeholder "someone" mark.

### Avatar photos — the spine carries the identity, the avatar carries the face (settled — 2026-07-11)

**Settled** — see ADR 042 (amends ADR 030). Component: `ProfileAvatar avatarUrl`;
editor: `AvatarEditor`.

**A photo is a face, not an identity token.** A photo **fills the circle** — the
avatar wears no hue ring. The identity colour is carried by the chrome _beside_ the
avatar (the `ItemCard` spine, an identity wash, a hue pill), so a photograph and the
identity system never compete for the same pixels. The tinted-initials fill remains
underneath as the **no-photo fallback**, but it is a fallback, not the colour signal.

Spines, dots, chips, calendar fills and split fills stay hue-driven and **never
become photos**.

> **The rule.** An avatar is **not** a colour signal. **Any surface showing more
> than one person at once must carry a hue element of its own.** Never delete a
> row's spine on the grounds that it has an avatar — that trade was made once (the
> up-next day rows, ADR 040) on the premise that "the avatar already IS the identity
> hue a spine would paint." A photograph makes that false, and ADR 042 reverses it.

**Why not ring the photo in the owner's hue?** It was built and rejected. On a feed
post card the `ItemCard` spine already paints that exact hue two millimetres to the
left — the ring said the same thing twice. An audit found the ring was _redundant_
on every surface that had a hue carrier and _load-bearing_ only on the four that had
none. That is a reason to fix those four surfaces, not to ring every avatar.

#### The identity key

The **profile switcher** (`ProfileGrid`) and the **Settings member list**
(`ProfileListItem`) both carry an identity `<Spine>`. They are the only surfaces
showing every member's **face and name together**, which makes them the app's
**legend** — the one place the hue→person code can be _learned_. Everywhere else
colour appears with **no name attached** (a calendar chip is a coloured pill and
nothing more) and only works because it was learned here. A photo replaces the
tinted circle, so without that spine the legend disappears while everything
depending on it remains.

Where colour is _not_ required: single-person chrome — the sidebar chip, the mobile
top bar, the compose form. That's you; colour there is decorative, not identifying.

**Uploads** are cropped and encoded client-side (`AvatarEditor` → 512×512 WebP), so
the server needs no image library. The server accepts **JPEG / PNG / WebP only,
identified by magic bytes — never SVG** (it can carry script, and we serve inline
from our own origin). Bytes live in Postgres and are served immutable behind
`/api/profiles/:id/avatar?v={hash}`.

> **Caveat:** a spine does **not** universally mean "who" — the **call site** decides.
> On a **multi-person** surface it always means who (ADR 043). On a **single-person**
> surface, where identity carries no information, it means **status**: chores' taskee
> `TaskCard` and the widget's taskee `TaskRow` both pass a status colour, and are
> correct to. See "Status vs identity colour".

### Semantic status tokens — light mode

Each token has a paired `-foreground`. `--destructive` is a CSS alias
for `--error` so shadcn components keep working without a separate
value to maintain.

| Token                      | Value                     | Role                                                      |
| -------------------------- | ------------------------- | --------------------------------------------------------- |
| `--info`                   | `oklch(0.45 0.09 200)`    | Informational banners and badges                          |
| `--success`                | `oklch(0.44 0.10 148)`    | Completion, confirmed states                              |
| `--warning`                | `oklch(0.69 0.12 78)`     | Attention needed, soft alerts                             |
| `--error`                  | `oklch(0.50 0.17 12)`     | Failures, validation errors                               |
| `--destructive`            | `var(--error)`            | shadcn alias — do not use directly in new code            |
| `--destructive-foreground` | `var(--error-foreground)` | shadcn alias (paired) — text/icon on destructive surfaces |

### Dark mode

Triggered by `prefers-color-scheme: dark` — no JavaScript required,
cascade-based. The dark background is a **deep loam** (`oklch(0.15 0.018 105)`)
rather than the cold blue-black common in most apps. Primaries lighten
to maintain contrast against dark surfaces.

> **Every themed token must be declared in all three blocks** of `styles.css`:
> `:root` (light), the `prefers-color-scheme: dark` media block, **and**
> `[data-theme='dark']` (the explicit in-app toggle). A token missing from the
> third does not fail loudly — it silently inherits the **light** value, and only
> for users who toggled the theme rather than inheriting it from the OS. This has
> bitten once: `--surface-sunken` / `--shadow-inset` shipped without the
> `[data-theme]` entry, so the up-next groove rendered near-white on dark, and the
> OS-preference dark screenshots all looked correct. If you add a token, grep for
> all three.

| Token                | Light                    | Dark                    |
| -------------------- | ------------------------ | ----------------------- |
| `--background`       | `oklch(0.985 0.008 100)` | `oklch(0.15 0.018 105)` |
| `--foreground`       | `oklch(0.18 0.03 100)`   | `oklch(0.92 0.012 100)` |
| `--primary`          | `oklch(0.5 0.11 122)`    | `oklch(0.62 0.11 122)`  |
| `--accent`           | `oklch(0.47 0.07 185)`   | `oklch(0.56 0.08 185)`  |
| `--secondary`        | `oklch(0.93 0.02 100)`   | `oklch(0.22 0.016 105)` |
| `--muted`            | `oklch(0.93 0.016 100)`  | `oklch(0.2 0.014 105)`  |
| `--muted-foreground` | `oklch(0.52 0.035 100)`  | `oklch(0.56 0.02 100)`  |
| `--border`           | `oklch(0.88 0.02 100)`   | `oklch(0.3 0.018 105)`  |
| `--input`            | `oklch(0.62 0.02 100)`   | `oklch(0.52 0.018 105)` |
| `--error`            | `oklch(0.50 0.17 12)`    | `oklch(0.62 0.17 12)`   |

A manual dark mode toggle is available to all tiers in display preferences.
The preference is stored per-profile and overrides `prefers-color-scheme` on
load. The family pseudo-profile always follows `prefers-color-scheme`.
Implemented in the M1 home-surface story.

---

## Spacing

**Settled** — design-system audit, 2026-07-10 (decisions recorded in
`docs/sessions/logs/2026-07-10-audit-design-system-consistency.md`, Part B).

Spacing is either a **numeric step on the base-4 grid** or a **semantic
dimension token** — never a bracket-arbitrary `[Npx]` value. Tailwind v4
derives every numeric utility from the `--spacing: 0.25rem` base, so the
rhythm scale is a convention, not CSS.

### Rhythm scale

| Step | Example utility             | px  | Role                                             |
| ---- | --------------------------- | --- | ------------------------------------------------ |
| 0.5  | `gap-0.5`                   | 2   | hairline gaps                                    |
| 1    | `w-1`                       | 4   | Spine width, tight inline gaps                   |
| 1.5  | `gap-1.5`                   | 6   | icon–label gaps, chip padding                    |
| 2    | `p-2`                       | 8   | dense row padding, field-label gap               |
| 2.5  | `px-2.5`                    | 10  | compact controls                                 |
| 3    | `py-3`                      | 12  | row padding (`ItemCard` `py`)                    |
| 3.5  | `px-3.5`                    | 14  | —                                                |
| 4    | `px-4`                      | 16  | card padding (`ItemCard` `px`), grid gap, insets |
| 5    | `p-5`                       | 20  | —                                                |
| 6    | `p-6`                       | 24  | panel padding, widget section rhythm             |
| 8    | `p-8`                       | 32  | page-level breathing room                        |
| 12+  | `w-18`, `min-h-32`, `w-35`… | 4×N | larger fixed dimensions stay on the grid         |

No custom off-grid steps exist — 7/18/22px legacy values were snapped to the
grid (2026-07-10 decision a).

**`scripts/check-spacing.sh` enforces this**, in CI on every PR and as a
`PostToolUse` hook — the same shape as the context-budget check, and for the same
reason: the rules above were written down years before they were kept. It fails
on a raw type class, a raw named radius, and bracket spacing that does not derive
from `var()` or `env()`. Stories and tests are exempt (they render specimens,
including ones the system rejected), and a component's own internal geometry can
be exempted in the script itself, with the reason it is geometry and not rhythm —
`ListRow`'s `inset-y-[3.5px]` is the only entry.

### Semantic dimension tokens

Defined in `packages/ui/src/styles.css` (`@theme`).

| Token                    | Value | Utility                          | Role                                                           |
| ------------------------ | ----- | -------------------------------- | -------------------------------------------------------------- |
| `--spacing-touch`        | 48px  | `min-h-touch`/`min-w-touch`      | Minimum touch target                                           |
| `--spacing-card-touch`   | 64px  | —                                | `ItemCard`'s floor per ADR 068 — **declared, not yet applied** |
| `--spacing-list-touch`   | 56px  | (primitive only, arbitrary form) | `ListRow`'s floor, applied unconditionally (ADR 068)           |
| `--spacing-tab-bar`      | 56px  | `h-tab-bar`, safe-area calc      | Mobile bottom tab bar + anything anchored to it                |
| `--spacing-top-bar`      | 52px  | `min-h-top-bar`                  | Mobile brand top bar                                           |
| `--spacing-sidebar`      | 220px | `w-sidebar`                      | Tablet sidebar (ADR 022)                                       |
| `--spacing-meter`        | 6px   | `h-meter`                        | Progress-meter bar height                                      |
| `--page-frame-x`         | 16px  | (frame declaration is `px-4`)    | `PageContainer` side gutter, phone                             |
| `--page-frame-x-md`      | 24px  | (`md:px-6`)                      | `PageContainer` side gutter, ≥ 768                             |
| `--page-frame-top`       | 16px  | (`pt-4`)                         | `PageContainer` top inset, phone                               |
| `--page-frame-top-md`    | 24px  | (`md:pt-6`)                      | `PageContainer` top inset, ≥ 768                               |
| `--page-frame-bottom`    | 24px  | (`pb-6`)                         | `PageContainer` bottom inset, phone                            |
| `--page-frame-bottom-md` | 48px  | (`md:pb-12`)                     | `PageContainer` bottom inset, ≥ 768                            |
| `--container-content`    | 680px | `max-w-content`                  | Single-column content pages                                    |
| `--container-drawer`     | 440px | `md:w-drawer`                    | Side-drawer width                                              |

### Radius family

| Token            | Value          | Utility         | Surfaces                              |
| ---------------- | -------------- | --------------- | ------------------------------------- |
| `--radius-card`  | 0.5rem (8px)   | `rounded-card`  | Card rows (`ItemCard`)                |
| `--radius-panel` | 0.75rem (12px) | `rounded-panel` | Panels, widget pills, compose chrome  |
| `--radius-hero`  | 1rem (16px)    | `rounded-hero`  | Hero cards (FocusView, NextEventHero) |

### Widget inset (settled — 2026-07-11)

`WidgetSlot` contributes **no padding**: it is chrome (radius, fill, shadow)
only, so each widget owns its own inset. One value can't serve every slot — a
1×1 has ~148px of content height at 16px padding, so the 24px that lets the 2×2
feature tile breathe would cost the small tile an eighth of its height. The
inset therefore **scales with the size variant**, exported as `WIDGET_INSET`
from `@family-os/ui` so the widgets can't drift apart:

| Variant    | Utility | px  | Slot                    |
| ---------- | ------- | --- | ----------------------- |
| `compact`  | `p-4`   | 16  | 1×1 — can't afford more |
| `standard` | `p-5`   | 20  | 2×1                     |
| `large`    | `p-6`   | 24  | 2×2 — the feature rung  |

A **full-bleed child must negate the matching value** (`-mx-6` under `large`) —
the calendar widget's "all week" groove is the current one. Retired
family-feed's hand-rolled `14px 18px 16px`.

### Rules

- Bracket-arbitrary `[Npx]` spacing/size values are banned. Exemptions:
  component-internal geometry (switch thumb travel, stroke widths, focus
  offsets, hairline indicators) and safe-area `calc()` expressions — which
  must derive from the tokens (`calc(var(--spacing-tab-bar) + env(…))`).
- One-off fixed widths with a single consumer (confirm dialog, notification
  tray, wide calendar canvas) stay local; promote to a `--container-*` token
  when a second consumer appears.

---

## Surfaces

### Tablet — Primary Hub

The family's central display. Always-on, landscape, touch-first.
Target: 10–13" touchscreen, 1280×800 minimum.

**Shell layout:** Left sidebar (220px) + main content area (flex-1).
No top header bar — the profile chip lives at the top of the sidebar.
See [Tablet Nav Layout](#tablet-nav-layout) and [Widget Composition System](#widget-composition-system).

**Home screen:** A named placeholder in M0. It explicitly does not
define the final composition surface — that is the widget system,
designed in M1. See ADR 011.

**Touch targets:** All interactive elements minimum 48px. Row height belongs to
the primitive, not to the caller (ADR 068): `ItemCard` is 64px
(`--spacing-card-touch`, when interactive), `ListRow` is 56px
(`--spacing-list-touch`, always). **`ListRow` applies its floor today; `ItemCard`
does not yet** — nothing reads `--spacing-card-touch`, so the card floor is a
decision on the books, not enforced code. Landing it grows every chores, calendar
and meals row and owes a visual review of its own. You pick a primitive by ADR
063's rule and it brings its own floor — a number written in a consumer, a story spec, or an AC is
a copy, and copies drift. Adjacent activation targets keep ≥8px of dead space
between them. `ListRow`'s overlay is `inset-y-[3.5px]`, a value **derived** from
two invariants — live target ≥ `--spacing-touch`, dead band ≥ 8px — and the
hairline the padding box excludes: `(56 − 1 − 48) / 2`. It yields 48px live and
8px dead on a 56px row. Re-derive it if any of the three moves; a whole-pixel
`inset-y-1` measures 47/9 and puts the target under the declared minimum.

**Viewing distance:** Primary readable content minimum 18px. Status
counts and key values minimum 20px. This is the **across-the-room** floor of the
[type scale's viewing-distance rule](#type-scale) — it binds the always-on wall
surface (the family pseudo-profile), not a parent's laptop showing the same
widgets at desk distance.

### Other Surfaces

Mobile surface layout is settled — see [Mobile Surface](#mobile-surface) and ADR 033.
TV and Pi room display layouts are deferred to their respective design sessions. See `docs/sessions/queue.md`.

---

## Role-Aware Rendering

**Settled** — see ADR 013 (state management) and ADR 015
(permission layer).

### Model

Tier defines the baseline permission set. Individual permissions
can be granted above or revoked below that baseline by a parent.
All capability checks operate on the _effective_ permission set.

```
effective permissions = tier_baseline ∪ granted − revoked
```

### Hooks

```ts
// Primary hook — full user object including tier
const { user } = useAuth()

// Tier level only
const { tier } = useTier() // 1 | 2 | 3 | 4

// Effective permissions — tier baseline + grants − revocations
const { can } = usePermissions()
can('create', 'chores.Task') // → boolean
```

All three imported from `@family-os/platform`.

### Rendering Primitives

```tsx
// TierGate — coarse structural gating
// Use for broad sections (admin nav, management areas)
<TierGate min={3}>
  <AdminPanel />
</TierGate>

// PermissionGate — fine-grained capability gating
// Use for specific actions that can be granted/revoked independently
<PermissionGate action="create" subject="chores.Task">
  <NewTaskButton />
</PermissionGate>

// Both support a fallback
<PermissionGate action="create" subject="finance.Transaction" fallback={<LockedState />}>
  <SpendingControls />
</PermissionGate>
```

`min` is always a numeric level (1–4), never a display name string.
Permission strings follow `module.noun.verb` convention.

### Tier rendering intent

| Tier       | General intent                                                                                      |
| ---------- | --------------------------------------------------------------------------------------------------- |
| 1          | Simplified vocabulary, large targets, no **household** financial data, task completion + own wallet |
| 2          | Earning progress visible, full task detail, no management UI                                        |
| 3          | Family schedule visible, can propose/create tasks, light management UI                              |
| 4 (parent) | Full management, approval queues, all financial data, system settings                               |

Specific capability rules per module are defined in module specs,
not here. Individual grants and revocations are managed at runtime
by parents — not hardcoded.

> **Amended 2026-07-22 (ADR 053).** Tier 1 read _"no financial data"_, written before any
> in-app currency existed. It means the **household's** money — budgets, real balances,
> cashout, Monarch — which is M8 and stays tier 4. It does **not** mean a kid's own P-Bucks:
> **tier 1 holds a wallet, reaches the store, and punches its own card.** Chores have
> minted XP for a tier-1 kid since M2 and M4 exists to give that loop its second half;
> granting the capability and withholding the surface is ADR 044's failure repeated.

---

## Login / Profile Switch

**Settled** — see ADR 017, ADR 021, and the 2026-05-29 design session.

### Family Dashboard

The tablet's default state when no family member is active. A `family` pseudo-profile
(tier 1, all writes removed via CASL) is permanently seeded and serves as the active
profile. Modules render tier-appropriate content normally — no special null-auth code
path.

The family dashboard is **not a lock screen.** The tablet remains functional and
informative in the unattended state. Intended content is module-owned; the rule is:
anything visible at tier 1 is eligible for the family dashboard.

**Contextual auth:** Write actions on the family dashboard intercept the tap and
surface the profile picker inline. The action completes after profile selection.
The CASL model enforces this naturally — the family pseudo-profile has no write
permissions.

### Entry Points

| Trigger                        | Behavior                                                                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **Corner chip** (shell header) | Always visible. Shows current active profile (avatar + name). Tap opens profile grid overlay.                           |
| **Inactivity timeout**         | Deactivates personal profile, returns to family dashboard. Next interaction uses family dashboard or switches via chip. |

There is no lock screen. The tablet does not gate access; it offers personalization.

### Profile Grid

A centered grid of circular avatars. Presented full-screen on inactivity transition;
floating overlay from corner chip tap. Same component, `mode: 'fullscreen' | 'overlay'`.

- Avatar: 80px minimum diameter
- Tap target: 48px minimum (see touch targets in Surfaces)
- Name label below each avatar
- Avatar fallback: initials or emoji if no image set
- Current active profile: highlighted ring, non-interactive
- Family pseudo-profile: **not shown** in the picker — it is the default, not a choice

### PIN Entry

Triggered when switching to a profile at a higher tier than the current active profile.

- **Single global family PIN** — one PIN for the whole family. Not per-profile.
  Stored in `platform.system_config`. Any tier-4 profile can set or reset it.
- **UI:** Full-screen overlay; large circular digit buttons; 4-digit PIN;
  dot progress indicator
- **Copy:** "Enter family PIN" — no attribution to a specific parent
- **No PIN set:** Returns 423; upward switching is blocked until a tier-4 profile
  completes first-run PIN setup
- **Failed attempt:** Wrong-PIN message shown inline. Repeated failures trip the
  API's lockout — a Too-many-attempts response with `retryAfter`, surfaced inline.

### Future — Biometrics

Touch ID / Face ID would replace PIN entry as the verification pathway on
`POST /auth/verify-pin`. The session/switch model is unchanged — it is a
UI-layer swap. No architectural accommodation needed now.

---

## Tablet Nav Layout

**Settled** — see ADR 022. **Surface + fold amended** — sidebar-refresh session,
2026-07-11 (ADR 031 amendment).

Left sidebar, always visible, on the `--background` plane (no colored wall) with a hairline
`border-r` seam. It **folds responsively**: a slim label-under-icon rail below `xl`,
expanding to the full label-beside rail at `xl`+.

```
   < xl  (w-sidebar-rail, 96px)        xl+  (w-sidebar, 220px)
┌──────┬─────────────────────┐    ┌──────────┬──────────────────┐
│  ▢   │                     │    │ (Z) Zach▸│                  │
│ Home │    Main content     │    │ ▨ Home   │   Main content   │
│  ▢   │    (cards float)    │    │ ▢ Feed   │   (cards float)  │
│ Feed │                     │    │ ▢ Chores │                  │
└──────┴─────────────────────┘    └──────────┴──────────────────┘
   icon over centered label          label beside icon
```

### Sidebar structure (top to bottom)

1. **Profile chip** — an **elevated `--card` chip** (`border` + `--shadow-card`, lifting to
   `--shadow-raised` on hover/open) so it reads as a header control, not a fourth nav item.
   Tap opens the profile-switch menu (per ADR 021) as a **floating dropdown just below the
   chip** — edge-aligned to the chip at `xl`, a fixed `w-64` overhang in the slim rail.
   **Avatar-only in the slim rail** (below `xl`); avatar + active profile name + chevron
   when expanded (`xl`+).
2. **Nav items** — icon + label (label _under_ the icon when slim, _beside_ it when
   expanded). Labels are **`text-xs-body` (11px) slim / `text-sm` (14px) expanded**.
   Tier-filtered: items the active profile can't access are hidden. Minimum 48px
   (`min-h-touch`) target per item. The nav scrolls internally (`overflow-y-auto`) so the
   pinned utility group survives short viewports and long nav lists.
3. **Notification bell + Settings** — bottom utility group, separated from the nav by an
   inset `border-t` hairline, same fold treatment. Tier-2+ only — the group **and its
   divider** render only when populated, so the family pseudo-profile gets neither. The
   bell label reads "Alerts" slim / "Notifications" expanded.

The fold breakpoint is `xl` (1280px); widths are the `--spacing-sidebar-rail` (96px) and
`--spacing-sidebar` (220px) tokens.

### Nav item visibility

Nav items are filtered by the active profile's tier. Plugins register nav routes in
their `manifest.json` with a `minTier` field (same pattern as widget registration).
The sidebar renders only the routes the current user can access.

The family pseudo-profile (tier 1, no writes) sees only tier-1-appropriate nav items.

### Sidebar surface

**Amended** — sidebar-refresh session, 2026-07-11 (ADR 031 amendment). _Supersedes the
2026-06-13 `--secondary` rule below._

The sidebar renders on **`--background`** — no colored fill. Once the home widgets float as
`--card`+shadow surfaces (ADR 039), a `--secondary` sidebar read as a _colored wall_
competing with content; on the shared `--background` canvas the cards lift and the rail
recedes. Two hairlines give the recessive rail just enough edge (a fully-bare rail read too
dissolved in review):

- **`border-r border-border/60`** — the rail↔content seam the `--secondary` lightness delta
  used to provide.
- inset **`border-t border-border/60`** — separates the bottom utility group from the nav.
  Rendered **only when the group is populated** (tier 2+), so no stray rule appears for the
  family profile.

The **profile chip is the one elevated element** — a `--card` chip with `--shadow-card`
(→ `--shadow-raised` on hover/open), per the ADR-039 ladder. Everything else stays flat.

> _Historical (pre-2026-07-11): the sidebar rendered on `--secondary`, relying on the
> lightness delta vs. `--background` to seam. Dropped — the colored wall competed with the
> floating content cards; the rail now recedes on `--background` with hairline edges._

### Interaction states

**Settled** — ADR 031, shell-chrome-interaction-states design session, 2026-06-13.

`--primary` owns "active" across the entire app. `--accent` is locked to module identity
and must never appear on navigation state (active, hover, selected).

#### Accent scope

`--accent` (sage-teal) is reserved for module identity surfaces only:

- Widget identity headers (icon + `text-section-label`)
- Feed day markers
- `section-label` when naming a module surface
- Notification badge for success/info severity

#### Nav state classes

_Amended 2026-07-11 (ADR 031 amendment) — active softened to `/10` on the seamless
`--background` rail; hover moved to the reused `--secondary` surface so it stays distinct
from the primary-tinted active._

| State                   | Classes                                       | Notes                                                            |
| ----------------------- | --------------------------------------------- | ---------------------------------------------------------------- |
| Active nav item         | `bg-primary/13 text-primary font-medium`      | "You are here" — soft olive tint on the bare `--background` rail |
| Nav hover               | `hover:bg-secondary/70 hover:text-foreground` | The retired sidebar surface, reused as the hover wash            |
| Profile chip rest       | `bg-card border shadow-[var(--shadow-card)]`  | Elevated header chip (ADR 039 ladder), not a nav item            |
| Profile chip hover/open | `shadow-[var(--shadow-raised)]`               | Lifts on hover and while the switch menu is open                 |

The active profile avatar uses a `--primary` ring (ADR 030). Ring (circular, avatar-level)
and fill (rectangular, item-level) are visually distinct shapes of the same
"primary = selected" signal — no conflict.

---

## Widget Composition System

**Settled** — see ADR 022. Implementation is M1.

### Grid

React Grid Layout (`react-grid-layout`). Config: `cols: 4`, `rowHeight: 180`,
`gap: 16`. The four columns fill the main content area (~1060px after sidebar at 1280px).

M1 ships in static mode (`isDraggable: false`, `isResizable: false`).
Drag-and-drop configuration UI is M1+.

### Widget slot taxonomy

Six named sizes. Plugin manifests declare these by name; the shell translates to
React Grid Layout `{ w, h }` values internally.

| Named size | `w` | `h` | ~Dimensions |
| ---------- | --- | --- | ----------- |
| `compact`  | 1   | 1   | 253×180px   |
| `standard` | 2   | 1   | 522×180px   |
| `tall`     | 1   | 2   | 253×376px   |
| `large`    | 2   | 2   | 522×376px   |
| `banner`   | 4   | 1   | 1060×180px  |
| `full`     | 4   | 4   | 1060×760px  |

### A widget list fits its slot — it does not crop (settled — 2026-07-25)

The dimensions above are nominal. A slot's real height comes from the viewport
(`WidgetGrid` divides its container by the row count), so **no widget can know at
author time how many rows it has room for** — and a list that leaves it to
`overflow: hidden` cuts its last row through the middle. **A half-rendered row
and a broken widget look identical**, so the reader cannot tell "there is more"
from "this is wrong."

Any list rendering into a widget slot uses **`useFitRows`** (`@family-os/ui`):
show only the **whole** rows that fit, then state the remainder (`+N more`).
Two things fall out of it:

- **Order the list by urgency**, because the sort decides who survives the clamp.
- **Memoise the array you hand it** — the hook re-measures on array identity, so
  a sort in the render body never settles.

Found the hard way: the chores today-summary sliced the fourth family member on
the fridge iPad (auto-bug #70), while calendar's up-next widget had already
solved the same problem inline.

### Widget registration

Plugins declare widgets in `manifest.json`. See ADR 022 for the full field spec.
Key fields:

```json
{
  "id": "chores.today-summary",
  "displayName": "Today's Chores",
  "component": "./widgets/TodaySummary",
  "defaultSize": "standard",
  "supportedSizes": ["compact", "standard", "large"],
  "minTier": 1,
  "requiredPermission": "chores.task.view",
  "description": "Shows the current user's tasks due today."
}
```

### Widget identity header

**Settled** — Family Feed visual language session, 2026-06-11.

Every content widget opens with an identity header so the module is legible
at a glance (the tablet is often viewed across a room, and an unlabeled
widget is anonymous):

```
[icon 13px, muted]  MODULE NAME        ← text-section-label, neutral
```

- Lucide icon representing the module, 13px, `--muted-foreground`
- Label: `text-section-label` neutral — the icon in `--muted-foreground`, the
  label inheriting `--foreground` (it sets no color of its own). Identity colour is
  **not** spent on the header; it's carried by the content rows (per-row spines /
  avatars — see _Identity in widget slots_).
- Placeholder cards and error cards are exempt (they carry their own anatomy and
  do not label an active module surface)

> **Reconciled 2026-06-20.** This entry previously specified `--accent`, but the
> `family-feed` reference widget (from the session that settled this) renders
> **neutral**, and the chores widget was aligned to match. Module identity lives in
> the rows, not the header. (Feed day markers / page-header eyebrows still use the
> sanctioned `--accent` section-label — that's a separate surface.)

### Identity in widget slots

**Settled** — widget-slot-states design session, 2026-06-13.

"People are color" (ADR 030) must hold in widget slots, not just on full-page views.
Each authored/assigned row carries a **4px leading spine** in the relevant hue.

**The spine is a shared primitive — `<Spine>` (`@family-os/ui`).** Do not hand-roll
the `<span>`; every row surface (chores, feed, calendar) renders `<Spine>` as the
first child of a `flex` row. It is **shape only** — 4px wide, `rounded-sm` (2px
radius), a flex child that `self-stretch`es to the content box. Its `color` prop
takes **one color or an array** and **carries no semantic of its own**; the call
site decides the hue (see _Status vs identity colour_ below). A single color paints
a solid bar; **multiple colors paint a vertical hard-stop split — one band per
member, top to bottom** — the shared-event recipe, mirroring the month-grid lane
fills (`lib/hues`). The `inset` prop floats the spine shorter than the row (the
dense filled-pill recipe for widget rows); the default stretches the full content
box (card/list rows).

> **Reconciled 2026-06-22 (Spine token).** Previously each surface re-implemented
> the spine inline, and the feed page card drew it as a **flush corner-to-corner
> edge** (`position: absolute` + `overflow: hidden` clip). Both feed variants moved
> to the **inset** `<Spine>` so all row surfaces share one placement. The feed page
> card is now a `flex` row with an internal floating color pill, not a colored edge.

**General rule for all content widgets:** when a widget row is authored by or
assigned to a specific family member, it expresses that member's identity hue via
`<Spine>`. Chores widget: assignee hue on each task row. Calendar widget:
organizer/assignee hue on each event row. The spine does not appear on unassigned
items; a multi-person (shared) item uses a split spine, a Family item a neutral one.

`FeedPostCard` ships three variants:

| Variant  | Chrome                                 | Identity        | Use                                   |
| -------- | -------------------------------------- | --------------- | ------------------------------------- |
| `note`   | `--card` bg + border + `--shadow-card` | inset `<Spine>` | Feed page — standalone elevated cards |
| `widget` | None                                   | inset `<Spine>` | Feed widget — dense list rows         |
| `plain`  | None                                   | None            | Surfaces that manage their own chrome |

### The card-row primitive — `ItemCard`

**Settled** — ItemCard + SegmentedControl session, 2026-06-23.

The `flex` row that hangs a `<Spine>`, a content column, and an optional trailing
control off card chrome recurs across **every** content surface — feed posts,
chore tasks, calendar event rows. It is a shared primitive: **`<ItemCard>`
(`@family-os/ui`)**. Do not hand-roll the `flex + Spine + rounded/border/bg-card/
shadow-card` skeleton; it had drifted (three radii, three paddings) before being
standardized here.

| Prop       | Values                 | Default   | Role                                                                                        |
| ---------- | ---------------------- | --------- | ------------------------------------------------------------------------------------------- |
| `spine`    | color · color[] · omit | omit      | Leading `<Spine>` hue; an array splits it per member; omit for no spine                     |
| `chrome`   | `card` · `bare`        | `card`    | `card` = radius/border/`--card`/shadow/padding; `bare` = layout only (the slot owns chrome) |
| `align`    | `stretch` · `center`   | `stretch` | Cross-axis; `center` for a single line + trailing control                                   |
| `dimmed`   | boolean                | `false`   | Dim the row (completed task); pair with `transition-opacity` on `className` to animate      |
| `trailing` | `ReactNode`            | —         | Control pinned to the row's trailing edge                                                   |
| `as`       | `div` · `article`      | `div`     | Wrapper tag (feed posts use `article`)                                                      |

The content column is the caller's `children` — provide your own `min-w-0 flex-1`
wrapper so the row truncates; `ItemCard` owns the spine/chrome/trailing, not the
content's internal layout. The spine still **carries no semantic of its own** — the
call site passes an identity hue (multi-person surfaces) or a status color
(single-person ones), per _Status vs identity colour_.

**Card-row radius is one token.** `--radius-card` (`0.5rem`, Tailwind `rounded-card`)
is the canonical corner for every card-chrome row. `ItemCard` applies it; don't
reach for `rounded-[14px]`/`rounded-lg` on a card row. Surfaces larger than a row
use `--radius-panel` / `--radius-hero` — see [Spacing](#spacing).

**Row affordances belong to the primitive, not to its callers:**

| Prop / component      | Role                                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `ItemCard onActivate` | Makes the row's passive area one tap target (tap-row-to-edit) and lifts `trailing` above it. A row owning its chrome owns its tap surface. |
| `RowActions`          | The inline edit/remove cluster — pencil on `sm+` (tap-row is the touch affordance), trash at every width, 44px targets.                    |
| `MemberGroupHeader`   | The by-member group header: face, name, identity-tinted count, load slot, add. Shared by the chores board and the Activities roster.       |

> **The AdminBoard exception is withdrawn (2026-07-12, ADR 043).** This section
> previously granted chores' `AdminBoard` a sanctioned exception to hand-roll the
> row scaffold, because it needed "a stretched tap-to-edit overlay button, a
> multi-control trailing cluster" that `ItemCard` didn't model. **The premise was
> already false:** calendar's `ActivityRow` was doing both _inside_ `ItemCard`, and
> each file's comments cited the other as its source — duplicated code that nobody
> had noticed was duplicated. Those affordances are now the primitive's (above).
> **No surface hand-rolls the row skeleton.**

> **Reconciled 2026-06-23.** Feed (`FeedPostCard`), chores (`TaskCard`), and
> calendar (`EventRow`) each hand-rolled this skeleton with drifted radii (14px vs
> 8px) and paddings. All three now compose `<ItemCard>` on a single `--radius-card`
>
> - `px-4 py-3`. `FeedPostCard`'s three variants map to chrome: `note` →
>   `card`/`article`, `widget` → `bare`, `plain` → returns its inner layout directly.

### The scanned-list primitive — `ListRow`

**Settled** — ADR 063 (2026-08-11); floors and targets settled by **ADR 068**
(2026-08-26). Landed in `@family-os/ui` with M5.5/2.

`@family-os/ui` has a second row primitive alongside `ItemCard`: **`<ListRow>`**
— hairline-separated (`border-b border-border`, no per-row border/shadow/radius),
`--spacing-list-touch` (56px) applied by the primitive itself and not lowerable
by a caller (ADR 068), a leading control slot, whole-row activation on an
`inset-y-[3.5px]` target. The rule for choosing:

> **Cards** when items are independent objects with several actions.
> **Rows** when items are a set you scan and act on one way.

`ItemCard` is unchanged; **do not** reach for `chrome="bare"` on a dense list
instead of `ListRow` — bare removes chrome but keeps the card's contract (spine,
trailing, per-row semantics) and models neither group membership nor a leading
slot. ADR 063 has the density argument.

| Prop            | Values        | Default | Role                                                                                                                                                                        |
| --------------- | ------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `leading`       | `ReactNode`   | —       | The row's leading control. `ListRow` renders it but doesn't define it — the primitive stays agnostic so a later interactive fill (a check ring) needs no prop-shape change. |
| `dimmed`        | boolean       | `false` | Opacity dim, no status colour — the primitive carries no semantic of its own                                                                                                |
| `onActivate`    | `() => void`  | —       | Whole-row tap target, ported from `ItemCard`                                                                                                                                |
| `activateLabel` | `string`      | —       | Accessible name for the tap target                                                                                                                                          |
| `as`            | `ElementType` | `div`   | Wrapper tag                                                                                                                                                                 |

Type: the name line is `text-card-title`, the note line `text-sm-token` and
muted; a group header (an aisle head) is `text-section-label`, muted. The
content column is the caller's `children`, same contract as `ItemCard`: bring
your own `min-w-0 flex-1` wrapper.

A `ListRow` carries **no identity chrome** — no spine, no avatar, no hue — on
any surface where the person is not the answer to the surface's question (ADR
064). Shopping is the case in point: who added the milk renders as a text fact
on the note line, never as colour nobody would decode mid-aisle.

### View switches — `SegmentedControl`

**Settled** — same session, 2026-06-23.

A compact single-select switch (Month/Week/Day on the calendar, and future
two-/three-way toggles): **`<SegmentedControl>` (`@family-os/ui`)**. A bordered
track where the active segment fills with `--primary`; under the hood a `radiogroup`
with roving `tabindex` + arrow-key navigation, so it reads as **one** control, not N
buttons. Generic over a string-union value (`options`/`value`/`onChange` +
`aria-label`). Use it instead of hand-rolling a button group; the calendar's
hand-rolled Month/Week/Day switch was its first adopter.

### Capture primitives — `CaptureField` and `ComposeForm`

**Settled** — ADR 070, M5.5/1 shopping surface design, 2026-09-03.

Two shapes of "type something in", and they are not sizes of one control:

> **`ComposeForm`** when the thing is **authored** — it has an author worth showing,
> it is worth a second draft, and submitting it ends the act.
> **`CaptureField`** when the thing is **caught** — it is one noun, it has no author
> worth showing, and submitting it should leave you ready to catch the next one.

`CaptureField` (`@family-os/ui`) is a single line that submits on Enter and **stays open
with its value cleared**. Anatomy: a leading glyph, the input, and an optional **trailing
scope slot** — the control that says _where what you type will land_ (shopping's
destination chip). It carries **no author avatar and no identity hue**: a primitive whose
whole claim is speed is not a place a person is displayed.

|           | `ComposeForm`                    | `CaptureField`                                          |
| --------- | -------------------------------- | ------------------------------------------------------- |
| Lifecycle | opens → submit → closes          | never closes; clears and stays focused                  |
| Lines     | multi (`Textarea`)               | one                                                     |
| Author    | avatar + identity hue            | none                                                    |
| Scope     | none — a note goes to the family | optional trailing scope control                         |
| Controls  | Cancel + a submit button         | Enter; no Cancel                                        |
| Height    | `--shadow-raised` panel          | 48 px inline · 56 px as a page hero · 76 px on the wall |

**Nothing autofocuses** (ADR 070, amended 2026-09-04 — this replaces the earlier
"autofocus is a surface decision" rule, whose two yes-cases both turned out to be
no-cases). `CaptureField` has no prop to ask: a widget claiming focus scrolled a stacked
phone dashboard 1272 px to a tile nobody asked for, and the same widget on the family
profile made an always-on kitchen display hold the keyboard. **A screen left on in a room
is not a screen someone walked up to.**

**A placeholder does not carry the field's weight at wall size** (2026-09-04). `wall` sets
its text to `heading`, whose 600 exists to carry **content** across a room — a placeholder
is instruction, and wearing that weight it reads as something already typed. Drop it to
`font-normal`; the colour is not the lever and stays `--muted-foreground` (5.23:1 on
`--background`, measured off the render). The case that forced it: a placeholder that
_demonstrates_ a syntax rather than describing the field — shopping's `milk, eggs, bread`
— looks most like a value exactly when the surface is answering about milk, eggs and bread.

**Reserve the report line, and keep it still.** A capture surface owes one line under the
field for what it has to say back — a failure, a collision. Its height is reserved from
first paint, because a line that mounts on the first keystroke shoves the page down and
Enter shoves it back. It may grow in answer to a submit, which is the reader's own act;
it must never move while someone is typing.

### Widget prominence — the elevation ladder

**Settled** — home-dashboard hierarchy exploration, 2026-07-10
(`logs/2026-07-10-design-dev-home-dashboard-elevation-ladder.md`).

Widget slots were uniform — every live widget got `--card` + `--shadow-card` +
`border` + `rounded-xl`, so nothing was a focal point and the surface read as three
equal boxes. Hierarchy on the home surface is now carried by **elevation**, not size
alone: the shell assigns each slot one of **three prominence rungs**. This is the
"depth, not lines, creates hierarchy" principle applied to the widget grid.

| Rung        | Shell chrome                                          | Radius                  | Role                                                                                                           |
| ----------- | ----------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Feature** | `--shadow-raised`, **no border**                      | `--radius-hero` (16px)  | The surface's one focal point; holds the module's hero. **At most one per surface** — a surface may have none. |
| **Card**    | `--shadow-card`, soft hairline (`border-border/45`)   | `--radius-panel` (12px) | Resting secondary widget.                                                                                      |
| **Quiet**   | recessed `--secondary` tint, **no shadow**, soft edge | `--radius-panel` (12px) | Fully live — keeps its identity header + content — but recedes _into_ the page.                                |

**The uniform border is gone.** A hard outline on every slot cancels the
(deliberately subtle) `--shadow-card` and flattens the ladder. Rungs are told apart
by **surface + depth**; only the quiet rung carries a soft edge, and the feature
rung carries none.

**At most one feature per surface, re-ranked per profile.** The rung assignment
expresses the ADR 028 tier-dominance that size used to carry alone: kid (tier 1–2) →
**Chores** features · family pseudo-profile → **Feed** features (a full-width banner,
read across a room). The same three widgets, same code — only the rung differs.

**A surface may have no feature, and the parent one doesn't** (ADR 039, amended
2026-07-11). The feature rung claims _"this is the one thing you came for."_ That is
true for a kid (today's chores) and for the unattended wall (the feed). It is not
true for a parent, who opens the dashboard to **triage** — calendar, chores and feed
are all live answers to "what needs me". Spending the ladder's loudest rung on a
claim that isn't true devalues it everywhere it _is_ true. The calendar still leads
by size and position (the 2×2, first column); elevation simply declines to overstate
a dominance the surface doesn't have.

**Reading order carries the same claim as elevation.** Within a column the higher rung
sits above the lower one. A quiet widget stacked above a card one is a bug: position
and elevation both answer "how much does this matter", so they must not disagree.

**Quiet ≠ flat.** The quiet rung is a **live** state and must never be confused with
the dashed-outline not-installed placeholder or the `--muted` error slot (both also
without shadow — see [Home Surface](#home-surface)). Quiet keeps a real surface tint,
its identity header, and live content; the flats carry their own not-content anatomy.
This distinction is load-bearing — if quiet reads as "broken," the ladder fails.

**Feature hero title stays DM Sans.** The calendar up-next hero title renders in
`text-heading` (DM Sans) — the serif treatment (`text-page-title`) was evaluated
against it and not adopted; the hero earns its weight from the wash + raised rung,
not a face change. (Lora as a hero option remains in the `Home Surface/Elevation
Ladder` playground for revisiting.)

**Widgets separate internal groups by spacing, not rules.** The calendar widget
sets day bands apart with space, not a hairline divider — "depth, not lines" holds
inside a widget too.

> **Wiring (ADR 039).** A slot's rung is a property of the **layout composition**,
> resolved on read (`GET /home/layout` carries `prominence` per item), not a widget
> manifest field — the same widget features for one profile and recedes for another.
> Not yet a persisted column; see ADR 039.

### Role-aware composition

Two levels:

1. **Shell — manifest gate:** Widget excluded from the layout if
   `minTier > activeProfile.tier` or `requiredPermission` fails `can()`.
   Skipped widgets are removed from the rendered grid; the layout re-flows.
   The saved layout record is preserved — the widget returns if the gate
   is later satisfied.

2. **Widget — internal rendering:** Widget component uses `useTier()` and
   `PermissionGate` to adapt its content within the slot.

### Layout persistence

Per-user layout stored in the platform DB as `{ widgetId, x, y, w, h }[]` —
the `widget_layouts` table, documented in `architecture.md`.

**Edit rights:**

| Tier | Own layout | Others' layouts   |
| ---- | ---------- | ----------------- |
| 1–2  | No         | No                |
| 3    | Yes        | No                |
| 4    | Yes        | Any family member |

New users seeded with a tier-appropriate default layout from platform config.
See [Home Surface](#home-surface) for the actual default layout definitions (ADR 028).
Layout is not auto-rearranged on tier changes — a parent edits it intentionally.

---

## Home Surface

**Settled** — see ADR 028. Implementation is M1.

The home surface is the primary view when the shell loads. It renders the widget grid
per the Widget Composition System. This section defines the default layout seeded for
new users and the reserved slot behavior for core modules.

### Default layouts

Three tier-appropriate default layouts are defined in
`packages/platform/src/home-layout.ts` (`DEFAULT_LAYOUTS` — the one definition;
the seed, the API and the shell all import it). All slot dimensions reference the
1280×800 viewport; widget components use CSS container queries to adapt to their
actual rendered size. Each slot also carries a **prominence** rung (see
[Widget prominence](#widget-prominence--the-elevation-ladder)); within a column
the higher rung sits above the lower — elevation and reading order must not
disagree.

**Tiers 1–2** (child profiles — wallet-first):

```
┌──────────────────────┬──────────────────────┐
│  Wallet    [feature] │  Chores       [card] │
├──────────────────────┼──────────────────────┤
│  Calendar  [quiet]   │  Family Feed [quiet] │
├──────────────────────┼──────────────────────┤
│  Dinner    [quiet]   │                      │
└──────────────────────┴──────────────────────┘
```

| `widgetId`             | x   | y   | w   | h   | prominence |
| ---------------------- | --- | --- | --- | --- | ---------- |
| `rewards.wallet`       | 0   | 0   | 2   | 1   | `feature`  |
| `chores.today-summary` | 2   | 0   | 2   | 1   | `card`     |
| `calendar.up-next`     | 0   | 1   | 2   | 1   | `quiet`    |
| `family-feed.feed`     | 2   | 1   | 2   | 1   | `quiet`    |
| `meals.tonight`        | 0   | 2   | 2   | 1   | `quiet`    |

**Tier 3** (teen profiles — the same ranking, one register down: no `feature`;
the wallet leads by position, not size):

| `widgetId`             | x   | y   | w   | h   | prominence |
| ---------------------- | --- | --- | --- | --- | ---------- |
| `rewards.wallet`       | 0   | 0   | 2   | 1   | `card`     |
| `chores.today-summary` | 2   | 0   | 2   | 1   | `card`     |
| `calendar.up-next`     | 0   | 1   | 2   | 1   | `quiet`    |
| `family-feed.feed`     | 2   | 1   | 2   | 1   | `quiet`    |
| `meals.tonight`        | 0   | 2   | 2   | 1   | `quiet`    |

**Tiers 3–4 and the family pseudo-profile** (parents / the unattended fridge
tablet — calendar-first triage, no `feature`):

```
┌──────────────────────┬──────────────────────┐
│                      │  Dinner       [card] │
│                      ├──────────────────────┤
│  Calendar    [card]  │  Chores       [card] │
│                      ├──────────────────────┤
│                      │  Family Feed [quiet] │
└──────────────────────┴──────────────────────┘
```

| `widgetId`             | x   | y   | w   | h   | prominence |
| ---------------------- | --- | --- | --- | --- | ---------- |
| `calendar.up-next`     | 0   | 0   | 2   | 3   | `card`     |
| `meals.tonight`        | 2   | 0   | 2   | 1   | `card`     |
| `chores.today-summary` | 2   | 1   | 2   | 1   | `card`     |
| `family-feed.feed`     | 2   | 2   | 2   | 1   | `quiet`    |

### Core module reservation

Family Feed, Chores, and Calendar are **reserved modules** — they hold positions in
every default layout regardless of whether their plugin is installed. When a reserved
module's plugin is absent from the registry, the slot renders a **placeholder card**
rather than being removed from the grid.

The shell checks plugin registry presence at render time. This is a shell concern —
plugins do not need to handle their own absent state.

### Placeholder state

**Settled** — widget-slot-states design session, 2026-06-13 (visual resolution of the flat/elevated conflict).

A reserved slot whose module is not installed renders in a **flat slot** (`WidgetSlot flat`):

- Slot chrome: none — no `--card` background, no border, no shadow
- Slot shape: `rounded-xl overflow-hidden` (same as live slots — only the elevation is removed)
- Background: transparent (page background shows through)
- Border: SVG `<rect>` dashed outline — `strokeWidth 1.5px`, `strokeDasharray 10 6`,
  `--muted-foreground/30`, `rx` matching the slot corner radius. CSS `border-dashed` is
  not used — SVG provides dash/gap size control that CSS cannot.
- Module icon: Lucide icon representing the module, 20px, `--muted-foreground`, inside a
  `--muted-foreground/10` rounded icon well
- Module name: 13px, medium weight, `--muted-foreground`
- One-line description: 11px, `--muted-foreground/70`
- No install CTA (marketplace pathway is M9)
- No widget identity header (exempt — the placeholder carries its own anatomy)

The flat/elevated contrast between placeholder slots and live widget slots is the primary
state signal: live widgets lift off the page; non-content slots recede into the background.
`PlaceholderCard` (`@family-os/ui`) implements this anatomy.

### Error state (slot level)

**Settled** — widget-slot-states design session, 2026-06-13.

When a widget's error boundary catches or a plugin's remote entry fails to load, the slot
renders an `ErrorCard` in the same `{ w, h }` — also in a **flat slot**:

- Slot chrome: none (same flat treatment as placeholder)
- Background: `--muted`
- Icon: Lucide `AlertTriangle`, 24px, `--muted-foreground`
- Copy: "[Module Name] couldn't load"
- Retry button: ghost variant, `--muted-foreground`, triggers a remount
- Visually calm — no red on the home surface
- No widget identity header (exempt)

Distinguished from the placeholder (not-installed) state by the warning icon and the retry
affordance. Both are flat — the absence of elevation is the shared "non-content" signal.
`ErrorCard` (`@family-os/ui`) implements this anatomy.

### WidgetSlot contract

**Settled** — widget-slot-states design session, 2026-06-13.

`WidgetSlot` carries a slot's prominence rung (see
[Widget prominence](#widget-composition-system)) plus the not-content flat:

| Rung / state           | Chrome                                                    | Use                           |
| ---------------------- | --------------------------------------------------------- | ----------------------------- |
| **Feature**            | `--shadow-raised`, no border, `rounded-hero`              | The one focal widget          |
| **Card** (resting)     | `--shadow-card`, `border-border/45`, `rounded-panel`      | Secondary live widgets        |
| **Quiet** (recessed)   | `--secondary` tint, no shadow, soft edge, `rounded-panel` | De-emphasized **live** widget |
| **Flat** (not-content) | None — shape only (`rounded-xl overflow-hidden`)          | Placeholder and error states  |

> **Migrated 2026-07-10 (elevation ladder).** The prior contract was a single `flat`
> boolean (`false` = one uniform live card; `true` = placeholder/error). The uniform
> live card is replaced by the three prominence rungs above; `flat` (dashed/muted)
> remains **only** for the not-installed and error states. The quiet rung is live and
> must not be confused with flat.

`WidgetGrid` accepts `flatSlots?: string[]` — a list of widget IDs that should render
flat. The shell passes this when it determines a slot holds a non-content state.

---

## Notification System

**Settled** — see ADR 029. Implementation is M1.

### Delivery model

All notifications flow through `platform.notify()`. Plugins never render
their own toasts, trays, or push payloads. The platform routes each
notification to the appropriate channel based on `priority` and the
active profile's tier.

```typescript
platform.notify({
  title: string,
  body?: string,
  variant: 'success' | 'info' | 'warning' | 'error',
  priority?: 'info' | 'alert',  // default: 'info'
  actions?: Array<{ label: string; href: string }>
})
```

### Toast

- Component: Sonner (shadcn/ui toast primitive)
- Position: bottom-right on tablet
- Max 3 visible simultaneously; additional notifications queue
- Anatomy: icon + title + optional body + optional action link + dismiss button

| Variant   | Auto-dismiss | Notes                        |
| --------- | ------------ | ---------------------------- |
| `success` | 3s           |                              |
| `info`    | 5s           |                              |
| `warning` | 8s           | User-dismissable             |
| `error`   | Persistent   | Must be explicitly dismissed |

All tiers receive toasts for modules they can access.

### Notification tray

A bell icon in the sidebar, between the nav items and the Settings entry.
Tapping it opens a panel that slides in from the right as an overlay —
the main content dims behind it; the layout does not shift.

- **Visible to:** tier 2+ only (tier 1 has no notification history to review)
- **Badge:** unread count pill on the bell icon
- **Badge color:** `max(severity)` across all unread notifications:

| Max unread severity | Badge color                          |
| ------------------- | ------------------------------------ |
| `success` or `info` | `--accent` (teal) — all calm         |
| `warning`           | `--warning` (amber) — attention soon |
| `error` / `alert`   | `--error` (red) — act now            |

Badge color re-evaluates whenever the unread set changes. **Closing** the
tray marks all items as read and resets the badge (not opening — so the
unread visual state is visible while reviewing).

- **Tray panel:** notification list, newest first.
- **History:** last 50 notifications retained per user; older items pruned.

### NotificationItem (Frame B)

Each item in the tray uses the following layout:

```
[icon]  Title text (bold if unread)          2m ago  [×]
        Optional body text (muted, 2-line clamp)
```

- **Left border:** 3px `--accent` (teal) when unread; transparent when read
- **Title weight:** 600 (unread) · 400 (read)
- **Icon opacity:** 1 (unread) · 0.45 (read)
- **Timestamp:** right-aligned on the title row (not below body)
- **Hover × button** (mouse only): `Button variant="ghost" size="icon-sm"`,
  appears on `mouseEnter`, calls `onDelete` — does not affect other profiles

### Per-item delete

Two mechanisms, both call `DELETE /notifications/:id`:

| Surface     | Mechanism                                                                                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Touch / pen | Swipe left — `@use-gesture/react` with `axis: 'x'`, `pointer: { mouse: false }`. Reveals red backdrop. Auto-dismisses past 100px or on flick (velocity > 0.5). Snaps back otherwise. |
| Mouse       | × button visible on hover (top-right of item)                                                                                                                                        |

### Clear all

"Clear all" text button in the tray header (right side), visible only when
the notification list is non-empty. Calls `DELETE /notifications` (bulk).
Optimistic: list empties immediately in the UI before server confirms.

### Web Push routing

| Tier     | Behavior                                                     |
| -------- | ------------------------------------------------------------ |
| Tier 4   | Web Push on by default for `priority: 'alert'` notifications |
| Tier 3   | Web Push opt-in per profile; `priority: 'alert'` only        |
| Tier 1–2 | No Web Push                                                  |

`priority: 'info'` never triggers Web Push regardless of tier.
Opt-in preference stored as a boolean per profile in platform settings.

---

## Error States

**Settled** — Notification & States design session, 2026-06-04.

### Level 1 — Inline (form / field validation)

- `--error`-colored text below the input field, DM Sans 14px
- Lucide `CircleAlert` (14px) inline-start of the error text
- Input border and ring shift to `--error`
- Never use error color text alone without the icon (accessibility)

### Level 2 — Component (widget / section error boundary)

When a widget's error boundary catches or a plugin's remote entry fails to load,
the slot renders `ErrorCard` in a flat `WidgetSlot`. See [Error state (slot level)](#error-state-slot-level)
in the Home Surface section for the full spec. `ErrorCard` is exported from `@family-os/ui`.

### Level 3 — Page / route error (404, 500)

Centered in the main content area. Not full-screen red.

- Icon: Lucide icon appropriate to the error type, 40px, `--muted-foreground`
- Heading: Lora — "Page not found" / "Something went wrong"
- Body: DM Sans, `--muted-foreground`, one line
- Action: Back button (404) or Retry link (500)

---

## Empty States

**Settled** — Notification & States design session, 2026-06-04.

### Anatomy

All empty states share the same structure:

```
     [Lucide icon — 36px, --muted-foreground, opacity 0.4]

       Nothing scheduled today          ← text-display-lg (Lora), --foreground
     Your calendar is clear.            ← text-body (DM Sans), --muted-foreground
                                          optional, max 2 lines

         [ + Add Event ]                ← PermissionGate-wrapped
                                          omitted entirely if can() = false
```

**Icon:** 36px, `color: var(--muted-foreground)`, `opacity: 0.4`. The reduced opacity reads as "absence" without adding visual weight.

**Heading:** `text-display-lg` (Lora, 29px). Empty state headings are the primary signal — they deserve the display weight.

**Body:** `text-body` (DM Sans, 18px), `--muted-foreground`. Single sentence max; matches widget viewing-distance minimum.

### Copy tone

| Tier | Tone                | Example (no chores)            |
| ---- | ------------------- | ------------------------------ |
| 1    | Warm, encouraging   | "All done!" / "Nothing today!" |
| 2+   | Neutral, functional | "No tasks scheduled"           |

Modules write two copy variants — one for tier 1, one for tier 2+.
The CTA is always wrapped in `PermissionGate` — if the profile cannot
create, the button is absent entirely (no locked/disabled state).

### Compact variant — widget slots

Inside 1-row widget slots (~180px) the full anatomy doesn't fit. Widgets
use a compact variant: heading drops to `card-title` (DM Sans), body to
`sm`, icon omitted. The CTA rule is unchanged (PermissionGate-wrapped or
absent).

### Rules

- Empty states are informational, never apologetic
- The icon must represent the module/category — not a generic empty box
- No animated illustrations in M1
- **The empty state owns the primary CTA.** When a page is empty, suppress the
  persistent header action so there is a single focal CTA (no duplicate primary).
  The header action returns once content exists. The empty-state CTA is `size="sm"`;
  the header action is default size. (Added 2026-06-20 — Task Editing; applied to
  chores + family-feed.)

---

## Motion & Animation

**Settled** — Notification & States design session, 2026-06-04.

### Principle

Motion should orient, confirm, or communicate — never decorate. If
removing an animation would not confuse the user, it should not be there.

`prefers-reduced-motion: reduce` disables all transitions and animations.
This is non-negotiable — every animated property must be wrapped in a
`@media (prefers-reduced-motion: no-preference)` guard or equivalent.

### Duration tokens

```css
--duration-fast: 100ms; /* micro-interactions: button press, toggle */
--duration-normal: 200ms; /* standard transitions: toast, fade, badge */
--duration-slow: 300ms; /* larger surfaces: tray panel, profile overlay */
```

### Easing tokens

```css
--ease-out: cubic-bezier(0, 0, 0.2, 1); /* elements appearing */
--ease-in: cubic-bezier(0.4, 0, 1, 1); /* elements leaving */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1); /* position/size transforms */
```

### Transition patterns

| Pattern                      | Duration            | Easing          | Notes                               |
| ---------------------------- | ------------------- | --------------- | ----------------------------------- |
| Button press                 | `--duration-fast`   | `--ease-out`    | Scale 0.97, color unchanged         |
| Toggle / checkbox            | `--duration-fast`   | `--ease-out`    | Color/fill only                     |
| Toast appear                 | `--duration-normal` | `--ease-out`    | Slide up + fade in                  |
| Toast dismiss                | `--duration-fast`   | `--ease-in`     | Fade out only, no slide             |
| Notification tray open/close | `--duration-slow`   | `--ease-in-out` | Slide in from right                 |
| Profile grid overlay         | `--duration-slow`   | `--ease-out`    | Fade in + backdrop blur             |
| Route transition             | `--duration-normal` | `--ease-in-out` | Fade only, no slide                 |
| Bell badge update            | `--duration-fast`   | `--ease-out`    | Scale pulse 1.0→1.15→1.0            |
| Widget mount (M1)            | None                | —               | No animation on initial grid render |

### Prohibition list — M1

- No page slide animations (applies to both tablet and mobile — see Mobile Surface section)
- No spring physics
- No stagger animations on list items
- No entrance animations on initial widget grid render
- No parallax or decorative movement

Plugins must use the duration and easing tokens above — never hardcode
timing values.

---

## Plugin Design Contract

**Settled** — see ADR 014.

```ts
// Plugins import from shared platform packages only
import { Button, Card, TierGate, PermissionGate } from '@family-os/ui'
import { useAuth, useTier, usePermissions } from '@family-os/platform'
```

Plugins must not:

- Import from the shell or other plugins directly
- Hardcode color values — use CSS custom property tokens
- Use media queries for layout — use CSS container queries

**Styling first-party plugins** (monorepo) — **settled by ADR 035.** First-party
plugins are authored **utility-first, exactly like the shell**. Plugins emit
JavaScript only (no CSS build of their own); the shell owns the single stylesheet
and `@source`-scans `plugins/*/src`, so any `className` utility, `hover:`/`focus:`
variant, or container query used in a plugin emits CSS. **No per-plugin CSS setup
is required** — a plugin does not import `tailwindcss` or `styles.css`.

```tsx
// Plugin component — same authoring model as the shell
<div className="grid place-items-center bg-primary hover:bg-primary/10 rounded-lg">
```

Colors and fonts still flow through **tokens** (`bg-primary`, `var(--primary)`,
`var(--font-display)`) — utilities resolve to tokens, and inline `var(--token)` is
fine for one-off values. Hardcoded hex/px color and font values stay banned.

> The shell `@source` and the Storybook `@source`
> (`packages/ui/.storybook/preview-styles.css`) must point at the same plugin glob
> — a divergence reintroduces "works in Storybook, breaks in the shell." Both carry
> a sync comment.

**Community / third-party plugins** (future): CSS custom-property tokens are
inherited from the shell's `:root` at runtime, so `var(--primary)` etc. work with
no import. But a third-party plugin distributed as a pre-built remote is **not** in
the shell's build tree, so its utility classes would not be scanned. That
distribution model isn't supported yet; when it is, the recommended path is a
**per-plugin Tailwind build** (ADR 035, Option 2) shipping the plugin's own
utilities-only CSS with the remote. Until then, community plugins should use
`var(--token)` inline styles or their own CSS rather than scanned utilities.

The `@family-os/ui` surface starts minimal and grows deliberately.
Every export is a commitment plugins can depend on.

---

## Mobile Surface

**Settled** — design-mobile-surface session, 2026-06-14. See ADR 033 (amended
2026-08-17: 5-tab cap + More sheet) and ADR 034 (brand top bar).

### Breakpoint

`md:` (768px) is the canonical tablet/mobile split. Below this threshold the sidebar is hidden and the bottom tab bar appears. This is a settled shell convention — all responsive work keys off this breakpoint.

### Nav pattern — top bar + bottom tab bar

Two chrome strips bookend the page content, both on `--secondary` material: a
**brand top bar** (ADR 034) — profile avatar (left) · **Vireo** wordmark
(center, DM Sans, never Lora) · notification bell (right) — and a **nav-only
bottom tab bar** capped at **5 tabs** (ADR 033, amended 2026-08-17): Home + the
first three tier-visible plugin tabs + a **More** tab. Always visible,
thumb-friendly, 1 tap to any pinned destination.

```
┌─────────────────────────────────────┐
│ [avatar]      Vireo         [bell]  │
├─────────────────────────────────────┤
│         [page content]              │
│                                     │
├──────┬──────┬──────┬──────┬────────┤
│ Home │ Cal  │Chores│Meals │  More  │
└──────┴──────┴──────┴──────┴────────┘
```

- **Tab height:** 56px minimum touch target
- **Active tab:** icon **and label together** on a `bg-primary/13` `rounded-panel` wash, label in `--primary` semibold — colour alone cannot separate olive from the muted ink (ADR 065). Same recipe as the sidebar's active row; the wash never covers the icon alone (#123, 2026-08-23).
- **Inactive tab:** icon + label in `--muted-foreground`
- **Tier filtering:** plugin tabs are filtered at the tab level using the same `minTier` convention as the sidebar.
- **Overflow:** the **More** tab opens a bottom `Sheet` listing the remaining tier-visible modules, and shows active state when an overflowed route is current; when everything fits in 5 tabs, no More tab renders. Pinning is registry order in `plugins.json`; the tab-pinning management UI is deferred to M9 (marketplace).

### Profile chip on mobile

The profile avatar sits in the left slot of the brand top bar (ADR 034). Tapping it opens the `ProfileGrid` (switch rows → Family view → Settings) as a top-anchored dropdown beneath the bar. The bottom tab bar carries no profile slot.

### Notification bell on mobile

**Settled** — ADR 034 (superseding the 2026-06-14 page-title top bar).

The bell occupies the right slot of the brand top bar, which applies `padding-top: env(safe-area-inset-top)` for notch clearance. The bell badge (unread count + severity) stays in peripheral vision on every page — same tier-2+ gate as the sidebar bell. The top bar disappears on tablet; the sidebar bell takes over.

Why a persistent top bar over a bell in the profile sheet: the badge is the primary value of the notification bell — it delivers ambient awareness. Hiding it behind 2 taps defeats that.

### Widget grid on mobile

Widgets reflow to a **single-column stack** — full viewport width, ordered by tier-default priority. No carousel. Widget components use CSS container queries to adapt to their full-width rendered size; no mobile-specific widget code needed.

### Safe-area insets

The bottom tab bar applies `padding-bottom: env(safe-area-inset-bottom)` to clear the iPhone home indicator. All mobile layout primitives must use safe-area insets — never assume the bottom of the viewport is usable.

```css
/* Bottom tab bar */
padding-bottom: env(safe-area-inset-bottom);

/* Page content — avoid tab bar overlap */
padding-bottom: calc(56px + env(safe-area-inset-bottom));
```

### App-shell scroll model

**Settled** — dev-mobile-shell-layout session, 2026-06-19.

The shell renders **fixed/sticky chrome around a single scroll container**. Every
view inherits this — pages do not manage their own scroll.

- **Outer shell** is `h-dvh … overflow-hidden` — the dynamic viewport height so
  mobile browser chrome (URL bar) never truncates the layout. `100vh` (`h-screen`)
  must not be used for the shell frame.
- **Chrome lives outside the scroll area.** The mobile top bar is a `shrink-0`
  sibling above `<main>` (not in the scroll flow, so it stays put); the bottom tab
  bar is `fixed bottom-0`. Neither scrolls.
- **`<main>` is the one scroll container** — `flex-1 overflow-auto` with
  `pb-[calc(56px+env(safe-area-inset-bottom))] md:pb-0` so the scrollable body
  clears the fixed tab bar on mobile (see [Safe-area insets](#safe-area-insets)).
- **Pages render content in natural document flow** and let `<main>` scroll under
  the chrome. A page must **never** pin itself to a bare `h-full` — on mobile,
  content taller than the viewport gets clipped instead of scrolling.
- **Fill-the-viewport views opt in with `md:h-full`** (not `h-full`). The Home
  dashboard is the canonical case: at `md:` and up it fills the frame and the
  widget grid scales `rowHeight` to fit; below `md:` it flows as a single-column
  stack that scrolls. Height-coupling utilities (`flex-1`, `min-h-0`) are likewise
  gated to `md:` so they only apply in the fill case.

### Page transitions on mobile

**Settled** — dev-mobile-surface session, 2026-06-14. **No slide animations — same rule as tablet.**

The M1 prohibition list (no page slide animations) extends to mobile. Tab-to-tab transitions use the same cross-fade (`--duration-normal`, `--ease-in-out`) as all other route changes. Reasoning: slide transitions add cognitive overhead on a shared family device and require careful direction logic (back vs. forward) that isn't worth the complexity at M1. Reconsider if user testing shows disorientation navigating between tabs.

---

## Reward — the "gold" semantic

**Settled** — M2 Design: Chores (2026-06-15); reassigned by ADR 051 (2026-07-22).

Gold belongs to **P-Bucks** — the currency that buys things. It renders as the
struck brass coin — the shared `Coin` / `CoinValue` components (`@family-os/ui`)
on the `--coin-*` tokens (light + dark) — kept well clear of error-red so a
reward never reads as an alarm. Anatomy, brass values and the four registers:
[Currency marks](modules/rewards/design.md#currency-marks).

**Rules:**

- **Gold is reserved for P-Bucks only.** Status never uses gold; **XP is a
  quiet star** — a `Star` glyph and the value in `--muted-foreground` (ADR 051).
  A score is a fact about you, not a thing you hold.
- **Currency and XP numerals are DM Sans** (`text-metric`), not Lora — the gold
  treatment carries the warmth, the type scale stays compliant.
- The **lifetime XP total** reads as a stone "score plate" (`ScorePlate`: star +
  numeral) — distinct in weight from the coin-marked money it sits beside.

## Status vs identity colour

**Settled** — M2 Design: Chores (2026-06-15).

When a surface shows **one person's own items**, the identity hue carries no
information (everything is that person) — so **colour encodes status**, not
identity: neutral default, **red only for overdue**, green for done. Flooding
such a surface with the owner's identity tint is both meaningless and a false
alarm (e.g. a terracotta owner makes every row read red-ish).

When a surface shows **multiple people**, the identity hue can carry meaning —
but the trigger is narrower than "multi-person" (ADR 064, 2026-08-11):
**identity hue appears where the person is the answer to the surface's
question.** The meals week plan keeps spines ("who's got Thursday" is the
module's whole sentence); the grocery list carries no identity chrome at all —
adder and shopper facts render as text notes. Where hue does appear (admin /
family / cross-member views), use it for per-person lanes, dots, and avatars
under ADR 043/044's rules.

> Corollary: **red is reserved for overdue/error**, never identity. The
> terracotta identity hue ≠ the error red.

The `<Spine>` primitive (see _Identity in widget slots_) is deliberately
**color-agnostic** so this rule lives at the call site, not the component: a
single-person surface passes a status color (`spineColor(task)`), a multi-person
one passes the assigned hue via `resolveHue` (ADR 044 — never re-derive from the
name).

### When a row must carry both — ADR 043 (settled 2026-07-12)

Some rows carry **both** signals: a chore on the admin board has an owner _and_ a
state. They are split by **channel**, never negotiated:

> **Identity takes the leading edge. Status takes the field.**
>
> - The **spine** carries the **identity hue, in every state**. It never encodes
>   status on a multi-person surface.
> - **Status** is carried by the row's **surface and content**: an overdue **wash**
>   on the row fill, the `Overdue` badge, red meta text, dim + strikethrough, the
>   completion check.

**Why the spine goes to identity, not status.** Status is already stated three
other ways on every row (badge, red date, strikethrough + dim + green check);
identity, without the spine, is stated nowhere the eye actually lands. And an
avatar cannot rescue it — a photo is a face, not a hue (ADR 042). The spine is the
only identity carrier a row has.

**The cost is real and deliberate.** Overdue loses the red bar. It is compensated
by the row **wash** — status moves from a 4px line to the whole surface, which is
_more_ prominent, not less, and stops competing with identity for the same pixels.
If overdue ever proves too quiet, **strengthen the wash; do not take the spine
back.**

> **Superseded.** This section previously read: _"The admin chores board sits on
> the seam — identity is carried by the lane header (tint gradient + 2px
> top-border), which frees the row `<Spine>` to encode status, falling back to the
> assignee hue at rest."_ That spine meant green, or red, **or** a person,
> depending on state — three meanings in one 4px element, so it taught nothing.
> The lane-header tint wash is gone with it: identity was the loudest thing on a
> page whose subject is the tasks. See ADR 043.

**Single-person surfaces are unchanged.** The chores **taskee** views still encode
status on the spine, and remain the reference case for the rule above.

## Page containers

**Settled** — Chores Overhaul, 2026-07-12. Component: `PageContainer`
(`@family-os/ui`).

A route surface states its **role**, not a width. Four roles:

| Role    | Width                         | Surfaces                                       |
| ------- | ----------------------------- | ---------------------------------------------- |
| `prose` | `--container-content` (680px) | Family feed — Lora body at 18px                |
| `list`  | `--container-list` (840px)    | Chores board · taskee · focus · Settings       |
| `wide`  | `--container-wide` (1400px)   | Calendar month / week — a canvas, not a column |
| `full`  | no max                        | Home dashboard · calendar mobile agenda        |

A **list is not prose.** 680px is a reading measure; a list row carries a spine, a
title, badges and controls, so it needs more room than a sentence does. Splitting
the two is the point of having roles rather than one shared width.

**Padding is not a prop.** Every role gets the same rhythm so the gutter never
jumps between routes. A surface that must break the gutter does it on a **child**,
not by renegotiating the page frame.

| Side   | Utility         | Phone | ≥ `md:` | Token                                            |
| ------ | --------------- | ----- | ------- | ------------------------------------------------ |
| Sides  | `px-4 md:px-6`  | 16    | 24      | `--page-frame-x` / `--page-frame-x-md`           |
| Top    | `pt-4 md:pt-6`  | 16    | 24      | `--page-frame-top` / `--page-frame-top-md`       |
| Bottom | `pb-6 md:pb-12` | 24    | 48      | `--page-frame-bottom` / `--page-frame-bottom-md` |

**The frame carries no allowance for a title** (ADR 074) — Home, the calendar's
tablet lens and the shopping hero render none into that slot. A title's air is
`PageHeader`'s. **The bottom is shorter on a phone** because the shell already
reserves the tab bar under it. **A surface sizing itself against the frame
subtracts the tokens**, never the sum: the hero's `calc(100svh - 4.5rem)` was
stale within a day of the frame moving.

### One breakpoint for the chrome

**Chrome and the page frame step at `md:` (768). Content may reflow at any
breakpoint.** 768 is where the shell swaps tab bar for sidebar, so it is the only
width at which the page's own geometry may change. `BREAKPOINT_MD`
(`@family-os/ui`) carries the number to the measurements JS makes itself, so
`WidgetGrid`'s stacking and the frame cannot drift. The frame used to step at
`sm:`, leaving a 128px band wearing the desktop gutter under mobile chrome.

**A reflow is a layout or visibility change** — a card stacking, a button's label
appearing — and may step wherever it reads best. **A spacing step that serves a
reflow steps with it**; one that serves nothing but roominess is chrome, and
steps at `md:`.

### The page header

**Settled** — spacing contract, 2026-09-04. Component: `PageHeader`
(`@family-os/ui`). See ADR 074.

| Relationship               | Utility        | px   |
| -------------------------- | -------------- | ---- |
| Header lead                | `pt-2 md:pt-4` | 8/16 |
| Title → nav strip          | `mt-4`         | 16   |
| Title (or strip) → content | `mb-6`         | 24   |

**Never hand-roll a page title.** Compose `PageHeader` inside `PageContainer`.
Six surfaces had six title→content gaps (12/16/20/24/28) for want of one place to
change it.

**The nav strip is the header's, not the caller's.** A `TabBar` switching the
panel below goes in the `nav` slot, so the header's `mb-6` is the strip's bottom
margin and no caller does the arithmetic. A strip reads **below** the page title
everywhere — the calendar's tablet lens stopped being the exception 2026-09-04.

**`text-page-title` is `PageHeader`'s type token**, and four surfaces use it as
one without being page headers: `FocusView`'s task title, `TonightView` compact,
`WalletChooser`'s prompt, `DemoPage`'s placeholder.

### The rhythm of a page's body

**Settled** — spacing contract, 2026-09-04. One value per relationship, and where
a primitive owns it, the caller does not write it.

| Relationship                        | Owner                | px  | Utility            |
| ----------------------------------- | -------------------- | --- | ------------------ |
| Section group → section group       | caller's stack       | 28  | `gap-7`            |
| Row → row inside a group            | caller's stack       | 12  | `gap-3`            |
| Section label → its content         | `SectionLabel`       | 8   | `mb-2`             |
| Group above → a section label       | `SectionLabel`       | 28  | `pt-7`             |
| The surface above → the first label | `SectionLabel`       | 16  | `pt-4` (`leading`) |
| Row inner padding                   | `ItemCard`/`ListRow` | 16  | `px-4`             |

`gap-7` and `gap-3` had 28/24/16/8 and 12/10/8 in use for the same two
relationships. The winners are the ones the codebase reached independently on
five surfaces — consistency should cost the fewest diffs.

**`SectionLabel` owns the space around a group label; it does not own the type
token.** Pass `leading` when something else already separates the label from what
precedes it — the first group in a stack, or a group inside a `gap-7` stack that
already holds the 28. Colour (`text-accent`, `text-primary`) and a trailing rule
stay the caller's: those are token choices, not rhythm. A caller that wants a
different _gap_ wants a different primitive — say so in the session log rather
than passing a number.

**`text-section-label` stays the type token.** A label is `SectionLabel`'s
business only when it opens a group of content in a page's flow. Where it does
not, the container already owns the space and the raw token is correct:
`WidgetHeader` and `PageHeader`'s eyebrow, `SettingsSection`'s panel head,
`Disclosure`'s trigger, `EmojiPicker`'s groups, `SpanBand` and `MonthGrid`'s
dense cells, the inline meta in `NextEventHero` / `TonightView` / `UpNextView` /
`GrabsTray` / `FocusView`, and `ActivitiesView`'s timeline months.

> **Why this exists.** Six surfaces had six recipes. Chores and the feed matched at
> 680px only by coincidence; the calendar hardcoded `max-w-[1100px]` next to a token
> that existed to prevent exactly that; the calendar's mobile agenda re-declared
> `px-4` on each of its three children; and **Settings had drifted onto Tailwind's
> stock `max-w-2xl` (672px — 8px off our token) _without_ `mx-auto`, so it silently
> hugged the left edge while every sibling route sat centred.** None of that was
> decided. Compose `PageContainer`; do not hand-roll `mx-auto max-w-… px-…`.

---

## To Be Defined

| Item                   | Deferred to        |
| ---------------------- | ------------------ |
| TV ambient layout      | M6+ design session |
| Pi room display layout | M6+ design session |
