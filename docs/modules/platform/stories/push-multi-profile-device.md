# Story: Push Multi-Profile Device Support

**Module:** platform
**Status:** ⬜ Not Started

## User story

As a parent, I can subscribe to push notifications on a shared device without displacing another profile's subscription, so both profiles receive their own alerts.

## Background

The current web-push implementation uses `endpoint` as a unique key in `push_subscriptions`. One browser instance (device) can therefore only have one profile associated with it — the last profile to subscribe overwrites the previous one. This is acceptable for personal phones but breaks down on shared devices.

## Scope

**In:**

- Change `push_subscriptions` to key on `(profile_id, endpoint)` instead of `endpoint` alone
- On subscribe: upsert on `(profile_id, endpoint)` — multiple profiles can hold the same endpoint simultaneously
- On 410 Gone: delete all rows with that endpoint (endpoint is dead for everyone)
- On unsubscribe: delete only the `(profile_id, endpoint)` row — other profiles' subscriptions for that endpoint survive
- `sendPushToProfile()` already scoped to one profile — no change needed there

**Out:**

- Broadcast push to multiple profiles in a single `platform.notify()` call (deferred — ADR 029 broadcast model)
- Any UI indication that another profile is subscribed on the same device

## Acceptance criteria

1. Two profiles can subscribe with the same endpoint; both rows exist in `push_subscriptions`
2. Profile A unsubscribing does not remove Profile B's subscription for the same endpoint
3. A 410 Gone response removes all subscriptions for that endpoint across all profiles
4. Existing subscribe and unsubscribe API contracts are unchanged

## Dependencies

- web-push (done)

## Notes

The migration requires dropping the current `@unique` constraint on `endpoint` and replacing it with a `@@unique([profileId, endpoint])` composite. The 410 cleanup in `sendPushToProfile()` should `deleteMany` by endpoint without filtering on profileId.
