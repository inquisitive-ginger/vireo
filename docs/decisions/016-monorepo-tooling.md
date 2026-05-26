# 016 — Monorepo Tooling

**Status:** Decided

**Decision:** pnpm workspaces as the package manager; Turborepo as the
build orchestrator.

**Why:** pnpm is used by the Vite ecosystem itself and handles
symlinked workspace dependencies cleanly — important for Vite Module
Federation, which resolves packages across the shell and plugin
boundaries. Turborepo adds task-graph caching (build, typecheck, lint)
with near-zero configuration; this pays off immediately once plugins
each have their own build step. The combination is the de facto
standard for Vite-based monorepos.

**Alternatives considered:** npm workspaces (slower, no caching,
less module resolution control); yarn workspaces (yarn 1 is legacy,
yarn 3/4 is complex and diverges from the node_modules model);
plain pnpm workspaces without Turborepo (no caching — acceptable at
M0 scale, but adds manual build-ordering work as soon as a second
app or plugin is added).

**Do not revisit unless:** A plugin build toolchain emerges that is
fundamentally incompatible with Turborepo's task model, or pnpm
introduces a breaking change to its workspace resolution.
