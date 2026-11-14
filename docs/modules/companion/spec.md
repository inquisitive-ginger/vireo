# Companion — Module Overview (M4.5)

> Direction settled 2026-08-07 (M4/9 direction session, log
> `docs/sessions/logs/2026-08-07-design-xp-sink-direction.md`). The settled
> decisions live in **ADR 061** (product) and **ADR 062** (art pipeline) — this
> file is the index and the session plan, not a restatement.

## What it is

The XP sink ADR 056 deferred: a per-kid critter grown by XP, dressed by milestone
picks. **P$ buys things; XP grows something.** Gated direction artifact:
`docs/sessions/artifacts/2026-08-07-xp-sink-direction.html` (open in a browser —
every surface is mocked in real app tokens).

The feature's kid-facing name is **decided at the dinner table** before launch;
"critter/companion" is the working register. Module name: `companion`.

## Session plan

Five sessions, strictly sequenced — each held for its session in `docs/reference/companion/` (roadmap sessions 2–4):

| #      | Session                       | Type   | Produces                                                   |
| ------ | ----------------------------- | ------ | ---------------------------------------------------------- |
| M4.5/1 | Style Bible + duotone proof   | design | `style-bible.md`, reference sheets, working duotone mapper |
| M4.5/2 | Gear taxonomy + asset library | design | gear catalog, the generated+curated v1 asset set, pipeline |
| M4.5/3 | Feature UX                    | design | gated hi-fi artifact on real art, curve, layout ADR notes  |
| M4.5/4 | Dev: foundation               | dev    | plugin, schema, hatch, level engine, portrait renderer     |
| M4.5/5 | Dev: surfaces                 | dev    | widget, flock, wardrobe, milestone pick, notifications     |

**Why this order:** the bible constrains generation (/1 → /2); UX layout is judged
on real art (/2 → /3); dev builds to a gated design (/3 → /4 → /5). If wall-clock
demands, /4 may start after /1 — the schema and level engine don't need final art —
at the cost of building the hatch UI to the direction artifact instead of /3's
gated design.

## Boundaries already settled (do not re-litigate — flag per session rule 4)

- Ownership, progression, roster, placement, mood, visibility → **ADR 061**
- Generation locus, duotone, compositing, asset storage, custom-gear extension → **ADR 062**
- XP award mechanics and register → ADR 056, ADR 051/054 (all untouched)
- Draft level curve (50/150/300/500/750/1050/1400/1800; stage-ups at Lv 3 and
  Lv 7) is **provisional** — finalized in M4.5/3 against the real gear catalog
  volume and the ~175 XP/week baseline earn rate.

## Deferred (backlog, not sessions)

- **Scenes** (backdrop gear category) — same pipeline, later content drop.
- **Parent-gated custom gear generation** — designed-for in ADR 062; needs its
  own design session when picked up.
- **Cross-page reactions** (critter appears outside its widget) — v2 at most.

## Done when

A kid hatches a critter, earns XP, gets the milestone notification, picks one of
three items, sees it on their critter on their own dashboard — and a sibling
notices it on the family flock strip.
