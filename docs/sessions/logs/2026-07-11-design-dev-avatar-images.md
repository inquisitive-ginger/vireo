# 2026-07-11 — Design + Dev: Avatar Images (PR #38)

**Type:** design + development (ad-hoc)
**Outcome:** merged — `ac9a88d`
**Produces:** ADR 042, `platform.profile_images`, `AvatarEditor`, the identity key

---

## What was decided

### ADR 042 — a photo is a face, not an identity token

Profiles get uploadable photographs. The hue **remains** the identity carrier
(ADR 030 upheld). A photo **fills the circle**; the avatar wears no hue ring. The
identity colour is carried by the chrome **beside** the avatar — the `ItemCard`
spine, an identity wash, a hue pill — so a photograph and the identity system never
compete for the same pixels.

The corollary is binding on every future surface:

> **An avatar is not a colour signal. Any surface showing more than one person at
> once must carry a hue element of its own. Never delete a row's spine because it
> has an avatar.**

### Storage — bytes in Postgres, behind an immutable URL

`platform.profile_images` (`bytea` + mime + content hash), served at
`/api/profiles/:id/avatar?v={hash}` with `Cache-Control: immutable`. ADR 009 bought
"backup and restore is a single operation"; a disk volume splits that in two, and a
`docker compose down -v` silently deletes every face in the house. At ≤8 profiles ×
~40KB the usual blobs-in-a-database objection doesn't apply. `Profile.avatarUrl`
(present since the initial migration) is unchanged.

### Permissions — self-serve

New `profile.avatar` CASL subject: **update-own for every tier, manage-all for tier 4.** Choosing your own face is not administration (`PUT /preferences/dark-mode`
already establishes the self-acting-on-`request.profile.id` pattern). A parent
revokes it per-profile through the existing override system. The household photo is
tier-4 only — the family pseudo-profile is itself tier 1, so without an explicit
carve-out the "own profile" branch would have let a family session set it.

---

## The mistake, and why it's the most useful thing here

**The band was built, approved, and wrong.**

The first pass reasoned: a photo covers the tint fill that carried the hue, so give
the avatar a **hue band** at its edge. That reasoning survived a rendered four-way
Storybook exploration and an explicit user gate. It shipped into the working tree.

It was wrong, and it only became visible **on a real screen with a real photo**: on
a feed post card, the `ItemCard` **spine already paints that exact hue two
millimetres to the left of the avatar.** The band was saying the same thing twice,
louder. The user caught it in live review — _"the band is too heavy and in places
where the avatar is next to an identity spine, redundant."_

An audit of every `ProfileAvatar` call site then showed the band was:

- **redundant** on the two surfaces that already had a hue carrier (feed post card,
  activities roster), and
- **load-bearing** on four that had none (up-next day rows, multi-day span rows,
  profile switcher, Settings member list).

Which is not an argument for the band. It is an argument that **those four surfaces
were under-built** and the band was papering over it. Fix the surfaces and the band
has no job. Photo-only is then both the simpler system and the more correct one:
one hue per row, in one place, on the chrome — never on the face.

**Why the exploration didn't catch it.** The playground rendered the avatar
treatments _in isolation and against each other_, never **inside the real
components that already carry a spine**. It answered "which band looks best?" when
the question was "does this row already say this?" A design exploration that only
compares its own options can't see redundancy with what already exists.

---

## The bug the audit surfaced

The up-next density session (ADR 040) **deliberately deleted** the `<Spine>` from
the widget's day rows. The premise was recorded in `EventOwners.tsx`:

> _"Owners are avatars, not names… the avatar already IS the identity hue a spine
> would paint, plus the initial that disambiguates it."_

That is true of a tinted initials circle. It is **false of a photograph** — a photo
covers the tint, and a photo's own dominant colour is not its owner's hue. The
premise had been sitting in a comment, load-bearing and unexamined, since the day it
was written.

Spines restored on the up-next day rows **and** `SpanBand`'s span rows; the comment
asserting the false premise corrected **in place**, with an explicit prohibition
against repeating the trade.

---

## The identity key (the user's insight)

Asked whether the profile switcher and Settings member list needed a hue element,
the initial recommendation was **no** — both render the person's full name, so
colour saves no reading.

The user's reply reframed it: _"does adding them create some kind of a key though?"_

Yes — and it inverts the argument. Those two lists are the **only** surfaces in the
app that pair a member's **face with their name**, which makes them the **legend**:
the one place the hue→person code can be _learned_. Everywhere the code actually
does work, colour appears with **no name attached** (a calendar chip is a coloured
pill and nothing else). The name being present is not what makes colour redundant
there — it is precisely what makes those surfaces the key.

Remove the tinted circle (which a photo does) and put nothing in its place, and you
**delete the legend while keeping every surface that depends on it.** Both now
carry an identity `<Spine>`.

---

## What was built

- **ADR 042** (amends ADR 030) + `design-system.md` §"Avatar photos".
- **`platform.profile_images`** — migration applied non-destructively to dev + test.
- **API** — `POST`/`GET`/`DELETE /profiles/:id/avatar`; raw-body content-type parser
  with `bodyLimit` (no multipart); `apps/api/src/lib/image.ts`.
- **`AvatarEditor`** (`@family-os/ui`) — pan/zoom/crop → 512px WebP, built on
  **`@use-gesture/react`, already a dependency**. No new deps, no `react-easy-crop`.
- **Settings** — `AvatarField` in the profile drawer (crop dialog stacked over it),
  plus a **"Your photo"** section for every tier.
- **`avatarUrl` threaded** through `GET /profiles`, `/auth/me`, `AuthUser`,
  `ProfileListItem`, `ProfileGrid`, `Sidebar`, `MobileBrandTopBar`, `FeedPostCard`,
  `EventOwners`.
- Calendar `membersById` widened `Map<string,string>` → `Map<string,CalendarMember>`.

---

## Security notes (binding)

The crop and WebP encode happen **client-side**, so the server needs no `sharp` (a
native binary, painful across Docker architectures) and receives ~40KB rather than a
4MB phone photo. The server still **does not trust the client**:

- format whitelisted by **magic bytes** — never by extension or declared
  `Content-Type` (a test uploads an SVG _declared as `image/png`_ and expects 415)
- **never SVG** — it can carry `<script>`, and we serve inline from our own origin
- hard byte cap at the route; server-derived `Content-Type` + `nosniff`

**EXIF:** decoding goes through `createImageBitmap(file, { imageOrientation:
'from-image' })`. Without that flag every portrait phone photo lands on the canvas
sideways.

---

## Gotchas

**An absolutely-positioned `<img>` is a REPLACED element.** While the band still
existed, `inset: 7px` without an explicit `width`/`height` did **not** stretch the
photo — `width: auto` resolves to the image's **intrinsic** width (512px), and the
over-constrained `left`/`right` pair is resolved by **ignoring `right`**. The photo
pinned itself to the top-left at full size and spilled over the band on the other
two edges. The band survived on exactly the two edges it was anchored to, which made
it look like a rendering glitch rather than a layout bug. `inset-0 h-full w-full` and
`inset: Npx` are **not** analogous. Caught in live review; the test that "covered" it
asserted only the _offset_, so it passed while the render was visibly broken.

---

## Latent gaps closed

`family-feed.ts` hardcoded `avatarUrl: null` on the post-author join **despite
already having the profile row in hand**, and neither `GET /profiles` nor
`/auth/me` returned the field. The shell could never have rendered a photo even
though `ProfileAvatar` has accepted `avatarUrl` all along. `profile-avatar.test.tsx`
did not exist at all.

---

## Owed / queued

**Chores overhaul** (queued as a design session, at the user's call). Chores **does
not call `ProfileAvatar` at all** — `TodaySummaryView`'s `PersonTile` hand-rolls its
own initials circle, so chores will **silently never show member photos** while every
other surface does. The mechanical swap is small but shouldn't be done blind:
`TaskRow`'s spine is a **status** colour, not identity, so chores is the one module
where "a spine means who" is **false**. The two colour languages need resolving, not
stacking.

---

## Verification

- ui **108** · platform **33** · api **236** · calendar **89** · shell **3** — green
- typecheck + lint clean across all 10 packages; Storybook builds clean
- exploration playground deleted post-approval (house convention)
- live-reviewed in the real shell; signed off

## What the next session needs to know

1. **Never delete a row's spine because the row has an avatar.** That trade was made
   once, on a premise a photograph invalidates. ADR 042 reverses it and forbids it.
2. **A new surface showing several people at once owes a hue element.** The avatar
   does not count.
3. **A spine does not universally mean "who."** Chores' `TaskRow` spine is a status
   colour. The status-vs-identity rule in `design-system.md` still governs.
4. **Render design explorations inside the real components**, not only against each
   other — that is the only way redundancy with existing chrome becomes visible.
