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
- **Last session:** 2026-07-12 — **Design + Dev: Chores Overhaul (PR #39).** **ADR 043 — identity takes the edge; status takes the field.** A row that must carry **both** an owner and a state splits them by **channel**: the **spine is the identity hue in every state**, and **status moves to the row's field** (an overdue **wash** on the fill, the badge, red due text, dim + strikethrough + the green check). **The old spine meant three things** — green when done, red when overdue, _otherwise_ the assignee's hue — so it taught nothing, while identity was shouted separately as a full-width **tint wash** across each lane header (the loudest object on a page whose subject is the tasks). **The asymmetry that decided it:** status was already stated **three other ways** on every row; identity was stated **nowhere the eye lands** — a row could not say whose it was on its own. **The user's steer was the key insight** — _"it's aligned with the activities board"_ — because **the Activities roster was already Direction B**: chores wasn't getting a new design, it was **rejoining one**. A reuse audit then found the two boards were the same component with different data, and that **`ActivityRow` and `AdminRow` had shipped the tap-overlay + action-cluster verbatim, each citing the other in a comment.** Extracted **`ItemCard onActivate`** (a row owning its chrome should own its tap surface), **`RowActions`**, **`MemberGroupHeader`** → both plugins compose them, and the `design-system.md` **"AdminBoard exception" is withdrawn: its premise was already false** (it existed because `ItemCard` "couldn't model" affordances calendar was already building inside `ItemCard`). **Chores had never called `ProfileAvatar` at all** — the widget's `PersonTile` hand-rolled an initials circle from the identity **tint**, so a photo could **never** appear, and the instant it did the tile would have lost its only hue carrier; now spine + real avatar. API `serializeTask` carries `assigneeAvatarUrl` (it already loaded the profile row and dropped the field — the same latent gap ADR 042 found in family-feed). **Container audit (user-raised):** six ad-hoc page recipes → **`PageContainer`, four roles** (`prose` 680 · `list` 840 · `wide` 1100 · `full`), one padding rhythm — **a list is not prose**, and the chores board had been squeezed into a reading measure. It exposed **three bugs, not just drift**: **Settings was left-anchored** (Tailwind's stock `max-w-2xl`, 672px — 8px off our token — **and no `mx-auto`**), calendar hardcoded `max-w-[1100px]` beside the token meant to prevent it, and the mobile agenda re-declared `px-4` on three children. **Chores got its first tests ever (17)** — it had a `test` script and **zero test files**, so it had been silently "passing" since M2. **Cost taken deliberately:** overdue loses the red bar; the wash compensates — _if it proves too quiet, strengthen the wash, do not take the spine back._ **The most instructive failure: I re-created the exact bug the ADR exists to prevent, one level up.** The first `MemberGroupHeader` tinted **every** chip in the member's hue, so an urgent member's `1 overdue` rendered in their **pale teal** — two lines above a row badge saying `Overdue` in **red**. One fact, two colours, on the same screen: fixed in the rows, reintroduced in the header. **The rule binds chips too** — a chip picks its language from **what it says**, not from whose header it sits in (a **count** is identity-tinted; `1 overdue` / `✓ all done` are **statuses** and take red/green). And **a meter is a comparison: at zero it must not render** — the load meter showed `0 tasks · 0 XP load` under an empty bar, and its `Math.max(6, …)` floor even painted a 6% stub of hue, so an all-done member appeared to carry a little something. Both fixes came from a language the **widget already spoke** (`AllDoneChip`/`OverduePill`/`CountChip`, settled in the Today Widget rework) — the board had never adopted it, which is this whole session in miniature. Green: ui 131 · chores 17 · calendar 89 · shell 3 · platform 33 · api 238; live-reviewed. See `logs/2026-07-12-design-dev-chores-overhaul.md`.
- **Previous session:** 2026-07-11 — **Design + Dev: Avatar Images (PR #38, merged).** Profiles get **uploadable, croppable photographs**. **ADR 042** (amends ADR 030): **a photo is a face, not an identity token** — it fills the circle, the avatar wears **no hue ring**, and the identity colour is carried by the chrome **beside** the avatar (the `ItemCard` spine, an identity wash), so a photograph and the identity system never compete for the same pixels. **The band was built, gated, and rejected — and that failure is the most useful thing here.** The first pass ringed each photo in its owner's hue; it survived a rendered four-way exploration and an explicit user gate, and was still wrong. It only became visible **on a real screen with a real photo**: on a feed post card the `ItemCard` spine **already paints that exact hue two millimetres to the left**. An audit of every `ProfileAvatar` call site then found the band **redundant** on the two surfaces that already had a hue carrier and **load-bearing** only on four that had **none** — which is an argument that **those four were under-built**, not that every avatar needs a ring. **Why the exploration missed it:** it rendered the treatments **against each other**, never **inside the real components that already carry a spine** — it answered "which band looks best?" when the question was "does this row already say this?" **The bug the audit surfaced:** the density session (ADR 040) had **deliberately deleted** the `<Spine>` from the up-next day rows on a premise recorded in a comment — _"the avatar already IS the identity hue a spine would paint"_ — **true of a tinted initials circle, false of a photograph**. Spines restored there **and** on `SpanBand`'s span rows; the false premise corrected in place. **The identity key (the user's insight):** the profile switcher and the Settings member list now carry an identity spine. They are the **only** surfaces pairing a member's **face with their name**, which makes them the app's **legend** — the one place the hue→person code can be _learned_, since everywhere the code actually does work colour appears with **no name attached** (a calendar chip is a coloured pill and nothing else). Replace the tinted circle with a photo and put nothing in its place, and you **delete the legend while keeping every surface that depends on it**. **Storage:** bytes in Postgres (`platform.profile_images`) behind an immutable `/api/profiles/:id/avatar?v={hash}` — ADR 009 bought "one backup, one restore", and a disk volume splits that in two (a `down -v` deletes every face in the house). **Security:** crop + WebP encode are **client-side** (no `sharp`; ~40KB, not a 4MB phone photo), but the server does **not** trust the client — format whitelisted by **magic bytes** (a test uploads an SVG _declared as PNG_ and expects 415), **never SVG** (it carries script and we serve inline from our own origin), plus a byte cap, a server-derived `Content-Type` and `nosniff`. EXIF via `createImageBitmap(f, { imageOrientation: 'from-image' })` or every portrait phone photo lands sideways. **Permissions:** new `profile.avatar` subject — **update-own for every tier**, manage-all for tier 4 (choosing your own face is not administration); the household photo is tier-4 only. New **`AvatarEditor`** on **`@use-gesture/react`, already a dependency** — **no new deps**. **Latent gaps closed:** `family-feed` hardcoded `avatarUrl: null` on the author join _while already holding the profile row_, and neither `GET /profiles` nor `/auth/me` returned the field — the shell could never have rendered a photo though `ProfileAvatar` has accepted one all along. **Gotcha:** an absolutely-positioned `<img>` is a **replaced element** — `inset: Npx` **without an explicit width/height does not stretch it** (`width: auto` = the _intrinsic_ width; the over-constrained left/right pair drops `right`), so the photo pinned top-left at full size and spilled over the band. `inset-0 h-full w-full` and `inset: Npx` are **not** analogous. Green: ui 108 · platform 33 · api 236 · calendar 89 · shell 3; live-reviewed. See `logs/2026-07-11-design-dev-avatar-images.md`.
- **Earlier session:** 2026-07-11 — **Design + Dev: Family Fill Re-home, Span Primitive, Type Floor (PR #37, merged).** Cleared the three follow-ups the density session owed, plus two bugs found in live review. **ADR 041 — the Family identity hue.** `--secondary` carried **two meanings** (chrome _and_ the Family fill) and they collided three times in one session; the household now has a **reserved seventh identity entry — "Hearth", a warm stone**, excluded from `IDENTITY_HUES` so the name hash can never hand it to a person, with `huesForEvent([])` resolving to `[FAMILY_HUE]` not `[]` — **one path**, no "no owner" branch. `--secondary` is chrome again. **The first values were wrong and live review caught it:** chroma was judged against the members' **base** layer (0.09–0.13), but fills use the **tint** layer, where the six run 0.035–0.05 — at 0.038 Hearth was a _peer_ of terracotta and rendered as the same pale peach (the exact "colour = person" violation the ADR exists to prevent, relocated). Corrected to **0.018**; it separates from chrome on **lightness**, because chroma has no room between 0.022 and 0.035. Hearth must stay **chromatic** or ADR 040's guarantee breaks retroactively. Also: the shell was hashing the **family's own name** into a member hue for its avatar. **Shared multi-day primitive:** new `SpanBand` — one anatomy, **two containers** (`groove` recessed inside a card · `panel` elevated on `--background`, since ADR 040 forbids a recess there). The mobile agenda now **states a span exactly once** (pinned if running, else inline on its start day) via new `buildAgenda()`. **Type floor rescoped by _distance_, not component** — "a widget is a container, not a distance": 18px binds across-the-room surfaces (the wall tablet); close-up surfaces, home dashboard included, go to 14px. **Gotcha 1:** a token missing from the `[data-theme='dark']` block **silently inherits the light value** — `--surface-sunken`/`--shadow-inset` shipped into only 2 of the 3 theme blocks, so the groove rendered near-white under the in-app toggle, and OS-preference screenshots looked fine. Grep all three. **Gotcha 2:** **judge a colour on the layer that renders it** — member hues are compared at `base`, but fills use `tint`, where everything is already desaturated. **Home dashboard bug:** it served new elevation rungs on **stale geometry** (chores rendered _below_ the feed). The composition lived in **six** places and had drifted, and each profile's layout was **frozen** into `widget_layouts` on its first page load — so a corrected default could never reach it. Now **one definition** in `@family-os/platform`, the default is **served not persisted**, and `GET /home/layout` got its **first-ever test** (6). **ADR 039 amended:** `feature` is **at most** one per surface and the **parent layout has none** (a parent triages — no single widget is "the one thing you came for"); reading order must agree with elevation. Green: ui 85 · platform 33 · shell 3 · api 208 · calendar 89; live-reviewed across breakpoints, both themes, both toggle paths. See `logs/2026-07-11-design-dev-family-fill-rehome.md`.
- **Next session:** **M3 Dev — Event Reminders (story 6)** — the last MVP story (resolve the owed reminder-scheduling ADR first): time-based reminders via `platform.notify()` + Web Push, the rung that retires Google. **Also queued:** **Identity Hue Assignment** — `getIdentityHue` hashes a name into **six** buckets, so **"Zach" and "Emma" already both resolve to terracotta**, and ADR 043 now puts that hue on **every row spine** with member groups stacked adjacently (two same-hued members side by side is the one case the colour language cannot survive); a **rename also silently re-colours a person** everywhere. Assign the hue at profile creation, hash as fallback. Plus the **family-wall feed-typography** follow-up. See `docs/sessions/queue.md`.

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
  photo invalidates, and ADR 042 reverses it.
- **Identity takes the edge; status takes the field** (ADR 043). When a row carries
  **both** an owner and a state, the **spine is the identity hue in every state** —
  it never encodes status on a multi-person surface — and **status goes to the row's
  field**: an overdue **wash** on the fill, a badge, red meta text, dim +
  strikethrough, the check. On a **single-person** surface identity carries no
  information, so the spine encodes **status** and is right to (chores' taskee
  `TaskCard` / widget `TaskRow`). The call site decides; see `design-system.md`
  §"Status vs identity colour".
- **Never hand-roll a row or a page frame.** `ItemCard` owns the row skeleton **and
  its affordances** — `onActivate` (tap-row-to-edit), `RowActions` (pencil `sm+` /
  inline trash), `MemberGroupHeader` (a by-member group's face/name/count/load/add).
  The old "AdminBoard exception" is **withdrawn** (ADR 043) — it existed because
  `ItemCard` supposedly couldn't model affordances calendar was _already_ building
  inside `ItemCard`. Page frames compose **`PageContainer width="prose|list|wide|full"`**;
  padding is **not** a prop, and **a list is not prose** (680px is a reading measure).
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
