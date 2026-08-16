# 2026-08-16 — Infra: offsite backups (and the two-day outage that forced them)

One session spanning 08-15 → 08-16: prod outage, data rescue, emergency
hardware migration, then Part F built and verified. Kickoff:
`infra-offsite-backups.md` (written mid-incident, deleted per rules).

## The outage

- 08-15: prod down; SSD absent from the 3B. The old bridge (universal IDE/SATA
  USB kit, JMicron JM20337) was resetting with changing serial numbers and
  `device firmware changed` events.
- Reboot attempts bricked the box: `/mnt/data` in fstab **without `nofail`**
  → 90 s mount timeout → emergency mode with root locked → no SSH, no
  Tailscale. Recovered by masking the mount from `cmdline.txt`
  (`systemd.mask=mnt-data.mount`) via SD card in the Mac. Note: that mask
  regenerates on every daemon-reload for the rest of the boot; only a reboot
  clears it.
- fstab now carries `nofail,x-systemd.device-timeout=10`. A missing drive
  costs 10 seconds, never the box.

## The rescue

- Full ddrescue image of the SSD on the Mac. Through the old adapter it
  collapsed at 52 GB (rate 41 MB/s → 300 kB/s → device gone: thermal). Through
  the new enclosure (Insignia NS-PC25HDE): remaining 204 GB at 227 MB/s
  sustained, **zero read errors** across all 256 GB.
- Verdict: drive healthy, adapter guilty. Confirmed on the 3B with the new
  enclosure: `Undervoltage detected!` → drop → `Voltage normalised` — the 3B's
  rail can't feed a bus-powered SSD (old adapter had its own brick).
- fsck after imaging: journal replay + two free-count fixes. No data loss.

## The migration (unplanned, correct)

Prod moved to a **Pi 5 (4 GB, 27 W PSU, official cooler)** — user's call,
GPIO ambitions + it fixes the USB power budget (5 A negotiated, UAS works).
Same arm64 GHCR images, config transplanted from the 3B (compose, .env,
docker/containerd data-roots on `/mnt/data`, RequiresMountsFor drop-ins,
fstab line). Postgres did one slow crash-recovery start (healthcheck timed
out during initial fsync pass; second `up -d` clean). Cutover: A record
`vireohome.app` → 192.168.0.42 (dashboard, by hand), Tailscale re-enrolled +
route `192.168.0.42/32` approved, Actions runner re-registered same
name/labels (`vireo-pi`) so the deploy workflow is untouched. Verified:
HTTPS 200 LAN-side and post-cutover, data intact (5 profiles / 61 tasks /
16 posts — family used the app mid-incident), runner online.

## Part F as built

- `restic` → Cloudflare R2 (`vireo` bucket, S3 API), repo v2 encryption.
  Stream: `pg_dump | restic backup --stdin` — nothing staged on disk.
- `familyos-backup.timer` 03:30 nightly + `Persistent=true`;
  `forget --keep-daily 14 --keep-weekly 8 --prune` after each run.
- `OnFailure=` → `backup-failed.sh` → unauthenticated LAN POST to
  `/api/family-feed/posts` (lands on the fridge as "Family"). **Not
  live-tested** — deliberate; it would post a scary message to the real feed.
- First snapshot `f8053b75` (659 KiB). **Restore tested**: dump → scratch DB
  → counts matched prod exactly → dropped.
- Creds: `/opt/family-os/backup/restic.env` (0600). R2 gotchas that burned an
  hour: the S3 access key ID is the **token's ID** (not the account ID the
  dashboard copy button hands out), and the secret is the 64-hex one shown
  once at creation. Encryption password: in restic.env + user's password
  manager (custody documented in deployment.md Part F, not the key).

## Open / follow-ups

- **3B repurpose** (queued): second-copy backup puller + tinker board. It
  still has Docker/tailscale state; wipe or repurpose deliberately.
- Mac cleanup: rescue image `~/vireo-ssd-rescue/` (238 GB) is deletable —
  restore verified — user's call; shred `~/r2-creds.env`,
  `~/vireo-restic-password.txt` (after password-manager), the token
  screenshot. Old JM20337 adapter: label it "attended data pulls only".
- Failure hook live-test still owed (or accept wiring-only verification).
- Tier-4 `PATCH … deployed` still owed for reports #102/#103/#107/#109.
- Mini-PC plan superseded by the Pi 5 purchase; N100 remains the answer if
  transcoding/cameras outgrow it.
- Stale memories corrected during session: prod _has_ a `family` profile row;
  hardware memory rewritten for Pi 5 + enclosure.
