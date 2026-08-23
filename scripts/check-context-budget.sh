#!/usr/bin/env bash
# Every doc here is a tax on some future session. CLAUDE.md is loaded before a
# session reads anything else; the queue is read at the start of every one; a log
# is read whenever its story comes back around. The budget is the only thing that
# keeps them indexes instead of records — the authoring rules were already
# written in each file's header and were not enough. Raising a cap is not a fix.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

# path : max bytes : max lines (0 = unchecked). Always enforced.
PINNED=(
  "CLAUDE.md:12000:200"
  "docs/sessions/queue.md:16000:0"
  "docs/architecture.md:44000:0"
  "docs/design-system.md:120000:0"
)

# glob : max bytes. Enforced only on files changed in the working tree, so the
# existing corpus is grandfathered and only new output is governed.
PER_FILE=(
  "docs/sessions/logs:6000"
  "docs/sessions/kickoffs:6000"
  "docs/decisions:6000"
)

fail=0
report() {
  printf '  %-52s %7s / %-7s %s\n' "$1" "$2" "$3" "$4" >&2
  fail=1
}

for entry in "${PINNED[@]}"; do
  IFS=: read -r file max_bytes max_lines <<<"$entry"
  [ -f "$file" ] || continue
  bytes=$(wc -c <"$file" | tr -d ' ')
  [ "$bytes" -gt "$max_bytes" ] && report "$file" "$bytes" "$max_bytes" bytes
  if [ "$max_lines" -ne 0 ]; then
    lines=$(wc -l <"$file" | tr -d ' ')
    [ "$lines" -gt "$max_lines" ] && report "$file" "$lines" "$max_lines" lines
  fi
done

changed=$( { git diff --name-only HEAD -- '*.md'; git ls-files -o --exclude-standard -- '*.md'; } 2>/dev/null | sort -u )
for entry in "${PER_FILE[@]}"; do
  IFS=: read -r dir max_bytes <<<"$entry"
  while IFS= read -r file; do
    [ -n "$file" ] && [ -f "$file" ] || continue
    bytes=$(wc -c <"$file" | tr -d ' ')
    [ "$bytes" -gt "$max_bytes" ] && report "$file" "$bytes" "$max_bytes" bytes
  done <<<"$(printf '%s\n' "$changed" | grep "^$dir/" || true)"
done

[ "$fail" -eq 0 ] && exit 0

cat >&2 <<'MSG'

Over budget. Cut content instead of raising the cap:
  what happened              -> docs/sessions/logs/   (headline + outcome, not narration)
  what is next / outstanding -> docs/sessions/queue.md (3 lines + a log pointer)
  why something is settled   -> docs/decisions/       (one page)
  how to run or deploy       -> docs/deployment.md
  visual language            -> docs/design-system.md
MSG
exit 2
