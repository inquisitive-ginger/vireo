# Roadmap

> Milestones are delivered as MVPs — the minimum to make the feature
> genuinely useful to the family. Subsequent versions are added to the
> roadmap as earlier milestones complete and needs become clearer.

## Active Milestone
**M1 — Platform Shell** · Not Started

## Completed
**M0 — Foundation** · ✅ Done (2026-06-01)

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
- XP + gamification basics (chore completion awards XP only — F$ earning from chores is wired in M6 when the finance module exists)
- Parent notification on completion

**Done when:** A kid completes a chore and a parent sees it happen.

---

### M3 — Calendar
- Family calendar view on tablet
- Event creation from mobile
- Activity tracking

**Done when:** Family stops using a separate calendar for day-to-day scheduling.

---

### M4 — Smart Home
- Home Assistant integration
- At least one working routine trigger
- Room context basics

**Done when:** One routine (e.g. bedtime) runs end-to-end via the system.

---

### M5 — School
Scope defined in product session. At minimum: homework tracking,
assignment due dates, school events surfaced into the family calendar (depends on M3 Calendar).

**Done when:** A kid's homework and due dates are tracked in the system
and school events appear on the family calendar.

---

### M6 — Finance
- F$ earning and balance tracking (chore completions from M2 now credit F$)
- Cashout flow with parent approval
- Monarch sync
- In-app reward redemption

**Done when:** Allowance is tracked entirely in the system and shows
up in Monarch.

---

### M7 — Meals
Scope defined in product session. At minimum: meal planning, grocery
lists, recipe bank.

**Done when:** Family plans the week's meals and generates a grocery
list without leaving the system.

---

### M8 — Marketplace
- Plugin API opened and documented
- Plugin registry
- One community plugin installable end-to-end

**Done when:** Someone outside the family can build and install a plugin.

---

## Future Milestones
_Added here as MVP milestones complete and v2 needs emerge._

- **Family Feed v2** — activity feed aggregation (chore completions, calendar events, F$ milestones surfaced as feed items via event subscriptions); richer post types; reactions. Scoped once M2–M6 modules have shipped and the feed has real events to aggregate.

---

## Completed Milestones

### M0 — Foundation · ✅ Done (2026-06-01)
The platform everything else runs on. No user-facing features yet.
- Platform shell + plugin system
- Family profiles + tier model
- Event bus
- Base tablet layout (one surface)

**Done when:** A plugin can be installed and rendered on the tablet. ✅
