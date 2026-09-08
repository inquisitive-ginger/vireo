# Roadmap

> Milestones are delivered as MVPs — the minimum to make the feature
> genuinely useful to the family. Subsequent versions are added to the
> roadmap as earlier milestones complete and needs become clearer.

> **Renumbered 2026-07-21.** M4–M8 were reordered to bring the reward economy and
> meals forward. **Old → new:** Smart Home M4→M6 · School M5→M7 · Finance M6→**split**
> (rewards → M4, allowance/cashout/Monarch → M8) · Meals M7→M5 · Marketplace M8→M9.
> Every milestone that moved was unstarted, so no shipped work is affected — but a
> session log or spec written before this date may name the old number. This file is
> authoritative.

## Active Milestone

**M4.5 — Companion** — direction settled 2026-08-07 (ADRs 061/062; grew out of
M4/9 when the XP sink outgrew a single session). Sessions 1–2 (style bible +
duotone proof; gear taxonomy + asset library) shipped 2026-08-07/08; **M4.5/3
Feature UX is next**, then dev foundation and surfaces. See
`docs/modules/companion/spec.md`.

**Also in flight: M5.5 — Shopping** — five stories plus the polish shipped
2026-09-03/04 (ADR 069–074); **M5.5/6 offline is the last one**. See
`docs/modules/shopping/spec.md`.

## Completed

**M0 — Foundation** · ✅ Done (2026-06-01)
**M1 — Platform Shell** · ✅ Done (2026-06-15)
**M2 — Chores** · ✅ Done (2026-06-20)
**M3 — Calendar** · ✅ Done (2026-07-19)
**M4 — Rewards & Wallet** · ✅ Done (2026-07-26, live in prod PR #75) — the XP sink split out as M4.5
**M5 — Meals** · ✅ Done (2026-09-07) — try bites recycled unbuilt; the `try_bite` field ships

---

## Current Roadmap (MVP Pass)

### M0 — Foundation

The platform everything else runs on. No user-facing features yet.

- Platform shell + plugin system
- Family profiles + tier model
- Event bus
- Base tablet layout (one surface)

**Done when:** A plugin can be installed and rendered on the tablet.

---

### M1 — Platform Shell

The system is ready for a real family. Infrastructure and the home surface come online;
the first module anchors the home screen.

- Family onboarding (profile creation, family PIN setup — prerequisite for family handoff)
- Profile management (create/edit profiles, avatar, tier, permission overrides, family PIN reset)
- Home Surface: widget grid live; default layout defined with reserved slots for core modules; uninstalled core module slots render a placeholder state
- Family Feed (MVP): family text posts visible as a home screen widget — anchors the family dashboard; enrichment deferred to a dedicated later milestone
- Minimum mobile: installable PWA + Web Push notifications (mobile layout/nav deferred to a dedicated design session)

**Done when:** A family can set up the system, see a meaningful home screen, and post to a shared feed.

---

### M2 — Chores

- Task creation and assignment
- Completion flow (kid marks done)
- XP + gamification basics (chore completion awards XP only — P-Bucks earning from chores is wired in M4 when the rewards module exists)
- Parent notification on completion

**Done when:** A kid completes a chore and a parent sees it happen.

---

### M3 — Calendar

- Family calendar view on tablet
- Event creation from mobile
- Activity tracking

**Done when:** Family stops using a separate calendar for day-to-day scheduling.

---

### M4 — Rewards & Wallet

The sink for everything the family earns. Chores have minted XP since M2 with nothing
to spend it on; this is the second half of the loop. Currency model is already settled
by **ADR 002** (XP never converts; P-Bucks is the redeemable wallet) and **ADR 005** (a
ledger, never a bank) — not reopened here.

- P-Bucks ledger + derived balance (**ADR 047** — append-only, balance is a cache)
- Priced at **~10 P-Bucks a week** (**ADR 052**); chores opt in to paying, `coinReward` default 0
- **P-Bucks takes the coin; XP demotes to a quiet star** (**ADR 051**) — re-strikes the M2 XP surfaces
- Chores earn: `coinReward` on the task, credited off the event bus (**ADR 048**)
- Reward catalog with a per-reward approval flag; redemption + refund-on-decline
- Store surface + wallet widget (lead with affordability, not the number)
- Punch cards (**ADR 049**) — a fixed-goal counter with a payout, kid-punched
- Parent bonus grant

**Explicitly not here:** allowance schedules, cashout to real money, Monarch — those
are M8. The wallet is built so cashout is another **sink**, not a second balance.

**Done when:** A kid completes a chore, watches their P-Bucks balance go up, and spends it
on something they chose.

_Spec: `docs/modules/rewards/spec.md`_

---

### M4.5 — Companion

> Grew out of M4/9 (the XP sink ADR 056 deferred) at the 2026-08-07 direction
> session — milestone-scale, numbered fractionally so M5–M9 keep their numbers.

The XP sink: a per-kid critter hatched once, grown by XP earned since hatch,
dressed by 1-of-3 picks at milestones. **P$ buys things; XP grows something**
(**ADR 061**). Art is a build-time generated, human-curated library — duotone-
mapped to the kid's identity hue at runtime, no generation API in the kid loop
(**ADR 062**).

Five sessions, sequenced: style bible + duotone proof → gear taxonomy + asset
library → feature UX → dev foundation → dev surfaces.

**Done when:** A kid hatches a critter, hits a milestone, picks one of three
items, and a sibling notices it on the family flock strip.

_Overview + session plan: `docs/modules/companion/spec.md`_

---

### M5 — Meals

Two jobs that turn out to be one module: **nobody gets ambushed by dinner**, and
**somebody has dinner**. Groceries was a third and turned out not to belong —
**split out to M5.5 on 2026-09-03 (ADR 069)**.

- Week plan + **Tonight's Dinner** widget — readable from the door, no tap
- **Who's got dinner** — owner + kind (cooked/takeout/leftovers/out); **unclaimed is a
  first-class state**, and at 4pm on a Thursday it is the most valuable one
- Calendar presence as a **day mark**, not an event (**ADR 050**) — a small platform
  story shared with M7 School
- **Try bites** — a free-text field on the planned meal, surfaced on the widget and the
  week page. The queued punch-card half was **recycled unbuilt 2026-09-07**
- ~~**Grocery list**~~ — moved to **M5.5 — Shopping** (ADR 069)

**Deferred deliberately:** the recipe bank. A free-text `needs` field on the planned
meal pushes to `shopping` and removes the reason to build ingredient parsing.

**Done when:** Nobody has to ask what's for dinner or who's making it. ✅

_Spec: `docs/modules/meals/spec.md`_

---

### M5.5 — Shopping

> Split out of M5 at the 2026-09-03 product session (**ADR 069**), numbered
> fractionally so M6–M9 keep their numbers — the same move M4.5 made.

The shared list you actually shop from, as its own plugin with its own nav entry.
It replaces a Google Keep list the family already keeps, which is the bar: slower
than Keep means unused.

- **Lists are rows, not columns** — a list carries its producer; permanent lists
  persist, runtime lists live while they hold items
- **Capture** in one gesture from anywhere in the house
- **Filing** — items sort into walk order _inside one list_; unknown words land in
  Other and a correction teaches a family-wide override
- **Shop mode** — one-handed, moving, and **offline** (the SW is network-first for
  `/api`, so offline is its own reviewable chunk)
- **Meals is a producer, not an owner** — the `needs` push crosses a contract
  (ADR 050's provider pattern), not a shared table

**Why it split:** ADR 032 gives one nav entry per plugin, so a top-level
destination _is_ a plugin — groceries could not be first-class while living inside
meals. Four of the six models in the `meals` schema were already grocery models,
`/groceries/*` was already a top-level route, and the only real coupling was one
push function.

**Done when:** The family shops off this list instead of Keep, including with no
signal in the store.

_Overview + session plan: `docs/modules/shopping/spec.md`_

---

### M6 — Smart Home

- Home Assistant integration
- At least one working routine trigger
- Room context basics

**Done when:** One routine (e.g. bedtime) runs end-to-end via the system.

---

### M7 — School

Scope defined in product session. At minimum: homework tracking,
assignment due dates, school events surfaced into the family calendar (depends on M3 Calendar).

Day-level facts — no school Monday, half day, teacher inservice — are **day marks**
(ADR 050), reusing the provider built in M5, not events.

**Done when:** A kid's homework and due dates are tracked in the system
and school events appear on the family calendar.

---

### M8 — Finance

The half of the old M6 that touches real money. Reward redemption already shipped in M4.

- Allowance schedules and recurring income
- Cashout flow with parent approval (**ADR 005** — the system never moves money)
- Monarch sync

**Done when:** Allowance is tracked entirely in the system and shows
up in Monarch.

---

### M9 — Marketplace

- Plugin API opened and documented
- Plugin registry
- One community plugin installable end-to-end

**Done when:** Someone outside the family can build and install a plugin.

---

## Future Milestones

_Added here as MVP milestones complete and v2 needs emerge._

- **Family Feed v2** — activity feed aggregation (chore completions, calendar events, P-Bucks milestones surfaced as feed items via event subscriptions); richer post types; reactions. Scoped once M2–M5 modules have shipped and the feed has real events to aggregate.
- **Meals v2** — recipe bank, meal history ("we had this three days ago"), pantry/leftovers, grocery spend → Monarch (depends on M8).

---

## Completed Milestones

### M2 — Chores · ✅ Done (2026-06-20)

The first feature module. Parents assign chores; kids complete them and earn XP;
parents are notified.

- Task creation and assignment (tier-4 creates; one assignee; one-shot) + ad-hoc edit/remove
- Completion flow (kid marks done; XP flight; tier-4 admin check-off + reopen)
- XP + gamification basics (running-total XP balance; lifetime score plate)
- Parent notification on completion (shared server `notify()` → tray + Web Push)
- `chores.today-summary` widget (taskee + family framings) + Focus Mode taskee variant (ADR 036)

**Done when:** A kid completes a chore and a parent sees it happen. ✅

> Shipped beyond MVP scope: ad-hoc Task Editing and per-profile Focus Mode (ADR 036).
> Plugin renamed `chore-engine → chores` mid-milestone (#24).

### M1 — Platform Shell · ✅ Done (2026-06-15)

The system is ready for a real family. Infrastructure and the home surface came online;
the first module anchors the home screen.

- Family onboarding (profile creation, family PIN setup)
- Profile management (create/edit profiles, avatar, tier, permission overrides, family PIN reset)
- Home Surface: widget grid live; default layouts with reserved core-module slots; placeholder + error slot states
- Family Feed (MVP): family text posts as a home screen widget
- Minimum mobile: installable PWA + Web Push; mobile surface (bottom tab bar + brand top bar)

**Done when:** A family can set up the system, see a meaningful home screen, and post to a shared feed. ✅

> Two M1-scoped sessions (Family Profile Notifications, Push Multi-Profile Device) were
> deferred as Platform v2 extras and then **recycled unbuilt 2026-09-07**.

### M0 — Foundation · ✅ Done (2026-06-01)

The platform everything else runs on. No user-facing features yet.

- Platform shell + plugin system
- Family profiles + tier model
- Event bus
- Base tablet layout (one surface)

**Done when:** A plugin can be installed and rendered on the tablet. ✅
