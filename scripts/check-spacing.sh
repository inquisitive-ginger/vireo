#!/usr/bin/env bash
# The spacing rules were already written down. design-system.md has said "never a
# bracket-arbitrary [Npx] value" since the 2026-07-10 audit and "use the token
# classes instead of raw size utilities" since M0, and prose did not stop 69 raw
# type classes, 70 raw radii, or a 3px gap. ADR 068 made a rule stick by making
# the override impossible; this does the same job for the rules that live inside
# class strings, where only a grep can see them.
#
# POSIX ERE and bash 3.2 on purpose — this runs as a PostToolUse hook on a Mac
# as well as in CI, so no `mapfile` and no `grep -P`.
#
# Adding to EXEMPT is a visible decision and owes a reason. Widening a pattern
# is not a fix.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

B='[^-a-zA-Z0-9]'  # a class-name boundary: not a dash, not alphanumeric

# The named type scale (styles.css `@utility text-*`) and the three-member radius
# family are the vocabulary. Stock Tailwind sizes bypass both. The trailing
# boundary is what keeps `text-sm-token` and `rounded-card` out of the net.
RAW_TYPE="(^|$B)text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)($B|\$)"
RAW_RADIUS="(^|$B)rounded(-(t|b|l|r|tl|tr|bl|br))?-(sm|md|lg|xl|2xl|3xl)($B|\$)"

# Bracket spacing. Permitted when it derives from a token or a safe-area inset —
# the exemption design-system.md already grants a surface that must size itself
# against chrome it cannot see. A bare literal is what this catches.
BRACKET="(^|$B)(p|m|gap|space|inset)(-(x|y|t|r|b|l)|(x|y|t|r|b|l))?-\\["
DERIVED='\-\[(calc|var|env)\('

# file:regex:reason — a component's own internal geometry is not page rhythm.
EXEMPT_FILES='packages/ui/src/components/list-row.tsx'
# ADR 068 §3: derived from the 48px live target, the 8px dead band and the
# hairline that sits outside the padding box. Re-derived if any of the three
# moves, never nudged.

# Stories and tests render specimens, including deliberately off-token ones —
# the exploration files exist to show what the system rejected.
scan() {
  git grep -nE "$2" -- '*.tsx' '*.ts' 2>/dev/null |
    grep -Ev '\.(stories|test)\.tsx?:' |
    sed "s/^/$1|/" || true
}

hits="$(
  {
    scan 'raw type  ' "$RAW_TYPE"
    scan 'raw radius' "$RAW_RADIUS"
    scan 'bracket   ' "$BRACKET" | grep -Ev "$DERIVED" || true
  } | grep -Ev "\\|$EXEMPT_FILES:" || true
)"

[ -z "$hits" ] && exit 0

printf '%s\n' "$hits" | sed 's/|/  /' | cut -c1-160 >&2
cat >&2 <<'MSG'

Off the spacing contract (docs/design-system.md §Spacing, §Page containers).

  raw type    -> a named token: text-xs-body · text-sm-token · text-base-token
                 text-card-title · text-body · text-heading · text-page-title
  raw radius  -> rounded-card (8) · rounded-panel (12) · rounded-hero (16),
                 or rounded-full for a pill or a circle
  bracket     -> the base-4 rhythm scale, or a calc() over var()/env() when a
                 surface must size itself against chrome it cannot see

A component's own internal geometry can be exempted in scripts/check-spacing.sh,
with the reason it is geometry and not rhythm.
MSG
exit 2
