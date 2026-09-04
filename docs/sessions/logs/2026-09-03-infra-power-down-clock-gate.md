# 2026-09-03 — Infra: planned power-down, and the cold-boot clock gate

**Type:** infra (ad-hoc, no kickoff) · **Trigger:** office cable management — the
Pi had to be unplugged and come back on its own.

## What was done

Backed up (`familyos-backup.service` by hand → restic snapshot `b41e234f`,
2.477 MiB, verified against the R2 repo), stopped the Actions runner, and halted
with `sudo shutdown -h now`. Deliberately **no** `docker compose stop`/`down`:
every service is `restart: unless-stopped`, and a compose stop sets the
manually-stopped flag that would have kept the stack down through the next boot.

On power-up the app restored itself with no intervention — all three containers
back, `/mnt/data` mounted rw, no ext4 or I/O errors, `vireohome.app` 200 in 0.13s,
watchdog ticking healthy. The SSD re-enumerated at **5000M** and reads
**331 MB/s**, so the cabling survived the reshuffle (cf. the August 8 MB/s cable).

## What was wrong

**The runner did not come back, and would have failed silently.** It started at
boot, connected, and got `Failed to create a session. The runner registration has
been deleted from the server, please re-configure` — then exited
`no retry needed`. Auto-deploy was broken: a merge to main would have built images
and queued the deploy job forever.

The registration was innocent — the GitHub API still listed `vireo-pi` as plain
`offline`, and a bare `systemctl start` two hours later brought it back `online`
with no re-registration. **The cause was the clock.** No battery-backed RTC means
a cold boot starts on `fake-hwclock`'s stale time; after a 2h outage the Pi came
up believing it was still the minute it halted, and the runner authenticated
inside that ~2h skew before NTP corrected it. Same skew explains `docker compose
ps` claiming `Up 2 hours` on a box ten minutes into its boot — `StartedAt` was
stamped pre-jump. Cosmetic for Docker and Postgres; fatal for the runner.

## What was fixed

Gated the runner unit on the clock — it shipped waiting only on
`network-online.target`:

- `/etc/systemd/system/actions.runner.*.service.d/wait-for-time-sync.conf` with
  `Wants=`/`After=time-sync.target`
- `systemctl enable systemd-time-wait-sync.service` — **both halves matter**;
  without the service the target is reached instantly and the gate does nothing.

Hand-installed on the Pi only, like the watchdog script and the compose file.
Recorded in `deployment.md` E3 (the failure mode + the drop-in) and Part F (the
planned power-down procedure).

## Worth knowing next time

- **Every power cut has this shape.** After any outage, planned or not, check the
  runner explicitly — the app going green says nothing about it.
- **The dead-man cannot be paused from the Pi.** No management API key there, and
  `POST <ping-url>/pause` answers `400 invalid url format`. Pausing is a click in
  the Healthchecks web UI; a paused check resumes on the next healthy ping.
- Untested until the next real cold boot: the drop-in was verified by
  `systemctl show` (`After=time-sync.target` present), not by a power cycle.
