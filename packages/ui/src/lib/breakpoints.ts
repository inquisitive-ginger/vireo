/* The one breakpoint the shell turns on. Below it the chrome is a brand top bar
   and a bottom tab bar; at and above it, a sidebar. The page frame steps here
   too (ADR 074) — it used to step at `sm:`, one breakpoint early, which left a
   128px band wearing the desktop gutter under mobile chrome.

   Tailwind's `md:` is the same number. This exists for the measurements JS has to
   make itself, so a grid that stacks and a frame that widens cannot drift apart. */
export const BREAKPOINT_MD = 768
