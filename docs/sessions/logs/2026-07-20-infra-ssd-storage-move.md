# Infra: Docker storage onto the SSD

**Date:** 2026-07-20 · **Type:** infra (ad-hoc, no kickoff) · **Box:** `vireo-pi` (Pi 3B v1.2)

## What was done

Moved Docker's on-disk state off the microSD onto the `/mnt/data` SSD that was
provisioned for it on 2026-07-19 and had sat empty (2.1 MB used) ever since.
Live data, done in place with the app down for ~15 minutes.

## The finding that changed the job

The plan was one config change — `data-root` in `/etc/docker/daemon.json`. That
would have moved **48 MB** and left **2.8 GB** where it was.

Docker 29 on this box uses the **containerd image store** (`Storage Driver:
overlayfs`, `--containerd=/run/containerd/containerd.sock`). Image content and
snapshots live under **`/var/lib/containerd`**, which `data-root` does not
govern — it is set by `root =` in `/etc/containerd/config.toml`. `data-root`
covers only volumes (`postgres_data`, `caddy_data`) and container metadata.

So it is **two roots**, and the one that matters for card wear is the second:
every release writes a fresh 2.1 GB api image.

## The measurement that lied

`sudo du -sh /var/lib/docker` reported **2.2 GB** with Docker running and
**48 MB** with it stopped. With the containerd snapshotter, live container
rootfs are mounted under `/var/lib/docker/rootfs/overlayfs/<id>`, so `du` walks
into the mounts and counts the images through them — the 2.2 GB was the
snapshotter directory, attributed to the wrong path.

The tell was there and got missed: 2.2 GB matched
`io.containerd.snapshotter.v1.overlayfs` **exactly**. A number that reappears
somewhere it shouldn't is not a coincidence. **Stop the daemon before measuring
its data directory.**

## The guard

Both `docker.service` and `containerd.service` got a drop-in:

```
[Unit]
RequiresMountsFor=/mnt/data
```

Without it, a USB disk that fails to enumerate hands Docker an **empty**
data-root; Postgres sees a blank data dir, initialises a fresh database, and the
stack comes up **healthy with the household gone** — and `deploy.yml` would then
migrate the empty DB. The failure mode is silent, which is what makes it worth a
guard rather than a check.

## Sequence

1. `pg_dump --format=custom` to the Mac (254 KB, 17 tables, verified with
   `pg_restore --list`) — `~/family-os-backups/familyos-2026-07-20-pre-ssd-move.dump`.
2. `docker image prune -af` — 13 images / 11.7 GB → 3 / 2.9 GB. Six superseded
   `family-os-api` tags at ~2.1 GB each had accumulated because `deploy.yml` ran
   `docker image prune -f`, which only drops **dangling** layers.
3. `compose down`, stop `docker docker.socket containerd`.
4. `rsync -aHAX --numeric-ids` both roots to `/mnt/data/{docker,containerd}`
   (2.7 GB at ~15 MB/s over USB 2.0). `-H`/`-X` are load-bearing.
5. `daemon.json` + `config.toml` + the two drop-ins, `daemon-reload`.
6. Start, `up -d`, verify, **reboot**, verify again.

## Verification

- `Docker Root Dir: /mnt/data/docker`; images and both volumes intact.
- `https://vireohome.app` 200; Let's Encrypt cert survived (the `caddy_data`
  volume came with it — no re-issue).
- Data intact: 4 profiles, 24 events, 4 tasks, 3 posts, 1 bug report.
- **Cold boot:** SSD mounted, stack self-started, app 200. Both units show
  `Requires=`/`After=` on the generated `mnt-data.mount`.
- API 502s for ~40–70s on every boot — the known `tsx`+migrate startup, not
  caused by this.

## Repo changes

- `docs/deployment.md` — new **Part C9** with the two-root table, the `du`
  warning, and the full procedure; Part C2 no longer says "boot from SSD"
  (this board's USB-boot OTP bit was never verified).
- `.github/workflows/deploy.yml` — `docker image prune -af --filter "until=168h"`,
  keeping a week of tags for a `TAG=` rollback.

## Left open

- `/var/lib/docker` and `/var/lib/containerd` (~2.9 GB) still on the card,
  deliberately: they are the rollback until deleted.
- **Part F offsite backups** is now the only storage risk left, and the one that
  matters most — the pre-move dump is a one-off, not a system.
