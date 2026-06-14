# Kickoff — Design+Dev: Family Profile Notifications

**Type:** Design + Development (two-phase)
**Branch:** `dev/family-profile-notifications`
**Story spec:** `docs/modules/platform/stories/family-profile-notifications.md`
**Origin:** notification-design-audit (2026-06-07) — shared-device surface deferred as explicit open question

---

## Pre-session reads

- [ ] `CLAUDE.md`
- [ ] `docs/modules/platform/stories/family-profile-notifications.md` — full read, all open questions
- [ ] `docs/sessions/logs/2026-06-07-design-notification-design-audit.md`
- [ ] `docs/design-system.md` — Surfaces, Elevation, Motion/Animation (understand what's already settled)
- [ ] ADR 003 (tier model — tier 1 is family profile)
- [ ] ADR 029 (`platform.notify()` contract — the amendment target)
- [ ] `apps/shell/src/pages/Home.tsx` — how the home surface currently renders; where a family notification strip could live

## Session scope

Design and implement a notification surface for the tier 1 (family) profile — always-on shared devices — that displays family-wide events without exposing per-user notification content.

## Surfaces in scope

Tablet (primary). Design must be statable in a way mobile can inherit later.

## Constraints coming in

- **ADR 003** — tier 1 is the family profile; it has no authenticated session and no personal notification tray (that's tier 2+). Don't collapse these.
- **ADR 029** — `platform.notify()` is the single entry point; any new broadcast model must extend this contract, not bypass it. If we add `audience: 'family'`, that's an amendment to ADR 029 — write it.
- **Elevation** — if a notification strip is a fixed chrome element, it must use `--card` + `--shadow-raised` (the settled surface model).
- **Motion** — no new easing or duration tokens; use the settled motion tokens.
- **Legibility at distance** — the family profile is often viewed from across the room. Sizes need to account for this.

## Phase 1: Design (close first)

Answer each open question before moving to implementation:

### 1. What notifications appear?

Options:

- **A. Explicit audience flag** — `platform.notify({ audience: 'family', ... })` marks which events are family-visible. Module authors opt in. Clean separation; requires modules to tag events.
- **B. Category whitelist** — certain notification categories (announcements, chore completions, calendar events) are always family-visible. Simpler for module authors but rigid.
- **C. Broadcast-only separate channel** — family profile never touches `platform.notify()`; a separate `platform.announce()` for broadcast content. Cleaner API but adds surface area.

Recommendation: **A** — audience flag on `platform.notify()`. Lowest coupling, most predictable for future plugins.

### 2. What is the surface shape?

Options:

- **A. Ambient ticker strip** — fixed bottom bar on the home screen; auto-scrolls recent family-visible events. Across-the-room readable. Auto-expires (no interaction needed).
- **B. Prominent card stack** — family notification cards in the widget grid, like a feed widget but read-only. Dismissed by anyone. More interactive.
- **C. Floating badge** — notification badge in the family profile chip; tapping reveals a modal. Minimal footprint but hidden until tapped.

Recommendation: **A** — ambient ticker strip. Consistent with "across the room" legibility; no interaction required; fits the passive display use case (kitchen tablet). Build an exploration (Frame A = ticker, Frame B = card in grid) to verify.

### 3. Persistence model

- **Session-only (in-memory):** Simplest. Lost on page reload. Appropriate if these are truly ambient and ephemeral.
- **DB-persisted (`family_notifications` table):** Survives reload. Necessary if "the last 3 announcements" should persist across device reboots.

Recommendation: DB-persisted with a short TTL (e.g., 24h auto-prune). A kitchen tablet reboots; losing the feed on every refresh would be surprising.

### 4. Legibility

- Font size: minimum `text-lg` (18px), likely `text-xl`
- Icons: 24px minimum for across-the-room visibility
- Contrast: use `--foreground` on `--card` (not `--muted-foreground`)

### 5. Dismissal

Ambient: auto-expires after TTL, no active dismissal needed. If a family member wants to clear early — allow it (any tier 1+ session can dismiss a family notification).

## Phase 2: Development (after design decisions are locked)

- Amend ADR 029: document `audience` field on `NotifyPayload`
- Schema: `family_notifications` table (id, title, body, variant, createdAt, expiresAt)
- API: `GET /api/notifications/family` (recent family-visible, respects TTL); pruning hook on `POST /notifications` when `audience === 'family'`
- Component: `FamilyNotificationStrip` in `packages/ui` — horizontal ticker of family-visible events; uses `--card` + `--shadow-raised`, `text-lg` minimum
- Shell: render `FamilyNotificationStrip` at the bottom of the home page layout when the active profile is tier 1
- Tests: route tests for the family notifications endpoint; RTL test for the strip component

---

## Outputs (required before closing)

**Design phase:**

- [ ] All 5 open questions answered with a recorded decision
- [ ] UX exploration (Frame A vs. B) built as Storybook story; selected frame noted in session log
- [ ] `docs/design-system.md` updated (family notification surface spec)
- [ ] ADR 029 amended (audience field)

**Dev phase:**

- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes
- [ ] `FamilyNotificationStrip` Storybook story present
- [ ] Story status → ✅ Done in `docs/modules/platform/progress.md` and story spec
- [ ] Session log committed to `docs/sessions/logs/YYYY-MM-DD-design-family-profile-notifications.md`
- [ ] `CLAUDE.md` current status updated
- [ ] `docs/sessions/queue.md` updated

## Session log format

```
## Design decisions made (one per open question)
## UX frame chosen and rationale
## What was built
## ADRs amended or created
## Open questions raised
## What the next session needs to know
```
