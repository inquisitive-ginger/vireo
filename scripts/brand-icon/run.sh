#!/usr/bin/env bash
# Generate an icon batch and build its contact sheet.
#   ./run.sh <outdir> [jobs.json]
# Reads GEMINI_API_KEY from the environment or from the repo .env.
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd)
root=$(cd "$here/../.." && pwd)
out=${1:?usage: run.sh <outdir> [jobs.json]}
jobs=${2:-$here/jobs/directions.json}
if [ -z "${GEMINI_API_KEY:-}" ] && [ -f "$HOME/.secrets/artgen.env" ]; then
  set -a; . "$HOME/.secrets/artgen.env"; set +a
fi
: "${GEMINI_API_KEY:?set GEMINI_API_KEY (env or .env)}"
mkdir -p "$out"
GEMINI_API_KEY="$GEMINI_API_KEY" python3 "$root/scripts/companion-art/gen.py" "$out" "$jobs"
python3 "$here/sheet.py" "$out" "$out/../sheet.png"
