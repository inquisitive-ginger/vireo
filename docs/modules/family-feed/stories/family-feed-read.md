# Story: Family Feed — Read

**Module:** family-feed
**Status:** ⬜ Not Started

## User story

As a family member, I can see recent family posts on the home screen and navigate to the full feed so I stay connected to what's happening.

## Scope

**In:**

- Family Feed plugin scaffolded in `plugins/family-feed/` via `pnpm turbo gen plugin`
- `manifest.json`: plugin id `family-feed`, widget entry `family-feed.feed` (supportedSizes: standard, large, banner; minTier: 1; no requiredPermission)
- Prisma schema for `family_feed` schema: `posts { id uuid PK, author_id uuid FK → platform.profiles, body text, created_at timestamptz }`
- `GET /api/family-feed/posts` (paginated, newest first, author profile data joined)
- Widget component: latest post (avatar, author name, relative timestamp, truncated body) at standard and banner; 2–3 stacked posts at large
- Full feed view at `/family-feed`: all posts newest first, each with avatar, author name, timestamp, full body
- Empty state: "No posts yet — be the first to share something." — no compose affordance (family-feed-compose story)
- CSS container queries for internal widget layout adaptation — not media queries
- `FeedPostCard` and `FeedEmptyState` exported from `packages/ui` with Storybook stories

**Out:** Post creation (family-feed-compose); post deletion or editing; reactions, images, activity aggregation (Family Feed v2)

## Acceptance criteria

1. After the Family Feed plugin is installed, the reserved home screen slot renders the widget component instead of the placeholder card
2. At `standard` and `banner` sizes the widget shows the most recent post: avatar, author name, relative timestamp, truncated body
3. At `large` size the widget shows 2–3 most recent posts stacked using the same card pattern
4. Tapping the widget navigates to `/family-feed` where all posts are shown newest first with avatar, author name, timestamp, and full body
5. When no posts exist the widget and feed view both show the empty state; no compose affordance is present
6. The widget uses CSS container queries — not media queries — for internal layout adaptation
7. `GET /api/family-feed/posts` returns posts paginated and newest first with author profile data joined
8. `FeedPostCard` and `FeedEmptyState` are exported from `packages/ui` with Storybook stories

## Dependencies

- home-surface

## Notes

The `widgetId` in `manifest.json` must be exactly `family-feed.feed` — this matches the reserved layout seed in ADR 028. Cross-schema join: `family_feed.posts` → `platform.profiles` for author data via Prisma `relationMode`.
