#!/bin/bash
# Self-heal for the USB-SSD failure mode (2026-08-20 outage: enclosure UAS hang
# -> ext4 journal abort -> xHCI controller death; only a reboot recovers the
# controller). Runs from a 1-minute systemd timer.
#
# Healthy = /mnt/data mounted read-write AND the app answers through Caddy.
# When healthy, optionally pings a dead-man's-switch URL (/etc/vireo-healthcheck-url)
# so a silent box raises an external alert.
#
# Source of truth for /usr/local/sbin/vireo-watchdog.sh on the Pi; install by hand
# (docs/deployment.md Part F) — nothing deploys it.

STAMP=/var/lib/vireo-watchdog-reboot-stamp # SD-card path: survives reboot, works with the SSD dead
COUNT=/var/lib/vireo-watchdog-fail-count
PING_URL_FILE=/etc/vireo-healthcheck-url
DEPLOY_FLAG=/opt/family-os/.deploy-in-progress # written by deploy.yml; also on the SD card
DEPLOY_TTL=900
# A missing /dev/sda is the controller-death mode: nothing but a reboot fixes it,
# and no slow start explains it. A present disk with a down app is usually just
# slow — a boot with postgres crash recovery plus the api's migrate+tsx start has
# taken 25 min on this hardware, so the reboot is held far past that.
FAIL_GONE=3
FAIL_SLOW=30

healthy() {
  findmnt -n /mnt/data >/dev/null || return 1
  touch /mnt/data/.watchdog-probe 2>/dev/null || return 1 # catches a read-only remount
  rm -f /mnt/data/.watchdog-probe
  curl -sf -o /dev/null --max-time 10 \
    --resolve vireohome.app:443:127.0.0.1 https://vireohome.app/api/plugins || return 1
  return 0
}

if healthy; then
  rm -f "$COUNT"
  [ -f "$PING_URL_FILE" ] && curl -sf --max-time 10 -o /dev/null "$(cat "$PING_URL_FILE")"
  exit 0
fi

# A deploy takes the api down on purpose, and a concurrent `compose up -d` races
# the rollout. The TTL keeps a runner killed mid-deploy — exactly what the #120
# reboot did — from suppressing recovery forever.
if [ -f "$DEPLOY_FLAG" ]; then
  age=$(($(date +%s) - $(stat -c %Y "$DEPLOY_FLAG")))
  if [ "$age" -lt "$DEPLOY_TTL" ]; then
    logger -t vireo-watchdog "unhealthy ${age}s into a deploy — standing down"
    exit 0
  fi
  logger -t vireo-watchdog "deploy flag stale (${age}s) — recovering anyway"
  rm -f "$DEPLOY_FLAG"
fi

fails=$(($(cat "$COUNT" 2>/dev/null || echo 0) + 1))
echo "$fails" >"$COUNT"

if [ -b /dev/sda ]; then
  threshold=$FAIL_SLOW
  # Cheap and idempotent, so retry every tick: this is what self-heals a boot
  # where the drive enumerated after the mount timeout.
  systemctl start mnt-data.mount containerd docker || true
  # The stack only needs starting once; repeating it every minute just adds I/O
  # to a box that is already failing its health probe.
  if [ "$fails" -eq 1 ]; then
    logger -t vireo-watchdog "unhealthy — attempting recovery"
    (cd /opt/family-os && docker compose -f docker-compose.prod.yml --env-file .env up -d) || true
    sleep 30
    if healthy; then
      rm -f "$COUNT"
      logger -t vireo-watchdog "recovered without reboot"
      exit 0
    fi
  fi
else
  threshold=$FAIL_GONE
fi

if [ "$fails" -lt "$threshold" ]; then
  logger -t vireo-watchdog "unhealthy ${fails}/${threshold} — holding"
  exit 0
fi

# Reboot at most once per 2h so a genuinely dead drive degrades to a slow retry
# loop instead of a boot storm.
now=$(date +%s)
last=$(cat "$STAMP" 2>/dev/null || echo 0)
if [ $((now - last)) -gt 7200 ]; then
  echo "$now" >"$STAMP"
  logger -t vireo-watchdog "rebooting to recover (unhealthy ${fails} ticks)"
  systemctl reboot
else
  logger -t vireo-watchdog "still unhealthy; reboot suppressed (last one <2h ago)"
fi
