# Story: Permission Overrides

**Module:** platform
**Status:** ⬜ Not Started

## User story

As a parent, I can grant or revoke individual capabilities for a specific family member's profile so I can tune their permissions beyond the tier baseline.

## Scope

**In:**

- Capabilities panel within the profile edit view, accessible to tier 4 only
- Lists all permissions from `PERMISSION_REGISTRY` with their effective state (active via baseline or grant / inactive via baseline or revocation)
- Toggling creates or removes a row in `permission_overrides`
- `POST /api/profiles/:id/permissions` (create override) and `DELETE /api/profiles/:id/permissions/:permissionId` (remove override)
- Effective ability recalculated from DB on each authenticated request — no session invalidation needed
- `PermissionToggleList` and `PermissionToggleItem` exported from `packages/ui` with Storybook stories

**Out:** Bulk permission templates or presets; permission history or audit log; editing overrides for the currently active profile

## Acceptance criteria

1. In the profile edit view, a tier 4 profile sees a Capabilities section listing all permissions from `PERMISSION_REGISTRY`
2. Each permission displays its current effective state: active (tier baseline or granted) or inactive (below tier baseline or revoked)
3. Toggling an inactive permission to active creates a grant record in `permission_overrides`
4. Toggling an active permission to inactive when it is above the tier baseline creates a revocation record
5. Toggling a permission back to its tier baseline removes the override row — no dangling grant or revocation remains
6. A parent cannot edit permission overrides for their own currently active profile
7. All permission override API routes return 403 for callers with tier < 4
8. `PermissionToggleList` and `PermissionToggleItem` are exported from `packages/ui` with Storybook stories

## Dependencies

- profile-management

## Notes

`PERMISSION_REGISTRY` has three platform permissions when this story runs. `family-feed.post.create` is added later in M1 by the family-feed-compose story; when that ships, it will automatically appear in the Capabilities panel with no changes needed here.
