# Family OS

A locally-hosted, plugin-native platform for family organization — chores, scheduling, finance, smart home, and more. Designed to grow with the family that runs it.

See [`docs/vision.md`](docs/vision.md) for the full picture.

---

## Getting started

**Prerequisites:** Node.js 22+, pnpm 9+, Docker

```sh
# Install dependencies
pnpm install

# Start PostgreSQL
docker compose up -d

# Start the shell and API
pnpm dev
```

The shell runs at `http://localhost:5173`. The API runs at `http://localhost:3000`.

---

## Commands

| Command                               | What it does                                          |
| ------------------------------------- | ----------------------------------------------------- |
| `pnpm dev`                            | Start all services (shell + API) in watch mode        |
| `pnpm test`                           | Run Vitest across all packages                        |
| `pnpm typecheck`                      | TypeScript check across all packages                  |
| `pnpm storybook`                      | Start the Storybook component catalog (`packages/ui`) |
| `pnpm lint`                           | ESLint across all packages                            |
| `pnpm format`                         | Prettier formatting                                   |
| `pnpm turbo gen plugin --args <name>` | Scaffold a new plugin under `plugins/<name>/`         |

---

## Monorepo structure

```
apps/
  shell/          React + Vite shell application
  api/            Fastify API service

packages/
  platform/       Shared types and platform API (client + server)
  ui/             Shared component library (shadcn/ui + Tailwind CSS v4)
  test-utils/     Shared test utilities (RTL render, profile factories, event bus double)

plugins/          Plugin packages (scaffolded via turbo gen plugin)

turbo/
  generators/     Turborepo generators
```

---

## Documentation

| Doc                                              | What it covers                            |
| ------------------------------------------------ | ----------------------------------------- |
| [`docs/vision.md`](docs/vision.md)               | Why this exists                           |
| [`docs/architecture.md`](docs/architecture.md)   | How pieces fit together                   |
| [`docs/design-system.md`](docs/design-system.md) | Visual language and component conventions |
| [`docs/roadmap.md`](docs/roadmap.md)             | Milestones and delivery status            |
| [`docs/decisions/`](docs/decisions/)             | Architecture decision records             |
| [`CONTRIBUTING.md`](CONTRIBUTING.md)             | Code style and git workflow               |
