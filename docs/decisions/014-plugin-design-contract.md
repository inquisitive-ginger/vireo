# 014 — Plugin Design Contract

**Status:** Decided

**Decision:** Plugins access platform design primitives via imports
from two shared packages:

```ts
import { Button, Card, TierGate, ... } from '@family-os/ui';
import { useAuth, useTier, ... }        from '@family-os/platform';
```

Vite Module Federation (ADR 007) declares these packages as shared
singletons in the federation config. Plugins receive the shell's
running instance of React and the platform packages — no version
isolation overhead, no injection ceremony.

The `@family-os/ui` surface starts small (core components, TierGate)
and grows deliberately. Every component added to the shared package
is a commitment plugins can depend on — additions are intentional,
not automatic.

Plugins must not:

- Import from the shell or other plugins directly
- Hardcode color values — use CSS custom properties (tokens)
- Use media queries for layout — use CSS container queries so the
  shell controls surface adaptation
- Import Tailwind directly — the platform stylesheet is injected;
  plugins inherit the token set

**Why:** For a project where all plugins are first-party (M0–M7),
import-based access is cleaner and more familiar than injection-based
(passing a `platform` prop into every plugin root). The Federation
singleton config handles the one legitimate concern (version
mismatch). Injection earns its complexity when untrusted third-party
plugins need hard isolation — that is a Marketplace (M8) problem,
not an M0 problem.

**Alternatives considered:** Injection-based Platform API (platform
primitives passed as props at mount) — stronger isolation but verbose
DX and premature for first-party-only plugin set; fully open imports
(plugins import anything from the shell) — breaks plugin isolation
and makes the shell's internals a de-facto public API.

**Do not revisit unless:** M8 Marketplace session determines that
third-party plugin isolation requires a stricter contract.
