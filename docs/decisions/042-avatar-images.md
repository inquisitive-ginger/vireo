# ADR 042 — Avatar Images

**Status** — Decided (2026-07-11, Avatar Images design + dev session)
**Amends** — [ADR 030](030-member-identity-colors.md) (member identity colors)

## Decision

Profiles get **uploadable photographs**. Four parts:

### 1. The spine carries the identity; the avatar carries the face

The **hue remains the identity carrier** (ADR 030 is upheld, not overturned).
Spines, dots, chips, calendar fills and split fills stay hue-driven and **never
become photos**. A photo appears in exactly one place: inside the avatar circle —
the only element in the system large enough to carry a face.

**A photo fills the circle. The avatar wears no hue band.** The identity colour is
carried by the chrome _beside_ the avatar — the `ItemCard` spine, an identity wash,
a hue pill — so a photograph and the identity system never compete for the same
pixels. (The tinted-initials fill remains underneath as the no-photo fallback, but
it is a fallback, not the system's colour signal.)

The corollary is binding on every surface:

> **An avatar is not a colour signal. Any surface that shows more than one person
> at once must carry a hue element of its own.**

### 2. The switcher and the settings list are the KEY

The profile switcher (`ProfileGrid`) and the Settings member list
(`ProfileListItem`) are the only two surfaces in the app that show every member's
**face and name together**. That makes them the one place the hue→person code can
be _learned_ — everywhere else (calendar chips, spines, split fills) colour appears
with **no name attached** and only works if you already know the mapping.

Both therefore carry an identity **spine**. This is not consistency for its own
sake: a legend needs the symbol beside the label, and once a photo replaces the
tinted initials circle, that spine is the only thing still teaching the code the
rest of the app depends on.

### 3. Storage — bytes in Postgres, behind an immutable URL

A `platform.profile_images` table (`bytea` + mime + content hash), 1:1 with the
profile. `Profile.avatarUrl` — which has existed since the initial migration — holds
`/api/profiles/:id/avatar?v={hash}`, served with
`Cache-Control: public, max-age=31536000, immutable`. The hash busts the cache on
change. **`Profile`'s schema does not change.**

### 4. Permissions

A new `profile.avatar` CASL subject: **`update` own in the baseline for every
tier; `manage` all at tier 4.** The Family pseudo-profile's photo is tier-4 only.

## Why

**The problem a photo creates.** A member's photo has its own dominant colour, and
that colour is not their hue. A terracotta-hued member photographed against a teal
background renders as a **teal** avatar — teal being _another member's_ hue. If the
avatar is the surface's colour signal, the colour is not merely absent: it **points
at the wrong person.** That is the exact failure ADR 030 was written to prevent,
relocated from the name-hash to the camera.

**Why a band on the avatar was the wrong answer.** The first pass solved this by
ringing the photo in the owner's hue. It was built, and it was wrong — for a reason
that only became visible on a real screen: on a feed post card, the `ItemCard`
**spine already paints the very same hue two millimetres to the left of the
avatar.** The band was saying the same thing twice, louder.

An audit of every `ProfileAvatar` call site then showed the band was:

- **redundant** on the two surfaces that already had a hue carrier (feed post card,
  activities roster) — and
- **load-bearing** on four that had none (the up-next widget's day rows, the
  multi-day span rows, the profile switcher, the Settings member list).

Which is not an argument for the band. It is an argument that **those four surfaces
were under-built**, and the band was papering over it. Fix the surfaces and the
band has no job left. Photo-only is then the simpler system _and_ the more correct
one: one hue per row, in one place, on the chrome — never on the face.

**The bug the audit surfaced.** The up-next density session (ADR 040) had
**deliberately deleted** the `<Spine>` from the widget's day rows, on this recorded
premise: _"the avatar already IS the identity hue a spine would paint, plus the
initial that disambiguates it."_ That was true of a tinted initials circle. It is
false of a photograph. The spine is restored on those rows and on `SpanBand`'s span
rows, and the comment asserting the false premise is corrected in place.

**Why the switcher and the settings list get a spine.** The tempting argument is
that they don't need one — both render the person's full name in text, so colour
saves you no reading. That gets it backwards. Those two lists are the **only**
surfaces pairing a face with a name, which makes them the app's **legend**. Colour
is used _without_ a name everywhere it actually matters (a calendar chip is a
coloured pill and nothing else); it only works because the code is learnable
somewhere. Remove the tinted circle and put nothing in its place, and you delete
the legend while keeping every surface that depends on it.

**Why bytes in Postgres.** ADR 009 chose a single Postgres explicitly so that
"backup and restore [is] a single operation." Uploads on disk split that in two:
a volume that must survive container recreation, and a restore that forgets it
leaves every profile with a broken image — a `docker compose down -v` silently
deletes every face in the house. The usual objection to blobs-in-a-database is
scale, and this dataset has none: **a household is ≤ ~8 profiles × ~40KB ≈ under
half a megabyte, permanently.** Serving under `/api` also means the existing Vite
dev proxy already covers it; a new `/uploads` path would not be proxied.

**Why the crop is client-side.** The browser crops and re-encodes to WebP on a
`<canvas>`, so the server never needs `sharp` (a native binary, painful to build
across Docker architectures) and receives ~40KB rather than a 4MB phone photo. The
server still does not trust the client — see below.

**Why self-serve.** A teen picking their own picture is the humane default, and
`PUT /preferences/dark-mode` already establishes the self-acting-on-
`request.profile.id` route pattern. If a child abuses it, the **existing
per-profile permission-override system revokes `profile.avatar` for that profile** —
which is precisely what that system is for. Tier-4-only would have been consistent
with `PATCH /profiles/:id`, but that route is about _administering_ a profile;
choosing your own face is not administration.

## Security constraints (binding on the implementation)

- **Whitelist by magic bytes, not by extension or client-declared type.** Accept
  WebP / PNG / JPEG only.
- **Never accept SVG.** An SVG can carry script; served inline from our own origin
  it is a stored-XSS vector.
- Serve with a **server-derived** `Content-Type` and `X-Content-Type-Options:
nosniff`.
- Enforce a hard byte cap at the route (`bodyLimit`), not just in the client.

## Alternatives considered

- **An identity band around the photo** — **built, then rejected.** It double-encodes
  the hue on every surface that already has a spine, and it only looked necessary on
  the four surfaces that were missing one. Fixing those surfaces removes its
  purpose. It also taxes the face at exactly the sizes where the face is already
  marginal (a 3px band leaves 26px of a 32px avatar), and it forces a second
  concentric ring into the `active` state.
- **A halo (band + a card-coloured gap)** — rejected with the band, and worse: ~2×
  the face-pixel cost for the same signal.
- **An adaptive band** (band when small, bare when large) — rejected: the same person
  renders under a different rule depending on where they appear, and it degrades to
  the bare-photo failure at exactly the up-close sizes. Two components in a trenchcoat.
- **Leaving the switcher and settings list without a hue** (on the grounds that the
  name is right there) — rejected: that is what makes them the legend, not what makes
  colour redundant. See above.
- **Filesystem + `@fastify/static`** — rejected: splits the ADR-009 backup
  guarantee, needs a persistent volume, orphans files on profile delete.
- **Server-side resize with `sharp`** — rejected: a native binary dependency to
  solve a problem the client has already solved for free.
- **`react-easy-crop`** — rejected: `@use-gesture/react` is already a dependency of
  `@family-os/ui`, and the differentiated part of a cropper is the frame, not the
  pan math.

## Do not revisit unless

- Profiles gain a use for images beyond the avatar circle (e.g. cover photos), at
  which point a general asset table — not `profile_images` — is the right shape.
- A household's image data outgrows a Postgres backup, which for avatars alone
  will not happen.
- Photographs are shown to be _more_ reliable identity carriers than hue at 32px
  across the room, which would reopen ADR 030 itself rather than this amendment.

## Consequences for future work

- **Never delete a row's spine because the row has an avatar.** That trade was made
  once (ADR 040, the up-next day rows) and this ADR reverses it.
- **A new surface showing several people at once owes a hue element.** The avatar
  does not count.
- **`chores` does not use `ProfileAvatar`** — `TodaySummaryView`'s `PersonTile`
  hand-rolls its own initials circle, so chores will silently never show photos.
  Queued as a follow-up; the module wants a broader overhaul. Note also that its
  `TaskRow` spine is a **status** colour, not identity — so "a spine means who" is
  not universally true, and the status-vs-identity rule in `design-system.md` still
  governs.
