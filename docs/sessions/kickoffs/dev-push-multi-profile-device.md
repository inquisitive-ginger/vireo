# Kickoff — Dev: Push Multi-Profile Device

**Type:** Development
**Branch:** `dev/push-multi-profile-device`
**Story spec:** `docs/modules/platform/stories/push-multi-profile-device.md`
**Origin:** web-push session identified shared-device limitation; queued as follow-on

---

## Pre-session reads

- [ ] `CLAUDE.md`
- [ ] `docs/modules/platform/stories/push-multi-profile-device.md`
- [ ] `docs/modules/platform/progress.md`
- [ ] `docs/sessions/logs/2026-06-07-dev-web-push.md` — existing subscribe/unsubscribe/410 implementation
- [ ] `prisma/schema.prisma` — `push_subscriptions` table current definition
- [ ] `apps/server/src/routes/push.ts` (or wherever subscribe/unsubscribe/410 routes live)

## Session scope

Change `push_subscriptions` to key on `(profileId, endpoint)` instead of `endpoint` alone, so multiple profiles can share a push endpoint without displacing each other.

## Story: `platform/push-multi-profile-device`

**Acceptance criteria:**

1. Two profiles can subscribe with the same endpoint; both rows exist in `push_subscriptions`
2. Profile A unsubscribing does not remove Profile B's subscription for the same endpoint
3. A 410 Gone response removes all subscriptions for that endpoint across all profiles
4. Existing subscribe and unsubscribe API contracts are unchanged

## Constraints coming in

- **ADR 029** — `platform.notify()` is the single notification entry point; `sendPushToProfile()` is already scoped to one profile and needs no change
- The Out scope explicitly excludes broadcast push to multiple profiles — don't add it
- No UI changes — this is a schema + route fix only

## Implementation plan

**1. Schema migration**

In `prisma/schema.prisma`, on `push_subscriptions`:

- Remove `@unique` on `endpoint`
- Add `@@unique([profileId, endpoint])`

Run `pnpm db:migrate` with a descriptive migration name (`push_subscriptions_composite_key`).

**2. Subscribe route**

Change the upsert to key on `(profileId, endpoint)`:

```ts
// before: upsert where: { endpoint }
// after: upsert where: { profileId_endpoint: { profileId, endpoint } }
```

**3. Unsubscribe route**

Change the delete to target `(profileId, endpoint)`:

```ts
// before: delete where: { endpoint }
// after: delete where: { profileId_endpoint: { profileId, endpoint } }
```

**4. 410 Gone cleanup in `sendPushToProfile()`**

Change the cleanup to delete all rows for the dead endpoint regardless of profile:

```ts
// before: delete where: { endpoint }  (already matches all — may already work)
// after: deleteMany where: { endpoint }  (explicit, removes any profile's row)
```

Confirm the current 410 path actually uses `deleteMany` and matches on endpoint only. If it filters on `profileId`, remove that filter.

## Testing

- **Unit tests:** Update subscribe/unsubscribe route tests to assert composite-key behavior
  - Subscribe twice with same endpoint, different profiles → 2 rows
  - Unsubscribe profile A → profile B row survives
  - 410 path → both rows deleted
- The web-push session wrote 12 API unit tests; extend that suite rather than writing a new file

---

## Outputs (required before closing)

- [ ] All 4 ACs verified and passing
- [ ] Migration applied and committed
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes (updated unit tests)
- [ ] Story status → ✅ Done in `docs/modules/platform/progress.md` and story spec
- [ ] Session log committed to `docs/sessions/logs/YYYY-MM-DD-dev-push-multi-profile-device.md`
- [ ] `CLAUDE.md` current status updated
- [ ] `docs/sessions/queue.md` updated

## Session log format

```
## What was built
## Acceptance criteria status
## Decisions made
## Open questions raised
## What the next session needs to know
```
