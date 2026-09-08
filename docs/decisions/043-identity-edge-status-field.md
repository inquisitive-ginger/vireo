# ADR 043 — Identity takes the edge; status takes the field

**Status** — Decided (2026-07-12, Chores Overhaul design + dev session) ·
**Amended 2026-09-04** (shopping polish) — one named meter exception, see Consequences
**Amends** — [ADR 030](030-member-identity-colors.md), [ADR 042](042-avatar-images.md), and
`design-system.md`'s "Status vs identity colour"

## Decision

When one row carries **both** an identity and a status, the two split by **channel**:

> **Identity takes the leading edge. Status takes the field.**
>
> - The **spine** — the row's 4px leading edge — carries the **identity hue** in **every**
>   state. It never encodes status.
> - **Status** goes on the row's surface and content: a wash on the fill, a badge, coloured
>   meta text, dim + strikethrough, the completion check.

A surface showing **one person's own items** is unchanged: identity carries no information
there, so colour encodes status, spine included — the chores **taskee** views keep their
status spines. This ADR governs only surfaces carrying **both** signals, today the chores
admin board. The prior rule, that the board "frees the row `<Spine>` to encode status", is
**withdrawn**.

## Why

**The old spine meant three different things.** `AdminRow` painted it green when done, red
when overdue, otherwise the assignee's hue — one 4px element answering a different question
per state, so it answered none. There was nothing stable to learn.

**Status was already said three other ways; identity nowhere.** An overdue row carried an
`Overdue` badge and red date text; a done row a strikethrough, a dim and a check. The spine
was a fourth copy of a delivered message, while identity lived only in the group header — so
the row a parent acts on could not say whose it was.

**Every other module already does this.** Feed, agenda, month grid and Activities roster use
a leading spine to mean _a person_. Chores was the sole dissenter, making "a spine means who"
a rule with one silent exception.

**A photograph forced it.** ADR 042 made the avatar a face, not a colour token, and any
surface showing more than one person owes a hue element of its own. The board shows four and
owed one; its only candidate was the spine, then busy as a status light.

**The cost, honestly.** Overdue loses its loudest cue, the red bar down the edge, falling
back to the badge, the red date and a new error **wash** on the fill. The wash is the
compensation: status moves from a 4px line to the whole surface, more prominent and no
longer competing with identity.

## The `ItemCard` exception is withdrawn

`design-system.md` granted the chores `AdminBoard` an exception from `ItemCard`, for
affordances it "doesn't model": a stretched tap-to-edit overlay and a multi-control trailing
cluster. The premise was already false — calendar's `ActivityRow` did **both, inside
`ItemCard`**, each file citing _the other_ as source. The affordances are now the primitive's:

- **`ItemCard onActivate`** — the row owns its stretched tap target and lifts `trailing`
  above it.
- **`RowActions`** — the pencil-on-`sm+` / inline-trash cluster, 44px targets.
- **`MemberGroupHeader`** — face, name, count, load, add; shared with the Activities roster.

The exception is **deleted**, not re-justified. No surface hand-rolls the row skeleton.

## Alternatives considered

- **Person card + status rows** — makes the group header correct and leaves the _row_, the
  thing you touch, filter and sort, unable to identify itself; and with avatars on it has no
  hue at all.
- **Roster + one flat urgent-first list** — a real contender, surfacing the house's most
  overdue chore as row one rather than hiding it in a lane. Held back: per-person grouping
  makes this an _admin_ board, and the change deserves a session. Not foreclosed.
- **A split spine** — 4px cannot carry two axes legibly, and re-creates the ambiguity it
  claims to solve.
- **Status on the spine, identity in the avatar** — forbidden by ADR 042: a photo's dominant
  colour is not its owner's, so it points at the wrong person.

## Do not revisit unless

- One row must carry identity, status **and** a third orthogonal signal — then the model
  needs a third channel, not a re-litigation of these two.
- Parents cannot spot overdue work on the board. If the wash proves too quiet, **strengthen
  the wash** — do not take the spine back.

## Consequences

- **A row spine on a multi-person surface means "who". Always.** State goes to the field.
- **The rule binds chips too.** A chip takes its language from **what it says**, not whose
  header it sits in: a **count** of a member's items is identity (identity tint); **"1
  overdue" / "✓ all done"** are statuses, in their rows' status colours. The first
  implementation tinted every header chip in the member's hue, so `1 overdue` rendered in
  pale teal above a badge reading `Overdue` in red — one fact in two colours.
  `MemberGroupHeader` renders `status` **raw**, tinting only `count`.
- **A meter is a comparison; at zero it must not render.** An empty bar with "0 tasks · 0 XP
  load" claims data it has none of, and a minimum-width floor paints load that does not exist. **Amended 2026-09-04 (shopping polish):** one exception — the shopping list's
  sticky line renders its meter from first paint whenever the list has items, because the `⋯`
  menu sits on that line and a control with nothing under it reads as floating; the bar is
  its anchor. That is not zero-with-no-data: the list has items, so the comparison is real. A
  meter with nothing to compare still must not render.
- **Single-person surfaces are unchanged** — the taskee views' status spines are still the
  reference case.
- **Identity hues are load-bearing on a denser surface now.** Two same-hued members in
  adjacent groups is the one case this colour language cannot survive, and a six-bucket name
  hash let a household collide; **ADR 044 settled it** — assigned, persisted.
