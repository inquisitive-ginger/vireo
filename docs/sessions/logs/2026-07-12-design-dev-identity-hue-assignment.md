# Design + Dev: Identity Hue Assignment (2026-07-12)

> **ADR 044.** Flow: HTML artifact gate → direction chosen → built → live-reviewed → PR.

## What was built

- **A member's colour is assigned and persisted**, not hashed from their name.
  `Profile.identityHue`, `UNIQUE`, backfilled. `getIdentityHue` survives **only** as a
  fallback; **`resolveHue(name, assigned)`** is now the single way to ask "which hue is
  this person".
- **The palette grows to eight** — `moss` (117°) and `indigo` (268°) join the original
  six, which are **unchanged**. `IDENTITY_HUES` moved to `@family-os/schemas` (the only
  leaf both the API and the UI can import).
- **The tint layer was rebuilt.** It was broken before this session started.
- **The calendar chip carries its owner's initial** — the second channel.
- **`ColorPicker`** primitive; **Settings → Your colour** (self-serve, every tier) and the
  tier-4 profile drawer; **Onboarding** auto-assigns and shows the colour, tap to change.
- **`platform.profile.color`** — update-own for every tier, manage-all for tier 4.
- The hue **travels with the data**: `assigneeHue`, `author.identityHue`,
  `CalendarMember.identityHue`, `/auth/me`, `GET /profiles`.

Green: **ui 167 · platform 33 · api 254 · calendar 96 · chores 19 · shell 3**; typecheck +
lint clean across 10 packages; live-reviewed and signed off.

## Decisions made

**Palette B — eight, in the app's voice — plus a second channel.** Gated from a three-way
HTML artifact rendered in the real tokens with a **colour-blindness switch**.

The session stopped being about picking nice colours the moment uniqueness was priced in.
**Unique hues make `IDENTITY_HUES.length` a hard cap on household size**, so the palette
_had_ to grow — and growing it ran straight into a trilemma. Red (~335°–30°) belongs to
`--error`, leaving ~305° of arc, inside which you can have any **two** of: **eight
colours**, **each nameable as a different colour**, **all separable to the ~1 in 12 who are
red-green colour-blind**.

- **A — keep six:** passes every vision model; caps the family at six forever.
- **B — eight in the app's voice:** the six unchanged + moss/indigo; **two pairs collide**
  for a deuteranope.
- **C — eight, engineered:** the only option that passes **everything**.

**C won on the numbers and was rejected for exactly that reason.** It buys separability
with a **lightness ladder** — terracotta becomes a _dark brown_, plum a _pale lilac_. It
fixes colour-blindness by making the palette worse for **everyone**, including the
eleven-in-twelve who could already see it, and terracotta is the app's primary brand hue.

**B fails honestly, and the fix for its failure was never a better hue — it was to stop
asking colour to work alone.** Hence the third clause of ADR 044: **colour is the primary
identity channel, not the only one.** That amends the premise ADR 030 rests on.

## What the artifact was for (and what a solver could not do)

Before the artifact I ran a ΔE optimiser over the whole gamut. It returned a palette of
**five blues** — numerically excellent, humanly useless. **Distinguishable ≠ nameable.** A
family needs _"Zach is the teal one"_, which requires colours that are different **kinds**
of colour, not different measurements.

That killed optimisation as a _method_ and left it as a _check_. The final palette was
**curated** (the eight hue names fixed by hand, so they stay nameable) and the maths was
allowed to choose only lightness and chroma. The hard bar — **≥0.045 ΔEok at normal
vision, on both layers, in both themes** — is met at **0.046**.

## The bug that was already shipping

**The tint layer never worked**, and it had nothing to do with growing the palette.

`fillForHues` renders the month-grid chips at `identityToken(hue, 'tint')`, and that layer
flattened **every** hue to L≈0.92 / C≈0.04. On the app's flagship "colour does all the work
at a distance" surface, the closest pair sat **0.025 ΔEok apart at normal vision** and
**0.013 for a deuteranope** — _the same pill_. Adding two hues without touching it would
only have made a broken surface busier.

The tint now inherits the base's lightness order and carries real chroma: closest fill pair
**0.046**.

> **Judge a colour on the layer that renders it.** Hues get quoted at `base`; the month grid
> paints at `tint`. This has now bitten twice — ADR 041, and again here.

## Caught in review (worth recording)

**1 — The ADR 041 gotcha caught me, exactly as written.** The identity tokens live in
**three** theme blocks, and the `[data-theme='dark']` block is indented **4 spaces** where
the `prefers-color-scheme` block uses **6**. My `replace_all` matched only two of the three,
leaving the explicit dark toggle serving the **old six hues and the old broken tints** —
while OS-preference dark looked perfect. A per-hue × per-layer × per-block count caught it.
_The check is cheap; write it every time._

**2 — The user found nine surfaces still hashing.** I added a `hue` prop to the primitives
and **never wired the call sites** (`MemberChip`'s dots were the visible symptom). The
dangerous ones were the **avatars**: `ProfileAvatar` falls back to `getIdentityHue(name)`
whenever `identity` is omitted, so on a chores row the **spine** painted Teddy's assigned
_moss_ while the **avatar tint two millimetres away** painted his hashed _terracotta_. **One
person, one row, two colours — worse than the bug we set out to fix.**

**3 — The grep sweep passed while the bug was still on screen.** Settings' "Your photo"
avatar kept hashing because `YourPhotoSection` **rebuilt the profile as an object literal**
(`{ id, name, tier, avatarUrl }`) and silently **dropped `identityHue`**. The
`<ProfileAvatar>` _did_ have `identity=` — so the sweep was satisfied. **A lossy object
literal is invisible to a grep for a missing prop.**

**4 — And that surface exposed a real gap.** `YourPhotoSection`'s own comment says it exists
because _"the Profiles section is tier-4 only, so without this a kid would have the
permission to change their own photo and nowhere to do it."_ **I had just recreated that gap
for colour**: `platform.profile.color` is update-own for every tier, and the only picker was
inside the **tier-4** drawer. Now `YourAppearanceSection` — **Your photo** and **Your
colour**, side by side, self-serve. **A capability with no surface is not a capability.**

## Backfill: nobody's colour moves unless it has to

The migration reproduces the **old six-hue** hash (that is the colour each member is
_currently wearing_), honours it where free, and moves only the loser of a collision — who
lands on **`moss`/`indigo` first**, since nobody can already be wearing those, so a
displacement can never cascade into stealing someone else's colour. Verified against the
real family (all four kept their colours) and against a seeded `Zach`/`Emma` collision
(Emma displaced to moss). The SQL hash was checked against the JS one including a
non-ASCII name (`Zoë`).

## Open questions raised

- **The name hash is now palette-length-dependent.** Growing six → eight moved every
  bucket. Assigned profiles are unaffected, but **no test may pin an expectation to
  `getIdentityHue(name)`** — two did, and both broke.
- **The fills are noticeably more colourful.** Taken deliberately (0.025 → 0.046). If it
  ever proves too loud, **pull chroma back in the `-tint` tokens — do not flatten the
  lightness ladder**, or the surface goes back to being unreadable.
- **`family-feed` has a `test` script and zero test files** — it is silently "passing",
  exactly as chores was before last session.

## What the next session needs to know

- **`resolveHue(name, assigned)` — always.** Never `identityColor(name)` when the profile
  is in hand. Two guards worth keeping: no `<ProfileAvatar>` without `identity=`, and no
  `identityColor(` in a component. Neither catches a **lossy object literal** (see #3).
- **A hue is unique, so the palette caps the household at eight.** `nextFreeHue` returns
  `null` when full and the caller must _say so_ — never double a colour.
- **Any surface where a hue is the sole discriminator owes a second channel** (ADR 044).
- **Identity tokens live in three theme blocks.** Grep all three.
