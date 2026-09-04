# 012 — Design Technology Stack

**Status:** Decided

**Decision:** shadcn/ui as the component library, Tailwind CSS v4 for
styling, Lucide for icons.

shadcn/ui uses a copy-paste model — components are scaffolded into the
repo and owned by the project, not versioned through a dependency.
Styling is done via Tailwind CSS utility classes and CSS custom
properties (design tokens). Radix UI primitives underpin all
interactive components, providing accessibility (focus management,
keyboard navigation, ARIA) without a baked-in visual language.

**Why:** Vireo needs to start with a coherent, production-quality
component set and evolve toward its own visual identity over time.
The copy-paste model means components are editable without fighting
a framework — the migration from "shadcn default" to "Vireo
custom" is incremental file edits, not a library upgrade or fork.
Tailwind v4's CSS variable token system makes theming (light/dark,
tier variants) clean and cascade-based with no JavaScript overhead.

**Alternatives considered:** MUI — carries Material Design's visual
language, hard to diverge significantly; Mantine — good theming but
still "Mantine-flavored" at its core; DaisyUI — excellent theming
and fast start but CSS-only components with no accessibility
primitives for complex interactions; Radix headless only — maximum
control but every component written from scratch, too slow for this
project.

**Do not revisit unless:** A fundamental requirement emerges that
shadcn/ui cannot satisfy (e.g., a required component category with
no Radix primitive and no viable alternative).
