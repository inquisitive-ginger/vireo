#!/usr/bin/env bash
# Builds all packages, starts API + previews, opens a Cloudflare tunnel to the shell (port 4173).
# Usage: ./scripts/preview-tunnel.sh
# Stop everything: ./scripts/preview-tunnel.sh stop  (or just Ctrl-C)

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$REPO_ROOT/.preview-pids"

stop_all() {
  if [[ -f "$PID_FILE" ]]; then
    echo "Stopping all preview processes..."
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

# Clean up on Ctrl-C / exit
trap 'echo ""; stop_all' EXIT INT TERM

cd "$REPO_ROOT"

# ── 1. Build ──────────────────────────────────────────────────────────────────
echo "Building packages..."
pnpm --filter @family-os/plugin-demo-plugin build
pnpm --filter @family-os/shell build
echo "Build done."

# ── 2. Start services ─────────────────────────────────────────────────────────
echo ""
echo "Starting API (port 3000)..."
pnpm --filter @family-os/api dev > /tmp/family-os-api.log 2>&1 &
echo $! >> "$PID_FILE"

echo "Starting demo-plugin preview (port 3010)..."
pnpm --filter @family-os/plugin-demo-plugin preview > /tmp/family-os-plugin.log 2>&1 &
echo $! >> "$PID_FILE"

echo "Starting shell preview (port 4173)..."
pnpm --filter @family-os/shell preview > /tmp/family-os-shell.log 2>&1 &
echo $! >> "$PID_FILE"

# Give services a moment to bind
sleep 2

# ── 3. Cloudflare tunnel ──────────────────────────────────────────────────────
echo ""
echo "Opening Cloudflare tunnel → http://localhost:4173"
echo "Logs: /tmp/family-os-{api,plugin,shell}.log"
echo "Stop: ./scripts/preview-tunnel.sh stop  (or Ctrl-C here)"
echo ""
cloudflared tunnel --url http://localhost:4173
