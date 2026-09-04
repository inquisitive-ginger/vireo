# 072 — The Wall Adds As the House

**Status:** Decided (2026-09-03, architecture session on the wall's add path) ·
Unblocks `docs/modules/shopping/design.md` §"The wall tablet — W2" (M5.5/5) ·
Applies ADR 021/060 (the family pseudo-profile), ADR 018 (`ability.can`),
ADR 044 (a hue is assigned, never derived), ADR 064 (no identity chrome here)

## Decision

The wall adds **as the family pseudo-profile**, and the add is attributed to it.

1. **`added_by` holds the requesting profile id, whatever it is** — a UUID from a
   phone, the literal `'family'` from the wall. There is no second column, no
   sentinel person, and no picker.
2. **The profile-referencing columns are `text`, not `uuid`.**
   `shopping.items.added_by`, `items.got_by` and `lists.created_by` drop
   `@db.Uuid`, matching `platform.profiles.id` — which is
   `String @id @default(uuid())`, a **text** column that holds a non-UUID value in
   production. The `FAMILY_PROFILE_ID` guard on `POST /shopping/lists/:id/items`
   is deleted with it. The matching guard on `POST /shopping/lists` is deleted as
   dead code: list creation is tier 4, the family profile is tier 1, and
   `ability.can` already refuses it.
3. **The family profile resolves to a place, not a person.** Attribution renders
   as **the house**: `Added by the house` on the row's note line, beside
   `Emma added`. It carries **no hue and no face** — the family profile's
   `identityHue` is null by design (the unique index means it consumes no member
   hue), and a null hue here must **never** fall back to `resolveHue(name)`, which
   would hash `Family` into a real member's colour and point "colour = person" at
   two things (ADR 044). On this surface that is free: ADR 064 already made
   attribution words only.
4. **"Just added" keeps its promise.** The chips read `oat milk · the house` for a
   wall add and `oat milk · Emma` for a phone add. design.md asks for "who added
   them"; for a wall add the honest answer is the house, and it is still an answer.
5. **One event.** A wall add emits the same `shopping.item.added`, with `addedBy`
   in the payload carrying `'family'`. A consumer that cares tests the value; a
   second event name would make every consumer subscribe twice and eventually
   forget one.
6. **No new permission key.** The wall rides `shopping.item.add` — tier 1, which
   the family profile already holds, so ADR 071's six-key table is untouched. A
   house that decides it does not want anonymous wall adds revokes
   `shopping.item.add` for the `family` profile: one per-profile revocation row on
   a lever that already exists.

M5.5/5 owes `design.md` §W2 one edit — the chip strip names the house for a wall
add — and nothing else in that section changes.

## Why

- **The wall's entire job is adding.** A capture-only surface that cannot capture
  is not a surface, and W2 is the only shopping surface the house has that is
  never logged in. The 403 did not defer the problem, it deleted the feature.
- **The column type was the bug, not the family profile.** `platform.profiles.id`
  is text. Every plugin that wrote `@db.Uuid` on a column pointing at it narrowed
  the type below the id space it references, and each one has since paid for that
  with a hand-written 403 in front of the unattended dashboard — `meals` claim,
  `chores` claim, and now `shopping` add. The one platform table that got it right
  is `platform.bug_reports.reporter_id`, plain `String`: it takes `'family'`
  writes in production today, and its own code comment calls that the common path,
  not the edge case. Shopping copies the table that works.
- **This is the platform's only precedent, and it points the same way.** Nothing
  else in the app lets the family profile write: `create family-feed.Post` starts
  at tier 2, `calendar.Event` creation is tier 4 via `manage all`, and every other
  write route either outranks tier 1 or blocks the id by hand. Bug reports are the
  single shipped counter-example — and they attribute, rather than anonymize.
- **Attribution without ceremony is the whole point of W2.** The argument for the
  surface is that your other hand is holding an empty carton. Any answer that
  costs a tap before the word gets typed loses to the Google Keep list this module
  has to beat.
- **The risk is already priced at tier 1** (ADR 071). The family profile can add
  and cannot check off, so anyone who walks up to the wall — including the wifi
  guest ADR 060 explicitly keeps inside the trust model — can put milk on the list
  and cannot clear a planned trip.
- **The window is open now.** The shopping schema is one unmerged migration on a
  branch with no rows in any environment; `uuid` → `text` is an edit, not a
  backfill. It stops being free the day M5.5/2 merges.

## Alternatives considered

- **Nullable `added_by`, wall adds anonymous.** Rejected: it makes every consumer
  branch on null anyway, so it buys no simplicity over text — and it pays for that
  by discarding the one true fact, that the item came from the unattended surface.
  design.md's chip strip would render a blank where it promised a name.
- **Give the family profile a real UUID.** Rejected: it is a platform-wide rename
  for a row that is not a person. `FAMILY_PROFILE_ID` is special-cased in
  `profiles.ts`, `auth.ts`, `rewards.ts`, `setup.ts`, `preferences.ts`, `dev.ts`
  and the bug-report reporter resolver; it is stored in live session rows; and
  ADR 021 made it a _reserved, legible_ id on purpose — `'family'` is readable in
  a psql dump at 11pm. Widening one column beats renaming an identity.
- **The wall asks who is adding — tap a face, then type.** Rejected: it is exactly
  the ceremony design.md's W2 argument rejects, and the wall is precisely where the
  adder is often unnameable — a guest, or the kid who cannot yet read the grid.
- **A `sourceType: 'wall'` carrying no person.** Rejected: `source_type` already
  answers a different question (who _produced_ the item — `manual`, `meal`), the
  wall is not a producer, and it still leaves `added_by` needing a value on a
  NOT NULL column. It renames the problem.
- **Keep the 403 and link the wall out to a profile switch.** Rejected: ADR 021's
  credential-free switch makes that a face grid and two taps standing in front of
  a tablet, before the word gets typed. It is the picker with extra navigation.
- **A separate `shopping.wall.add` key.** Rejected: the capability is identical —
  create an item — and a second key would need its own baseline, its own registry
  row, and its own revoke, to gate the same verb by furniture.

## Do not revisit unless

Profile ids stop being text — if `platform.profiles.id` ever becomes a real
`uuid`, this decision inverts and the family profile needs one too. Or the
anonymous add is actually abused, which is a revocation row on the `family`
profile, not a redesign. Or a second unattended surface appears and the house
needs to tell it from the wall — at which point the distinguishing fact belongs on
the item, not on the person who is not one.
