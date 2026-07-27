# Design System

> Last updated: 2026-07-24 — **ADR 054: the currency is named Pritchett Bucks.** The coin now bears a struck **P-mark** (0.66 of the face, stroke 2.5) in place of ADR 051's placeholder `Coins` glyph, and the name has **four registers** — the mark · `P$` · `P-Bucks` · `Pritchett Bucks` — one per medium, chosen by naming an export in `packages/ui/src/lib/currency.ts`. See [Currency marks](#currency-marks). Prior: 2026-07-22 — **ADR 051: the coin belongs to the currency that buys things.** P-Bucks takes gold, the disc and the coin glyph; **XP demotes to a quiet star**. The coin's gold moves off `--identity-marigold`, and what separates it from a member's hue is **form** — one struck disc, never a disc inside a ring (a washer) and never notched (a gear). See [Currency marks](#currency-marks). Prior: 2026-07-12 — **ADR 044: a colour is assigned, not derived; and it is not the only channel.** The member palette grows to **eight** (`moss`, `indigo`); a member's hue is **persisted and unique** (`resolveHue`, never `identityColor(name)`), so palette size is now a **cap on household size**. The **tint layer is rebuilt** — it flattened every hue to off-white on the one surface (the month grid) where colour does all the work. Eight nameable hues cannot survive red-green colour-blindness, so **any surface where a hue is the sole discriminator owes a second channel** — the calendar chip carries its owner's initial.

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
- [Currency marks](#currency-marks)
- [Rewards surfaces](#rewards-surfaces)
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
| **No AI aesthetic**                   | Family OS should have its own visual character — avoid the generic Inter/Geist/hyper-minimal look     |
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

**This does not soften the wall tablet.** If anything it sharpens it: the family-profile surface is now the _named_ place the 18px floor applies, rather than one instance of a vaguer rule (see [Tablet — Primary Hub](#tablet--primary-hub)). A widget that renders on both surfaces should scale its type with its prominence — which is what [Widget prominence](#widget-prominence) already gives it.

All tokens are defined as CSS utilities in `packages/ui/src/styles.css` and are available as Tailwind classes throughout the codebase. Use the utility name — never raw pixel values.

| Token           | Utility class        | px  | Weight | Line-height | Tracking | Font                       |
| --------------- | -------------------- | --- | ------ | ----------- | -------- | -------------------------- |
| `xs`            | `text-xs-token`      | 10  | 600    | 1.4         | 0        | DM Sans                    |
| `xs-body`       | `text-xs-body`       | 11  | 400    | 1.4         | 0        | DM Sans                    |
| `section-label` | `text-section-label` | 11  | 700    | 1.4         | 0.1em    | DM Sans · always uppercase |
| `sm`            | `text-sm-token`      | 13  | 400    | 1.5         | 0        | DM Sans                    |
| `base`          | `text-base-token`    | 14  | 400    | 1.5         | 0        | DM Sans                    |
| `prose-sm`      | `text-prose-sm`      | 15  | 400    | 1.5         | 0        | **Lora**                   |
| `card-title`    | `text-card-title`    | 16  | 600    | 1.3         | 0        | DM Sans                    |
| `body`          | `text-body`          | 18  | 400    | 1.6         | 0        | DM Sans                    |
| `prose`         | `text-prose`         | 18  | 400    | 1.65        | 0        | **Lora**                   |
| `heading`       | `text-heading`       | 20  | 600    | 1.2         | −0.01em  | DM Sans                    |
| `page-title`    | `text-page-title`    | 26  | 600    | 1.2         | −0.02em  | **Lora**                   |
| `display-lg`    | `text-display-lg`    | 29  | 600    | 1.2         | −0.01em  | **Lora**                   |
| `metric`        | `text-metric`        | 32  | 700    | 1.0         | −0.01em  | DM Sans                    |
| `display-xl`    | `text-display-xl`    | 36  | 400    | 1.15        | −0.01em  | **Lora**                   |

**Usage notes:**

- `xs-body` — smallest regular-weight text: placeholder/error-card descriptions, tier pills, meta captions (added 2026-07-10 audit — the settled placeholder/error anatomies specified 11px/400 with no token to express it)
- `section-label` — `--muted-foreground` by default; `--accent` when naming a module surface (widget identity headers, feed day markers); uppercase is baked into the utility
- `prose` — user-authored content only (feed posts, notes, messages). The family's own words get the warmth of the display face; text _about_ the UI never does. Same 18px viewing-distance floor as `body`
- `prose-sm` — the family voice at 15px for **dense** contexts (multi-post feed widget rows) where 18px crowds. Same Lora face; use `prose` on roomy surfaces (feed page, across-room banner). Not for UI chrome
- `page-title` — one per route; renders in Lora
- `display-lg` — empty state headings, error page headings
- `display-xl` — greeting text ("Good morning, Zach"), hero moments
- `metric` — widget key numbers and counts (XP, task count, etc.)

---

## Color & Tokens

**Settled** — Visual Language design session, 2026-06-02.

**Palette: Terracotta & Teal.** A warm burnt-orange primary paired
with a muted sage-teal accent — earthy warmth balanced by a calm
complement. Deliberately two distinct hues rather than a single-hue
scale.

Theming is cascade-based via CSS custom properties defined in
`packages/ui/src/styles.css`. No JavaScript overhead. Plugins consume
semantic tokens only — never raw oklch values.

### Core tokens — light mode

| Token                    | Value                   | Role                                                                   |
| ------------------------ | ----------------------- | ---------------------------------------------------------------------- |
| `--background`           | `oklch(0.985 0.008 75)` | Page background — warm off-white                                       |
| `--foreground`           | `oklch(0.18 0.04 50)`   | Primary text                                                           |
| `--primary`              | `oklch(0.57 0.14 35)`   | Terracotta — main actions, active states                               |
| `--primary-foreground`   | `oklch(0.99 0 0)`       | Text on primary                                                        |
| `--secondary`            | `oklch(0.93 0.022 72)`  | Inset / structural surfaces — sidebar, grouped rows, settings sections |
| `--secondary-foreground` | `oklch(0.28 0.05 50)`   | Text on secondary                                                      |
| `--muted`                | `oklch(0.93 0.016 72)`  | Subtle backgrounds                                                     |
| `--muted-foreground`     | `oklch(0.52 0.04 58)`   | Subdued labels, timestamps                                             |
| `--accent`               | `oklch(0.47 0.07 185)`  | Muted sage-teal — module identity only (see Accent scope below)        |
| `--accent-foreground`    | `oklch(0.99 0 0)`       | Text on accent                                                         |
| `--border` / `--input`   | `oklch(0.88 0.022 75)`  | Borders and input outlines                                             |
| `--ring`                 | `oklch(0.57 0.14 35)`   | Focus ring (matches primary)                                           |

### Surface elevation

**Settled** — Family Feed visual language session, 2026-06-11.

The original token set had no depth layer — `--secondary` (oklch 0.93) on
`--background` (oklch 0.985) read as nearly flat, which made every surface
look like the same beige. Elevation now carries surface hierarchy:

| Token               | Light                   | Dark                    | Role                                       |
| ------------------- | ----------------------- | ----------------------- | ------------------------------------------ |
| `--surface-sunken`  | `oklch(0.955 0.006 75)` | `oklch(0.175 0.008 47)` | A recess cut _into_ a card (ADR 040)       |
| `--shadow-inset`    | warm inner shadow       | deep inner shadow       | The depth cue that makes the tint a groove |
| `--card`            | `oklch(0.999 0.004 80)` | `oklch(0.21 0.022 47)`  | Content cards — lifts _above_ background   |
| `--card-foreground` | `var(--foreground)`     | `var(--foreground)`     | Text on cards                              |
| `--shadow-card`     | warm-tinted, subtle     | deep black, subtle      | Resting cards, widget slots                |
| `--shadow-raised`   | warm-tinted, pronounced | deep black, pronounced  | Compose forms, overlays, pickers           |

Rules:

- Light-mode shadows are **warm-tinted** (`oklch(0.35 0.06 50 / …)`), never
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

The window decides where a span is stated. A one-week view can pin them all
("All week"). A scrolling agenda cannot — a camp three weeks out is not "all
week" — so it pins only what is **already running** ("Ongoing") and states the
rest **inline, once, on the day they begin**.

### Member identity palette

**Settled** — see ADR 030, amended by **ADR 044**. Helpers: **`resolveHue`**,
`identityToken`, `nextFreeHue`, `isIdentityHue` from `@family-os/ui`. The palette
list itself lives in `@family-os/schemas` — the API allocates hues and the UI paints
them, and that is the only leaf package both can import.

**Eight** fixed hues harmonized with Terracotta & Teal. Every family member maps to
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
cascade-based. The dark background is a **warm clay** (`oklch(0.15 0.022 45)`)
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

| Token                  | Light                   | Dark                   |
| ---------------------- | ----------------------- | ---------------------- |
| `--background`         | `oklch(0.985 0.008 75)` | `oklch(0.15 0.022 45)` |
| `--foreground`         | `oklch(0.18 0.04 50)`   | `oklch(0.92 0.012 75)` |
| `--primary`            | `oklch(0.57 0.14 35)`   | `oklch(0.66 0.14 35)`  |
| `--accent`             | `oklch(0.47 0.07 185)`  | `oklch(0.56 0.08 185)` |
| `--secondary`          | `oklch(0.93 0.022 72)`  | `oklch(0.22 0.020 48)` |
| `--muted`              | `oklch(0.93 0.016 72)`  | `oklch(0.20 0.016 48)` |
| `--muted-foreground`   | `oklch(0.52 0.04 58)`   | `oklch(0.56 0.022 60)` |
| `--border` / `--input` | `oklch(0.88 0.022 75)`  | `oklch(0.30 0.022 48)` |
| `--error`              | `oklch(0.50 0.17 12)`   | `oklch(0.62 0.17 12)`  |

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

### Semantic dimension tokens

Defined in `packages/ui/src/styles.css` (`@theme`).

| Token                 | Value | Utility                     | Role                                            |
| --------------------- | ----- | --------------------------- | ----------------------------------------------- |
| `--spacing-touch`     | 48px  | `min-h-touch`/`min-w-touch` | Minimum touch target                            |
| `--spacing-row-touch` | 64px  | `min-h-row-touch`           | Minimum interactive card/list-item height       |
| `--spacing-tab-bar`   | 56px  | `h-tab-bar`, safe-area calc | Mobile bottom tab bar + anything anchored to it |
| `--spacing-top-bar`   | 52px  | `min-h-top-bar`             | Mobile brand top bar                            |
| `--spacing-sidebar`   | 220px | `w-sidebar`                 | Tablet sidebar (ADR 022)                        |
| `--spacing-meter`     | 6px   | `h-meter`                   | Progress-meter bar height                       |
| `--container-content` | 680px | `max-w-content`             | Single-column content pages                     |
| `--container-drawer`  | 440px | `md:w-drawer`               | Side-drawer width                               |

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

**Tablet is the only M0 surface.** All others are deferred.

### Tablet — Primary Hub

The family's central display. Always-on, landscape, touch-first.
Target: 10–13" touchscreen, 1280×800 minimum.

**Shell layout:** Left sidebar (220px) + main content area (flex-1).
No top header bar — the profile chip lives at the top of the sidebar.
See [Tablet Nav Layout](#tablet-nav-layout) and [Widget Composition System](#widget-composition-system).

**Home screen:** A named placeholder in M0. It explicitly does not
define the final composition surface — that is the widget system,
designed in M1. See ADR 011.

**Touch targets:** All interactive elements minimum 48px. Cards and
list items minimum 64px tall.

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
- **Failed attempt:** Wrong-PIN message shown inline. Rate-limiting deferred to M1.

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

| State                   | Classes                                       | Notes                                                                 |
| ----------------------- | --------------------------------------------- | --------------------------------------------------------------------- |
| Active nav item         | `bg-primary/10 text-primary font-medium`      | "You are here" — soft terracotta tint on the bare `--background` rail |
| Nav hover               | `hover:bg-secondary/70 hover:text-foreground` | The retired sidebar surface, reused as the hover wash                 |
| Profile chip rest       | `bg-card border shadow-[var(--shadow-card)]`  | Elevated header chip (ADR 039 ladder), not a nav item                 |
| Profile chip hover/open | `shadow-[var(--shadow-raised)]`               | Lifts on hover and while the switch menu is open                      |

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

### View switches — `SegmentedControl`

**Settled** — same session, 2026-06-23.

A compact single-select switch (Month/Week/Day on the calendar, and future
two-/three-way toggles): **`<SegmentedControl>` (`@family-os/ui`)**. A bordered
track where the active segment fills with `--primary`; under the hood a `radiogroup`
with roving `tabindex` + arrow-key navigation, so it reads as **one** control, not N
buttons. Generic over a string-union value (`options`/`value`/`onChange` +
`aria-label`). Use it instead of hand-rolling a button group; the calendar's
hand-rolled Month/Week/Day switch was its first adopter.

### Widget prominence — the elevation ladder

**Settled** — home-dashboard hierarchy exploration, 2026-07-10
(`logs/2026-07-10-design-home-dashboard-hierarchy.md`).

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

Per-user layout stored in the platform DB as `{ widgetId, x, y, w, h }[]`.
Exact schema deferred to the M1 implementation session.

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

Three tier-appropriate default layouts are seeded from platform config. All slot
dimensions reference the 1280×800 viewport; widget components use CSS container
queries to adapt to their actual rendered size.

**Family pseudo-profile** (unattended tablet — shared family display):

```
┌─────────────────────────────────────────────┐
│           Family Feed        [banner 4×1]   │
├──────────────────────┬──────────────────────┤
│  Chores  [standard]  │  Calendar [standard] │
└──────────────────────┴──────────────────────┘
```

| `widgetId`             | x   | y   | w   | h   |
| ---------------------- | --- | --- | --- | --- |
| `family-feed.feed`     | 0   | 0   | 4   | 1   |
| `chores.today-summary` | 0   | 1   | 2   | 1   |
| `calendar.today`       | 2   | 1   | 2   | 1   |

**Tiers 1–2** (child profiles — chores-first):

```
┌──────────────────┬───────────────────────────┐
│                  │  Family Feed  [standard]  │
│  Chores  [large] ├───────────────────────────┤
│                  │  Calendar     [standard]  │
└──────────────────┴───────────────────────────┘
```

| `widgetId`             | x   | y   | w   | h   |
| ---------------------- | --- | --- | --- | --- |
| `chores.today-summary` | 0   | 0   | 2   | 2   |
| `family-feed.feed`     | 2   | 0   | 2   | 1   |
| `calendar.today`       | 2   | 1   | 2   | 1   |

**Tiers 3–4** (parent/teen profiles — calendar-first):

```
┌──────────────────┬───────────────────────────┐
│                  │  Family Feed  [standard]  │
│ Calendar [large] ├───────────────────────────┤
│                  │  Chores       [standard]  │
└──────────────────┴───────────────────────────┘
```

| `widgetId`             | x   | y   | w   | h   |
| ---------------------- | --- | --- | --- | --- |
| `calendar.today`       | 0   | 0   | 2   | 2   |
| `family-feed.feed`     | 2   | 0   | 2   | 1   |
| `chores.today-summary` | 2   | 1   | 2   | 1   |

These are initial defaults, expected to be tuned once real content is rendering and
interaction patterns are established post-M1 build-out.

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
- No install CTA (marketplace pathway is M8)
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

**Settled** — design-mobile-surface session, 2026-06-14. See ADR 033.

### Breakpoint

`md:` (768px) is the canonical tablet/mobile split. Below this threshold the sidebar is hidden and the bottom tab bar appears. This is a settled shell convention — all responsive work keys off this breakpoint.

### Nav pattern — bottom tab bar

4 module tabs (Home, Feed, Chores, Calendar) + profile avatar as the rightmost (5th) tab. Always visible, thumb-friendly, 1 tap to any primary destination.

```
┌─────────────────────────────────────┐
│         [page content]              │
│                                     │
├──────┬──────┬──────┬──────┬────────┤
│ Home │ Feed │Chores│ Cal  │ Avatar │
└──────┴──────┴──────┴──────┴────────┘
```

- **Tab height:** 56px minimum touch target
- **Active tab:** icon + label in `--primary`
- **Inactive tab:** icon + label in `--muted-foreground`
- **Tier filtering:** all M1 core tabs have `minTier: 1` — every profile sees the same 4 tabs. Future tier-gated modules are filtered at the tab level using the same `minTier` convention as the sidebar.
- **Overflow:** deferred to M8+ (marketplace). When installed modules exceed 4 a "More" tab and tab-pinning UI will be required — separate design session.

### Profile chip on mobile

The profile avatar is the rightmost tab. Tapping it opens the `ProfileGrid` overlay, anchored above the tab bar. No top header bar on mobile — the `MobileTopBar` carries the page title and bell instead.

### Notification bell on mobile

**Settled** — dev-mobile-surface session, 2026-06-14. **Option A: bell in the mobile top bar.**

A minimal top bar (`min-h-[48px]`) renders on mobile only (`flex md:hidden`) with the current page title on the left and the `NotificationBell` on the right. The bell badge (unread count + severity) stays in peripheral vision on every page — same tier-2+ gate as the sidebar bell. The top bar disappears on tablet; the sidebar bell takes over.

Why Option A over Option B (bell in profile sheet): the badge is the primary value of the notification bell — it delivers ambient awareness. Hiding it behind 2 taps defeats that.

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

## Reward / XP — the "gold" semantic

**Settled** — M2 Design: Chores (2026-06-15).

XP (and reward/treasure cues generally) use a dedicated **gold** treatment built
on the marigold/`--warning` hue family (≈ hue 78), kept well clear of error-red
(hue 12) so a reward never reads as an alarm.

| Layer     | Value (light)          | Use                              |
| --------- | ---------------------- | -------------------------------- |
| gold      | `oklch(0.74 0.13 80)`  | coin gradient mid, chip borders  |
| gold-hi   | `oklch(0.88 0.09 86)`  | coin highlight (top-left)        |
| gold-deep | `oklch(0.55 0.12 66)`  | gold numerals / deep edge        |
| gold-tint | `oklch(0.95 0.045 86)` | soft gold chip / pill background |
| gold-ink  | `oklch(0.45 0.1 70)`   | gold text on tint                |

> Currently inline constants in the chores surfaces; promote to `--reward-*`
> tokens (light + dark) when a second module needs them.

**Rules:**

- **Gold is reserved for XP/reward only.** Status never uses gold; XP never uses
  red/green.
- **XP numerals are DM Sans** (`text-metric`), not Lora — the gold treatment
  carries the warmth, the type scale stays compliant.
- The **lifetime total** reads as a minted "score plate" (coin + numeral +
  `XP / TOTAL`); **daily earned** is a lighter momentum stat (TrendingUp icon,
  gold-ink text) — distinct in weight/icon so the two don't read at one level.

## Status vs identity colour

**Settled** — M2 Design: Chores (2026-06-15).

When a surface shows **one person's own items**, the identity hue carries no
information (everything is that person) — so **colour encodes status**, not
identity: neutral default, **red only for overdue**, green for done. Flooding
such a surface with the owner's identity tint is both meaningless and a false
alarm (e.g. a terracotta owner makes every row read red-ish).

When a surface shows **multiple people** (admin / family / cross-member views),
the identity hue **does** carry meaning — use it for per-person lanes, dots, and
avatars.

> Corollary: **red is reserved for overdue/error**, never identity. The
> terracotta identity hue ≠ the error red.

The `<Spine>` primitive (see _Identity in widget slots_) is deliberately
**color-agnostic** so this rule lives at the call site, not the component: a
single-person surface passes a status color (`spineColor(task)`), a multi-person
one passes `identityColor(name)`.

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
| `wide`  | `--container-wide` (1100px)   | Calendar month / week — a canvas, not a column |
| `full`  | no max                        | Home dashboard · calendar mobile agenda        |

A **list is not prose.** 680px is a reading measure; a list row carries a spine, a
title, badges and controls, so it needs more room than a sentence does. Splitting
the two is the point of having roles rather than one shared width.

**Padding is not a prop.** Every role gets the same rhythm (`px-4 sm:px-6 pt-6
pb-12`) so the gutter never jumps between routes. A surface that must break the
gutter does it on a **child**, not by renegotiating the page frame.

> **Why this exists.** Six surfaces had six recipes. Chores and the feed matched at
> 680px only by coincidence; the calendar hardcoded `max-w-[1100px]` next to a token
> that existed to prevent exactly that; the calendar's mobile agenda re-declared
> `px-4` on each of its three children; and **Settings had drifted onto Tailwind's
> stock `max-w-2xl` (672px — 8px off our token) _without_ `mx-auto`, so it silently
> hugged the left edge while every sibling route sat centred.** None of that was
> decided. Compose `PageContainer`; do not hand-roll `mx-auto max-w-… px-…`.

## Currency marks

**Settled** — ADR 051 (2026-07-22) and ADR 054 (2026-07-24).

Two currencies appear on the same row (a paying chore shows both), so they are told
apart by **metaphor**, not by shade.

| Currency            | Mark                                                   | Meaning                     |
| ------------------- | ------------------------------------------------------ | --------------------------- |
| **Pritchett Bucks** | A struck **brass coin** bearing the P-mark + the value | Money. Goes up and down.    |
| **XP**              | A **quiet star** + the value, in `--muted-foreground`  | A score. Only ever goes up. |

### The four registers

Each exists because a medium ruled the others out. Pick one by **naming it** — the
exports in `packages/ui/src/lib/currency.ts` — never by typing two characters.

| Register              | Where                                                                 |
| --------------------- | --------------------------------------------------------------------- |
| The struck mark       | the coin face — anywhere a value renders with its coin                |
| **`P$`**              | compact text beside a number: chips, buttons, prose, the ledger       |
| **`P-Bucks`**         | any sentence a person reads or **hears** — push, toasts, `aria-label` |
| **`Pritchett Bucks`** | the wallet hero, settings, first use — where the name is taught once  |

**A coin beside a value means the text is the amount alone** — `[◉] 10`, never
`[◉] 10 P$`. The coin states the unit, and the chore row is the tightest surface in the
app. **A value inside a sentence is the exception**: a sentence has to name what it
counts, so the held chip reads `[◉] 10 P$ when Mom or Dad checks` and the declined chip
reads `No P$ this time`. The coin is decorative either way, so every such chip pairs an
`aria-hidden` rendering with an `sr-only` one spelling `P-Bucks`.

**XP kept its pill shape and gave up its metal.** It held gold, the disc and the coin
glyph from M2 — assigned when nothing was spendable and the conflict could not appear.
A score is a fact about you; money is a thing you hold.

### Coin anatomy

The coin's gold is **brass, not marigold**: `hi oklch(0.95 0.09 96)` ·
`base oklch(0.79 0.155 90)` · `deep oklch(0.55 0.125 74)` · `tint oklch(0.96 0.05 95)` ·
`ink oklch(0.44 0.105 78)`. The old XP gold sat at hue 80 against
`--identity-marigold`'s 78 — the same colour saying two different things.

**It is ONE disc**, built from a single element:

- a radial face (light at 34%/28%, deepening to the edge),
- an outer **rim** — a conic metallic sweep masked to the outer ~9% of the same circle,
- a **specular gloss** crossing the face,
- a **raised relief** ring just inside the rim,
- the **P-mark** struck at **66%** of the diameter, stroke **2.5**.

Two things it is **not**, both tried and rejected on sight: a smaller disc nested inside
a ring (the pale step between them reads as a **washer**), and radial notches (milling
reads as a **gear** — machinery, not money). Relief holds down to 18px, so the row mark
and the 64px celebration coin are the same object at different sizes.

**The mark's weight is set by where its counters close.** The bowl's arms run y=4→12 and
the bar crosses at y=8, so each counter is **(4 − stroke)** units tall. At a 0.66 share on
a **16px coin every weight closes** — the mark is a **silhouette, not a letter**, which is
what a struck coin looks like from across a kitchen. Weight is therefore decided at 26px
and up, where **2.5 is the heaviest that still holds an open counter at 44px**. The mark
also needs **no centring transform**: its bowl arc is a semicircle bulging right to x=18,
so extents are 5→19 and the centre is exactly 12.

**The separation from a member's identity hue is form, not colour** (ADR 044's second
channel). A spine is a flat 4px bar; it can never be struck metal. That is what allows
brass to sit two millimetres from a marigold-spined row without the colour meaning two
things at once.

**Rendered hierarchy check.** XP is always the larger number (1,240 vs 24) and gold puts
the smaller one on top. That is the true reading — the small number is the one that can
be spent — and any future currency treatment has to preserve it.

---

## Rewards surfaces

The kid surfaces are the **ticket system** (ADR 055, gated 2026-07-26 on the rework
artifact): a redemption is a ticket — buy → own → explicit use. The wallet widget and
punch card remain build targets from the 2026-07-22 session, revisable without an ADR.

### The ticket

One anatomy renders the store, the pocket, and the loading skeleton (`TicketFrame`): a
**perforated stub** (2px dashed brass) beside the body — emoji, name, **description**.
The stub carries the **cost** in the store (coin + numeral) and the **emoji** once
owned: it's paid for; the price is history.

- **The notches are die-cut, not drawn** — a mask punches real holes through the card
  (border, wash and all) and the shadow is a `drop-shadow` recomputed off the cut
  silhouette, so nothing can extend past an edge at any width.
- **Affordable = a brass-warmed border, no wash.** The two-shelf split already carries
  affordability (only reachable tickets sit under "Get it now"), so a fill would restate
  it; the money-warmth lives in the border, the coin, and the stub numeral. Never the
  green success edge — affordability is a fact of the wallet, not a status of the
  reward.
- **Ask-first = a quiet corner seal** (`AskSeal` + "ask to use") — informational, never
  a gate. The seal means "you'll ask when you **use** it"; buying is always allowed.
- Out-of-reach rewards stay calm rows in full colour with quiet `N more P$` text —
  **distance, not denial** — under "Almost there", two-up at `md:`. **No meter and no
  pill on the shelf**: a balance-fed bar drops on every spend, taxing every goal at
  once, and a distance is not a collectible (the chip rule). The meter survives where
  it answers a one-time "how close?" — the nudge modal and the wallet widget's
  next-up line.

**At width, a store ticket is a unit off THE ROLL** (gated 2026-07-26 addendum): the
live ticket keeps a fixed 430px — the tap target never stretches — and the rest of the
row is the same ticket echoing at the perforation, dimmed in two steps, bleeding off
the cut edge (no right border). Echoes are decoration (`aria-hidden`, no pointer); the
phone shows none and is unchanged. Pocket tickets are already off the roll, so they
stay single and cap at 560px; the purse caps at the roll's 430px — a purse is
hand-sized, not a banner.

The store endpoint returns the **whole catalog plus the balance** — never a pre-filtered
affordable list. Affordability is a rendering decision, not a server one.

### Two kid tabs — Store · My stuff

**Store spends, My stuff owns and remembers, the history sheet explains** (sheet lands
M4/5c). The tabs are the shared **`TabBar`** — a top-level split between peer surfaces,
per the TabBar/SegmentedControl rule — with a `badge` option carrying the pocket's
ready count (the parent page's Approvals tab rides the same badge). The purse is the
store's hero — whose money, the struck coin, the metric numeral. "My stuff" holds the
pocket (ready tickets → "Use it" / "Ask to use"; an asked ticket quiets down under a
waiting pill) and the **stub shelf** — torn-stub chips with counts, the trophy row
moved out of the shop. Punch cards (M4/6) land in My stuff too — that's why it isn't
"My tickets".

### The moments

The buy confirm keeps the **before → after arithmetic** (`35 → 20 P$ left`) and says
where the ticket goes ("It goes in your pocket"). The ask happens at **use time** and
talks about timing, never money. **The tear is the module's one flourish** — the ticket
splits at the perforation (480ms settle, skipped under reduced motion) and the stub
joins the shelf. A parent's **"not now" is deliberately soft**: the ticket returns
whole, the optional note is quoted verbatim, nothing needs an error state.

### Wallet widget — adaptive, never a dead end

`compact` leads with the balance and follows it with **one line that changes with
state**: _"3 rewards you can get"_ when something is affordable, otherwise _"3 more for
🍿 Pick the movie"_ with a meter. A bare balance is a score plate, not a wallet, and an
always-on next-goal line tells a kid who can afford three things that they are short of a
fourth. **The zero state decides this widget** — it is where a kid spends most of their
time. (M4/5c adds the top-priority ticket-ready line: the thing you already have beats
the thing you could buy.)

`standard` moves the balance into the header's trailing slot and makes **what you can
have** the body.

### Punch card — the paper sheet

A row of squares with the payout as a **finish line** at the end. The next square is the
tap target (dashed outline); **the kid punches their own card** (ADR 049). A meter with a
count was rejected: a meter is a progress bar for an adult, and the fridge sheet works
because each square is a thing you did, countable by eye.

---

## To Be Defined

| Item                   | Deferred to        |
| ---------------------- | ------------------ |
| TV ambient layout      | M4+ design session |
| Pi room display layout | M4+ design session |
