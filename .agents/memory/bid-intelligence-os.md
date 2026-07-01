---
name: BidIntelligenceOS conventions
description: Durable conventions/gotchas for the bid-intelligence-os artifact (frontend-only React+Vite prototype).
---

## Demo gate blocks the screenshot tool
The app hides everything behind a marketing landing until a sessionStorage flag
(`cca-demo-entered` === "1") is set by clicking "Launch Live Demo". The screenshot /
app_preview tool loads a fresh browser and cannot click, so it only ever sees the
marketing page.

**How to verify internal pages visually:** temporarily change the `entered` useState
initializer in `App.tsx` to `() => true || ...`, restart the workflow, screenshot the
routes you need, then revert to `() => sessionStorage.getItem("cca-demo-entered") === "1"`
and re-run typecheck. Always revert before finishing.

## Data lives in two libs, keep them separate
- `src/lib/data.ts` = bid/marketing/analytics seed (`seedBids`, `analyticsData`, etc.).
- `src/lib/operations.ts` = the bid→job lifecycle + job-execution contract consumed by all
  the newer modules (deployment, scheduling, labor, permits, weather, cost-roi, alerts,
  briefings, command-center). Treat operations.ts as the single shared contract; page files
  import from it rather than redefining data.
**Why:** 12 module pages were built in parallel against this one contract, so changing a
type/shape there ripples across every module — edit deliberately.

## Verticals are global + persisted
`src/lib/verticals.ts` (11 configs) drives per-trade labels/phases/cost categories. Selection
is in `context.tsx` and persists to sessionStorage `bios-vertical`. Pages should read
`verticalConfig` from `useAppContext()` to stay vertical-aware.

## Guardrails (product constraints, enforced in UI copy)
No internal pricing-formula/model exposure; no guaranteed bid/pricing/bonding/award outcomes;
client-facing output hides margin/strategy/AI reasoning; projections carry a
"decision-support only / review before sending" note. Keep these when editing any module.
