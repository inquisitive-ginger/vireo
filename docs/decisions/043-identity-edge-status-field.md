# ADR 043 — Identity takes the edge; status takes the field

**Status** — Decided (2026-07-12, Chores Overhaul design + dev session) ·
**Amended 2026-09-04** (shopping polish) — one named meter exception; see Consequences
**Amends** — [ADR 030](030-member-identity-colors.md) (member identity colors),
[ADR 042](042-avatar-images.md) (avatar images), and the "Status vs identity
colour" section of `design-system.md` (settled M2 Design: Chores, 2026-06-15)

## Decision

When a single row must carry **both** an identity (whose is this?) and a status
(is it late / done?), the two signals are split by **channel**, not by
negotiation:

> **Identity takes the leading edge. Status takes the field.**
>
> - The **spine** — the row's 4px leading edge — carries the **identity hue**,
>   in **every** state. It never encodes status.
> - **Status** is carried by the row's **surface and its content**: a wash on the
>   row fill, a badge, coloured meta text, dim + strikethrough, the completion
>   check.

The rule for a surface that shows **one person's own items** is unchanged
(`design-system.md`, "Status vs identity colour"): identity carries no
information there, so colour encodes status — including on the spine. The chores
**taskee** views keep their status spines. This ADR governs only the surfaces
where **both** signals are genuinely present, which today means the chores admin
board.

The prior rule — that the admin board "frees the row `<Spine>` to encode status,
falling back to the assignee hue at rest" — is **withdrawn**.

## Why

**The old spine meant three different things.** `AdminRow` painted it green when
done, red when overdue, and _otherwise_ the assignee's hue. One 4px element
answered a different question depending on the row's state, so it reliably
answered none of them. You could not learn to read it, because there was nothing
stable to learn.

**Status was already said three other ways; identity was said nowhere.** Every
overdue row already carried an `Overdue` badge **and** red due-date text; every
done row already carried a strikethrough **and** a dim **and** a green check. The
spine's status encoding was the fourth copy of a message already delivered.
Identity, meanwhile, appeared only in the group header — so a row, the thing a
parent actually acts on, could not say whose it was on its own. The spine was
being spent on the signal that needed it least.

**Every other module already does this.** The feed, the calendar agenda, the
month grid and the Activities roster all use a leading spine to mean _a person_.
Chores was the sole dissenter, which made "a spine means who" a rule with one
silent exception — the worst kind.

**A photograph forced the question.** ADR 042 established that an avatar is a
face, not a colour token, and that **any surface showing more than one person at
once owes a hue element of its own**. The admin board shows four people and owed
one. Its only candidate was the spine, which was busy being a status light.

**The cost, stated honestly.** Overdue loses its loudest cue — a red bar down the
row's edge. It falls back to the badge, the red date, and a new error **wash**
across the row fill. That wash is the deliberate compensation: status moves from
a 4px line to the entire surface, which is _more_ prominent, not less — it simply
stops competing with identity for the same pixels. This is the same structural
move ADR 042 made for photographs (face in the circle, hue on the chrome beside
it), applied to a second pair of colliding signals.

## The `ItemCard` exception is withdrawn

`design-system.md` granted the chores `AdminBoard` a **sanctioned exception** from
the `ItemCard` primitive, on the grounds that it needed affordances `ItemCard`
"doesn't model": a stretched tap-to-edit overlay and a multi-control trailing
cluster.

That premise was already false when it was written. Calendar's `ActivityRow` was
doing **both, inside `ItemCard`** — and the comments in the two files each cited
_the other_ as their source, which is what duplicated code looks like when nobody
has noticed it is duplicated.

The affordances are now the primitive's:

- **`ItemCard onActivate`** — the row owns its own stretched tap target and lifts
  `trailing` above it. A row that owns its radius and chrome should own its tap
  surface.
- **`RowActions`** — the pencil-on-`sm+` / inline-trash cluster, 44px targets.
- **`MemberGroupHeader`** — the by-member group header (face, name, count, load,
  add), shared by the chores board and the Activities roster.

The exception is **deleted**, not re-justified. No surface hand-rolls the row
skeleton.

## Alternatives considered

- **Person card + status rows** (identity stated once, on a rich group header;
  rows keep status spines) — rejected. It makes the _header_ correct and leaves
  the _row_ — the thing you touch, filter and sort — unable to identify itself.
  It also fails the photo test: turn avatars on and the row has no hue at all.
- **Roster + one flat urgent-first list** (grouping becomes a filter) — a real
  contender, and the more ambitious answer; it would surface the most overdue
  chore in the house as row one instead of letting it hide inside a lane. Held
  back because per-person grouping is what makes this an _admin_ board, and the
  change is large enough to deserve its own session. Not foreclosed.
- **A split spine** (identity band over status band) — rejected. 4px cannot carry
  two axes legibly, and it re-creates the ambiguity it claims to solve.
- **Keeping status on the spine and putting identity in the avatar** — forbidden
  by ADR 042: a photo's dominant colour is not its owner's hue, so it would point
  at the wrong person.

## Do not revisit unless

- A surface appears that must carry identity, status, **and** a third orthogonal
  signal on one row — at which point the channel model needs a third channel, not
  a re-litigation of these two.
- Usage shows parents cannot spot overdue work on the board. The wash is the
  compensation for the lost red bar; if it proves too quiet, **strengthen the
  wash** — do not take the spine back.

## Consequences for future work

- **A row spine on a multi-person surface means "who". Always.** If you need to
  show state, use the field: wash, badge, meta text, dim, check.
- **The rule binds chips too, not just spines.** A chip picks its language from
  **what it says**, not from whose header it sits in: a **count** of a member's
  items is an identity statement (identity tint); **"1 overdue" / "✓ all done"** are
  **statuses** and take the status colours (red / green), the same ones their rows
  use. The first implementation of this ADR tinted _every_ header chip in the
  member's hue, so an urgent member's `1 overdue` rendered in pale teal two lines
  above a row badge reading `Overdue` in red — one fact wearing two colours, the
  exact failure this ADR exists to prevent, reintroduced one level up while being
  fixed in the rows. `MemberGroupHeader` therefore renders its `status` slot **raw**
  and tints only `count`.
- **A meter is a comparison; at zero it must not render.** An empty bar with
  "0 tasks · 0 XP load" is not a quiet meter, it is a meter claiming to have data —
  and a minimum-width floor will even paint a stub of load that does not exist.

  **Amended 2026-09-04 (shopping polish, live pass).** **This rule stands
  everywhere except one surface.** On the shopping list's sticky line the meter
  renders from first paint whenever the list has items, filling from zero, because
  there it is doing a second job: the `⋯` list menu sits on that line, and a control
  with nothing under it reads as floating. The bar is its anchor. The reasoning above
  is unchanged and still binds every other meter — a bar with no comparison to make
  is a bar claiming data it does not have, and gating on `> 0` remains the default.
  What this exception rests on is that the shopping bar is **not** at zero-with-no-data:
  the list has items, the comparison is real, and zero-got is a true reading of it.
  A meter with genuinely nothing to compare still must not render. Do not read this
  as a licence to always-render; it is one surface, for a structural reason, named.

- **Single-person surfaces are unchanged** — the taskee views' status spines are
  still correct, and still the reference case for the original rule.
- **Identity hues are now load-bearing on a denser surface than before.**
  hashing a name into six buckets let a household collide, and two same-hued members
  in adjacent groups is the one case this board's colour language cannot survive.
  **ADR 044 settled it**: the hue is assigned at profile creation and persisted.
