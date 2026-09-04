# 072 — The Wall Adds As the House

**Status:** Decided (2026-09-03, architecture session on the wall's add path) ·
**Amended 2026-09-04** (M5.5/2) — §3, §4 withdrawn as _rendered_ attribution;
§1, §2, §5, §6 stand. ·
Unblocks `design.md` §"The wall tablet — W2" (M5.5/5) · Applies ADR 021/060 (the
family pseudo-profile), ADR 018 (`ability.can`), ADR 044 (a hue is assigned, never
derived), ADR 064 (no identity chrome here)

## Decision

The wall adds **as the family pseudo-profile**, and the add is attributed to it.

1. **`added_by` holds the requesting profile id** — a UUID from a phone,
   `'family'` from the wall. No second column, no sentinel, no picker.
2. **The profile-referencing columns are `text`, not `uuid`.** `items.added_by`,
   `items.got_by` and `lists.created_by` drop `@db.Uuid` to match
   `platform.profiles.id`. Both `FAMILY_PROFILE_ID` guards go: the one on
   `POST /shopping/lists/:id/items` because the column now accepts the id, the one
   on `POST /shopping/lists` as dead code — creation is tier 4, the family profile
   tier 1, so `ability.can` already refuses it.
3. ~~**The family profile resolves to a place, not a person**, rendered
   `Added by the house`.~~ **Withdrawn 2026-09-04.** Its rule survives: rendered as
   an adder anywhere, the family profile gets **no hue and no face**. Its
   `identityHue` is null by design and must **never** fall back to
   `resolveHue(name)`, which hashes `Family` into a member's colour and points
   "colour = person" at two things (ADR 044).
4. ~~**"Just added" keeps its promise** — `oat milk · the house`.~~ **Withdrawn
   2026-09-04.** Whether W2's chip strip names an adder is M5.5/5's; it inherits the
   same answer: it should not.
5. **One event.** A wall add emits the same `shopping.item.added`, `addedBy` set to
   `'family'`. A consumer that cares tests the value; a second name makes every
   consumer subscribe twice and eventually forget one.
6. **No new permission key.** The wall rides `shopping.item.add`, tier 1, which the
   family profile already holds — ADR 071's table is untouched. A house that does
   not want anonymous wall adds revokes that key for the `family` profile: one row
   on an existing lever.

M5.5/5 owes `design.md` §W2 one edit: its chip strip still says "with who added
them".

## Amendment — 2026-09-04, M5.5/2 live review

**Per-row attribution left the shopping surface entirely**, so "the house" has
nothing to render into. Zach cut `Emma added` / `Sam added · just now` from the note
line: a shared list does not answer whose milk it is, and thirty rows of it sit
between the shopper and the next word. The line keeps **producer** words
(`for Thursday`) only.

This withdraws §3 and §4 as rendered behaviour, nothing more: the wall still adds,
`added_by` still stores `'family'`, the columns stay text, the guards stay gone.

## Why

- **The wall's entire job is adding.** A capture surface that cannot capture is not
  a surface, and W2 is the only one never logged in. The 403 did not defer the
  problem; it deleted the feature.
- **The column type was the bug, not the family profile.** `platform.profiles.id`
  is text. Every plugin that put `@db.Uuid` on a column pointing at it narrowed the
  type below the id space it references, and each paid with a hand-written 403 in
  front of the unattended dashboard — `meals` claim, `chores` claim, now `shopping`
  add. `platform.bug_reports.reporter_id` is plain `String`, takes `'family'` in
  production, and its comment calls that the common path. Shopping copies the table
  that works.
- **The only shipped precedent agrees.** Nothing else lets the family profile write
  — `family-feed.Post` is tier 2, `calendar.Event` tier 4 — except bug reports,
  which attribute rather than anonymize.
- **Attribution without ceremony is the point of W2.** Your other hand holds the
  empty carton; any tap before the word is typed loses to Google Keep.
- **The risk is already priced at tier 1** (ADR 071). The family profile adds and
  cannot check off, so anyone at the wall — including the wifi guest ADR 060 keeps
  in the trust model — adds milk and cannot clear a planned trip.
- **The window is open now.** The schema is one unmerged migration with no rows
  anywhere, so `uuid` → `text` is an edit, not a backfill — free only until M5.5/2
  merges.

## Alternatives considered

- **Nullable `added_by`, wall adds anonymous.** Consumers branch on null anyway, so
  it buys nothing over text and discards the one true fact: the item came from the
  unattended surface.
- **Give the family profile a real UUID.** A platform-wide rename for a row that is
  not a person: `FAMILY_PROFILE_ID` is special-cased across seven modules, lives in
  session rows, and ADR 021 made it reserved and legible on purpose — `'family'` is
  readable in a psql dump at 11pm. Widening one column beats renaming an identity.
- **The wall asks who is adding.** The ceremony W2 exists to reject, and the wall
  is where the adder is least nameable: a guest, or a pre-literate kid.
- **A `sourceType: 'wall'` carrying no person.** `source_type` answers a different
  question (who _produced_ the item), the wall is not a producer, and `added_by`
  still needs a value. It renames the problem.
- **Keep the 403, link the wall to a profile switch.** ADR 021's credential-free
  switch makes that a face grid and two taps.
- **A separate `shopping.wall.add` key.** The capability is identical — create an
  item — so it gates the same verb by furniture.

## Do not revisit unless

Profile ids stop being text — if `platform.profiles.id` becomes a real `uuid`, this
inverts and the family profile needs one too. Or the anonymous add is abused, which
is a revocation row, not a redesign. Or a second unattended surface appears and the
house must tell it from the wall — at which point the distinguishing fact belongs on
the item, not on the person who is not one.
