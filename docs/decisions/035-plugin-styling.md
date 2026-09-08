# 035 — Plugin Styling: Shell Scans Plugin Source

**Status:** Decided

**Decision:** First-party plugins are styled with the **same utility-first Tailwind patterns
as the shell and `packages/ui`**. The shell stylesheet (`apps/shell/src/styles.css`) gains a
Tailwind `@source` scanning plugin source, so any utility used in a plugin emits CSS:

```css
@source "../../../plugins/*/src/**/*.{ts,tsx}";
```

This mirrors the identical `@source` already in `packages/ui/.storybook/preview-styles.css`,
so the two Tailwind contexts — the real shell and Storybook — are consistent. Plugins write
`className="grid bg-primary hover:bg-primary/10"` as the shell does; no per-plugin CSS setup.

CSS custom-property **tokens** remain the only sanctioned way to reference colours and fonts
— utilities like `bg-primary` resolve to them, and inline `var(--token)` is fine where a
one-off is clearer. Hardcoded hex/px colour and font values stay banned (ADR 012).

## Background — the silent no-op

Plugins are **federated remotes** (`@originjs/vite-plugin-federation`), each built by its own
Vite config and loaded lazily at runtime. They emit **JavaScript only**, so plugin DOM is
styled by the **shell's single stylesheet**.

Tailwind generates a utility only if it sees the class as a string in a file it scans. The
shell scanned its own `src` + `packages/ui/src`, **not** plugin source, so a plugin's utility
emitted CSS **only if that exact class coincidentally appeared in the shell or ui** —
otherwise it silently produced nothing. That broke the chores completion circles (`grid` /
`place-items-center` appear in neither), was worked around with inline styles, and left an
inline-heavy plugin style at odds with the utility-first shell (audit then: shell 4 inline /
148 className; family-feed 36 / 20; chore-engine 62 / 24).

Tokens and the `@utility`-defined typography classes (`page-title`, `section-label`, …) were
**never** affected: tokens are custom properties inherited from `:root` at runtime, and
`@utility` classes are definitions, not scanned usages. The footgun is specific to
**scanned utility classes**.

## Why this option

**It matches the distribution model we actually have.** Every plugin is first-party, in this
monorepo, present in the build tree when the shell compiles. Standard monorepo practice is
one centrally-built stylesheet scanning all first-party source, as a Turborepo app scans
`apps/*` + `packages/*`.

**It removes an inconsistency rather than adding coupling.** Storybook already scanned
`plugins/*/src`; the shell did not, so a component rendered correctly in an isolated story
and broke in the real shell. This makes the shell match the context that already worked.

**Lowest churn, fully additive.** One `@source` line; existing inline `var(--token)` chrome
keeps working, so migrating the back-catalogue is opportunistic. New plugin UI is authored
utility-first from day one.

**One deduped stylesheet.** No duplication, no federated-CSS injection wiring, no
`@layer`/preflight/specificity conflicts between Tailwind outputs.

**Verified end-to-end.** Canary `h-64`, used only in plugin source and absent from shell/ui:
the shell build emits `.h-64{height:calc(var(--spacing)*64)}` with the `@source` and
**nothing** without it.

**Cost accepted:** the shell's CSS build now depends on plugin source and re-scans when a
plugin adds a class. With one dev server / `turbo build` that is negligible, and Storybook
has lived with the same coupling.

## Third-party / community plugins — deferred to Option 2

This styles **only plugins in the shell's build tree**. A third-party plugin shipped as a
pre-built remote the shell never compiled would not be scanned, and its utilities would
no-op. That model does not exist yet (community plugins are unsupported until `@family-os/ui`
is published) and will need its own trust/isolation design regardless.

When it is built, the **recommended path is Option 2: a per-plugin Tailwind build** — each
plugin emitting its own utilities-only CSS (no preflight/theme duplication) that travels with
the federated remote and is injected on load, ideally with scoped resets or Shadow DOM so a
plugin cannot restyle the host. A separate ADR for when the marketplace work is scoped;
paying its per-plugin tax today buys nothing for the plugins we have.

## Alternatives considered

**Option 2 — per-plugin Tailwind build, now.** True isolation, working for third-party
plugins immediately. Rejected: real complexity paid by every plugin forever (per-plugin
config, utilities-only build to suppress preflight, CSS-injection wiring, load-order and
specificity care, duplicated base utilities) for a use case that does not exist yet.
Retained as the recommended path **for** that future case.

**Option 3 — codify inline `var(--token)` and lint-ban utilities in plugins.** Lowest build
risk, identical for first- and third-party. Rejected: verbose, inline-heavy code diverging
from the utility-first shell, and inline styles cannot express `:hover`/`:focus` or container
queries — forcing every interactive bit through a shared `ui` component even when it is
plugin-specific.

## Keep in sync

The shell `@source` and the Storybook `@source` (`packages/ui/.storybook/preview-styles.css`)
must point at the same plugin glob; if one moves, move the other, or the "works in Storybook,
breaks in the shell" footgun returns. Both carry a comment pointing at the other.

`packages/ui` remains the home for **reusable, interactive primitives** (Button,
`CompletionToggle`) — for reuse and consistency, not because plugins cannot express
interactive styling. A plugin-specific interactive element may use `hover:`/`focus:` directly.

## Do not revisit unless

- Community / third-party distribution is scoped — then write the Option 2 ADR for that path.
- Plugin-source scanning measurably slows the shell build, or a plugin's generated output
  pollutes the emitted CSS — then scope the glob more tightly.
