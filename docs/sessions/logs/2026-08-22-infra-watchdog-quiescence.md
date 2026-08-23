# 2026-08-22 — Infra: watchdog deploy-quiescence (and the cable)

**Kickoff:** `kickoffs/infra-watchdog-quiescence.md` (deleted at closeout) ·
**PR:** #121 · **Outcome:** shipped, plus the root cause of six weeks of
instability found by accident.

## The headline: it was a USB cable

Prod's SSD had been delivering **318 kB/s on 4k reads and 8 MB/s sequential** on
a SuperSpeed link. Replacing the USB cable took the same disk, same enclosure,
same UAS quirk to **17.6 MB/s at 4k and 256 MB/s sequential** — 55× and 32×. The
old cable negotiated 5 Gbps and then couldn't carry it; every transfer was
drowning in retries.

Measured, same commands throughout (`dd … iflag=direct` on `/dev/sda`):

| block size | old cable | new cable |
| ---------- | --------- | --------- |
| 4k         | 318 kB/s  | 17.6 MB/s |
| 64k        | 542 kB/s  | 229 MB/s  |
| 1M         | 8.1 MB/s  | 256 MB/s  |

Downstream, on the same image and code:

|                               | before   | after         |
| ----------------------------- | -------- | ------------- |
| one `prisma migrate deploy`   | 25–35 s  | ~2 s          |
| api container start → serving | ~10 min  | 12 s          |
| deploy job wall-clock         | 6–11 min | **1 min 1 s** |
| postgres crash-recovery fsync | 92 s     | n/a           |

Everything the last three sessions treated as separate problems — the watchdog
firing under deploys, the 25-minute reboots, multi-second API responses, the
2026-08-20 "enclosure UAS hang" — is downstream of this one fault.

## What was actually shipped (PR #121)

- **Deploy quiescence.** `deploy.yml` touches `/opt/family-os/.deploy-in-progress`
  before `pull` and again before `up -d`, removing it in an `if: always()` step.
  The watchdog stands down entirely while that file is < 15 min old; the TTL keeps
  a runner killed mid-deploy from suppressing recovery forever.
- **The reboot needs a sustained failure.** Consecutive unhealthy ticks are counted
  in `/var/lib/vireo-watchdog-fail-count`, cleared the moment it goes healthy.
  `/dev/sda` **missing** = controller death, reboot after 3 ticks; `/dev/sda`
  **present** = probably just slow, hold for 30. `compose up -d` runs on the first
  unhealthy tick only.
- **`start_period: 180s`** on the postgres healthcheck.
- **`scripts/vireo-watchdog.sh`** is now the repo's source of truth. Nothing deploys
  it — hand-install per runbook Part F. Same for `docker-compose.prod.yml`; the Pi's
  copy is hand-synced and the deploy job only rewrites `TAG=` in `.env`.

Logic verified before shipping against a stubbed harness covering all nine branches
(fresh/stale deploy flag, disk gone vs present, both thresholds, reboot suppression,
recovery-clears-count). Then verified live: the merge deploy finished in **1m01s**
with the watchdog journal **completely silent**, the flag created and removed, and
`family-os-api-1` back to its proper name (clearing #120's `1aa1b727c2d6_` orphan).

The new script also proved itself unplanned: during the cable swap, with `/mnt/data`
unmounted, it made **one** recovery attempt and logged `recovered without reboot`.
The old script would have rebooted the Pi there.

## Wrong turns, recorded so they aren't repeated

- **The kickoff's premises were both wrong.** No 10-minute job timeout exists — the
  #120 job ran 10m20s and GitHub marked it "canceled" when the reboot killed the
  runner. And it was the api recreate, not a postgres cold start, that held the
  health gate.
- **I blamed the UAS quirk for the slowness and was wrong.** The claim rested on
  deploy wall-clock (250–340 s before 2026-08-14, 550/686 s after), but that break
  point is the **2026-08-16 Pi 5 migration**, four days before the quirk. Removing
  the quirk and re-measuring showed no improvement — the disk was erratic either
  way, swinging 3–7× between identical runs. That variance was the real tell: a
  driver-mode difference is reproducible, a bad cable is not.
- **Bus number is not physical port.** A drive enumerating on a 480M bus while in a
  blue port means the cable lacks working SuperSpeed conductors — `lsusb -t` shows
  the 5000M side of the _same controller_ sitting empty. Diagnosed as "wrong port"
  first; the user's "could it be the cable?" was correct.
- **The api's 6× sequential `prisma migrate deploy` + runtime `tsx` was proposed as
  a build refactor and dropped.** The mechanism was right (tens of thousands of
  small-file reads) but the fix was the cable. At 2 s per migration step there is
  nothing left to optimise. The Dockerfile's "no compile step" rationale stands.

## Open

- **`fsck -fy` after the swap: clean, exit 0, zero repairs**, despite lost async
  page writes logged during the bad-cable unmount. Nothing to chase.
- **NVMe HAT is no longer urgent** — the USB path now does 256 MB/s. It stays queued
  as an upgrade, not a rescue.
- **The UAS quirk stays.** It costs nothing measurable at these speeds, and since the
  2026-08-20 hang was probably the cable too, whether it was ever needed is unknown.
  Not worth a reboot to find out.
- **journald is volatile** — the pre-reboot journal from the #120 incident was gone.
  Worth `Storage=persistent` if incident forensics matter.
