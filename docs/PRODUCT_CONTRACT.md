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
| Command Center | `/`, `/dashboard` | **partial live** | Bid KPIs from API when signed in; jobs/alerts/schedule demo |
| Daily Briefings | `/briefings` | demo | Seed |
| Alerts | `/alerts` | demo | Seed |

## Bid lifecycle

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| Bid Intelligence | `/bids`, `/bids/:id` | **live** | API CRUD when authenticated |
| New bid intake | `/new-bid` | **live** | Draft + document upload + ROSEOS scope analysis |
| Package Builder | `/package-builder` | demo | Seed |
| Won Jobs | `/won-jobs` | **partial live** | API when authenticated |
| Government Contracting | `/government` | demo | Seed |

## Job execution

| Module | Route | Status |
|--------|-------|--------|
| Job Deployment | `/deployment` | partial live |
| Scheduling | `/scheduling` | partial live |
| Labor & Subs | `/labor` | demo |
| Permits | `/permits` | partial live |
| Weather | `/weather` | demo |
| Cost & ROI | `/cost-roi` | demo |
| Risk & Change Orders | `/risk` | demo |
| Job Closeout | `/closeout` | partial live |

## Intelligence

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| ROSEOS | `/roseos` | **partial live** | Live pipeline insights when authenticated |
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
