# CCA Integration Map — BidIntelligenceOS

Which repo owns each capability and what BidOS consumes vs builds.

## Ownership

| Capability | Owner repo | BidOS role |
|------------|------------|------------|
| Scoring engine IP (`computeBidScore`, Layer A/B) | `Audit-Risk-Model/lib/cca-core` | **Consume** via path import in `apps/api` only |
| Browser-safe types (`BidComplianceSnapshot`) | `Audit-Risk-Model/lib/cca-shared` | Types mirrored in web hooks (no package import required) |
| Contractor audits + scorecards | `Audit-Risk-Model/artifacts/api-server` | **Pull** via `AUDIT_ENGINE_API_URL` |
| Jurisdiction rules (export-ready) | `cca-research-hub` | **Pull** via Supabase bridge env |
| Auth (Clerk) | Platform pattern | Optional `AUTH_ENABLED` + legacy JWT fallback |
| Bids / scores persistence | `bid-intelligence-os/apps/api` | **Own** (Postgres + RLS) |
| Demo fixtures | `bid-intelligence-os/core` | Anonymous demo only |

## Environment bridges

```env
# Audit engine (Compliance ↔ BidOS)
AUDIT_ENGINE_API_URL=https://audit-api.example.com
AUDIT_ENGINE_API_TOKEN=   # optional Bearer for Clerk-protected audit API

# Research Hub jurisdiction preview
RESEARCH_HUB_SUPABASE_URL=
RESEARCH_HUB_SUPABASE_SERVICE_ROLE_KEY=

# Shared auth (optional)
AUTH_ENABLED=true
CLERK_SECRET_KEY=
VITE_CLERK_PUBLISHABLE_KEY=
```

## API routes (BidOS)

| Route | Source |
|-------|--------|
| `GET /api/v1/bids/:id/compliance-eligibility` | Research Hub + audit engine merge |
| `POST /api/v1/bids/:id/score` | `@workspace/cca-core` `computeBidScore` |
| `GET /api/v1/bids/:id/score` | `serializePublicBidScore` (payload-leak safe) |
| `PUT /api/v1/bids/:id/score/lock` | Lock latest score snapshot before submission |
| `POST /api/v1/bids/:id/outcome` | Record won/lost/no-bid outcome for Bid DNA |
| `GET /api/v1/command-center/projection` | Sanitized pipeline snapshot for Command Center |
| `POST /api/v1/bids/:id/outcome` | Record won/lost/no-bid outcome for Bid DNA |

## Pre-build security

1. `scripts/check-cca-core-browser-leak.mjs` — no `cca-core` in `apps/web`
2. `apps/api/src/lib/bid-score-public.test.ts` — public score allow-list tripwire
3. CI: `.github/workflows/ci.yml`

## Acceptance (Rose plan)

- Changing license/trigger status in **Audit** product updates bid compliance on next `POST /api/v1/bids/:id/score` when `AUDIT_ENGINE_API_URL` points at the live audit API and a matching audit exists for bid state/trade.
- Browser never receives scoring weights/multipliers — only category points, verdict, and compliance flags.
