# 035 — Plugin Styling: Shell Scans Plugin Source

**Status:** Decided

**Decision:** First-party plugins are styled with the **same utility-first Tailwind
patterns as the shell and `packages/ui`**. The shell's stylesheet
(`apps/shell/src/styles.css`) gains a Tailwind `@source` directive that scans
plugin source, so any utility class used in a plugin emits CSS:

```css
@source "../../../plugins/*/src/**/*.{ts,tsx}";
```

This mirrors the identical `@source` already present in
`packages/ui/.storybook/preview-styles.css` — the two Tailwind contexts (the real
shell and Storybook) are now consistent. Plugins write `className="grid bg-primary
hover:bg-primary/10"` exactly as the shell does; no per-plugin CSS setup is
required.

CSS custom-property **tokens** (`var(--primary)`, `var(--font-display)`, …) remain
the only sanctioned way to reference colors and fonts — utilities like `bg-primary`
resolve to those tokens, and inline `var(--token)` is still fine where a one-off
value is clearer. Hardcoded hex/px color and font values remain banned (ADR 012,
`design-system.md`).

---

## Background — the silent no-op

Plugins are **federated remotes** (`@originjs/vite-plugin-federation`): each is
built by its own Vite config and loaded lazily into the shell at runtime. Plugins
emit **JavaScript only** — none has a CSS build or stylesheet. At runtime, plugin
DOM is styled by the **shell's single stylesheet**.

Tailwind generates a utility class only if it sees that class as a string in a file
it scans. The shell scanned only its own `src` + `packages/ui/src`, **not** plugin
source. So a utility used in a plugin emitted CSS **only if that exact class
coincidentally also appeared in the shell or ui** — otherwise it silently produced
nothing. This broke the chores completion circles (`grid` / `place-items-center`
emitted no CSS in the federated plugin; neither class appears in shell/ui) and was
worked around with inline styles. The result was an inline-heavy plugin style
inconsistent with the utility-first shell (audit at decision time: shell 4 inline /
148 className; family-feed 36 / 20; chore-engine 62 / 24).

Tokens and the `@utility`-defined typography classes (`page-title`,
`section-label`, …) were **never** affected: tokens are CSS custom properties
inherited from `:root` at runtime, and `@utility` classes are definitions (not
scanned usages), so both always work in plugins. The footgun was specific to
**dynamically-scanned utility classes**.

---

## Why this option

**It matches the distribution model we actually have.** Every plugin today is
first-party and lives in this monorepo, present in the build tree when the shell
compiles. The standard practice for a monorepo is a single, centrally-built
stylesheet that scans all first-party source (the same way a Turborepo app scans
`apps/*` + `packages/*`). Option 1 is that pattern.

**It removes an inconsistency rather than adding coupling.** Storybook already
scans `plugins/*/src`; the shell did not. The same plugin component rendered
correctly in an isolated story but broke in the real shell. This change makes the
shell match the context that already worked.

**Lowest churn, fully additive.** One `@source` line. Existing inline `var(--token)`
chrome keeps working unchanged, so migrating the back-catalog is opportunistic, not
forced (see fast-follow). New plugin UI is authored utility-first from day one.

**One deduped stylesheet.** No duplication, no federated-CSS injection wiring, no
`@layer`/preflight/specificity conflicts between multiple Tailwind outputs.

**Verified end-to-end.** Canary `h-64` (used only in plugin source, absent from
shell/ui): the shell build emits `.h-64{height:calc(var(--spacing)*64)}` with the
`@source`, and **nothing** without it. The isolated build (Storybook) already
covers the plugin side.

### Cost accepted

The shell's CSS build now depends on plugin source and re-scans when a plugin adds a
class. In a monorepo with one dev server / `turbo build` this is negligible, and
Storybook has lived with the same coupling without issue.

---

## Third-party / community plugins — deferred to Option 2

Option 1 styles **only plugins in the shell's build tree**. A future third-party
plugin distributed as a pre-built remote the shell never compiled would **not** be
scanned, and its utilities would no-op. That distribution model does not exist yet
(`design-system.md`: community plugins are unsupported until `@family-os/ui` is
published) and will need its own trust/isolation design regardless.

When community distribution is built, the **recommended path is Option 2: a
per-plugin Tailwind build** — each plugin emits its own utilities-only CSS (no
preflight/theme duplication) that travels with the federated remote and is injected
on load, ideally with scoped resets (or Shadow DOM) so a plugin cannot restyle the
host. That is a separate ADR to write when the marketplace work is actually scoped;
it is **not** built now, because paying its per-plugin tax today buys nothing for
the first-party plugins we have.

---

## Alternatives considered

**Option 2 — per-plugin Tailwind build (now).** True isolation; works for
third-party plugins immediately. Rejected for now: real complexity paid by every
plugin forever (per-plugin config, utilities-only build to suppress preflight,
federated CSS-injection wiring, load-order/specificity care, duplicated base
utilities) to serve a use case that doesn't exist yet. Retained as the recommended
path **for** that future case (above).

**Option 3 — codify inline `var(--token)` + lint-ban utilities in plugins.** Lowest
build risk and identical for first/third-party. Rejected: verbose, inline-heavy
plugin code that diverges from the utility-first shell (against the goal of unified
styling), and inline styles cannot express `:hover`/`:focus`/pseudo-states or
container queries, forcing every interactive bit through a shared `ui` component
even when it is plugin-specific.

---

## Keep in sync

The shell `@source` and the Storybook `@source`
(`packages/ui/.storybook/preview-styles.css`) must point at the same plugin glob.
If one moves, move the other — a divergence reintroduces the "works in Storybook,
breaks in the shell" footgun this ADR closes. Both carry a comment pointing at the
other.

`packages/ui` remains the home for **reusable, interactive primitives** (Button,
the `CompletionToggle` pattern, etc.) — for reuse and consistency, not because
plugins can no longer express interactive styling. A plugin-specific interactive
element may now use `hover:`/`focus:` variants directly.

---

## Do not revisit unless

- Community / third-party plugin distribution is scoped — then write the Option 2
  ADR for that path (this ADR already names it as the recommendation).
- Plugin-source scanning measurably slows the shell build, or a plugin's generated
  output pollutes the emitted CSS — then scope the glob more tightly than
  `plugins/*/src/**/*.{ts,tsx}`.
