# Session Log — Login / Profile-Switch UX Design

**Date:** 2026-05-29
**Type:** Design
**Story:** Login / Profile-Switch UX (pre-requisite for auth-and-profiles)

---

## What was decided

### 1. Entry point model

Two entry points, same underlying component:

- **Corner chip** — persistent in the shell header, shows current active profile (avatar + name), tap opens profile grid overlay
- **Inactivity** — idle timeout deactivates personal profile and returns to family dashboard; no lock screen

### 2. Profile selection UI

Centered avatar grid. Circular avatars with name below. Large tap targets (80px avatar minimum). Current active profile highlighted, non-interactive. Family pseudo-profile not shown in the grid. Same component with `mode: 'fullscreen' | 'overlay'`.

### 3. PIN entry

Single global family PIN — not per-profile. Large circular digit buttons, 4-digit, dot progress indicator. Copy: "Enter family PIN." Any tier-4 profile can set or reset it. Blocked upward switching returns 423 if no PIN has been set.

### 4. Unattended state — Family Dashboard

The tablet's default unattended state is a **family dashboard** (pseudo-profile), not a lock screen. A `family` pseudo-profile (tier 1, all writes removed via CASL) is permanently seeded. The tablet shows shared content — upcoming events, chore leaderboard, shared goals — at all times.

**Contextual auth:** Write actions on the family dashboard intercept the tap and surface the profile picker inline. The family pseudo-profile has no write permissions; CASL enforces this naturally. No special null-auth code path needed.

### Schema change

`pin_hash` removed from `platform.profiles`. New `platform.system_config` table holds the family PIN hash. This amends ADR 017.

---

## What was produced

- **ADR 021** — global family PIN + family pseudo-profile (`docs/decisions/021-global-pin-family-pseudo-profile.md`)
- **ADR 017 amended** — status updated to reference ADR 021
- **`docs/design-system.md`** — new "Login / Profile Switch" section added
- **`docs/modules/platform/stories/auth-and-profiles.md`** — schema, seed data, and ACs updated for global PIN and family pseudo-profile

---

## Open questions raised

- **Family dashboard content per module** — which specific widgets/actions each module exposes on the family dashboard is not defined here. Each module story owns this. The rule: tier-1-visible content renders; write actions trigger contextual auth.
- **Inactivity timeout duration** — not specified. Likely a configurable system setting; deferred to a settings/admin story.
- **"Stay as [Name]?" prompt** — after a contextual auth action completes, does the tablet stay on the selected profile or return to family dashboard? Not resolved. Probably configurable or context-dependent.
- **First-run PIN setup flow** — what the tier-4 onboarding experience looks like when no family PIN exists yet. Deferred to auth-and-profiles implementation.

---

## What the next session needs to know

- **Widget Composition Design** is next in queue. The corner chip is a persistent shell element — the widget composition session should account for it when designing the header/nav layout.
- The family dashboard is the home surface in the unattended state. Its content slots will be defined module-by-module, but the Widget Composition session should treat it as a real surface alongside the personal home view.
- Auth-and-profiles story is now unblocked for implementation. The story spec has been updated to reflect the global PIN model.
