# BidIntelligenceOS — Product Contract

Living map of marketing promises → routes → data status. Update when a module goes live.

**Legend:** `live` = persisted API data · `demo` = seed fixtures · `planned` = not built

## Public surfaces (unchanged)

| Promise | Route / entry | Data | Status |
|---------|---------------|------|--------|
| Platform overview | Marketing landing | Static + walkthrough | live |
| Interactive demo | Rose modal, `/demo` hub | Promo film + fixtures | live |
| Launch Interactive Demo | `/?rose-demo=1`, demo subdomain | Fixtures | live |

## Operations

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| Command Center | `/`, `/dashboard` | **partial live** | Bid KPIs + live ROSEOS brief when signed in; ops tiles from `/api/v1/ops/*` when jobs exist; add-on demo cards hidden for authed users |
| Daily Briefings | `/briefings` | **partial live** | Live brief from pipeline tasks, ROSEOS, and compliance counts when signed in; demo fixtures otherwise |
| Alerts | `/alerts` | **partial live** | Overdue follow-ups, compliance gaps, ROSEOS insights, and ops alerts (`/api/v1/ops/alerts`) when signed in |

## Bid lifecycle

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| Bid Intelligence | `/bids`, `/bids/:id` | **live** | API CRUD, Go/No-Go score workflow, outcome recording when authenticated |
| Bid Fit | `/bid-fit` | **partial live** | Live 12-category score when `?bidId=` + signed in; demo otherwise |
| New bid intake | `/new-bid` | **live** | Draft + document upload + ROSEOS scope analysis |
| Package Builder | `/package-builder` | **live** | Section preview from uploaded bid documents + compliance gates via `/api/v1/ops/package-builder`; demo templates for anonymous sessions |
| Won Jobs | `/won-jobs` | **live** | Jobs from `/api/v1/jobs`; convert won bids via `POST /api/v1/jobs/from-bid/:bidId` |
| Government Contracting | `/government` | **partial live** | Demo fixtures for anonymous/demo sessions; live pipeline from Public/GC bids + jurisdiction compliance when signed in; `OpsModuleEmpty` when authed with no qualifying bids or jurisdiction data (no seed contracts) |
| Bid Library | `/bid-library` | **partial live** | Orphan route (not in nav). Live bids list from `/api/v1/bids` when signed in; demo fixtures otherwise; `OpsModuleEmpty` when authed with no bids |
| Bid Monitoring | `/monitoring` | **partial live** | Orphan route (not in nav). Active pipeline from `/api/v1/bids` + jobs KPIs + `/api/health` when signed in; demo fixtures otherwise |

## Job execution

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| Job Deployment | `/deployment` | **live** | Jobs + permits from `/api/v1/jobs` and `/api/v1/ops/permits` when signed in |
| Scheduling | `/scheduling` | **live** | Schedule events from `/api/v1/ops/scheduling` (job payload milestones) |
| Labor & Subs | `/labor` | **live** | Crew/subs from job payload via `/api/v1/ops/labor` |
| Permits | `/permits` | **partial live** | Job payload permits + jurisdiction/compliance-derived items via `/api/v1/ops/permits` |
| Weather | `/weather` | **partial live** | Open-Meteo 5-day forecast per active job (geocoded from site city/state); placeholder fallback when geocode fails |
| Cost & ROI | `/cost-roi` | **partial live** | Job table + portfolio snapshot from `/api/v1/ops/cost-roi`; labor burn time-series demo |
| Risk & Change Orders | `/risk` | **partial live** | Risks from jobs/bids/scores via `/api/v1/ops/risk`; profit-fade from live cost when available |
| Job Closeout | `/closeout` | **live** | Won/completed jobs via `/api/v1/ops/closeout`; punch list, closeout docs, and completion chart from job payload when present; honest empty otherwise |

## Intelligence

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| ROSEOS | `/roseos` | **partial live** | Live pipeline insights + Rose Brain brief when authenticated |
| Analytics | `/analytics` | **partial live** | Win/loss KPIs + bid outcome charts from API when signed in; margin/ROI charts from `/api/v1/ops/cost-roi` when jobs exist; post-job learning loop from live outcomes when ≥3 decided bids (hidden when insufficient); honest empty states otherwise |
| Bid DNA | `/bid-dna` | **partial live** | Derived from closeout jobs, won bids, and score history when signed in; demo fixtures otherwise; `OpsModuleEmpty` when authed with no learning data |
| Market Watch | `/market-watch` | **partial live** | Demo fixtures for anonymous sessions; read-only Research Hub export-ready preview when bridge configured; honest empty for authed users without bridge data |
| Scope analyzer | `/scope-analyzer` | **partial live** | Live brief when `?bidId=` + signed in |

## Add-ons (demo marketplace)

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| Add-On Marketplace | `/add-ons` | demo | Catalog of connected and coming-soon add-ons; fixtures for all sessions |
| VoiceConnect | `/voice-connect` | **demo** | Demo fixtures for anonymous/demo sessions; `OpsModuleEmpty` for authed team users; command bar and command-center feed hidden when signed in |
| VideoConnect | `/video-connect` | demo | Marketing showcase; no live API |
| BuildConnect | `/build-connect` | demo | Marketing showcase; no live API |
| ComplianceConnect | `/compliance-connect` | demo | Marketing showcase; no live API |
| CompetitorWatchOS | `/competitor-watch` | demo | Seed fixtures; coming soon |

## Account

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| Business profile | `/business-profile` | live | |
| Settings | `/settings` | **partial live** | Org/user prefs from `/api/v1/org/profile` when signed in; empty fields for missing data; enterprise tab shows `OpsModuleEmpty` for authed users |

## Guardrails

- Decision-support only; no guaranteed outcomes.
- **Powered by AI. Reviewed by humans** — `humanReviewed` required before client-facing use.
- Demo sessions never mix silent live data — fixtures only.

## Phase 4 API routes (authed team users)

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/ops/scheduling` | Schedule events from job payload |
| `GET /api/v1/ops/permits` | Permits from job payload + jurisdiction/compliance derivation |
| `GET /api/v1/ops/labor` | Crew/subs from job payload |
| `GET /api/v1/ops/weather` | Open-Meteo forecast per active job (geocode from location); placeholder fallback |
| `GET /api/v1/ops/closeout` | Closeout pipeline from won/completed jobs (completion fields) |
| `GET /api/v1/ops/cost-roi` | Cost records from job budget fields |
| `GET /api/v1/ops/risk` | Risks + change orders derived from jobs/bids |
| `GET /api/v1/ops/package-builder` | Active bid packages + documents + compliance |
| `GET /api/v1/ops/alerts` | Ops alerts for briefings/alerts merge |
| `POST /api/v1/jobs/from-bid/:bidId` | Convert won bid to job deployment with seeded schedule |
