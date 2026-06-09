# Session Log — 2026-06-07 · Dev · family-feed-read

## What was decided

- **Frame A (dividers)** chosen after a three-frame playground review (A = 1px `--border` dividers, B = whitespace-only, C = left accent strip). Frame A was selected because the divider already scopes each post as a discrete item — reactions and reply counts slot in above the line without touching the layout, making it the most extensible frame for future post-MVP additions.
- **Component location:** `FeedPostCard` and `FeedEmptyState` live in the plugin, not `packages/ui`. The UI package stays as a reusable primitives library.
- **Unified Storybook:** One Storybook instance in `packages/ui` covers all plugins via an expanded glob (`../../../plugins/*/src/**/*.stories.@(ts|tsx)`). No per-plugin Storybook instances needed.
- **Cross-schema join strategy:** Two Prisma clients (`feedPrisma` for `family_feed.posts`, platform `prisma` for profiles), joined in the API route handler. No formal Prisma cross-schema relations.
- **Prisma migration approach:** `prisma db push` used for dev (not `migrate dev`) to avoid `public._prisma_migrations` contamination from the platform schema. Migration formalization is deferred.
- **`db push` must target both `familyos` and `familyos_test`** — the test suite uses `familyos_test` and the table must exist there. (Discovered during test debugging.)

## What was built

### Plugin scaffold

- `plugins/family-feed/` — full plugin directory
- `package.json` with `@family-os/plugin-family-feed` workspace name, port 3011, `lucide-react` + `@storybook/react` devDependencies
- `vite.config.ts` — port 3011, exposes `./Plugin` and `./widgets/FeedWidget`, shared singletons include `react-router-dom`
- `tsconfig.json`, `index.html`, `public/manifest.json`
- `prisma/schema.prisma` — `family_feed` schema, `Post` model (`id uuid`, `authorId uuid`, `body text`, `createdAt`)
- `prisma.config.ts` — Prisma 7 config with `migrationTableSchema: 'family_feed'`, `PrismaPg` adapter
- `src/db.ts` — `feedPrisma` singleton
- `src/types.ts` — `PostAuthor`, `FeedPost`, `PostsResponse`
- `src/index.ts` — re-exports `Plugin`

### Plugin UI

- `src/Plugin.tsx` — routes `<Route path="/family-feed" element={<FeedPage />} />`
- `src/components/FeedPostCard.tsx` — design-system tokens (`text-card-title`, `text-sm-token`, `text-body`), optional `lineClamp` prop
- `src/components/FeedEmptyState.tsx` — 36px Rss icon, `opacity: 0.4`, `text-display-lg` heading, `text-body` body
- `src/widgets/FeedWidget.tsx` — CSS container queries (`@container (min-height: 300px)` toggles single→multi layout), Frame A dividers, `Link` to `/family-feed` via shared `react-router-dom` singleton
- `src/pages/FeedPage.tsx` — cursor pagination with `Button variant="outline"` load-more from `@family-os/ui`

### Storybook

- `src/components/FeedWidget.playground.stories.tsx` — design gate playground (3 frames × all sizes + in-context home-surface layouts) — kept for reference, not production
- `src/components/FeedPostCard.stories.tsx` — Default, LongBody, WithLineClamp, RecentPost
- `src/components/FeedEmptyState.stories.tsx` — Default

### API

- `apps/api/src/plugins/family-feed.ts` — `GET /family-feed/posts?cursor&limit`, max 50, two-query join, `nextCursor`
- `apps/api/src/plugins/family-feed.test.ts` — 8 tests: empty, author join, ordering, limit, cursor, cap, 400
- `apps/api/src/server.ts` — registered `familyFeedPlugin`
- `apps/api/package.json` — `@family-os/plugin-family-feed: workspace:*`

### Shell wiring

- `plugins.json` — added `{ "name": "family-feed", "baseUrl": "http://localhost:3011" }`
- `apps/shell/src/federation.d.ts` — declarations for `family-feed/Plugin` and `family-feed/widgets/FeedWidget`
- `apps/shell/src/lib/load-plugin.ts` — added `getLazyWidget()` for widget-level federation loading
- `apps/shell/src/pages/Home.tsx` — renders `<Suspense fallback={<PlaceholderCard />}><Widget /></Suspense>` for installed modules with widget loaders

### Design system

- `docs/design-system.md` — Empty States Anatomy updated: 36px icon, `opacity: 0.4`, `text-display-lg` heading, `text-body` body
- `packages/ui/.storybook/main.ts` — expanded stories glob to include plugin stories

## Open questions raised

- **`prisma migrate dev` cross-contamination:** The platform migrations live in `public._prisma_migrations` (not `platform._prisma_migrations`). The `migrationTableSchema: 'family_feed'` option in prisma.config.ts doesn't fully isolate because Prisma still detects the public table. `db push` is the workaround; a proper migration setup for the family-feed plugin will require either migrating the platform history to `platform._prisma_migrations` or using a shared migrations directory approach.
- **Widget data fetching:** `FeedWidget` uses raw `fetch` + `useState/useEffect` since `@tanstack/react-query` is not in the shared singletons list. If query caching becomes important for the widget, add it to shared.

## What the next session needs to know

- family-feed-compose builds on this: adds `POST /api/family-feed/posts`, a compose form in `FeedPage`, and `family-feed.post.create` in `PERMISSION_REGISTRY`.
- When running `prisma db push` for future schema changes, remember to target BOTH `familyos` and `familyos_test`.
- The `FeedWidget.playground.stories.tsx` file is still present as a playground artifact — it should be deleted once compose is done and the full story is verified in Storybook.
