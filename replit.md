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
- Business-vertical system: `src/lib/verticals.ts` (13 `VerticalConfig`s: GC, HVAC, roofing, electrical, plumbing, concrete, facilities, landscaping, painting, restoration, solar, insurance (Insurance Restoration & Claims), engineering (Engineering & Design-Build) — each with job phases, cost categories, labor/sub categories, permit needs, weather note; `DEFAULT_VERTICAL="gc"`, `getVertical()`). Selected vertical persists to sessionStorage `bios-vertical` via `src/lib/context.tsx` (`vertical`, `setVertical`, `verticalConfig`). Selectors: dropdown in the topbar (layout) and a Business Type card in Settings. Pages read `verticalConfig` to adapt labels/phases/categories.
- Shared operations data contract: `src/lib/operations.ts` — the single source for the bid→job lifecycle and job-execution data (`BID_LIFECYCLE`, `jobDeployments`, `crewMembers`, `subcontractors`, `scheduleEvents`/`scheduleDays`, `jobsiteWeather`, `permitItems`, `costRecords`/`costToDateSeries`/`laborBurnSeries`, `alertItems`, `dailyBriefing`, `voiceCommands`). All new modules import from here. `src/lib/data.ts` still holds `seedBids`/`analyticsData`/etc.
- Persistent VoiceConnect command bar (teal `#0BA3A8`): `src/components/voice-connect/command-bar.tsx` (`VoiceConnectCommandBar`), mounted once in `layout.tsx` so it appears on every in-app screen; uses `voiceCommands` from operations.
- Primary navigation (grouped in `src/components/layout.tsx`): Operations — Command Center (`/`), Daily Briefings (`/briefings`), Alerts (`/alerts`); Bid Lifecycle — Bid Intelligence (`/bids`), Bid Package Builder (`/package-builder`), Won Jobs (`/won-jobs`); Job Execution — Job Deployment (`/deployment`), Scheduling (`/scheduling`), Labor & Subs (`/labor`), Permits & Documents (`/permits`), Weather Watch (`/weather`), Cost & ROI (`/cost-roi`), Risk & Change Orders (`/risk`), Job Closeout (`/closeout`); Intelligence — Bid DNA (`/bid-dna`), Industry Use Cases (`/industry-use-cases`), Analytics (`/analytics`); Add-Ons — Add-On Marketplace (`/add-ons`), VoiceConnect (`/voice-connect`), VideoConnect (`/video-connect`), CompetitorWatchOS (`/competitor-watch`, badge "Soon"), MarketWatchOS (`/market-watch`, badge "Soon"); Account — Business Profile (`/business-profile`), Settings (`/settings`). NavItem supports an optional `badge`.
- V2 lifecycle modules (each page + typed seed-data lib, all wrap `<Layout>` and are vertical-aware): Bid DNA learning engine `pages/bid-dna.tsx` + `lib/bid-dna.ts` (estimate-vs-actual profiles by job type, accuracy trend, learnings feed with applied/suggested/under-review states); Risk & Change Orders `pages/risk.tsx` + `lib/risk.ts` (risk radar with severity/category filters, change-order table + detail, profit-fade watch — all AI detections framed "flagged for review"); Job Closeout `pages/closeout.tsx` + `lib/closeout.ts` (closeout pipeline cards with 5-stage progress, punch list, documentation checklist, retainage, per-job "Feeds Bid DNA" summaries linking to `/bid-dna`).
- Marketing V2: platform grid has 11 capability cards (incl. Risk & Change Orders, Job Closeout, Bid DNA Learning Engine); how-it-works is a 4-step loop ending "Close & Learn"; "The OS learns" lifecycle band (deploy → track → close → learn) sits under the steps with decision-support/no-guarantee framing. V2b additions: paired flagship add-on section (VoiceConnect teal + VideoConnect violet, framed as separate products that connect to the OS), "On The Roadmap" section with CompetitorWatchOS + MarketWatchOS locked cards (public-data-only framing), and an Add-On Marketplace badge row (VoiceConnect/VideoConnect Connected, CompetitorWatchOS/MarketWatchOS Soon).
- Expansion content contracts (shared data files): `src/lib/industry-use-cases.ts` (`INDUSTRY_USE_CASES` — 10 industries, each painPoints/features/dashboardShows + icon key; `VERTICAL_TO_USE_CASE` + `useCaseIdForVertical()` map global vertical ids from `verticals.ts` — incl. insurance/engineering — to the closest use-case id for topbar preselection), `src/lib/competitorwatch.ts` (`COMPETITORWATCH` coming-soon content), `src/lib/ai-features.ts` (`AI_FEATURES` — 15 features incl. Walkthrough-to-Bid AI (VideoConnect), Sub Intelligence, Market Pricing Intelligence, Bid Simulation Engine, Follow-Up Intelligence).
- Add-on architecture (V2b): add-ons are SEPARATE PRODUCTS that connect into the OS, not internal modules. `src/lib/add-ons.ts` (`ADD_ONS`: VoiceConnect connected/teal, VideoConnect connected/violet `#7C3AED`, CompetitorWatchOS coming-soon, MarketWatchOS coming-soon — each with capabilities[] + dataFlows[] describing what it feeds into the OS; `getAddOn()`). Pages: `src/pages/add-ons.tsx` (Add-On Marketplace hub with integration-architecture strip; add-ons licensed separately), `src/pages/video-connect.tsx` (VideoConnect: walkthrough-to-bid, damage detection, auto documentation, simulated walkthroughs feed), `src/pages/market-watch.tsx` (MarketWatchOS locked coming-soon, public/lawful data only, waitlist). `voice-connect.tsx` is reframed as a connected add-on ("feeds field data into BidIntelligenceOS"); its dark shared showcase components are wrapped in dark `bg-[#0B1220]` panels on the light page. Command Center has a VoiceConnect Feed panel (connected-add-on framing, links to `/voice-connect`).
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
- Dual-layer theme (V2b): the in-app design is a dark shell + LIGHT workspace. `layout.tsx` renders the sidebar/topbar dark (`#0B1220` sidebar, `#111827` topbar, `#1E293B` borders) and the page-content area light (`bg-[#F8FAFC] text-slate-900`). `index.css` `:root` tokens are light (card white, border `#E2E8F0`, primary `#2563EB`, muted-foreground `#64748B`); sidebar tokens stay dark; the layout `useEffect` calls `classList.remove("dark")`. Light-workspace conventions: cards `bg-white border-[#E2E8F0] shadow-sm`, muted `text-slate-500`, accent text `#0284C7`, primary/AI buttons `#2563EB`, VoiceConnect teal `#0BA3A8` (text `#0A8A8F` on light), VideoConnect violet `#7C3AED`; recharts tooltips white/`#E2E8F0`/`#0F172A`, grid `#E2E8F0`, axes `#64748B`. The marketing page (`marketing.tsx`) intentionally STAYS dark navy with explicit hexes (no token classes).

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
