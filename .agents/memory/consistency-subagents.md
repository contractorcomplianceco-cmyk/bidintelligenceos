---
name: Extending an existing design system with subagents
description: When to prefer GENERAL subagents over DESIGN for parallel UI work that must match an existing look.
---

When fanning out many page/component builds across parallel subagents for an app that
**already has an established visual language**, use GENERAL subagents — not the DESIGN
subagent.

**Why:** DESIGN subagents invent their own visual direction, which fragments consistency
across independently-built pages. The goal here is to *match* the existing system, not
create a new one.

**How to apply:**
- Write a session plan with a shared "SHARED CONTEXT" preamble: exact color tokens, card/
  header patterns, the shared data contract to import from, hard rules (wrap in the app's
  Layout, no emojis, no dead buttons), and 1-2 existing polished pages named as the visual
  reference to read first.
- Give each subagent ONE file to own; forbid editing shared files. Create stub files +
  wire routing first so the app keeps compiling while subagents fill in the stubs in
  parallel.
- Verify with the package's `typecheck` (not `build`) after they finish, then a visual pass.
