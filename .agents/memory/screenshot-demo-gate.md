---
name: Screenshotting the gated bid-intelligence-os app
description: How to capture in-app screens that live behind the demo sign-in gate
---

The bid-intelligence-os artifact lands on the marketing page. The in-app router (Command Center, etc.) only renders after a `cca-demo-entered` sessionStorage flag is set (via "Launch Live Demo").

**Rule:** The `screenshot` app_preview tool starts a fresh browser session with no sessionStorage, so it always sees the marketing page — never the in-app screens.

**How to apply:** To screenshot an in-app screen, temporarily force the gate open in `App.tsx` (the `entered` useState initializer — e.g. `() => true || sessionStorage...`), restart the workflow, screenshot, then revert the change and restart again. Always revert before finishing.
