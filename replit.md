# CCA BidIntelligenceOS

A premium, contractor-facing bid intelligence SaaS prototype (tagline: "Research Less, Win More") that helps commercial trade contractors analyze opportunities, structure pricing, build vendor-facing bid packages, and track outcomes.

## Run & Operate

- `pnpm --filter @workspace/bid-intelligence-os run dev` — run the web app (frontend-only)
- `pnpm --filter @workspace/bid-intelligence-os run typecheck` — typecheck the app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind, shadcn/ui, lucide-react icons, recharts, wouter routing
- No backend — 100% frontend with local seeded data

## Where things live

- App entry/routing: `artifacts/bid-intelligence-os/src/App.tsx` (lands on the marketing page `pages/marketing.tsx`; "Launch Live Demo" sets a `cca-demo-entered` sessionStorage flag and renders the app router directly — the sign-in gate was removed. `pages/demo-landing.tsx` is the old sign-in screen, kept on disk but no longer routed)
- Layout (sidebar + topbar, responsive): `artifacts/bid-intelligence-os/src/components/layout.tsx`
- Global mode context (Standalone / ContractorConnect Add-On): `artifacts/bid-intelligence-os/src/lib/context.tsx`
- Seed data (bids, analytics series, defaults): `artifacts/bid-intelligence-os/src/lib/data.ts`
- Client-facing bid package seed data (3 sample proposals: HVAC, Roofing, Multi-location): `artifacts/bid-intelligence-os/src/lib/bid-packages.ts`
- Brand source of truth: the "BidIntelligenceOS" shield+wordmark logo at `src/assets/bidintelligence-logo.png` (background-removed), used in the marketing header and the app sidebar.
- Business-vertical system: `src/lib/verticals.ts` (11 `VerticalConfig`s: GC, HVAC, roofing, electrical, plumbing, concrete, facilities, landscaping, painting, restoration, solar — each with job phases, cost categories, labor/sub categories, permit needs, weather note; `DEFAULT_VERTICAL="gc"`, `getVertical()`). Selected vertical persists to sessionStorage `bios-vertical` via `src/lib/context.tsx` (`vertical`, `setVertical`, `verticalConfig`). Selectors: dropdown in the topbar (layout) and a Business Type card in Settings. Pages read `verticalConfig` to adapt labels/phases/categories.
- Shared operations data contract: `src/lib/operations.ts` — the single source for the bid→job lifecycle and job-execution data (`BID_LIFECYCLE`, `jobDeployments`, `crewMembers`, `subcontractors`, `scheduleEvents`/`scheduleDays`, `jobsiteWeather`, `permitItems`, `costRecords`/`costToDateSeries`/`laborBurnSeries`, `alertItems`, `dailyBriefing`, `voiceCommands`). All new modules import from here. `src/lib/data.ts` still holds `seedBids`/`analyticsData`/etc.
- Persistent VoiceConnect command bar (teal `#0BA3A8`): `src/components/voice-connect/command-bar.tsx` (`VoiceConnectCommandBar`), mounted once in `layout.tsx` so it appears on every in-app screen; uses `voiceCommands` from operations.
- Primary navigation (grouped in `src/components/layout.tsx`): Operations — Command Center (`/`), Daily Briefings (`/briefings`), Alerts (`/alerts`); Bid Lifecycle — Bid Intelligence (`/bids`), Bid Package Builder (`/package-builder`), Won Jobs (`/won-jobs`); Job Execution — Job Deployment (`/deployment`), Scheduling (`/scheduling`), Labor & Subs (`/labor`), Permits & Documents (`/permits`), Weather Watch (`/weather`), Cost & ROI (`/cost-roi`); Intelligence — Industry Use Cases (`/industry-use-cases`), CompetitorWatchOS (`/competitor-watch`, badge "Soon"), VoiceConnect (`/voice-connect`), Analytics (`/analytics`); Account — Business Profile (`/business-profile`), Settings (`/settings`). NavItem supports an optional `badge`.
- Expansion content contracts (shared data files): `src/lib/industry-use-cases.ts` (`INDUSTRY_USE_CASES` — 10 industries, each painPoints/features/dashboardShows + icon key; `VERTICAL_TO_USE_CASE` + `useCaseIdForVertical()` map global vertical ids from `verticals.ts` to the closest use-case id for topbar preselection), `src/lib/competitorwatch.ts` (`COMPETITORWATCH` coming-soon content), `src/lib/ai-features.ts` (`AI_FEATURES` — 10 features incl. Bid Leveling Assistant + Client Update Generator).
- Expansion pages: `src/pages/industry-use-cases.tsx` (vertical-aware industry explorer) and `src/pages/competitor-watch.tsx` (premium Coming Soon + waitlist, lawful/public-signals framing). Command Center and marketing both surface a CompetitorWatchOS coming-soon card; marketing also has industry use-cases, pain-points, AI-features, and VoiceConnect-as-integration sections.
- Audit report: `BIDINTELLIGENCEOS_AUDIT_REPORT.md` at the repo root (Phase 1 deep-dive findings).
- Promo film (`artifacts/promo-video`, served at `/promo/`, workflow "artifacts/promo-video: web"): ~98s 10-scene walkthrough demo (hook → VoiceConnect capture → bid intelligence → client-safe package → bid→job deployment → live job dashboard → daily briefings → industry montage → CompetitorWatchOS locked card → closing CTA). Scenes in `src/components/video/video_scenes/Scene1–Scene10.tsx` + `shared.tsx` (AppFrame/PhoneFrame/Kicker/Waveform helpers); `VideoTemplate.tsx` holds `SCENE_DURATIONS` which MUST stay in sync with `public/audio/composite_audio.mp3` (per-scene TTS VO mixed over a music bed; VO source clips in `attached_assets/generated_audio/`).
- VoiceConnect (premium add-on, teal `#0BA3A8` sub-brand): in-app page `src/pages/voice-connect.tsx` + shared components in `src/components/voice-connect/` (`logo.tsx`, `phones.tsx`, `pillars.tsx`, `marketing-section.tsx`). The same phone/pillar/logo components are reused by the in-app page and the marketing showcase section. Voice-first field-capture companion that hands captures into BidIntelligenceOS as draft bids.
- Command Center (front page, mounted at `/`): `artifacts/bid-intelligence-os/src/pages/command-center.tsx` (the executive cockpit; pulls from operations + data). The old `dashboard.tsx` is kept as a style reference and is still reachable at `/cockpit`.
- New module screens (all wrap `<Layout>`, import from `src/lib/operations.ts`, and are vertical-aware): `briefings.tsx`, `alerts.tsx`, `won-jobs.tsx`, `deployment.tsx`, `scheduling.tsx`, `labor.tsx`, `permits.tsx`, `weather.tsx`, `cost-roi.tsx`, `analytics.tsx`, `business-profile.tsx`.
- Other nav screens: `bids.tsx` (Bid Intelligence), `settings.tsx` (now includes the Business Type selector).
- Legacy routes kept reachable but out of the main nav: `/cockpit` (dashboard.tsx), `/projects`, `/leads`, `/competitors`, `/insights`, `/documents`, `/reports`.
- Deep analysis-workspace screens (intentionally NOT in the main nav, reachable by route/links): `new-bid.tsx`, `scope-analyzer.tsx`, `cost-inputs.tsx`, `bid-fit.tsx`, `strategy-memo.tsx`, `package-builder.tsx` (the package builder is reached from Documents)
- Brand crest (inline SVG, not the PNG): `artifacts/bid-intelligence-os/src/components/cca-crest.tsx`
- Legacy screens kept on disk but no longer routed: `bid-library.tsx`, `monitoring.tsx`, `company-profile.tsx` (superseded by `business-profile.tsx`), `addon.tsx`, `demo-landing.tsx`. Note: `analytics.tsx` was rebuilt and IS now routed at `/analytics`.
- Theme tokens: `artifacts/bid-intelligence-os/src/index.css` (dark navy `#0A0E1A`, panels `#0F1830`/`#111A2E`, electric cyan accent `#38BDF8`, Won `#22C55E`, Lost `#EF4444`)

## Architecture decisions

- Frontend-only prototype: all data is seeded locally in `src/lib/data.ts`; there is no API server dependency for this artifact.
- A global product-mode context drives label/panel adaptation between "Standalone" and "ContractorConnect Add-On" modes while keeping the core workflow identical.
- Bid Package Builder includes a Builder/Preview tabbed flow; internal strategy content is kept separate from the vendor-facing package by design.

## Product

CCA BidIntelligenceOS is a decision-support workspace for commercial trade contractors (HVAC, roofing, electrical, concrete, facilities maintenance). It covers: dashboard overview, company profile, bid library, guided new-bid analysis, scope analysis, cost inputs, bid-fit scoring, internal strategy memo, vendor-facing bid package builder + export preview, bid monitoring, win/loss analytics, and a ContractorConnect add-on view.

## Guardrails (product constraints)

- Never expose or reference any internal pricing formula model.
- Never promise guaranteed bid/pricing/compliance/bonding/licensing/award outcomes.
- Keep internal strategy separate from the vendor-facing bid package.
- All AI/demo output requires user review before export.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
