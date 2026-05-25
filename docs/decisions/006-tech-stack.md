# 006 — Tech Stack

**Status:** Decided

**Decision:** TypeScript end-to-end. React for the shell and all
first-party plugin UIs. Node.js (Fastify) for backend plugin services
and the platform API server.

**Why:** A single language across shell, plugins, and backend minimises
context-switching and lowers the bar for plugin authors — they need
one runtime, one type system, one toolchain. Fastify is chosen over
Express for its performance and native TypeScript support. React is
chosen over Vue or Svelte for its dominance in the micro-frontend /
Module Federation ecosystem, which directly supports ADR 007.

**Alternatives considered:** TypeScript frontend + Go backend (better
raw performance on constrained hardware, but adds a second language
for plugin service authors and is unnecessary given the primary server
is a repurposed x86 laptop with 8GB+ RAM); TypeScript frontend +
Python backend (rich home-automation ecosystem, but slower and a worse
fit for the plugin contract model).

**Do not revisit unless:** A concrete performance ceiling is hit on
real hardware that TypeScript/Node cannot address, or Go/Python
becomes a first-class requirement of a specific module.
