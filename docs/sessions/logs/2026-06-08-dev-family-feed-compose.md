# Session Log — 2026-06-08 · Dev · family-feed-compose

## What was built

### Permission layer

- `family-feed.post.create` added to `PERMISSION_REGISTRY` in `packages/platform/src/types.ts`
- `ability.ts`: added `'create'` to `Actions`, `'family-feed.Post'` to `Subjects`
- Tier baseline: tier 2+ gets `can('create', 'family-feed.Post')`; tier 1 and the family pseudo-profile do not

### API

- `POST /api/family-feed/posts { body: string }` in `apps/api/src/plugins/family-feed.ts`
  - 403 if `request.ability.can('create', 'family-feed.Post')` is false
  - 400 if body is absent, non-string, or whitespace-only (trim checked server-side)
  - 201 with created post + joined author profile on success

### UI — packages/ui

- `Textarea` component (`textarea.tsx`) — follows same shadcn pattern as `Input`; exported from index
- `ComposeForm` component (`compose-form.tsx`) — Frame B card design: secondary background, border, shadow, avatar left of textarea, divider above Post/Cancel row. Props: `onSubmit`, `onCancel`, `authorName?`, `defaultValue?`. Internal `useState` for body and submitting state. Submit disabled when body is empty or in flight.
- `ComposeForm` stories: Empty, Filled, Submitting (click Post to see pending state)

### Plugin — family-feed

- `FeedEmptyState` gained optional `compose?: ReactNode` slot; renders below the body text
- `FeedPage.tsx` rewritten: compose toggle state, `PermissionGate` wrapping "New Post" header button (absent when no permission), `ComposeForm` opens below header when composing, Zod `postSchema` validates body client-side before fetch, new post prepended to state on 201, form closes and feed container focused on success
- `FeedWidget.tsx`: both empty-state branches (single and multi layout) now pass a `PermissionGate`-wrapped `Link`+`Button` as the `compose` prop — navigates to `/family-feed`
- `zod ^4.4.3` added to plugin dependencies for client-side schema

### Tests

- 6 new API tests in `family-feed.test.ts`: 403 for family profile, 403 for tier-1, 201 for tier-2, 201 for tier-3, new post appears first in GET, 400 for empty body, 400 for whitespace body (7 tests total for POST)
- 3 new ability tests: tier 1 cannot create, tier 2 can create, tier 3 can create `family-feed.Post`
- 1 existing profiles test updated: `PERMISSION_REGISTRY` length 3 → 4

### Cleanup

- Deleted `FeedWidget.playground.stories.tsx` (carried over from family-feed-read session)
- Deleted `ComposeForm.playground.stories.tsx` (created this session, Frame B selected)

## Acceptance criteria status

1. ✅ New Post button visible in feed view for profiles with permission (PermissionGate)
2. ✅ Button absent (not disabled) for family profile / tier 1 — PermissionGate renders null
3. ✅ Non-empty post creates a record attributed to active profile; appears at top without reload
4. ✅ Empty body blocked client-side — Zod schema + disabled submit button
5. ✅ Form closes after success; feed container receives focus
6. ✅ Compose button present in widget empty state (both single and multi layout paths)
7. ✅ POST returns 403 without `family-feed.post.create` permission
8. ✅ ComposeForm exported from packages/ui; stories: Empty, Filled, Submitting

## Decisions made

- **Frame B (card style)** selected from three-frame playground. Rationale: avatar-left layout mirrors FeedPostCard, card elevation cleanly separates composing from reading, snaps open/closed naturally for AC5. Frames A and C ruled out (A too sparse for the warm design language; C always-visible textarea conflicts with AC2's permission-gating requirements).
- **No React Hook Form inside ComposeForm**: single-field form, `useState` suffices; RHF would add a heavy dep to `packages/ui` for zero real gain. Zod validation lives in `FeedPage.tsx`'s submit handler.
- **Rich content deferred**: plain text `body` column can evolve to `jsonb` when a file storage strategy + rich text editor are scoped. Frame B's card layout is neutral to the input type — textarea swaps for Tiptap without touching the surrounding chrome.
- **Widget compose button navigates to /family-feed**: widget is too small for an inline compose form. Clicking New Post in the widget takes the user to the full feed page where the compose experience lives.

## Open questions raised

None.

## What the next session needs to know

- `family-feed.post.create` is now in the registry; the appearance-preference-gate story adds `platform.preferences.appearance` next.
- The Storybook Submitting story requires the user to click "Post" to trigger the pending state — there's no play function (Storybook 10 canvas type doesn't expose testing-library methods; could add `@storybook/test` if interactive stories become important).
- If a future story adds the compose form to the widget inline (rather than navigating), `FeedWidget` will need `useAuth` for the author name and the compose form embedded within the container-query-driven layout.
