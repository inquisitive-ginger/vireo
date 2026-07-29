# 2026-07-29 — Dev: the household had no photo affordance, and no row to hang one on

**Type:** development (auto-bug fix) · **Issue:** #86 · **PR:** #87
**Ad-hoc** — picked up straight from the `auto-bug` queue, no kickoff.

---

## The report

> There's no way for the family profile to get a profile pic set. Tier 4 accounts
> should be able to set it.

Filed in-app by **Family** (tier 1) from `/`, build `JwwO0MtF`.

## What was actually wrong

Two separate defects, either of which alone would have produced the same report.

**1. No mount point.** `AvatarField` was written household-aware from the start —
it already branches to `FAMILY_HUE` for the identity ring — but it is only ever
handed a member row. The Profiles list filters the household out
(`nonFamily`), and `YourAppearanceSection` returns `null` for a family session on
purpose: the household is tier 1, and choosing its face is a tier-4 decision
(ADR 042). So the one surface that could have offered it self-serve is precisely
the one that must not, and no other surface offered it at all.

**2. No row to hang it on — the real one.** ADR 021 calls the `family`
pseudo-profile a _permanently seeded system record_. Only `seed.ts` and
`reset.ts` ever wrote that row; `POST /setup/family` never has. So every dev and
test database has the household as a real row and **production has none**. In
prod:

- `POST /profiles/family/avatar` returns 404 at the `findUnique` on line 160 —
  before `canEditAvatar` is ever consulted, so the tier-4 permission the ADR
  promises is unreachable;
- `ProfileImage.profileId`'s FK and the `profile.update({avatarUrl})` in the same
  transaction both need the row regardless;
- `GET /profiles` returns no household entry, so `ProfileGrid`'s
  `familyProfile?.avatarUrl` is permanently `undefined` — the family tile could
  never show a photo no matter what was uploaded.

This is the same divergence that made the likeliest bug reporter in the house 500
and forced `bug_reports.reporter_id`'s FK to be dropped in `20260721040000`. It
was sitting in the Deferred Backlog as "decide whether the household should be a
real row everywhere or stay synthetic everywhere." **It did not need deciding** —
ADR 021 decided it in 2026-05-29 and the write was simply never implemented.

## What shipped

- **`20260729140000_seed_household_profile`** — `INSERT … ON CONFLICT DO NOTHING`
  backfills the row on every install. No schema change. Applied cleanly to a dev
  DB that already had it.
- **`FamilyPhotoRow`** at the top of the tier-4 **Family** section in Settings,
  beside the family name — `AvatarField` handed the household row with the family
  name substituted, so the initials match what ProfileGrid and the Sidebar already
  draw.
- **Household copy** in `AvatarField`: the crop dialog uses the whole family name
  ("The Pritchetts"), not `split(' ')[0]` — "Add photo — The" is not a sentence.
  And a household photo is not a face, so the caption points at Hearth rather than
  repeating the face/colour line.
- **The synthesized-household fallback stays**, and now speaks. A database
  predating the backfill must still be able to switch home, and 500ing every
  unauthenticated request would be far worse than a household with no photo. But
  the synthetic profile carries no `avatarUrl`, which is _exactly_ how a photo set
  on one install silently fails to exist on another — so it logs once, per the
  standing "catch to recover, never to hide" convention.
- One test locking the invariant: `GET /profiles` carries the household's
  `avatarUrl`. The existing "no family row (prod parity)" switch test is kept —
  its comment was rewritten, since prod parity is no longer the thing it proves.

## Verified live

`GET https://vireohome.app/api/profiles` now returns the `family` row — the first
time production has ever had one — and the deployed shell chunk carries the
household caption. Zach set the household photo the same day and moved the report
to `deployed` — `reporter.avatarUrl` on the prod board now points at
`/api/profiles/family/avatar`, which is the whole fix proving itself: that URL
could not have existed before the backfill.

## Notes for next time

- **`AvatarField` being family-aware was a trap, not a hint.** The `isFamily`
  branch made the component look finished; it had been dead code since ADR 042
  because nothing ever passed it the household. A capability with no reachable
  caller reads exactly like a shipped feature in a grep.
- **The API test suite could not have caught this.** `profile-avatar.test.ts` has
  had "lets tier 4 set the family photo" passing since ADR 042 — it passes because
  the test DB is seeded with the row that prod lacks. Any test that depends on the
  seed is blind to the seed being the only thing that writes it.
- **The Deferred Backlog entry was mis-filed as an open question.** Before
  scheduling a decision, check whether an ADR already made it. Two sessions'
  worth of "worst of both worlds" framing evaporated on reading ADR 021.
- Running the app from a worktree needs `.env` copied in — it is gitignored, so a
  fresh worktree fails `turbo dev` at `node: ../../.env: not found`.
