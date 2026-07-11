# Design + Dev — Home Dashboard Visual Hierarchy (Elevation Ladder)

> **Type:** Design (exploration → lock) + Development (build → PR #34 → merged)
> **Date:** 2026-07-10
> **Surface:** Home dashboard (tablet primary; mobile stack + family pseudo-profile in scope)
> **Outcome:** ✅ Shipped. The three home widgets no longer read as equal peers.

---

## The problem

Three plugin widgets (`calendar.up-next`, `chores.today-summary`, `family-feed.feed`)
all shipped with identical `WidgetSlot` card chrome — same background, border,
`--shadow-card`, radius. Identical elevation = identical importance; the eye landed
nowhere. Size (ADR 028 `large` vs `standard`) was the only hierarchy lever, and a
bigger box of the same material still reads as "same thing, wider."

## What was decided

Locked **Option C — the Elevation Ladder** from a rendered exploration (four
directions, safe→bold). A **three-rung prominence scale**, shell-applied on
`WidgetSlot`:

| Rung        | Chrome                                             | Role                           |
| ----------- | -------------------------------------------------- | ------------------------------ |
| **feature** | `--shadow-raised` · `rounded-hero` · **no border** | the one lead per surface       |
| **card**    | `--shadow-card` · `rounded-panel` · soft hairline  | resting peers                  |
| **quiet**   | recessed `--secondary` tint · **no shadow**        | backgrounded, still fully live |

**One feature per surface, re-ranked per profile** — parent → Calendar, kid (tier 1–2)
→ Chores, family pseudo-profile → Feed banner. Elevation expresses ADR 028 dominance,
not just `{w,h}`.

**Sub-gates resolved:**

- **Hero title typeface → DM Sans** (not Lora). Explored serif (Lora) as the surface's
  single serif focal moment; the user tested it live and chose DM Sans. Lora stays
  available but the calendar hero ships DM Sans.
- **Quiet rung = recessed-live**, kept unmistakably distinct from the dashed/muted
  not-installed and error flats (the direction's one real risk).
- **Ground-plane fixes shipped with the ladder** (not optional): dropped the uniform
  widget border ("depth, not lines"), density pass.
- **Sidebar ADR-031 tidy** (independent cleanup): removed the 3px left-bar the ADR
  had rejected; active `bg-primary/20`, hover `bg-primary/10`.

## Calendar hero + widget refinements (from live iteration)

- Up-Next hero: **no clock icon**; time as plain `text-sm-token`; owner in an
  **identity pill** (tint/ink + inset ring).
- Day headings dropped from `text-card-title` to the smaller `text-base-token`; day
  groups separate by **spacing, not divider rules**.
- Family-feed widget body gained a **dense mode** (`text-prose-sm`, 15px) for tight
  columns; roomy surfaces stay `text-prose` (18px). Family voice stays Lora either way.

## What was built

- **ui** — `WidgetSlot` gains a `prominence` prop (`feature`/`card`/`quiet`) driving
  the rung chrome; `flat` still overrides for placeholder/error. `WidgetGrid` threads
  prominence through both stack and grid render paths. New **`text-prose-sm`** token.
- **api** — single source of layout composition in **`default-layouts.ts`** (also
  fixed the previously **never-seeded `default_layout_family`** — family had been
  getting the tier_1_2 layout). Prominence is **derived on read** from layout
  composition, **not a persisted column** (forward-compatible with a future column).
  `seed-layout` / `home` / `dev` all consume it.
- **calendar** — `NextEventHero` (pill owner, no clock) + `UpNextView` (smaller day
  headings, no dividers).
- **family-feed** — `FeedPostCard` dense mode + `FeedWidgetView` two-variant CQ
  (single / dense multi).
- **shell** — `Sidebar` ADR-031 tidy.
- **docs** — **ADR 039** (widget prominence; amends 022/028) + `design-system.md`
  §Widget prominence and the migrated `WidgetSlot` contract.
- **Storybook** — the exploration playground (`Home Surface/Elevation Ladder`) was
  removed post-approval; the essential rung demonstration was folded into the existing
  **`Foundation/Elevation`** story (`Widget prominence ladder` — identical content per
  rung so only the chrome varies). Rung tests (`widget-slot.test.tsx`) +
  `default-layouts.test.ts` are the enduring guards.
- **Typography audit** (drive-by) — the `Foundation/Typography` Scale story was
  missing three tokens vs the `@utility text-*` set: added `text-xs-body`,
  `text-prose-sm`, `text-prose` in px-order; values match `design-system.md`. Fixed
  the stale "Lora tokens" comment in `styles.css`.

## Verification

- Green: ui 85 · api 206 · calendar 66 · typecheck + lint clean across all packages;
  Storybook build green.
- Live-reviewed in the running shell (family profile): feed banner leads borderless,
  chores + calendar rest as bordered cards; the hierarchy reads top-down.

## Open — one follow-up

**Family-wall feed typography.** On the family pseudo-profile the feed banner renders
the **dense 15px** multi-post body rather than a single across-the-room 18px post. The
banner's tall slot trips the multi-post height gate, and a container-query **width**
heuristic can't reliably identify the 4-col banner across device sizes — a 4-col banner
on a 1024px wall tablet is _narrower_ than a 2-col widget on a 1920px laptop, so no
absolute width/aspect threshold separates them. The robust fix is **passing prominence
into the widget itself** (e.g. a `useWidgetProminence()` context provided by
`WidgetSlot`), which the widget can read to pick its across-room typography. Deferred —
15px Lora reads fine in the interim. Queued in `queue.md`.

## What the next session needs to know

- Prominence is **derived on read**, not stored. If/when install-uninstall UI or
  per-user re-ranking lands, ADR 039 anticipates promoting it to a persisted column.
- The elevation model is now **three rungs** (was two shadow tokens). `WidgetSlot`
  `prominence` is the single entry point; `flat` is orthogonal (placeholder/error).
- Kickoff `design-home-dashboard-hierarchy.md` is retired into this log.
