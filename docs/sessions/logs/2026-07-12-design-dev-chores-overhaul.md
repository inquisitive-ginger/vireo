# Design + Dev: Chores Overhaul (2026-07-12)

> **PR #39 — merged.**

## What was built

- **ADR 043 — identity takes the edge; status takes the field.** The chores admin
  board rebuilt: every row is an `ItemCard` whose **spine is the assignee's hue in
  every state**; status moved to the row's **field** (overdue wash + badge + red
  date; dim + strikethrough + green check). The lane **tint wash** and 2px
  top-border are gone; the group header is now the shared `MemberGroupHeader`
  (face, name, urgency badge, XP-load meter, Add).
- **Chores can finally show faces.** It never called `ProfileAvatar` anywhere. The
  widget's `PersonTile` hand-rolled its own initials circle, so a photo could never
  appear — and the moment one did, the tile would have lost its only hue carrier.
  Now: identity `<Spine>` + real `ProfileAvatar`.
- **Three primitives extracted to `@family-os/ui`,** adopted by chores **and**
  calendar: `ItemCard onActivate` (the row owns its own stretched tap target),
  `RowActions` (pencil `sm+` / inline trash, 44px), `MemberGroupHeader`.
- **`PageContainer`** — four page roles (`prose` 680 / `list` 840 / `wide` 1100 /
  `full`), one padding rhythm, retiring six ad-hoc page recipes across every module.
- **API:** `serializeTask` now carries `assigneeAvatarUrl` (all 5 call sites).
- **Chores got its first tests** — it had a `test` script and **zero test files**,
  so it had been silently "passing" since M2.

## Acceptance criteria status

Ad-hoc session (no story spec). All gated scope delivered and live-reviewed:
board rework ✅ · widget tile ✅ · hide-completed ✅ · reuse audit + extraction ✅ ·
container standardization ✅ (added mid-session at the user's request).
**Declined into the backlog:** empty-lane treatment, overdue-first group order,
Today/Week/All scope filter.

## Decisions made

- **Direction B — "identity rows"** chosen from a three-direction HTML artifact
  rendered in the real tokens. The user's steer — _"it's aligned with the
  activities board"_ — was correct and load-bearing: **the Activities roster was
  already Direction B**, so this was less a new design than chores rejoining one.
- **Why the spine goes to identity.** Status was already stated **three** other ways
  on every row (badge, red date, strikethrough+dim+check); identity was stated
  nowhere the eye lands. The old spine meant green **or** red **or** a person
  depending on state — three meanings in one 4px element, so it taught nothing.
- **The cost, taken deliberately:** overdue loses the red bar; the row **wash**
  compensates. If it ever proves too quiet, **strengthen the wash — do not take the
  spine back** (recorded in the ADR).
- **No Storybook playground.** The HTML artifact was the direction gate; the user
  chose to iterate on the real stories rather than gate variants _within_ B. Noted
  because it means three sub-decisions (wash at 7%, badge copy, meter-at-zero) are
  judgement calls that were reviewed live rather than gated.
- **Page widths are roles, not numbers** — and a **list is not prose**: 680px is a
  reading measure, and a board row carries a spine, title, badges and three
  controls. Chores/Settings moved to 840px; the feed stayed at 680px.
- **The ADR-043 rule binds chips, not just spines** (caught in review — see below).
  A chip picks its language from **what it says**, not from whose header it sits in:
  a **count** of a member's items is identity-tinted; **"1 overdue" / "✓ all done"**
  are **statuses** and take the status colours (red / green), the same ones their
  rows use. `MemberGroupHeader` renders its `status` slot **raw** and tints only
  `count`.
- **A meter is a comparison; at zero it must not render.** The load meter is gone
  for an all-done member.

## Caught in review (worth recording)

**I re-created the exact bug ADR 043 exists to prevent, one level up.** The first
implementation tinted **every** header chip in the member's identity hue — so an
urgent member's `1 overdue` rendered in their **pale teal**, two lines above a row
badge reading `Overdue` in **red**. One fact wearing two colours, on the same
screen: the collision fixed in the rows, reintroduced in the header.

The satisfying part is the fix's provenance: **the widget's `PersonTile` already
spoke the right language** (`AllDoneChip` / `OverduePill` / `CountChip`), settled
back in the Today Widget rework. The board had simply never adopted it — the same
shape as the whole session (chores rejoining conventions it had drifted from,
rather than needing new ones).

**And the meter was lying.** It rendered `0 tasks · 0 XP load` under an empty bar
for an all-done member, and the `Math.max(6, …)` minimum-width floor even painted a
6% stub of their hue — so someone with no work appeared to be carrying a little
something. The floor now only applies when there **is** load, so it can never
manufacture one.

## Scope additions (folded in)

- **Container standardization** (user-requested mid-session). Six recipes → four
  roles. It surfaced **three real bugs, not just drift**:
  1. **Settings was left-anchored** — Tailwind's stock `max-w-2xl` (672px, 8px off
     our token) **and no `mx-auto`**, so it hugged the left edge while every sibling
     route sat centred. Nobody chose that.
  2. **Calendar hardcoded `max-w-[1100px]`** — an arbitrary value beside a token
     that exists to prevent exactly that.
  3. **Calendar's mobile agenda re-declared `px-4` on each of three children.**
- **The `ItemCard` "AdminBoard exception" is withdrawn.** `design-system.md` had
  granted chores an exception because `ItemCard` supposedly couldn't model a
  stretched tap overlay + a multi-control trailing cluster. **The premise was
  already false:** calendar's `ActivityRow` was doing both _inside_ `ItemCard`, and
  each file's comments cited the other as its source — duplicated code nobody had
  noticed was duplicated. `onActivate` makes it the primitive's job; the exception
  is deleted, not re-justified.

## New stories created

- **[platform/identity-hue-assignment](../../modules/platform/stories/identity-hue-assignment.md)** — queued.

## Open questions raised

- **Identity hue collisions are now load-bearing.** `getIdentityHue` hashes a name
  into **six** buckets: **"Zach" and "Emma" already both resolve to terracotta.**
  ADR 043 puts the hue on every row spine with member groups stacked adjacently —
  two same-hued members side by side is the one case this colour language cannot
  survive. **Second bug, same root:** a **rename silently re-colours a person**
  everywhere, because the hue is derived from the name. Queued, not patched.
- The **load meter reads `0 tasks · 0 XP load`** on an all-done member (the
  empty-lane treatment was declined). Still the weakest thing in the diff.

## What the next session needs to know

- **A row spine on a multi-person surface means "who". Always.** Status goes to the
  field. Single-person surfaces (chores taskee) keep their status spines and are
  still the reference case for the original rule.
- **Do not hand-roll a row.** `ItemCard` + `onActivate` + `RowActions` +
  `MemberGroupHeader` now cover every affordance the exception was granted for.
- **Do not hand-roll a page container.** Compose `PageContainer width=…`.
- **Chores has an RTL suite now** (jsdom + `@testing-library/react`, mirroring
  calendar) — extend it rather than re-standing it up.
- Green: **ui 131 · chores 17 · calendar 89 · shell 3 · platform 33 · api 238**;
  typecheck + lint clean across 10 packages; live-reviewed and signed off.
