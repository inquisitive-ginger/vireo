# Family OS — Master Context

> **Working title.** "Family OS" is provisional — use consistently
> throughout until renamed, then find-replace globally.

A locally-hosted, plugin-native platform for family organization —
chores, scheduling, finance, smart home, and more. Designed to grow
with the family that runs it. See [`docs/vision.md`](docs/vision.md).

---

## Milestone Numbering

> **Note:** Session logs prior to 2026-05-30 use pre-audit milestone numbering (old M1=Chores, M2=Calendar, M3=Smart Home, M7=Marketplace). The roadmap was restructured on 2026-05-30 to introduce M1 Platform Shell and renumber all subsequent milestones. `docs/roadmap.md` is authoritative — treat it as the source of truth over any milestone number found in session logs.

---

## Current Status

- **Milestone:** M3 — Calendar 🔄 in progress (6 of 7 MVP stories shipped; **one story from MVP-complete**)
- **Active stories:** **Up Next Widget (story 7) ✅ shipped** (PR #33). Only **Event Reminders (story 6)** remains for the M3 MVP — gated by the owed reminder-scheduling ADR (resolve first). Story 8 (Suggested Events Inbox) is the deferred north star.
- **Last session:** 2026-07-11 — **Design + Dev: Avatar Images (PR #38, merged).** Profiles get **uploadable, croppable photographs**. **ADR 042** (amends ADR 030): **a photo is a face, not an identity token** — it fills the circle, the avatar wears **no hue ring**, and the identity colour is carried by the chrome **beside** the avatar (the `ItemCard` spine, an identity wash), so a photograph and the identity system never compete for the same pixels. **The band was built, gated, and rejected — and that failure is the most useful thing here.** The first pass ringed each photo in its owner's hue; it survived a rendered four-way exploration and an explicit user gate, and was still wrong. It only became visible **on a real screen with a real photo**: on a feed post card the `ItemCard` spine **already paints that exact hue two millimetres to the left**. An audit of every `ProfileAvatar` call site then found the band **redundant** on the two surfaces that already had a hue carrier and **load-bearing** only on four that had **none** — which is an argument that **those four were under-built**, not that every avatar needs a ring. **Why the exploration missed it:** it rendered the treatments **against each other**, never **inside the real components that already carry a spine** — it answered "which band looks best?" when the question was "does this row already say this?" **The bug the audit surfaced:** the density session (ADR 040) had **deliberately deleted** the `<Spine>` from the up-next day rows on a premise recorded in a comment — _"the avatar already IS the identity hue a spine would paint"_ — **true of a tinted initials circle, false of a photograph**. Spines restored there **and** on `SpanBand`'s span rows; the false premise corrected in place. **The identity key (the user's insight):** the profile switcher and the Settings member list now carry an identity spine. They are the **only** surfaces pairing a member's **face with their name**, which makes them the app's **legend** — the one place the hue→person code can be _learned_, since everywhere the code actually does work colour appears with **no name attached** (a calendar chip is a coloured pill and nothing else). Replace the tinted circle with a photo and put nothing in its place, and you **delete the legend while keeping every surface that depends on it**. **Storage:** bytes in Postgres (`platform.profile_images`) behind an immutable `/api/profiles/:id/avatar?v={hash}` — ADR 009 bought "one backup, one restore", and a disk volume splits that in two (a `down -v` deletes every face in the house). **Security:** crop + WebP encode are **client-side** (no `sharp`; ~40KB, not a 4MB phone photo), but the server does **not** trust the client — format whitelisted by **magic bytes** (a test uploads an SVG _declared as PNG_ and expects 415), **never SVG** (it carries script and we serve inline from our own origin), plus a byte cap, a server-derived `Content-Type` and `nosniff`. EXIF via `createImageBitmap(f, { imageOrientation: 'from-image' })` or every portrait phone photo lands sideways. **Permissions:** new `profile.avatar` subject — **update-own for every tier**, manage-all for tier 4 (choosing your own face is not administration); the household photo is tier-4 only. New **`AvatarEditor`** on **`@use-gesture/react`, already a dependency** — **no new deps**. **Latent gaps closed:** `family-feed` hardcoded `avatarUrl: null` on the author join _while already holding the profile row_, and neither `GET /profiles` nor `/auth/me` returned the field — the shell could never have rendered a photo though `ProfileAvatar` has accepted one all along. **Gotcha:** an absolutely-positioned `<img>` is a **replaced element** — `inset: Npx` **without an explicit width/height does not stretch it** (`width: auto` = the _intrinsic_ width; the over-constrained left/right pair drops `right`), so the photo pinned top-left at full size and spilled over the band. `inset-0 h-full w-full` and `inset: Npx` are **not** analogous. Green: ui 108 · platform 33 · api 236 · calendar 89 · shell 3; live-reviewed. See `logs/2026-07-11-design-dev-avatar-images.md`.
- **Previous session:** 2026-07-11 — **Design + Dev: Family Fill Re-home, Span Primitive, Type Floor (PR #37, merged).** Cleared the three follow-ups the density session owed, plus two bugs found in live review. **ADR 041 — the Family identity hue.** `--secondary` carried **two meanings** (chrome _and_ the Family fill) and they collided three times in one session; the household now has a **reserved seventh identity entry — "Hearth", a warm stone**, excluded from `IDENTITY_HUES` so the name hash can never hand it to a person, with `huesForEvent([])` resolving to `[FAMILY_HUE]` not `[]` — **one path**, no "no owner" branch. `--secondary` is chrome again. **The first values were wrong and live review caught it:** chroma was judged against the members' **base** layer (0.09–0.13), but fills use the **tint** layer, where the six run 0.035–0.05 — at 0.038 Hearth was a _peer_ of terracotta and rendered as the same pale peach (the exact "colour = person" violation the ADR exists to prevent, relocated). Corrected to **0.018**; it separates from chrome on **lightness**, because chroma has no room between 0.022 and 0.035. Hearth must stay **chromatic** or ADR 040's guarantee breaks retroactively. Also: the shell was hashing the **family's own name** into a member hue for its avatar. **Shared multi-day primitive:** new `SpanBand` — one anatomy, **two containers** (`groove` recessed inside a card · `panel` elevated on `--background`, since ADR 040 forbids a recess there). The mobile agenda now **states a span exactly once** (pinned if running, else inline on its start day) via new `buildAgenda()`. **Type floor rescoped by _distance_, not component** — "a widget is a container, not a distance": 18px binds across-the-room surfaces (the wall tablet); close-up surfaces, home dashboard included, go to 14px. **Gotcha 1:** a token missing from the `[data-theme='dark']` block **silently inherits the light value** — `--surface-sunken`/`--shadow-inset` shipped into only 2 of the 3 theme blocks, so the groove rendered near-white under the in-app toggle, and OS-preference screenshots looked fine. Grep all three. **Gotcha 2:** **judge a colour on the layer that renders it** — member hues are compared at `base`, but fills use `tint`, where everything is already desaturated. **Home dashboard bug:** it served new elevation rungs on **stale geometry** (chores rendered _below_ the feed). The composition lived in **six** places and had drifted, and each profile's layout was **frozen** into `widget_layouts` on its first page load — so a corrected default could never reach it. Now **one definition** in `@family-os/platform`, the default is **served not persisted**, and `GET /home/layout` got its **first-ever test** (6). **ADR 039 amended:** `feature` is **at most** one per surface and the **parent layout has none** (a parent triages — no single widget is "the one thing you came for"); reading order must agree with elevation. Green: ui 85 · platform 33 · shell 3 · api 208 · calendar 89; live-reviewed across breakpoints, both themes, both toggle paths. See `logs/2026-07-11-design-dev-family-fill-rehome.md`.
- **Earlier session:** 2026-07-11 — **Design + Dev: Up Next — Density Rework (PR #36, merged).** The widget bucketed every event by **every day it touched**, so one week-long camp claimed five rows and swamped the appointments (and re-emitted the same event id per day — **duplicate React keys**, never caught because the story fixtures had no multi-day events). Spans now leave the day list for a dedicated band and the window is **one week** (today + 6), retiring the "+40 more" that read as a backlog. The tile is **three zones, three ranks**, each wearing a different **surface** so none reads as a peer: **raised** hero (a moment) · **recessed** full-bleed "all week" groove (a condition — the one element that touches both edges, because a multi-day event is the one thing that runs past the frame) · **flat** day-gutter list (a sequence). Earlier passes failed because the band kept **borrowing its grammar from a neighbour** (as a card → a second hero; folded into the gutter → lost among the days); the axis that resolved it was **material, not position**. **ADR 040 — the sunken surface plane:** the groove needed a surface meaning _below the card_ and the system had none (the ladder only climbed), while the one candidate, `--secondary`, **already means the Family fill** — so a Family-owned hero sat on a band of the identical beige. `--surface-sunken` is **near-achromatic on purpose** (chroma 0.006 vs 0.022): every identity fill is chromatic by construction, so a desaturated plane can never be mistaken for one. Ships paired with `--shadow-inset` (the tint alone is a grey rectangle; the inner shadow is what makes it a groove). Also: **`WIDGET_INSET`** (widget padding scales with the slot — 16/20/24; `WidgetSlot` contributes none, so the three widgets had drifted; retires family-feed's off-grid `14/18/16px`), owners as **avatars not names** (a strict superset of the spine), new `lib/week.ts` (11 tests), and a hero tidy (dropped the identity dot — **invisible** on a Family wash and silently indenting the eyebrow 14px). **Gotcha:** `leading-tight` is **silently dead** on `text-*-token` (those utilities bake their own line-height and win the cascade) — cost three passes at the gutter alignment; the fix was to **mirror the row's geometry** rather than compute an inset. **Fault line:** `--secondary` carrying two meanings bit **three times** this session — re-homing the Family fill is queued. Green: ui 85 · calendar 81 · api 206 · shell 3; live-reviewed. See `logs/2026-07-11-design-dev-up-next-density.md`.
- **Next session:** **M3 Dev — Event Reminders (story 6)** — the last MVP story (resolve the owed reminder-scheduling ADR first): time-based reminders via `platform.notify()` + Web Push, the rung that retires Google. **Also queued:** the **chores overhaul** (ADR 042's audit found chores **never calls `ProfileAvatar`** — `PersonTile` hand-rolls its own initials circle, so chores will silently never show photos; and its `TaskRow` spine is a **status** colour, so it is the one module where "a spine means who" is false — the two colour languages need resolving, not stacking), and the **family-wall feed-typography** follow-up. See `docs/sessions/queue.md`.

> Update this section at the end of every session.

---

## Workspace Map

| Path                       | What it is                                |
| -------------------------- | ----------------------------------------- |
| `docs/vision.md`           | The why — stable, rarely changes          |
| `docs/architecture.md`     | How pieces fit — living doc               |
| `docs/design-system.md`    | Visual language and component conventions |
| `docs/decisions/`          | ADRs — settled decisions                  |
| `docs/modules/[name]/`     | Per-module spec + progress board          |
| `docs/sessions/queue.md`   | What to run next — the session queue      |
| `docs/sessions/kickoffs/`  | Pre-loaded kickoff doc per queued session |
| `docs/sessions/templates/` | Recipes for writing kickoff docs          |
| `docs/sessions/logs/`      | Session output artifacts                  |
| `docs/roadmap.md`          | Milestones and delivery status            |

---

## Rules Every Session Follows

1. **Read this file first**
2. **Open the kickoff doc** (`docs/sessions/kickoffs/`) for this session — it has the pre-loaded context, constraints, and scope. If no kickoff exists (ad-hoc session), write a minimal one before touching code.
3. **Check `docs/decisions/` before proposing changes to settled questions**
4. **Do not re-litigate ADRs** — if a decision needs revisiting, flag
   it in your session note; don't just override it
5. **Commit an output artifact + session note before closing**
6. **Delete the kickoff doc** for this session after closing (it becomes the session log)
7. **Planning sessions must update `docs/sessions/queue.md`** before closing — add a kickoff stub for any new sessions queued

---

## Formats

### Kickoff Docs (`docs/sessions/kickoffs/[session-name].md`)

Written before the session opens. Contains: pre-session reads, scope statement,
ACs or decisions to make, constraints coming in, implementation notes (if dev),
and the required outputs checklist. Deleted after the session closes (its content
lives in the session log). Template recipes are in `docs/sessions/templates/`.

### Session Notes

Committed to `docs/sessions/logs/YYYY-MM-DD-[type]-[story].md`:

- What was decided
- What was built or produced
- What was sent back and why (if anything)
- Open questions raised
- What the next session needs to know

### ADRs (`docs/decisions/NNN-title.md`)

- **Status** — Decided | Superseded
- **Decision** — what was chosen
- **Why** — rationale
- **Alternatives considered**
- **Do not revisit unless** — what would justify reopening

### Story Progress (`docs/modules/[name]/progress.md`)

Statuses: ⬜ Not Started · 🔄 In Progress · ✅ Done · 🔙 Sent Back

---

## Conventions

**Module names:** kebab-case (`chore-engine`, `calendar`, `finance`)
**Event names:** `module.noun.verb` (`chores.task.completed`)
**Commits:** `[module/story] what changed`
**Sessions:** scoped to one story — not "backend for chores module"
but "backend for chores/task-completion story"

---

## Standing Engineering Conventions

> Cross-cutting decisions that bind **every** dev session, regardless of the
> story. Kickoffs list story-specific ADRs; these are the always-on ones a cold
> session must not miss. Check your work against this list before closing.

- **Server / plugin data → TanStack Query** (ADR 013). Never raw `fetch` + `useState`.
  Plugins import `useQuery` / `useMutation` / `useQueryClient` / `useInfiniteQuery`
  from `@family-os/platform` (the singleton path that shares the shell's
  `QueryClient`). Profile-scope query keys; invalidate on mutation. Share a key
  **prefix** across a module's page and its widget (e.g. `['chores/tasks']` +
  `['chores/tasks', 'widget']`) so one invalidation refreshes both.
- **UI → `@family-os/ui` (shadcn/Radix) components + design tokens** (ADR 012,
  `design-system.md`). Use `Button`/`Badge`/`Input`/`Label`/etc. and typography
  token utilities — never raw px font sizes, hardcoded colors, or reimplemented
  primitives. **Plugins are styled utility-first, same as the shell** (ADR 035):
  the shell's Tailwind `@source`-scans `plugins/*/src`, so `className` utilities,
  `hover:`/`focus:` variants, and container queries all emit — no per-plugin CSS
  setup. Colors/fonts still go through tokens (`bg-primary`, `var(--token)`), never
  hardcoded values. (First-party only; third-party plugin CSS is a future Option-2
  per-plugin build — see ADR 035.)
- **Member colors → identity palette helpers** (`identityColor`, ADR 030) — never
  invent hues.
- **The spine carries the identity; the avatar carries the face** (ADR 042). An
  avatar can hold a **photograph**, so it is **not** a colour signal. **Any surface
  showing more than one person at once owes a hue element of its own** (an
  `ItemCard` spine, an identity wash, a hue pill) — and **never delete a row's spine
  on the grounds that it has an avatar.** That trade was made once, on a premise a
  photo invalidates, and ADR 042 reverses it. Caveat: a spine does **not**
  universally mean "who" — chores' `TaskRow` spine is a **status** colour (see
  `design-system.md` §"Status vs identity colour").
- **Render design explorations _inside_ the real components**, not only against each
  other. The ADR-042 identity band passed a four-way rendered exploration and a user
  gate, then failed on the first real screen — because the playground never placed an
  avatar beside the `ItemCard` spine that already paints the same hue. An exploration
  that only compares its own options cannot see redundancy with what already exists.
- **Permissions → CASL namespaced subjects + `PERMISSION_REGISTRY`** (ADR 018).
- **Events → `module.noun.verb`**; **widgets → manifest + Query cache invalidation** (ADR 022).
- **New plugin → mirror the `family-feed` structure** (db export, prisma config,
  federation singletons, manifest); register in `plugins.json`, `load-plugin.ts`,
  `federation.d.ts`, and the shell `ICON_MAP`.

---

## Session Templates

`docs/sessions/templates/` — one file per type:
`product` · `design` · `architecture` · `development` · `qa` · `audit`

Templates are recipes for writing kickoff docs, not docs to fill out live.
All six types now exist.
