# Kickoff — Platform Architecture: plugin styling (inline-vs-Tailwind)

**Type:** Architecture (ADR) + dev follow-through
**Proposed branch:** `arch/plugin-styling`
**Origin:** Raised in the Completion Flow PR review (#20); queued at the user's
request (2026-06-18).

## Pre-session checklist

- [ ] Read `CLAUDE.md` — "Standing Engineering Conventions" (the rule: shell
      Tailwind scans only `packages/ui` + shell; plugins use token `@utility`
      classes + inline `var(--token)` styles, not novel utilities)
- [ ] Read `docs/sessions/logs/2026-06-17-dev-chores-completion.md` — the
      inline-vs-Tailwind **audit table** + the `grid`/`place-items-center` silent
      no-op that motivated this
- [ ] Read PR #20 review thread — the audit + options summary
- [ ] Read the Tailwind/`@source` config: `packages/ui/.storybook/main.ts`, the
      shell's Tailwind setup, `packages/ui/src/styles.css` (`@theme` tokens)
- [ ] Skim `plugins/family-feed` + `plugins/chore-engine` components — the
      inline-`var(--token)` precedent that would be reconciled

## Problem

The shell's Tailwind build scans only `packages/ui` + the shell. Plugin source is
**not** scanned, so a Tailwind utility used in a plugin only produces CSS if that
exact class also happens to appear in ui/shell — otherwise it silently no-ops
(this broke the chores completion circles: `grid`/`place-items-center` emitted
nothing). The sanctioned workaround is inline `var(--token)` chrome in plugins,
which is inconsistent with the utility-first shell/ui (audit: shell 4 inline / 148
className; family-feed 36 / 20; chore-engine 62 / 24).

## Decision to make (ADR)

Pick the standard and justify it against Module Federation (shared CSS, lazy
plugin loading, bundle size, isolation, dev ergonomics):

1. **Scan plugins from the shell** — add `plugins/*/src` to the shell's Tailwind
   `@source`. Utilities "just work" in plugins; cost = shell CSS owns all plugin
   classes (coupling; the shell must rebuild when a plugin adds a class).
2. **Per-plugin Tailwind build** — each plugin emits its own CSS scanning its own
   source, loaded with the federated remote. Isolation; cost = setup +
   duplication + load-order/specificity care.
3. **Keep inline `var(--token)` as the deliberate standard** — codify it, add a
   lint guard against novel utility classes in plugins, and lean on shared
   `packages/ui` components for anything interactive/hover-y (the `CompletionToggle`
   pattern). Lowest churn; accepts the inline-heavy plugin style.

## Scope

In: the decision + the enabling change so **new** UI is built under the right
standard. **Out (explicit fast-follow):** reconciling the existing plugin
components (chore-engine, family-feed) to the new standard — don't migrate the
back-catalog in this session; if the chosen option is additive (e.g. scanning
`plugins/*/src`), existing inline styles keep working and migration is
opportunistic. Verify the enabling change end-to-end (a plugin renders a
utility-only element correctly in the real shell **and** in the plugin's own
isolated/Storybook build) before closing.

## Required outputs

- [ ] ADR (`docs/decisions/NNN-plugin-styling.md`) — decision + rationale + alternatives
- [ ] The chosen enabling change implemented + verified (shell + isolated plugin build),
      **or** the documented keep-inline decision + lint guard
- [ ] `CLAUDE.md` standing convention + `design-system.md` updated to match
- [ ] A queued fast-follow (or a noted TODO) for reconciling existing plugin components
- [ ] Session log; delete this kickoff
