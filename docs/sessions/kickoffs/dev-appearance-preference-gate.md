# Kickoff — Dev: Appearance Preference Gate

**Type:** Development
**Branch:** `dev/appearance-preference-gate`
**Story spec:** `docs/modules/platform/stories/appearance-preference-gate.md`
**Origin:** 2026-06-09 audit (deferred gap from settings-permissions session)

---

## Pre-session reads

- [ ] `CLAUDE.md`
- [ ] `docs/modules/platform/stories/appearance-preference-gate.md`
- [ ] `docs/modules/platform/progress.md`
- [ ] `packages/platform/src/types.ts` — `PERMISSION_REGISTRY` (line 51) and `PermissionString` type
- [ ] `apps/shell/src/pages/Settings.tsx` — dark mode section (around line 745)

No ADR reads required — permission model settled in ADR 018 (CASL) and PermissionGate pattern established in settings-permissions session.

## Session scope

Add `platform.preferences.appearance` to `PERMISSION_REGISTRY` and wrap the dark mode toggle in Settings with `PermissionGate` so parents can revoke appearance control per-profile.

## Story: `platform/appearance-preference-gate`

**Acceptance criteria:**

1. `platform.preferences.appearance` exists in `PERMISSION_REGISTRY` with a label and correct `module`, `action`, `subject` fields
2. The dark mode toggle in Settings is absent (not disabled) for any profile whose `platform.preferences.appearance` permission has been explicitly revoked
3. The toggle is present for all profiles that have not had the permission revoked (tier baseline includes it)
4. A tier 4 parent can revoke and restore the permission for a tier 2–3 profile via the permission overrides drawer; the toggle disappears/reappears on next Settings load for the affected profile

## Constraints coming in

- **ADR 018** (CASL) — permission checks go through the platform permission layer, not ad-hoc conditionals
- **permission-overrides** session established `PermissionGate` as the UI pattern; use it, don't invent a new pattern
- Toggle must be **absent**, not disabled — the `PermissionGate` component hides children when the permission is missing (confirm this is what it does before writing code)
- Scope is intentionally narrow: one registry entry + one wrapper. Don't add other preference permissions or preference-gating infrastructure this session.

## Implementation notes

- `PERMISSION_REGISTRY` is in `packages/platform/src/types.ts:51`. Add entry after `family-feed.post.create`. Follow the same shape: `label`, `module`, `action`, `subject`.
  - Suggested: `module: 'platform'`, `action: 'control'`, `subject: 'platform.Appearance'`
- The dark mode section in `Settings.tsx` is around line 745. Wrap the toggle (and its containing section, not just the input) in `PermissionGate permission="platform.preferences.appearance"`.
- Tier baseline: no code change needed — the CASL config already grants all permissions at tier baseline unless overridden. Confirm this by checking how `family-feed.post.create` is granted.

## Testing

- Unit test: `platform.preferences.appearance` appears in `PERMISSION_REGISTRY` with correct shape
- E2E test: log in as tier 3 profile with the permission revoked → dark mode toggle absent from Settings; restore → toggle present
- The permission-overrides E2E spec may be a good place to add the revoke/restore scenario

---

## Outputs (required before closing)

- [ ] All 4 ACs verified and passing
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes
- [ ] Story status → ✅ Done in `docs/modules/platform/progress.md` and story spec
- [ ] Session log committed to `docs/sessions/logs/YYYY-MM-DD-dev-appearance-preference-gate.md`
- [ ] `CLAUDE.md` current status updated
- [ ] `docs/sessions/queue.md` updated

## Session log format

```
## What was built
## Acceptance criteria status
## Decisions made
## Open questions raised
## What the next session needs to know
```
