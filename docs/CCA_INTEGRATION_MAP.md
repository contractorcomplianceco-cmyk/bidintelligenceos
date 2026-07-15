# CCA Integration Map — BidIntelligenceOS

Which repo owns each capability and what BidOS consumes vs builds.

## Ownership

| Capability | Owner repo | BidOS role |
|------------|------------|------------|
| Scoring engine IP (`computeBidScore` / Rose Pursuit Confidence v1, Layer A/B) | `Audit-Risk-Model/lib/cca-core` on **main** | **Consume** via path import in `apps/api` only — pin in [ARM_ENGINE_PIN.md](./ARM_ENGINE_PIN.md); formula [ROSE_CONFIDENCE_FORMULA_V1.md](./ROSE_CONFIDENCE_FORMULA_V1.md) |
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

## Live verification (2026-07-08)

| Check | Result |
|-------|--------|
| `AUDIT_ENGINE_API_URL` in BidOS `.env` | Set → `http://127.0.0.1:3002` (local `cca-audit-api`) |
| `GET /api/health` → `auditEngine` | `true` (local `:5001` and prod `bidintelligence.cagteam.net`) |
| `cca-audit-api` PM2 | **online** — cwd `Audit-Risk-Model/artifacts/api-server`, port **3002** |
| FL acceptance audit `CCA-2026-BIOS-FL` | Present in audit API (`id: 1`, 1 critical trigger `license_expired`) |
| `GET /api/v1/research/compliance-eligibility?state=FL` | `auditConnected: true`, `auditCode: CCA-2026-BIOS-FL`, `auditFinalStatus: Critical Review Required`, `eligibilityPoints: 0` (expected — unresolved critical trigger) |
| Prod compliance smoke | Same audit pull confirmed on `https://bidintelligence.cagteam.net` |

**Notes**

- Research Hub jurisdiction rows for `FL` may fall back to another priority state when no export-ready FL rows exist; audit matching is independent and correctly resolves `CCA-2026-BIOS-FL` for Florida.
- `GET /api/v1/bids/:id/compliance-eligibility` requires auth (org-scoped); use the research route for unauthenticated smoke tests.
- Audit API has no dedicated `/api/health` route; liveness is verified via `GET /api/audits`.

See also: `docs/ROSE_GITHUB_MAIN_ALIGNMENT.md` appendix — Audit-Risk-Model merge status.
