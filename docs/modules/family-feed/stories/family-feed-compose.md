# Story: Family Feed — Compose

**Module:** family-feed
**Status:** ✅ Done

## User story

As a family member with write access, I can compose and post a text message to the family feed so I can share updates with the family.

## Scope

**In:**

- Compose button in the full feed view and in the widget empty state, gated by `PermissionGate (action: 'create', subject: 'family-feed.Post')`
- Compose form: text area + post button + cancel
- React Hook Form + Zod for form state and validation; post body schema lives within the plugin (self-contained)
- `POST /api/family-feed/posts { body: string }` creates a post attributed to the active profile; server validates against the same Zod schema
- New post appears at top of feed without a page reload
- `family-feed.post.create` added to `PERMISSION_REGISTRY` in `@family-os/platform/types`; tier 2+ has this in the tier baseline; tier 1 is read-only by default
- `ComposeForm` exported from `packages/ui` with Storybook stories

**Out:** Character limits; image or rich media attachments; post targeting (specific family members); post deletion or moderation

## Acceptance criteria

1. In the full feed view, a New Post button is visible for profiles with `family-feed.post.create` permission
2. The compose button is absent — not disabled — for profiles without write permission (family pseudo-profile, tier 1 by default)
3. Submitting a non-empty post creates a record attributed to the active profile; the new post appears at the top of the feed without a page reload
4. Submitting an empty post body is blocked client-side by Zod schema validation; the form does not submit
5. After a successful post the compose form closes and focus returns to the feed
6. The compose button is also present in the widget empty state for profiles with write permission
7. `POST /api/family-feed/posts` returns 403 for profiles without `family-feed.post.create` permission
8. `ComposeForm` is exported from `packages/ui` with Storybook stories covering empty, filled, and submitting states

## Dependencies

- family-feed-read

## Notes

Tier 2 is the lowest baseline that includes `family-feed.post.create` — consistent with the tier 2 intent and the principle that kids are participants. A parent can grant the permission to a tier 1 profile individually via the permission-overrides story.
