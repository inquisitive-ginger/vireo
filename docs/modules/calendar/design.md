# Calendar — UX Design Spec

> Locked in **M3 Design: Calendar** (2026-06-22). The dev-facing distillation of
> `docs/sessions/logs/2026-06-22-design-calendar.md`. The interactive Storybook
> playground that served as the visual reference lived under **`Calendar Exploration/…`**;
> each exploration is deleted as its real component ships (same lifecycle as the M2
> Chores Playground). **Only `Up Next Widget` remains** — Month Grid (#2), Event Drawer
> (#3/#4), and Activities (#5) shipped as real `calendar`-plugin components (+ the real
> **`Primitives/DatePicker`**). Cross-cutting conventions are in `docs/design-system.md`.

> **Product constraints (locked in planning, honored here):** one shared calendar;
> tier-4 creates/edits; simple weekly recurrence; month default with week/day
> drill-in. **Changed here:** multi-person events were pulled **into** M3 (see §1).

---

## Shared language (applies everywhere)

- **Color = person** (ADR 030), reproducing the paper wall-calendar highlighters.
  Every event expresses its owner(s):
  - **One owner** → that member's identity **tint fill** + **ink** text (a filled
    "highlighter" pill).
  - **2+ owners (shared)** → a **split fill**: hard-stop tint segments, one per
    person (a date night, siblings' appointment). Reads as "these specific people,"
    not a blended new hue. Gradient and dot-cluster alternatives were explored and
    dropped.
  - **No owner (Family)** → a **neutral** pill (`--secondary`) + a small `Users`
    glyph, so a whole-house event reads as _family_, not as an uncolored leftover.
- **Carry the chores status-vs-identity rule** (design-system): on a single
  person's own surface, identity hue carries no info; calendar surfaces are
  multi-person, so the owner hue **is** the signal — spend it on events.
- **Across-the-room legibility is carried by colour, not text.** Month chips are
  small (`xs`); the glance reads the colour rhythm (who's busy when, where the
  spans are). Event titles/times are approach-read or drill-in. Do not over-promise
  text legibility at month density.
- Cards/surfaces: `--card` bg, `--border`, `--shadow-card`, rounded ~`xl`. Page
  titles ("June 2026", "Activities") in Lora (`page-title`); all else DM Sans.

---

## 1 · Month view — the hero (story #2)

The glanceable tablet twin of the paper calendar: a 7-column, Sunday-start month
grid, color-by-owner, that reads from across the room.

- **Chips = filled hue pills** (the shared language above). Each day cell stacks
  its events as compact filled pills.
- **Multi-day spans** render as **continuous bars in a lane above** the single-day
  chips (not one chip per day). Edges run **flush** with a `←`/`→` cap when the
  span crosses a week boundary; the bar carries the same solo/shared/Family fill.
- **Today** — the date number only, as a filled `--primary` circle. No cell-level
  wash/ring/bar (those were explored and dropped as too heavy for a mid-month
  "today" that would shade half the grid).
- **Past days** — **dim-events**: the past date number and its event pills recede
  (~40% / 60% opacity); the grid stays uniform (no cell-background change). Pushes
  the eye to now-and-ahead without losing the colour backbone of what happened.
  (Other options — dim-number only, mute-cell — were dropped.)
- **Density** — a cell shows the first few chips then **`+N more`**; tapping the
  day or `+N more` drills into the **day/week detail** (all events with times).
- **Chrome** — Lora "June 2026" title, prev/next/today nav, an **Add event** CTA.
- **Reads via TanStack Query** keyed `['calendar/events', { from, to }]`; the
  visible month drives the range; create/edit/delete invalidate the shared prefix.
- **Empty month** → the design-system empty state; loading → a non-janky skeleton.

---

## 2 · Event create / edit drawer (stories #3, #4)

One reused right **Drawer** (Radix Dialog, chores `CreateTaskDrawer` pattern) for
create / edit / per-day prefill; the **same form is reused on mobile** as a
full-width sheet (#4). Header + CTA copy swap on mode ("Add event" / "Save
changes"). Tier 4 only.

**The flow reads as one connected "when," not a pile of switches — each modifier
lives on the field it changes:**

1. **Title**.
2. **For** — **multi-select** owner chips (identity hue) + a **Family** chip.
   Selecting members builds the attendee set (1 = solo, **2+ = shared → split
   fill**, with a "shows as a split color" hint); **Family** is mutually exclusive
   with members. **A pick is required** (≥1 member or Family) — never defaulted, so
   an event always carries identity (no silent neutral). _Owner is not defaulted to
   Family: the common case is a specific person, and a colourless default would
   undermine the colour-by-person glance._
3. **Date** — with an **inline "Multiple days" toggle** on the label row. Off → a
   single date field; on → the field **becomes a range picker** (start→end in one
   calendar), and the time + recurrence rows drop away (a span carries no times and
   doesn't repeat).
4. **Time** — with an **inline "All day" toggle**. The **end time auto-follows
   start by +60 min** until the user overrides it; All day hides the time fields.
   (Single-day only.)
5. **Repeat weekly** — the label gains an inline **"(Every Tuesday)"** (derived from
   the start date's weekday) when on, and reveals an optional **Until** date.
   (Single-day only.)
6. **Location**, **Notes** (optional).
7. **Reminder** — preset chips (`sm`, neutral — not gold). **Defaults to 30 min**
   for a new timed event: capture-once-and-get-reminded is the default path (the
   notification value is the reason to retire Google), not an opt-in people forget.
   This control sets `reminder_minutes` only; the firing mechanism is story #6.

**Footer:** full-width primary CTA. **Edit mode** adds a **Remove event**
(ghost-destructive → confirm) in the footer — a month chip has no row to hang a
trash on, unlike the chores list, so Remove lives in the drawer here.

Optimistic create/edit/delete via `useMutation`; invalidates the shared
`['calendar/events']` prefix. Validation via a shared Zod schema. 44px targets.

---

## 3 · Date picker — shared components (`@family-os/ui`)

A real, themeable date picker shipped to `@family-os/ui` (used by the drawer; the
dev story **retrofits the chores due-date field** onto it, replacing the
stripped-native `<input type=date>`):

- **`Calendar`** — **react-day-picker v10**, themed entirely through its `--rdp-*`
  CSS variables → our tokens (selection/today in `--primary`, our UI font, Lucide
  chevrons; single-selected day **fills** via a scoped rule). Range mode supported
  (filled endpoints, light-`--primary` middle).
- **`Popover`** — Radix popover on `--shadow-raised`. Accepts a `container` so a
  picker inside a modal Drawer **portals into the dialog** (else a body-portaled
  popover falls outside the dialog's dismiss scope and swallows clicks).
- **`DatePicker`** — the single-date field (Input-styled trigger → Calendar in a
  popover; `fromDate` min constraint; auto-resolves the dialog container).
- **`DateRangePicker`** — the range variant (the drawer's "Multiple days").

**Library decision recorded in ADR 037.** Time uses the native `<input type=time>`
for now (a stepped time picker is an optional future polish).

---

## 4 · Activities surface (story #5) — a load lens

**An Activity is not "an event that repeats."** It's a **standing commitment a
specific person has taken on, over a season, that counts toward how busy they
are** (T&T, gymnastics, Vision Therapy, speech/OT). A recurring _event_ (trash day,
Sunday dinner) just lands on the calendar again — nobody carries it as load.

- **Derive, don't categorize.** Users never choose "event vs activity."
  `is_activity` is **derived**: a **weekly-recurring event with member attendees**
  is an activity and appears in each attendee's roster (shared events included —
  ADR 038 amendment, 2026-08-19); Family / un-owned / one-off recurring things
  don't. The Activities surface is a **lens** on the calendar, not a separate object
  type. ("Add activity" just opens the event drawer with repeat-weekly on.)
- **Reached as a view on the calendar** (a Month ⇄ Activities switch).
- **Grouped by owner** (color = person, mirroring the chores admin lanes): each
  member's commitments under their identity avatar + hue, with a count chip, a
  per-person **+ Add**, and tier-4 **edit / end** row actions (tap-row + pencil;
  trash → confirm). Activity rows show the weekly slot (`Tuesdays · 5:15 PM ·
Flips Gym`) and **"until Aug 25" / "ongoing"** seasonality.
- **Why it earns its keep** (what paper can't do) — the **load lens**:
  - a per-kid **weekday-load strip** (committed days filled in their hue → "is
    Teddy overbooked? room for more?" at a glance), and
  - a family **season timeline** (a schematic Gantt: each activity runs to its end
    date, ongoing ones run on with `→` — so "what frees up in November / can we
    start something new?" is visible).
- Tier 1–3 view read-only (no add/edit). **Connects to the owed member-capacity
  ADR** (chores): a child's true load is chores + activities; Activities is
  capacity's first consumer.

---

## 5 · `calendar.up-next` widget (story #7) — read-only

Follows the `chores.today-summary` precedent: `CalendarDays` + "Calendar" neutral
identity header; **per-row owner-hue spine** (split for shared, neutral for Family
— the widget-slot identity rule); read-only **tap-through to `/calendar`**;
self-sizes via CSS container queries. **"Up Next" is agenda-shaped, not a big
metric** — the value is _what's next and when_, so it leans list-forward.

**Two framings** (same widget id, derived from the active profile):

- **Family** (shared tablet / family pseudo-profile) — the family's next events
  across all members, color-by-owner, owner name shown.
- **Mine** (a member's profile / mobile) — the active member's own + Family events;
  owner names dropped (all theirs), Family events still tagged.

**Three sizes:**

- **compact** (1×1) — "Next up" + the next event + "+N more today".
- **standard** (2×1, wide-short) — a small hero count (`text-metric`) + today's
  event rows.
- **large** (2×2) — a **day-grouped agenda** (Today / Tomorrow / _full weekday
  name_) filling height.

**Empty / all-clear** — heading **"Nothing scheduled"** (the primary signal), body
**"Your calendar is clear."** at `large` only (compact drops the body, per the
widget empty-state precedent). Shares the `['calendar/events']` query prefix so a
mutation elsewhere refreshes it.

---

## Implementation notes

- **Playground vs final.** The `Calendar Exploration/…` stories are exploration
  scaffolding (fixtures, fixed slot sizes). The real components live in the
  `calendar` plugin (and the shared pickers in `@family-os/ui`); the explorations
  are deleted once those ship — there is no playground to maintain in parallel.
- **Engineering fixes made this session (shipped, not throwaway):**
  - `cn` now registers the typography token utilities (`text-*-token`) as
    font-size classes in `tailwind-merge`, so a token size + a `text-{color}` in
    one `cn()` no longer silently drops the size.
  - `packages/ui/.storybook/preview-styles.css` now `@source`-scans `../src` so
    ui's own novel utilities emit reliably.

## Open / owed

- **ADR — recurrence storage** — **resolved, ADR 038** (gated Event Model #1):
  also covers the **`event_attendees` join** for multi-person (0 rows = Family ·
  1 = solo · 2+ = shared split fill) and the solo-case `owner_id` shortcut.
- **ADR — time-based reminder scheduling** — **resolved, ADR 045** (gated Event
  Reminders #6): how the 30-min default reminder actually fires.
- **ADR — external-ingest / suggested events** (owed, gates #8).
- **ADR — member capacity** (owed from chores): Activities is its first consumer
  (the load lens). The weekday-load + season-timeline visuals don't need it for
  MVP, but a real "capacity" number would build on it.
- **Time picker** — native `<input type=time>` in MVP; a stepped picker is optional
  polish.
