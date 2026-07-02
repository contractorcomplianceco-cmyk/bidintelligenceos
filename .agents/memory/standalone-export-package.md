---
name: Standalone export package
description: Conventions and pitfalls for the GitHub/Cursor export copy of the app kept under export/
---

The clean, Replit-free export of the web app lives under `export/` (not matched by pnpm-workspace globs, so it never pollutes the monorepo). It is an npm-workspaces repo verified via `npm install && npm run typecheck && npm run build` inside that dir.

**Why:** User migrates to GitHub/Cursor/AWS; the Replit project must stay untouched, and the export must stay ONE clean app (promo film + walkthrough apps intentionally excluded; videos are env-driven external links `VITE_WALKTHROUGH_VIDEO_URL` / `VITE_PROMO_FILM_URL`).

**How to apply:**
- Any new app features must be re-applied to the export copy too if the user wants them migrated — the copy does not track the live app.
- When smoke-testing export dev servers from bash, never `pkill -f vite` — it kills the Replit workflow dev servers too; kill by PID or port instead, then restart affected workflows.
- `zip` CLI is not installed; use `python3 -m zipfile` / the zipfile module.
- Long `npm install` exceeds the 120s bash limit; run once to warm cache, then re-run with `--prefer-offline` to finish fast.
