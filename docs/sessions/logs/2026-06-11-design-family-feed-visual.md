# 2026-06-11 — Design: family-feed visual language

**Type:** Design (ad-hoc — not from queue)
**Story:** family-feed visual language ("flat and visually indistinctive" feedback)
**Branch:** `dev/family-feed-visual-language`

---

## What was decided

Direction: **"The Family Bulletin"** — posts are notes left on the family
table. Warm card surfaces lifted with warm-tinted shadows, each note carrying
its author's identity color as a left spine, note text set in Lora (the
family's voice), day-grouped with teal editorial labels. Calm, tactile,
on-palette — no new fonts, no new base hues, no motion changes.

Four gaps in the design system were identified as the root cause of the
flatness, and codified:

1. **No elevation layer** — no `--card`, no shadow tokens; `--secondary` on
   `--background` is a 0.055 ΔL — effectively invisible. → Added `--card`,
   `--card-foreground`, `--shadow-card`, `--shadow-raised` (warm-tinted in
   light mode, deep black in dark). `WidgetSlot` now renders card + shadow.
2. **No member identity system** — avatars hashed names to arbitrary 0–360
   hues: off-palette colors, identical colors for similar names (both "Z"
   names rendered the same mint). → Six fixed identity hues × three layers
   (base/tint/ink), light+dark. ADR 030.
3. **Lora locked out of user content** — post bodies (the app's most
   emotional content) rendered in DM Sans like UI labels. → New `prose`
   token (Lora 18px/1.65); Lora scope amended to include user-authored
   content.
4. **Widgets had no module identity** — an unlabeled feed widget is
   anonymous from across the room. → Widget identity header convention
   (13px accent icon + section-label in `--accent`); section-label color
   rule amended to sanction `--accent` for module identity labels.

New principles added to the design system table: _People are color_, _The
family voice is serif_, _Surfaces lift, backgrounds recede_.

## What was built

**`packages/ui`**

- `styles.css`: `--card`/`--card-foreground`, `--shadow-card`/`--shadow-raised`,
  18 identity tokens × light/dark, `text-prose` utility
- `lib/identity.ts` (new): `IDENTITY_HUES`, `getIdentityHue`, `identityToken`,
  `identityColor` — exported from package index
- `ProfileAvatar`: identity palette instead of arbitrary hash hue; new
  `identity` prop for explicit assignment; new `base` (40px) size
- `WidgetSlot`: `--card` + `--shadow-card` (was flat `--secondary`)
- `ComposeForm`: card surface, `--shadow-raised`, `text-prose` textarea,
  warmer placeholder copy
- Foundation/Color extended with member identity tokens (swatch rows for
  base/tint/ink per hue + avatar) and a `--card` row; `elevation.stories.tsx`
  (new): Foundation/Elevation — surface layers, shadow tokens, in-context
  example, all in the Foundation swatch-row + annotation format
- Family Feed stories share a `StoryAnnotation` helper — every story carries
  an uppercase context annotation (slot size, tier/permission context,
  variant rationale) in the same style as Foundation stories
- Elevation applied across all floating surfaces: `NotificationTray`,
  `Drawer`, `ConfirmDialog`, `Toast` → `--card` + `--shadow-raised`;
  `SettingsSection` → `--card` + `--shadow-card`

**`apps/shell`**

- `ProfileGrid` overlay panel and `Onboarding` card → `--card` +
  `--shadow-raised` (were `--secondary` with ad-hoc Tailwind shadows)

**`plugins/family-feed`**

- `FeedPostCard`: note card (card surface, radius 14, shadow, 40px avatar,
  Lora body) + `plain` variant for widget use. Identity edge: 4px
  full-height bar clipped by the card radius so its curve follows the
  corner — chosen from a five-option Storybook exploration (full-height
  clipped edge · floating pill · inset tab · avatar ring · edge + wash)
- `FeedPageView` (new, presentational): bulletin header (accent section
  label + Lora title), day-grouped posts (Today / Yesterday / weekday /
  date) with accent labels + hairlines; `FeedPage` is now a thin container
  (fetch/state/permission gates) — view is fully Storybook-renderable
- `FeedWidgetView` (new, presentational): widget identity header, latest
  post (standard/banner) or 3 posts (large) via existing container queries;
  `FeedWidget` is now a thin container (useQuery + Link)
- `FeedEmptyState`: `compact` variant for 180px slots; icon Rss →
  MessagesSquare; copy "Nothing on the board yet / Be the first to leave a note"
- Storybook playground: `Family Feed/Feed Page` (default, composing, single,
  empty, empty-read-only), `Family Feed/Feed Widget` (standard/banner/large/
  empty at exact ADR 022 slot dimensions), updated FeedPostCard stories incl.
  identity range; shared `sample-posts.ts` fixture

All stories verified by Playwright screenshot in light + dark.

## What was sent back and why

Nothing sent back. Two pre-existing issues noted, not fixed (out of scope):

- `pnpm lint` fails in `packages/ui` (env/config: `no-undef` on DOM/React
  globals) and in `family-feed` (generated Prisma client linted — needs an
  ignore pattern). Failures predate this session; verified on clean tree.
- `Button` heights (36px default) are below the 48px touch-target rule.

## Open questions raised

1. **Identity hue assignment** — hash fallback collides (Jake/Marcus both
   marigold in fixtures). ADR 030 plans an explicit `identityHue` profile
   field (round-robin at creation, parent-editable). Needs a platform dev
   story: schema field + Settings UI + pass-through in `useAuth`/profile
   payloads → `ProfileAvatar identity`.
2. **Card primitive** — ADR 014's plugin contract example imports `Card`
   from `@family-os/ui`, but no such component exists. The note-card chrome
   in `FeedPostCard` is inline-styled; worth extracting once a second
   consumer appears.
3. **Day-group labels use the client's locale/timezone** — fine for a
   home-server app; revisit if posts ever cross timezones.

## What the next session needs to know

- Design system doc + ADR 030 are authoritative for elevation, identity
  colors, `prose`, and widget headers. Plugins should adopt the widget
  identity header as they're built (Chores, Calendar).
- `FeedPage`/`FeedWidget` are container/presentational splits now — put
  visual work in the `*View` components, data work in the containers.
- The Storybook playground under "Family Feed/" is the assessment surface
  for this module; extend it rather than ad-hoc test pages.
