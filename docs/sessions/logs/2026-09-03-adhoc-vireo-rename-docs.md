# Ad-hoc: finish the Vireo rename in the docs

**Date:** 2026-09-03 · **Committed straight to `main`** (docs-only, no PR)

## What changed

The 2026-08-22 olive-primary session renamed the app to Vireo and swapped the
wordmark strings in the shell, but left the working title standing in every
prose doc. Fourteen files still opened with "Family OS". They now say Vireo:

- `CLAUDE.md`, `README.md`, `CONTRIBUTING.md`, `docs/vision.md`,
  `docs/deployment.md` (its title also still said Pi 4 — now just "a Raspberry
  Pi"; the status line under it has said Pi 5 since 2026-08-16).
- `docs/design-system.md` — the "No AI aesthetic" principle and the ADR 034 nav
  pattern, wordmark and ASCII frame included.
- ADR 012 (the "Why" prose) and ADR 034 (the wordmark slot, and its
  "do not revisit unless" trigger, which named the rename as its own condition
  and had therefore already fired).
- Four module story/spec files and the `turbo gen plugin` description.

The CLAUDE.md line declaring "Family OS" a provisional working title is gone —
one line back under the 200-line cap. `docs/vision.md` §Name replaces it and now
also lists which identifiers deliberately kept the old name.

## What was deliberately left alone

The 2026-08-22 log settled this and it is not re-litigated here: the
`@family-os/*` package scope (1459 references), the GitHub repo name, the GHCR
image names, the `family-os-<hash>` service-worker cache prefix, the `familyos`
databases, `/opt/family-os` on the Pi, and the `admin@family-os.local` VAPID
subject all still say family-os. Near-zero user-facing payoff, and four live
worktrees would conflict on a scope-wide rename. `package.json`'s root
`"name": "family-os"` and the `/tmp/family-os-*.log` paths in the tunnel scripts
belong to that same set and were left with it.

Session logs and design artifacts are dated records and were not rewritten —
including `artifacts/2026-09-03-shopping-surface-explorations.html`, whose 17
mock top bars read "Family OS". The real `MobileBrandTopBar` has rendered
"Vireo" since 2026-08-22, so M5.5/2 should take the component, not the mock.

## Snags

- `docs/sessions/kickoffs/product-design-beacon.md` also says "Family OS" and
  was **not** changed. It is 7955 bytes against the 6000-byte kickoff budget,
  and `check-context-budget.sh` only enforces per-file caps on files changed in
  the working tree — so touching it at all un-grandfathers it and fails CI.
  Trimming someone else's queued kickoff was out of scope. It gets deleted when
  the beacon session runs.
- `docs/sessions/queue.md` sits at exactly its 16000-byte cap, so the two notes
  above could not be added there.

## Verification

`scripts/check-context-budget.sh` exit 0; `prettier --check` clean on all
changed files. No code paths touched beyond the generator description string.
