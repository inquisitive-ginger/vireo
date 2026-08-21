# 2026-08-20 — Infra: SSD outage, recovery, and self-heal watchdog

Ad-hoc incident session ("prod plugins aren't loading"); no kickoff. Full outage
— nothing listening on 80/443/3000/5432; the cached PWA shell made it look like
a plugins-only failure.

## Incident

Kernel log timeline (Aug 20): **07:19** the Insignia enclosure stopped answering
mid-write (sense "LU becoming ready" — UAS hang, not the disk medium); **07:24**
a 180s write timeout aborted the ext4 journal; **07:45** dockerd tripped it and
the FS went read-only; **07:59** the reset storm killed the Pi's entire xHCI USB
controller and the drive left the bus. The `RequiresMountsFor=/mnt/data` guard
worked exactly as designed — Docker stayed down instead of coming up on an empty
data-root. Nightly restic ran before the failure.

## Recovery

Reboot (dead xHCI needs one) → drive re-enumerated clean, but fstab's
`x-systemd.device-timeout=10` was shorter than the drive's ~11s enumeration, so
the mount (and Docker) stayed down. `e2fsck -p` replayed the journal (exit 1,
minor fixes), manual mount + service start + `compose up -d`, all healthy.
Verified: 5 profiles, all weekly series, and the #114 backfill intact at the row
level ("Swim at British Swim School" `is_activity=t`, 2 attendees).

Access notes: `ssh vireo-pi` works from Zach's machine (stale 3B host key had to
be cleared — the Pi 5 migration changed it); `docker exec family-os-postgres-1
psql` is the working prod-DB invocation. A dispatchable runner-diagnostics
workflow was tried first and abandoned (`workflow_dispatch` needs the file on
main, and any workflow push to main triggers release); branch deleted.

## Hardening (all live, gated with Zach)

- UAS disabled for the enclosure (`usb-storage.quirks=6655:a580:u`) — root-cause
  mitigation.
- fstab device-timeout 10s → 60s — boot self-heals a slow enumeration.
- `vireo-watchdog.timer` (1 min): healthy = mount rw + app 200; pings a
  Healthchecks.io dead-man URL when healthy (external paging); on failure,
  remount/restart, else reboot (max once per 2h, stamp on SD).
- Post-quirk reboot live-tested the chain: stack returned with zero manual steps.

Runbook: `deployment.md` Part F. Durable fix queued: NVMe HAT on the Pi 5's
PCIe port — gets storage off USB entirely.

## Open

- smartmontools not installed; no SMART baseline for the SSD (declined for now).
- Report `603e89eb` (#114) still owes its `deployed` flip.
