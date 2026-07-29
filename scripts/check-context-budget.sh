#!/usr/bin/env bash
# CLAUDE.md is loaded into every session before it reads anything else, so its
# size is a tax on every task. The budget is the only thing that keeps it an
# index instead of a record. Raising the cap is not a fix.
set -euo pipefail

MAX_LINES=200
MAX_BYTES=12000

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
file="$root/CLAUDE.md"

lines=$(wc -l <"$file" | tr -d ' ')
bytes=$(wc -c <"$file" | tr -d ' ')

if [ "$lines" -le "$MAX_LINES" ] && [ "$bytes" -le "$MAX_BYTES" ]; then
  exit 0
fi

cat >&2 <<EOF
CLAUDE.md is over budget: $lines lines (max $MAX_LINES), $bytes bytes (max $MAX_BYTES).

Move the excess out instead of raising the cap:
  what happened              -> docs/sessions/logs/
  what is next / outstanding -> docs/sessions/queue.md
  why something is settled   -> docs/decisions/
  how to run or deploy       -> docs/deployment.md
  visual language            -> docs/design-system.md
EOF
exit 2
