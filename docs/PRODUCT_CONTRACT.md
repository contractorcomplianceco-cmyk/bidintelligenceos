# BidIntelligenceOS — Product Contract

Living map of marketing promises → routes → data status. Update when a module goes live.

**Last verified:** 2026-07-08  
**Team URL:** [https://bidintelligence.cagteam.net](https://bidintelligence.cagteam.net)  
**Verified at:** `5e38f98`+ (through org leadership/contact + export-until-reviewed gates)

**Legend:** `live` = persisted API data when signed in · `partial live` = mix of live API + demo fixtures or honest empty · `demo` = seed fixtures / marketing showcase only · `planned` = not built

## Status summary (authed team users)

| Status | Count | Sections |
|--------|------:|----------|
| **partial live** | 18 | Operations (2), Bid lifecycle partials (4), Job execution partials (4), Intelligence (5), Account (2) |
| **live** | 9 | Bid Intelligence, New bid intake, Package Builder, Won Jobs, Job Deployment, Scheduling, Labor & Subs, Job Closeout, ROSEOS |
| **demo** | 11 | Add-ons marketplace (6), Orphan routes (5) |
| **planned** | 0 | — |

Public marketing surfaces (3) are **live** as static/demo-entry experiences — not counted above.

## Public surfaces (unchanged)

| Promise | Route / entry | Data | Status |
|---------|---------------|------|--------|
| Platform overview | Marketing landing | Static + walkthrough | live |
| Interactive demo | Rose modal, `/demo` hub | Promo film + fixtures | live |
| Launch Interactive Demo | `/?rose-demo=1`, demo subdomain | Fixtures | live |

## Operations

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| Command Center | `/`, `/dashboard` | **partial live** | Bid KPIs + live ROSEOS brief and insight cards when signed in; ops tiles from `/api/v1/ops/*` when jobs exist; VoiceConnect / MarketWatch add-on cards hidden for authed users; CompetitorWatch coming-soon card remains |
| Daily Briefings | `/briefings` | **partial live** | Live brief from pipeline tasks, ROSEOS, and compliance counts when signed in; demo fixtures otherwise; briefing archive is demo for anonymous sessions, empty for authed (no archive API) |
| Alerts | `/alerts` | **partial live** | Overdue follow-ups, compliance gaps, ROSEOS insights, and ops alerts (`/api/v1/ops/alerts`) when signed in; demo fixtures otherwise |

## Bid lifecycle

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| Bid Intelligence | `/bids`, `/bids/:id` | **live** | API CRUD, Go/No-Go score workflow, outcome recording when authenticated; package-builder CTA disabled until bid score is human-reviewed (live authed only) |
| Bid Fit | `/bid-fit` | **partial live** | Live 12-category score when `?bidId=` + signed in; demo otherwise |
| New bid intake | `/new-bid` | **live** | Draft + document upload + ROSEOS scope analysis (requires sign-in to persist) |
| Package Builder | `/package-builder` | **live** | Section preview from uploaded bid documents + compliance gates via `/api/v1/ops/package-builder`; PDF/DOCX export disabled until bid score is human-reviewed (live authed only); demo templates for anonymous sessions |
| Won Jobs | `/won-jobs` | **live** | Jobs from `/api/v1/jobs`; convert won bids via `POST /api/v1/jobs/from-bid/:bidId` |
| Government Contracting | `/government` | **partial live** | Demo fixtures for anonymous/demo sessions; live pipeline from Public/GC bids + jurisdiction compliance when signed in; `OpsModuleEmpty` when authed with no qualifying bids or jurisdiction data |
| Bid Library | `/bid-library` | **partial live** | Orphan route (not in nav). Live bids list from `/api/v1/bids` when signed in; demo fixtures otherwise; `OpsModuleEmpty` when authed with no bids |
| Bid Monitoring | `/monitoring` | **partial live** | Orphan route (not in nav). Active pipeline from `/api/v1/bids` + jobs KPIs + `/api/health` when signed in; demo fixtures otherwise |

## Job execution

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| Job Deployment | `/deployment` | **live** | Jobs + permits from `/api/v1/jobs` and `/api/v1/ops/permits` when signed in |
| Scheduling | `/scheduling` | **live** | Schedule events from `/api/v1/ops/scheduling` (job payload milestones); `OpsModuleEmpty` when authed with no events |
| Labor & Subs | `/labor` | **live** | Crew/subs from job payload via `/api/v1/ops/labor`; `OpsModuleEmpty` when authed with no crew data |
| Permits | `/permits` | **partial live** | Job payload permits + jurisdiction/compliance-derived items via `/api/v1/ops/permits` |
| Weather | `/weather` | **partial live** | Open-Meteo 5-day forecast per active job (geocoded from site city/state); placeholder fallback when geocode fails |
| Cost & ROI | `/cost-roi` | **partial live** | Job table + portfolio snapshot + labor burn chart from `/api/v1/ops/cost-roi` (or `/api/v1/ops/labor`) when job payload includes crew hours; honest empty otherwise |
| Risk & Change Orders | `/risk` | **partial live** | Risks from jobs/bids/scores via `/api/v1/ops/risk`; profit-fade from live cost when available |
| Job Closeout | `/closeout` | **live** | Won/completed jobs via `/api/v1/ops/closeout`; punch list, closeout docs, and completion chart from job payload when present; honest empty otherwise |

## Intelligence

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| ROSEOS | `/roseos` | **live** | Live executive brief, section insight cards, verdict counts, and priorities from `/api/v1/intelligence/roseos/summary` + bid context when signed in; demo fixtures for anonymous sessions |
| Analytics | `/analytics` | **partial live** | Win/loss KPIs + bid outcome charts from API when signed in; margin/ROI charts from `/api/v1/ops/cost-roi` when jobs exist; post-job learning loop from live outcomes when ≥3 decided bids (hidden when insufficient); honest empty states otherwise |
| Bid DNA | `/bid-dna` | **partial live** | Derived from closeout jobs, won bids, and score history when signed in; demo fixtures otherwise; `OpsModuleEmpty` when authed with no learning data |
| Market Watch | `/market-watch` | **partial live** | Demo fixtures for anonymous sessions; read-only Research Hub export-ready preview when bridge configured; `OpsModuleEmpty` for authed users without bridge data |
| Scope analyzer | `/scope-analyzer` | **partial live** | Live brief when `?bidId=` + signed in; demo payload otherwise |

## Add-ons (demo marketplace)

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| Add-On Marketplace | `/add-ons` | demo | Catalog of connected and coming-soon add-ons; demo fixtures for anonymous sessions; `OpsModuleEmpty` for authed team users |
| VoiceConnect | `/voice-connect` | **demo** | Demo fixtures for anonymous/demo sessions; `OpsModuleEmpty` for authed team users; command bar and command-center feed hidden when signed in |
| VideoConnect | `/video-connect` | demo | Static marketing showcase; no live API; same static walkthrough cards for all sessions (not gated) |
| BuildConnect | `/build-connect` | demo | Marketing showcase; demo fixtures for anonymous sessions; `OpsModuleEmpty` for authed team users |
| ComplianceConnect | `/compliance-connect` | demo | Marketing showcase; demo fixtures for anonymous sessions; `OpsModuleEmpty` for authed team users |
| CompetitorWatchOS | `/competitor-watch` | demo | Seed fixtures for anonymous sessions; `OpsModuleEmpty` for authed team users; coming soon |

## Account

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| Business profile | `/business-profile` | **partial live** | Org name + job/win-rate KPIs from `/api/v1/org/profile` and live jobs when signed in; licenses, certifications, primary contact (phone/email), and leadership read from org profile JSON when signed in (honest empty when none saved); demo fixtures for anonymous sessions only; edit in Settings → Enterprise & White Label; identity and service-area fields empty until org profile is populated |
| Settings | `/settings` | **partial live** | Org/user prefs from `/api/v1/org/profile` when signed in; enterprise tab persists `licenses`, `certifications`, `phone`, `contactEmail`, and `leadership` JSON fields; white-label, multi-location, and RBAC deferred Phase 5 |

## Orphan routes (not in nav)

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| Legacy cockpit | `/cockpit` | demo | Superseded by Command Center; demo fixtures for anonymous sessions; `OpsModuleEmpty` for authed team users |
| Insights | `/insights` | demo | Orphan win/loss chart; demo fixtures for anonymous sessions; `OpsModuleEmpty` for authed team users |
| Documents hub | `/documents` | demo | Orphan compliance docs view; demo fixtures for anonymous sessions; `OpsModuleEmpty` for authed team users |
| Competitors | `/competitors` | demo | Orphan competitor signals; demo fixtures for anonymous sessions; `OpsModuleEmpty` for authed team users |
| Industry use cases | `/industry-use-cases` | demo | Marketing vertical walkthrough; demo fixtures for anonymous sessions; `OpsModuleEmpty` for authed team users |

## Guardrails

- Decision-support only; no guaranteed outcomes.
- **Powered by AI. Reviewed by humans** — `humanReviewed` required before client-facing use.
- Demo sessions never mix silent live data — fixtures only.
- Authenticated team users never see silent demo seed on gated modules — `useLiveData` or `OpsModuleGate` required on any `@core/` fixture page.

## Phase 4 API routes (authed team users)

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/ops/scheduling` | Schedule events from job payload |
| `GET /api/v1/ops/permits` | Permits from job payload + jurisdiction/compliance derivation |
| `GET /api/v1/ops/labor` | Crew/subs + labor burn series from job payload crew hours |
| `GET /api/v1/ops/weather` | Open-Meteo forecast per active job (geocode from location); placeholder fallback |
| `GET /api/v1/ops/closeout` | Closeout pipeline from won/completed jobs (completion fields) |
| `GET /api/v1/ops/cost-roi` | Cost records + labor burn series from job budget/crew-hour fields |
| `GET /api/v1/ops/risk` | Risks + change orders derived from jobs/bids |
| `GET /api/v1/ops/package-builder` | Active bid packages + documents + compliance |
| `GET /api/v1/ops/alerts` | Ops alerts for briefings/alerts merge |
| `POST /api/v1/jobs/from-bid/:bidId` | Convert won bid to job deployment with seeded schedule |

## Phase 5 (deferred)

| Surface | Status | Notes |
|---------|--------|-------|
| Settings enterprise — white label | planned | Brand color, product name override, custom domain, logo upload |
| Settings enterprise — multi-location | planned | Franchise rollups, regional segmentation, location KPIs |
| Settings enterprise — RBAC | planned | Role templates, permission grants, user invites |
| `GET/PATCH /api/v1/org/profile` enterprise extras | **partial live** | `licenses` (object array), `certifications` (string array), `phone`, `contactEmail`, and `leadership` (object array) persist in `organizations.profile_json`; other enterprise fields not yet modeled |
