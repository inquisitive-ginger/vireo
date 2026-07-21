# Story — In-situ Bug Reporting

**Status:** ✅ Done (2026-07-21) · **ADR:** [046](../../../decisions/046-in-situ-bug-reporting.md)
· **Log:** [2026-07-21](../../../sessions/logs/2026-07-21-design-dev-bug-reporting.md)
· **PRs:** #47, #49

---

## The problem

The app is live on the fridge iPad. The people using it are not the person who
can fix it, and a verbal report loses the route, the build, and the console —
everything that makes a bug reproducible. The reporter also never learns whether
anything came of it, which is how a household stops reporting.

## What it does

A **Report a problem** surface in the notification tray footer. One free-text
field; the app attaches the route, build hash, profile, viewport, user agent, and
the last ten errors on its own. The report opens a labelled `auto-bug` GitHub
issue (best-effort) and the reporter watches it move **Reported → Logged → Being
fixed → Fixed — live**, with a notification when it ships.

## Acceptance criteria

1. ✅ Any profile, **any tier**, can open the drawer from any screen and submit.
2. ✅ The report carries route, profile, build hash, viewport, UA, and recent
   console errors without the user typing them.
3. ✅ It persists to `platform.bug_reports` with status `new`.
4. ✅ With a token configured a labelled issue opens and its number is stored;
   without one the report still saves.
5. ✅ A reporter sees their own reports and each one's status.
6. ✅ Tier 4 sees all reports on a triage board, spine-coded by reporter, and can
   move a status.
7. ✅ Moving to `deployed` notifies the reporter (tier 2+).
8. ✅ Tier 1 can report and see status, and is never sent a notification.

## Notes

- The tray is tier-2+ chrome, so below tier 2 the report control **takes the
  bell's slot** rather than adding a second affordance.
- `reporterId` carries **no foreign key** — the household pseudo-profile has no
  `profiles` row on production and is the default profile. See the ADR.

## Deferred

- **Screenshot capture** — the strongest signal for visual bugs; needs a client
  capture dependency plus image storage and magic-byte validation.
- **An autonomous fix agent** — the GitHub Action upgrade path is documented in
  [`docs/fix-it-playbook.md`](../../../fix-it-playbook.md). Adopt PR-only first.
