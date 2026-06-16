# 020 — Plugin Dev Toolchain

**Status:** Decided

**Decision:** Turborepo generator (`pnpm turbo gen plugin`) scaffolds new
plugins. Templates live in `turbo/generators/plugin/`. No custom CLI.

**Why:** Turborepo (ADR 016) ships a built-in `turbo gen` command with file
templating and variable substitution — zero additional dependencies. The demo
plugin (M0) is created via the generator, validating the full scaffold →
dev → load workflow before any real module is built. Turborepo handles
workspace registration automatically as part of generation.

**Local dev flow:**

Each plugin runs its own Vite dev server on a dedicated port. `pnpm dev`
(via Turborepo task graph) starts the shell, API, and all registered plugins
in parallel. The shell's `vite.config.ts` points to each plugin's dev server
URL for its Module Federation remote entry. Vite HMR operates per-plugin —
changes to a plugin hot-reload without affecting the shell or other plugins.

**What `pnpm turbo gen plugin` produces:**

| File                            | Purpose                                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------- |
| `plugins/[name]/vite.config.ts` | Module Federation config; `@family-os/ui` and `@family-os/platform` declared as shared singletons |
| `plugins/[name]/manifest.json`  | Stub matching the `PluginManifest` type                                                           |
| `plugins/[name]/tsconfig.json`  | Extends workspace root config                                                                     |
| `plugins/[name]/src/index.ts`   | Barrel — exposes the plugin module                                                                |
| `plugins/[name]/src/Plugin.tsx` | Minimal example using platform hooks                                                              |
| `pnpm-workspace.yaml`           | Entry added automatically                                                                         |

**Alternatives considered:**

- **Copy-paste template directory:** zero tooling but requires manual
  find-replace on every name; easy to misconfigure the Module Federation
  `name` field or dev port, causing silent federation failures
- **Custom `create-family-os-plugin` CLI:** guided and validated but
  additional tooling to build and maintain; unjustified for a single-team
  project at M0

**Do not revisit unless:** Plugin scaffolding requirements grow complex
enough to justify a custom CLI (e.g., community plugin authors, marketplace
onboarding in M8).
