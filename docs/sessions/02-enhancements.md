# Session 02 — Enhancements

Type: build · Approver: Zach · Status: in progress · Started: 2026-11-14 14:37 · Ended: —

## Goal

A script holding only a maintainer token moves a bug report's status, so `/triage` and `/lock-in` flip reports (and the reporter hears "Fixed and live") without a PIN login; ADR 074 records Home's bottom-inset override.

## Inputs

F-008, F-004; D-075, D-076; D-046 (ADR 046: report lifecycle, only `deployed` notifies); D-074. `docs/fix-it-playbook.md`. Assumed: the token is a fixed env var (`MAINTAINER_TOKEN` on the Pi, `VIREO_MAINTAINER_TOKEN` in Zach's shell), not a stored, rotatable credential; the script finds the report from the `Report id` line every `auto-bug` issue body already carries; kit statuses map `triaged`/`fixing` as is, `shipped` → `deployed`, `wontfix` → `wont_fix`.

## Implements

D-075, D-076.

## Deliverable

Branch `session-02-enhancements` as a PR: the token on `PATCH /bug-reports/:id`, `scripts/report-status.sh` wired as `issues.onStatus`, ADR 074's added line. Acceptance board: https://claude.ai/artifact/CT4Kk8KjrQRewiNi45eKeT (source `docs/artifacts/02-enhancements.html`), linking the branch diff; no UI changes, so no walkthrough. The live check runs at lock-in: after merge and the deploy check, `scripts/report-status.sh` re-sets an open report's current status against prod (no notification).

## Options

—

## Exit criteria

Every check passes, `pnpm test` green, PR merged and `scripts/deploy-check.sh` passing. At lock-in: `.claude/process.json` (`issues.onStatus`), `docs/fix-it-playbook.md`, `docs/deployment.md`, ADR 074, the two Enhancements lines.

## Outcome

Round 1, 2026-11-14 · Sent 2026-11-14 14:44
