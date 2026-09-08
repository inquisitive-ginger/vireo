# Meals — Module Spec

> **Groceries left this module 2026-09-03 (ADR 069)** and became the `shopping`
> plugin — see `docs/modules/shopping/spec.md`. Grocery scope, permissions and
> tables below are retained only where meals still touches them (the `needs`
> push). Everything else moved.
>
> Spec drafted in the M4/M5 planning session (2026-07-21). Story-level design
> was settled in **M5/1 (2026-08-11)** — see `design.md` in this directory and
> ADR 063/064. Amendments from that session are marked _[M5/1]_ inline.

---

## What it is

Two jobs that turn out to be one module:

1. **Nobody gets ambushed by dinner.** A kid walks in from school, looks at the fridge
   tablet, and already knows what's coming — including the one thing on the plate
   they're being asked to try.
2. **Somebody has dinner.** The single most useful fact for a family with a full
   schedule is _who is responsible today_ — cooking it or calling it in.

Groceries once followed from both and was the biggest surface here. It outgrew the
framing: shopping is its own activity with its own producers, and a hardware-store
run is not dinner planning (ADR 069).

## M5 scope (MVP)

- Week plan (one dinner per day) + **Tonight's Dinner** widget
- **Who's got dinner** — owner + kind, an explicit **unclaimed** state, a day-level nudge
- Calendar presence as a **day mark** (ADR 050) — the _who_, never the _what_
- **Try bites** at the table — punches a `rewards` card (ADR 049)
- ~~**Grocery list**~~ — moved to the `shopping` module (ADR 069). Meals keeps only
  the `needs` free-text field and the push that hands it across the contract.

## Explicitly deferred

- **Recipe bank** — deliberately, see below
- Ingredient parsing / scaling / nutrition
- Breakfast and lunch slots (dinner is the one that gets fought over)
- Store integrations, price tracking, grocery spend → Monarch (M8)
- Leftovers tracking, pantry inventory
- Meal history / "we had this three days ago" nudges

---

## Two decisions that shape everything

### The meal is not a calendar event (ADR 050)

`meals` owns its table and contributes a **day mark** — an avatar and a glyph in the
month cell, the label in the agenda day header; it never writes `calendar.events`. The
mark carries the _who_; the _what_ lives on meals' own surfaces. The why is ADR 050's.

### Build mode and shop mode are two different contexts — not two arrangements

- **Build** — at home, over a week, many contributors, three-second adds. _"We're out of
  milk,"_ said standing at the fridge.
- **Shop** — in the store, one person, one hand, cart moving, bad lighting, bad signal.

Most grocery apps design for build and ship a miserable shop mode. **Design for shop.**
Concretely: grouped by **aisle, not entry order** (re-sorting forty items by hand is why
people go back to paper); big targets; checked items **dim in place, never vanish**
("did I already get that?"); no destructive taps; two shoppers see each other's checks.

_[M5/1]_ The mode **split** is retired: one aisle-grouped list everywhere, no
Build/Shop toggle. Capture's "did my add land?" is answered by a just-added
flash in place; items file themselves via an aisle dictionary + learned
per-family overrides. **Dim-in-place, amended:** a _fully cleared aisle_ may
collapse to a stated row ("Bakery · all 2 in the cart", tap to reopen) — the
stated row answers "did I already get that?" better than dimmed lines;
individual checked items still never vanish. See `design.md` §M5/6–M5/7.

**Offline is a requirement, not a nicety.** The service worker is network-first for
`/api`, so today this feature fails in exactly the place it is used. That is a story,
not a surprise to discover in an aisle.

### Why there is no recipe bank

Pulling ingredients from meals normally needs structured recipes — expensive, and the
reason recipe features stall. Instead a planned meal carries a free-text **`needs`**
list the parent types while planning (`chicken thighs, broccoli`); one tap pushes it to
groceries. Barely more work than planning, and it deletes the parsing problem entirely.
A recipe bank becomes genuinely optional.

---

## Anti-ambush, concretely

Two mechanisms, neither needing a schema field:

- **Timing.** They read it at 3pm, not when the plate lands. The _"ugggghhhh"_ still
  happens — it happens in the hallway, alone, with three hours to get over it, instead
  of at the table in front of everyone. The reaction is relocated, not prevented.
- **The title/try-bite split.** `title` = "Rigatoni". `try_bite` = "the veggies". The kid
  isn't handed one intimidating compound noun; they get a thing they like plus **one
  named, bounded ask** they can see coming and pre-negotiate with themselves. The split
  exists for punch cards and turns out to do this job too.

**How the parent phrases the title _is_ the feature**, and no schema change fixes
"creamy sausage rigatoni with veggies". The design session makes the input's placeholder
do the teaching. _[M5/1]_ A `sides` column now does half of it structurally — the full
menu has a home that isn't the title — and a standing helper line does the rest
(a placeholder dies at the first keystroke).

---

## Events namespace

`meals.*`

| Event                    | Published by            | Payload                                           |
| ------------------------ | ----------------------- | ------------------------------------------------- |
| `meals.dinner.planned`   | POST/PATCH planned meal | `{ mealId, date, title, kind, ownerId, tryBite }` |
| `meals.dinner.claimed`   | owner set on a meal     | `{ mealId, date, ownerId }`                       |
| `meals.dinner.fulfilled` | meal marked done        | `{ mealId, date, ownerId }`                       |
| `meals.grocery.added`    | POST grocery item       | `{ itemId, name, addedBy, sourceType }`           |

`meals` publishes nothing into the earn contract (ADR 048) and knows nothing about
ledgers or punch cards. The cook award was retired in M5/2 (2026-08-13); a paid dinner
is a dedicated chore.

---

## Permissions namespace

| Permission key       | CASL                                 | Default baseline                    |
| -------------------- | ------------------------------------ | ----------------------------------- |
| `meals.plan.view`    | `can('view', 'meals.PlannedMeal')`   | Tier 1+                             |
| `meals.dinner.claim` | `can('update', 'meals.PlannedMeal')` | Tier 3+ (claim an unclaimed dinner) |

The claim row is `update` on `meals.PlannedMeal`, not `claim` on `meals.Meal` — the
route narrows `update` to claim-only, and full edits stay behind `manage`.

Tier-4 baseline (not a registry key): `can('manage', 'meals.PlannedMeal')` — plan,
assign, edit, delete.

**Grocery keys moved to `shopping`** (ADR 069): `shopping.item.add`,
`shopping.item.manage`, `shopping.list.create`. Their tier baselines are unchanged —
see `docs/modules/shopping/spec.md` §Permissions namespace.

> **Kids adding to the shopping list is deliberate**, and it is the loop that ties the
> two modules together: a kid adds a vegetable they want to try → it lands on the meal
> plan → it's the try bite that night. The kid started it. That loop crosses a plugin
> boundary now; it is a reason the contract has to be good, not a reason to have kept
> one module.

---

## Day-level nudge

Meals runs its own poll (ADR 045's in-plugin scheduler is the precedent) and fires
`notify()` in the afternoon:

- **to the owner** — _"You've got dinner tonight: rigatoni."_
- **to tier 4, if still unclaimed** — _"Nobody's got dinner."_

The owner nudge can carry the try bite, which reaches a tier-2+ kid's phone before they
are even through the door.

---

## Widget

### `meals.tonight`

| Field                | Value                                                    |
| -------------------- | -------------------------------------------------------- |
| `id`                 | `meals.tonight`                                          |
| `displayName`        | Tonight's Dinner                                         |
| `defaultSize`        | `standard`                                               |
| `supportedSizes`     | `compact`, `standard`, `large`                           |
| `minTier`            | 1                                                        |
| `requiredPermission` | `meals.plan.view`                                        |
| `description`        | What's for dinner, who's got it, and tonight's try bite. |

**Readable from the door, no tap.** This is the fridge-tablet anti-ambush surface — the
meal name is the headline, at the across-the-room 18px floor.

**The empty state is the most valuable state.** A day with no owner at 4pm on a Thursday
is not blank — it is _nobody has dinner_, the exact fact a full-schedule family needs
shoved in its face. Render it as a muted, tappable **"unclaimed"**, one tap to claim.

---

## Database schema (`meals`)

```
planned_meals
  id          uuid  PK
  date        date
  slot        text  default 'dinner'      -- breakfast/lunch reserved, not built
  title       text                        -- the kid-facing name; phrasing is the feature
  sides       text  nullable              -- [M5/1] "roasted veggies, garlic bread" — the menu's second line
  kind        text                        -- 'cooked' | 'takeout' | 'leftovers' | 'out' — renders as a verb, never a chip
  owner_id    uuid  nullable              -- null = UNCLAIMED, a first-class state
  notes       text  nullable
  try_bite    text  nullable              -- the one named, bounded ask
  needs       text  nullable              -- free text → pushed to `shopping` across the
                                          --   contract (ADR 069); no recipe model
  created_by  uuid
  created_at  timestamptz
  updated_at  timestamptz
  UNIQUE (date, slot)

(grocery_items, grocery_lists, grocery_entries, grocery_aisle_overrides and
staples moved to the `shopping` schema — ADR 069. Meals holds no grocery tables.)
```

`try_bite` is free text on the meal, not a foreign key — the punch card it feeds lives
in `rewards` and is reached over the bus (ADR 049). `needs` is the same shape for the
same reason: it feeds `shopping` over a contract, and meals does not model an
ingredient.
