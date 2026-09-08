# ADR 042 — Avatar Images

**Status** — Decided (2026-07-11, Avatar Images design + dev session)
**Amends** — [ADR 030](030-member-identity-colors.md)

## Decision

Profiles get uploadable photographs.

1. **The spine carries the identity; the avatar carries the face.** ADR 030 stands — spines,
   dots, chips and calendar fills stay hue-driven. A photo appears only in the avatar
   circle, the one element big enough for a face, and fills it. **No hue band:** identity
   colour goes on the chrome beside it, so the two never contest the same pixels. Tinted
   initials are the fallback, not the signal.

   > An avatar is not a colour signal. Any surface showing more than one person at once
   > must carry a hue element of its own.

2. **The switcher and the Settings member list are the legend.** `ProfileGrid` and
   `ProfileListItem` alone pair a face with a name — the one place the hue→person code is
   learnable; elsewhere colour is nameless. Both keep an identity **spine**: once a photo
   replaces the tinted circle, it is all that still teaches the code.

3. **Bytes in Postgres, behind an immutable URL.** `platform.profile_images` (`bytea` + mime
   - hash), 1:1 with the profile. `Profile.avatarUrl` (there since the initial migration)
     holds `/api/profiles/:id/avatar?v={hash}` at `max-age=31536000, immutable`; the hash
     busts the cache. **`Profile`'s schema does not change.**

4. **Permissions.** `profile.avatar`: `update` own in the baseline at every tier, `manage`
   all at tier 4. The Family pseudo-profile's photo is tier-4 only.

## Why

**A photo's dominant colour is not its owner's hue.** A terracotta member shot against teal
renders as a teal avatar — another member's hue. Colour is not absent; it points at the
wrong person. ADR 030's failure, moved from the name-hash to the camera.

**The band was the wrong fix.** The first pass ringed the photo in the owner's hue; on a
feed post card the `ItemCard` spine already paints that hue two millimetres to the left.
The band was redundant wherever a hue carrier existed (feed card, activities roster) and
load-bearing on the four that had none (the up-next widget's day rows, span rows, the
switcher, the Settings list) — evidence those four were **under-built**, not that the band
was right. Fixed, it has no job, and photo-only is simpler _and_ more correct: one hue per
row, on the chrome, never on the face. The band also taxed a face already marginal at size
(3px leaves 26px of a 32px avatar) and forced a second concentric ring into `active`.

**The bug that audit surfaced.** ADR 040 deliberately deleted the `<Spine>` from the
widget's day rows, recording that _"the avatar already IS the identity hue a spine would
paint."_ True of a tinted circle, false of a photograph. The spine returns there and on
`SpanBand`'s rows, and the comment is corrected.

**Bytes in Postgres:** ADR 009 bought a single backup operation. Disk uploads split it into
a volume that must survive container recreation and a restore that silently leaves every
profile a broken image — `docker compose down -v` deletes every face in the house. The
usual objection to blobs is scale, and there is none (≤ ~8 profiles × ~40KB). `/api` also
rides the existing Vite dev proxy; `/uploads` would not.

**Client-side crop.** The browser re-encodes to WebP on a `<canvas>`, so the server needs no
`sharp` (a native binary, painful across Docker architectures) and gets ~40KB, not 4MB — and
still does not trust the client.

**Self-serve**, because a teen picking their own picture is the humane default and `PUT
/preferences/dark-mode` already establishes self-acting-on-`request.profile.id`. Abuse is
answered by the existing per-profile override revoking `profile.avatar`. Tier-4-only would
match `PATCH /profiles/:id`, but that route _administers_; choosing a face does not.

## Security constraints (binding)

- **Whitelist by magic bytes**, never extension or declared type: WebP / PNG / JPEG only.
- **Never accept SVG** — it can carry script; served inline from our origin it is stored XSS.
- Serve a **server-derived** `Content-Type` plus `X-Content-Type-Options: nosniff`.
- Hard byte cap at the route (`bodyLimit`), not just in the client.

## Alternatives considered

- **A halo** (band + card-coloured gap) — the band's costs at ~2× the face-pixel price, for
  the same signal.
- **An adaptive band** (band when small, bare when large) — one person under two rules, and
  it degrades to the bare-photo failure at the up-close sizes.
- **No hue on the switcher and Settings list** (the name is right there) — being the legend
  is what makes them need it.
- **Filesystem + `@fastify/static`** — splits the ADR-009 backup guarantee, needs a
  persistent volume, orphans files on profile delete.
- **Server-side `sharp`** — a native dependency for what the client solves free.
- **`react-easy-crop`** — `@use-gesture/react` is already a `@family-os/ui` dependency, and
  a cropper's differentiated part is the frame, not the pan math.

## Do not revisit unless

- Images are wanted beyond the avatar circle (cover photos) — then a general asset table,
  not `profile_images`, is the shape.
- A household's image data outgrows a Postgres backup, which for avatars will not happen.
- Photographs prove _more_ reliable than hue at 32px across the room — which reopens ADR
  030 itself, not this amendment.

## Consequences

- **Never delete a row's spine because the row has an avatar** — that trade was made once
  (ADR 040's up-next day rows) and this ADR reverses it.
- **A new surface showing several people at once owes a hue element** — the avatar does not
  count.
- **`chores` hand-rolls its initials circle** (`PersonTile`), so it silently never shows
  photos; queued with that module's overhaul. Its `TaskRow` spine is a **status** colour, so
  "a spine means who" is not universal — `design-system.md`'s rule governs.
