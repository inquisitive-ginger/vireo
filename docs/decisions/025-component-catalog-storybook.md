# ADR 025 — Component Catalog (Storybook)

**Status:** Decided

## Decision

**Storybook 8** is the component catalog, hosted in `packages/ui`. It ships as part of the M0 `dev-environment` story.

## Why

Design sessions need a living canvas to work against. Without Storybook, the Visual Language Design session (blocked on M0) has nowhere to render tokens, typography, and component states — it becomes a document exercise rather than an interactive one. Earlier is better; waiting until M1 means the component library grows without a catalog and stories must be written retroactively.

Storybook 8 has native Vite integration — it uses the same Vite config as the app and picks up Tailwind CSS v4 and shadcn/ui without extra setup. It runs as a separate dev server (`pnpm storybook`) and is not part of the production build.

## Alternatives considered

- **Histoire** — lighter, Vite-native, but Vue-first; React support is secondary-class.
- **Ladle** — simpler API, smaller install, but much smaller ecosystem and fewer integrations with design tools.
- **Plain test harness** — no visual catalog; designers can't work against it; ruled out.

## Scope

Storybook lives in `packages/ui`. Stories for `apps/shell` components that aren't part of the shared UI package live in `apps/shell/.storybook/`. Plugins are expected to include stories for any widgets they expose.

`pnpm storybook` starts the catalog; it is not wired into the Turborepo `build` or `test` pipelines (it's a dev tool, not a CI artifact).

## Do not revisit unless

Storybook's module resolution conflicts with Vite Module Federation remotes in a way that can't be isolated by aliasing shared singletons (same condition as ADR 023).
