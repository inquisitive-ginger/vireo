# Kickoff — infra: watchdog deploy-quiescence window

**Type:** infra (small) · **Urgent** — the watchdog has rebooted the Pi under
both of the last two deploys (#119 after rollout; #120 mid-`api`-recreate,
killing the runner and leaving prod down ~15 min until its own retry loop
finished the job).

## Pre-session reads

- `docs/deployment.md` Part F — watchdog spec (`vireo-watchdog.timer` 1-min
  cadence; healthy = `/mnt/data` rw + `/api/plugins` 200 via Caddy; unhealthy →
  remount + `compose up -d`, then reboot, stamped to one per 2h).
- `logs/2026-08-22-design-dev-olive-primary.md` §Deploy incident — full #120
  timeline (postgres cold start held the api health gate → probe saw the stack
  down → reboot under the in-flight deploy).
- `logs/2026-08-20-fix-auto-bug-116-118.md` §Deploy — the #119 firing.
- `.github/workflows/deploy.yml` — runs **on the Pi's own runner** in
  `/opt/family-os`, so it can write local state directly.

## Decision to make

Quiescence mechanism — leading option: **touch-file with TTL**. deploy.yml
touches `/var/lib/vireo-deploy-in-progress` before `compose pull` and removes
it after `up -d`; the watchdog treats a fresh file (< ~15 min) as "stand down
from the reboot path" (recovery `compose up -d` may stay — it is what finished
#120's rollout). TTL guards the crashed-mid-deploy case: a stale file must
never suppress recovery forever. Alternative if the touch-file feels brittle:
N consecutive unhealthy ticks (~10 min grace) before the reboot path.

## Also in scope (same root cause)

- Deploy job blew a ~10-min timeout because postgres's cold start held the
  `api` recreate — raise the job timeout and/or the postgres healthcheck
  start_period so a slow disk doesn't fail an otherwise-good deploy.
- Next clean deploy re-normalizes the api container's compose temp name from
  the #120 incident (`1aa1b727c2d6_…`) — verify it happened.

## ACs

- A trivial deploy to main completes with zero watchdog interventions
  (journal `-t vireo-watchdog` quiet throughout).
- Genuine SSD death during a deploy still reboots once the TTL lapses.
- Dead-man Healthchecks ping behavior unchanged while quiesced.
- Runbook Part F updated; watchdog script change recorded there verbatim.

## Constraints

- `/usr/local/sbin/vireo-watchdog.sh` is root-owned on the Pi; the sandbox
  classifier blocks state-changing ssh — hand the user `!` commands for the
  script install, or ship it via deploy.yml which already runs on the Pi.
- Test with a real merge to main; there is no staging.

## Outputs

- Updated `vireo-watchdog.sh` + `deploy.yml`, runbook Part F edit, session log,
  queue update, this kickoff deleted.
