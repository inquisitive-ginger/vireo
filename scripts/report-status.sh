#!/usr/bin/env bash
# issues.onStatus (D-075): report-status.sh <issue#> <triaged|fixing|shipped|wontfix> ["<note>"]
# Moves the in-app report behind an auto-bug issue; shipped notifies the reporter with the note.
set -euo pipefail
issue=$1 status=$2 note=${3:-}
case $status in
  triaged | fixing) ;;
  shipped) status=deployed ;;
  wontfix) status=wont_fix ;;
  *) echo "unknown status: $status" >&2; exit 2 ;;
esac
: "${VIREO_MAINTAINER_TOKEN:?set VIREO_MAINTAINER_TOKEN to MAINTAINER_TOKEN on the Pi}"
id=$(gh issue view "$issue" --json body -q .body | sed -n 's/^| Report id | `\(.*\)` |$/\1/p')
[ -n "$id" ] || { echo "#$issue has no Report id line" >&2; exit 1; }
body=$(jq -n --arg s "$status" --arg r "$note" '{status: $s} + (if $r == "" then {} else {resolution: $r} end)')
curl -fsS -o /dev/null -X PATCH "${VIREO_API:-https://vireohome.app/api}/bug-reports/$id" \
  -H "Authorization: Bearer $VIREO_MAINTAINER_TOKEN" -H 'Content-Type: application/json' -d "$body"
echo "#$issue → $status"
