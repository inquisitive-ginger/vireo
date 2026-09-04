# Contributing to Vireo

## Code Style & Formatting

### TypeScript

- Strict mode is enabled — no implicit `any`, no non-null assertions without justification
- Prefer `type` over `interface` for simple object shapes; use `interface` only when extending is the intent
- Export types explicitly; don't rely on inferred return types for public API functions
- No default exports except in React component files and config files that require them

### React

- Functional components only — no class components
- Named exports for components (`export function MyComponent`) — not `export default`
- One component per file; filename matches the export name (PascalCase: `MyComponent.tsx`)
- Props typed inline or as a `type` named `[ComponentName]Props`

### File naming

- Components: `PascalCase.tsx` (e.g. `ProfileChip.tsx`)
- Utilities, hooks, config: `kebab-case.ts` (e.g. `use-auth.ts`, `vite.config.ts`)
- Test files: colocated, same name with `.test.ts(x)` suffix (e.g. `ProfileChip.test.tsx`)
- Story files: colocated, same name with `.stories.tsx` suffix

### Imports

- Use workspace package names (`@family-os/ui`, `@family-os/platform`) — never relative imports into another package
- Group imports: external packages first, then workspace packages, then local files

### Formatting

Prettier and ESLint enforce formatting automatically. Run before committing:

```sh
pnpm format   # Prettier
pnpm lint     # ESLint
```

Config files: `.prettierrc` and `eslint.config.mjs` at the repo root.

---

## Branching & Git Workflow

### Branch naming

```
<type>/<module>-<story>
```

Examples:

- `dev/platform-dev-environment`
- `dev/platform-shell-skeleton`
- `fix/auth-session-null`
- `chore/update-dependencies`

Types: `dev` (story implementation), `fix` (bug fix), `chore` (maintenance), `design` (design docs), `arch` (architecture docs)

### Commit messages

Follow the format established in `CLAUDE.md`:

```
[module/story] what changed
```

Examples:

- `[platform/dev-environment] add Turborepo monorepo scaffold`
- `[platform/auth] fix session null on profile switch`

Keep commits focused. Each commit should be a coherent unit of change — not a WIP dump.

### Pull requests

- **One PR per story.** Don't bundle unrelated stories into one PR.
- Branch off `main`; PR targets `main`.
- Merge strategy: **squash merge** — keeps `main` history clean.
- PR description should include:
  - What was built (brief summary)
  - Acceptance criteria status (pass / deferred — with reason if deferred)
  - Any scope additions or new stories created
  - Open questions (if any)

### Review

This is a single-developer project. Self-review via the PR diff before merging is the minimum bar. For significant architectural changes, consider requesting a second opinion before merging.
