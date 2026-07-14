#!/usr/bin/env bash
# Builds plugins once, starts API + plugin watch/preview + shell dev server,
# then opens a Cloudflare tunnel to the shell dev server (port 5173) with HMR.
# Usage: ./scripts/dev-tunnel.sh
# Stop everything: ./scripts/dev-tunnel.sh stop  (or Ctrl-C)

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$REPO_ROOT/.dev-pids"

stop_all() {
  if [[ -f "$PID_FILE" ]]; then
    echo "Stopping all dev processes..."
    while IFS= read -r pid; do
      kill "$pid" 2>/dev/null && echo "  killed $pid" || true
    done < "$PID_FILE"
    rm -f "$PID_FILE"
  fi
}

if [[ "${1:-}" == "stop" ]]; then
  stop_all
  exit 0
fi

trap 'echo ""; stop_all' EXIT INT TERM

cd "$REPO_ROOT"

PLUGINS=(family-feed chores calendar)

# ── 1. Build plugins (federation remotes must exist before shell dev starts) ──
echo "Building plugins..."
for p in "${PLUGINS[@]}"; do
  pnpm --filter "@family-os/plugin-$p" build
done
echo "Build done."

# ── 2. Start services ─────────────────────────────────────────────────────────
echo ""
echo "Starting API (port 3000)..."
pnpm --filter @family-os/api dev > /tmp/family-os-api.log 2>&1 &
echo $! >> "$PID_FILE"

for p in "${PLUGINS[@]}"; do
  echo "Starting $p watch+preview..."
  pnpm --filter "@family-os/plugin-$p" dev > "/tmp/family-os-plugin-$p.log" 2>&1 &
  echo $! >> "$PID_FILE"
done

echo "Starting shell dev server (port 5173, HMR enabled)..."
pnpm --filter @family-os/shell dev > /tmp/family-os-shell.log 2>&1 &
echo $! >> "$PID_FILE"

sleep 2

# ── 3. Cloudflare tunnel ──────────────────────────────────────────────────────
echo ""
echo "Opening Cloudflare tunnel → http://localhost:5173"
echo "Logs: /tmp/family-os-{api,shell}.log, /tmp/family-os-plugin-*.log"
echo "Stop: ./scripts/dev-tunnel.sh stop  (or Ctrl-C here)"
echo ""
cloudflared tunnel --url http://localhost:5173
