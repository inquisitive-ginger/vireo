# Session Log — M2 Dev: Focus Mode (taskee Focus view + per-profile setting)

**Date:** 2026-06-20
**Type:** Development (+ ADR 036; UX design gate)
**Branch:** `dev/chores-focus-mode`
**Origin:** Deferred from M2 Task Model + Creation; queued at the user's request
during the Completion Flow live review (2026-06-17). The last queued M2 enhancement.

---

## What was decided

### Design gate — Focus page treatment (UX exploration → AskUserQuestion)

Built a transient Storybook exploration (`Chores Playground/Focus View
Exploration`) rendering three candidate Focus-page treatments, then gated via
ASCII previews:

- **A · Spotlight (chosen)** — bold hero "Next up" card; "Coming up"/"Done"
  collapse to disclosure rows. The most single-focus reading; the spec-faithful
  default (design §1 "collapse to quiet mini-rows").
- B · Next-up + peek — calmer hero, next 2 always visible as quiet rows.
- C · On-deck stack — remaining pending as a stepped, dimming card stack.

The playground graduated to the real `FocusView` and was deleted (playground
convention).

### Default-from-tier threshold

**Tiers 1–2 default to Focus on; tiers 3–4 → Agency.** A parent overrides per
profile either way. (`resolveFocusMode = focusMode ?? tier <= 2`.)

### Storage — ADR 036

The `focusMode` setting lives as a **nullable `Boolean` column on the platform
`Profile` model** (`focus_mode`), mirroring `darkMode`: `null` = derive from tier,
`true`/`false` = parent override. A `null` setting auto-re-derives on tier change;
no generic settings table for one boolean. See `docs/decisions/036-focus-mode-setting.md`.

---

## What was built

**Platform / API**

- `Profile.focusMode Boolean?` migration (`20260620120000_add_focus_mode`).
- Shared `resolveFocusMode(focusMode, tier)` helper in `@family-os/platform`
  (exported for both server and client).
- `/auth/me` returns the **effective** `focusMode`; `AuthUser`/`useAuth` expose it.
- `GET /profiles` returns the **raw** nullable value (so the override UI can show
  "Default" vs explicit); `PATCH /profiles/:id` accepts `focusMode` via
  `UpdateProfileSchema`.

**Shell**

- "Chores view" tri-state control (Default / Focus / Agency) in the Settings
  profile-edit drawer's Role & Capabilities section — autosaves, invalidates
  `api/profiles` + `api/auth/me`. "Default" hint shows the tier resolution.

**Chores plugin**

- Extracted **`useXpFlight`** hook from `TaskeeView` (lifetime score, optimistic
  `pending → inFlight → done+banked` state machine, airborne chips, reduced-motion
  / off-screen-plate quiet-bank). `TaskeeView` refactored onto it.
- **`FocusView`** (Candidate A · Spotlight): hero "Next up" card (XP chip is the
  flight launch point) + big green **Mark done**, collapsed "Coming up"/"Done"
  disclosure rows, "🎉 All done today" empty. Hero promotes the next task on
  landing. `ChoresPageView` branches taskee → Focus vs Agency on `focusMode`;
  `ChoresPage` reads it from `useAuth`.
- Widget **Focus** branch in `TodaySummaryView` (single hero "Next up" row +
  "+N more" + progress) across compact/standard/large, reusing the existing
  `cw-*` container-query slots; `TodaySummary` container reads `focusMode`.
- Stories: `Chores/Chores Page · Taskee — Focus view` and `Chores/Today Widget ·
Focus —` (compact/standard/large/all-done).

**Tests:** +4 API tests (effective `focusMode` by tier in `/auth/me`; set/clear
override in `PATCH /profiles/:id`) → **176 API tests** pass. typecheck (9/9),
lint, build (5/5) green. Live-reviewed in the real shell and signed off (Focus
page + Mark-done flight + widget + the Settings toggle; padding nit on the
"Chores view" control fixed during review).

---

## Incident — dev data wiped by a mis-targeted test run (resolved)

On the **first** API test run I explicitly set `DATABASE_URL=…/familyos` (the dev
DB) instead of letting it default to `familyos_test`. The suite's `beforeEach`
cleanup truncated dev tables before aborting on a FK constraint, wiping
`widget_layouts`, `permission_overrides`, `notifications`, and the
`default_layout_*` / `family_name` / `family_pin_hash` `system_config` keys.
**Profiles survived** (the delete aborted before reaching them).

Recovery: restored the `default_layout_*` keys from the seed (home re-seeds
per-profile defaults on load) and the family PIN (user-provided, verified live).
**Unrecoverable:** custom widget arrangements, custom permission overrides, the
old family name (user re-set in Settings).

**Guard added** (`apps/api/src/test.setup.ts`): the suite now **refuses to run**
unless `DATABASE_URL`'s database name ends in `_test`, throwing in setup before
any `beforeEach` can truncate. Verified it blocks the dev DB and still allows
`familyos_test`.

---

## Open questions / follow-ups

- **Custom layouts/overrides** lost in the incident are unrecoverable from this
  side; the user can rebuild as needed.
- **`family_name`** was re-set by the user during review.
- A second per-profile module preference would justify consolidating `darkMode` +
  `focusMode` into a generic settings store (ADR 036 "do not revisit unless").
- Seeded review tasks for **Teddy** were left in the dev DB (harmless sample data).

## What the next session needs to know

M2 Chores is **fully done** — Focus Mode was the last queued enhancement. Agency
and Focus taskee variants both ship and share the `useXpFlight` engine. The
per-profile `focusMode` pattern (nullable override + tier default + shared
resolver) is the template if another module wants a per-profile variant toggle.
