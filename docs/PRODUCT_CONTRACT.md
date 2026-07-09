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
| Command Center | `/`, `/dashboard` | **partial live** | Bid KPIs + live ROSEOS brief when signed in; ops tiles from `/api/v1/ops/*` when jobs exist |
| Daily Briefings | `/briefings` | **partial live** | Live brief from command center + ROSEOS when signed in; demo fixtures otherwise |
| Alerts | `/alerts` | **partial live** | Pipeline + ROSEOS + ops alerts (`/api/v1/ops/alerts`) when signed in |

## Bid lifecycle

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| Bid Intelligence | `/bids`, `/bids/:id` | **live** | API CRUD, Go/No-Go score workflow, outcome recording when authenticated |
| Bid Fit | `/bid-fit` | **partial live** | Live 12-category score when `?bidId=` + signed in; demo otherwise |
| New bid intake | `/new-bid` | **live** | Draft + document upload + ROSEOS scope analysis |
| Package Builder | `/package-builder` | **partial live** | Live bid packages + compliance checklist from API when signed in; full preview demo |
| Won Jobs | `/won-jobs` | **live** | Jobs from `/api/v1/jobs`; convert won bids via `POST /api/v1/jobs/from-bid/:bidId` |
| Government Contracting | `/government` | demo | Seed |

## Job execution

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| Job Deployment | `/deployment` | **live** | Jobs + permits from `/api/v1/jobs` and `/api/v1/ops/permits` when signed in |
| Scheduling | `/scheduling` | **live** | Schedule events from `/api/v1/ops/scheduling` (job payload milestones) |
| Labor & Subs | `/labor` | **live** | Crew/subs from job payload via `/api/v1/ops/labor` |
| Permits | `/permits` | **partial live** | Job payload permits via `/api/v1/ops/permits` |
| Weather | `/weather` | **partial live** | Placeholder forecast per active job; external feed optional |
| Cost & ROI | `/cost-roi` | **partial live** | Budget/cost from job payload via `/api/v1/ops/cost-roi` |
| Risk & Change Orders | `/risk` | **partial live** | Derived risks from jobs/bids via `/api/v1/ops/risk`; profit-fade charts demo |
| Job Closeout | `/closeout` | **partial live** | Completed/near-complete jobs via `/api/v1/ops/closeout`; punch list demo |

## Intelligence

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| ROSEOS | `/roseos` | **partial live** | Live pipeline insights + Rose Brain brief when authenticated |
| Analytics | `/analytics` | **partial live** | Win/loss KPIs from API when signed in; charts demo |
| Bid DNA | `/bid-dna` | demo | Seed |
| Market Watch | `/market-watch` | demo | Seed |
| Scope analyzer | `/scope-analyzer` | **partial live** | Live brief when `?bidId=` + signed in |

## Account

| Module | Route | Status |
|--------|-------|--------|
| Business profile | `/business-profile` | live |
| Settings | `/settings` | demo |

## Guardrails

- Decision-support only; no guaranteed outcomes.
- **Powered by AI. Reviewed by humans** — `humanReviewed` required before client-facing use.
- Demo sessions never mix silent live data — fixtures only.

## Phase 4 API routes (authed team users)

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/ops/scheduling` | Schedule events from job payload |
| `GET /api/v1/ops/permits` | Permits from job payload |
| `GET /api/v1/ops/labor` | Crew/subs from job payload |
| `GET /api/v1/ops/weather` | Weather placeholder per active job |
| `GET /api/v1/ops/closeout` | Closeout pipeline from completed jobs |
| `GET /api/v1/ops/cost-roi` | Cost records from job budget fields |
| `GET /api/v1/ops/risk` | Risks + change orders derived from jobs/bids |
| `GET /api/v1/ops/package-builder` | Active bid packages + compliance |
| `GET /api/v1/ops/alerts` | Ops alerts for briefings/alerts merge |
| `POST /api/v1/jobs/from-bid/:bidId` | Convert won bid to job deployment with seeded schedule |
