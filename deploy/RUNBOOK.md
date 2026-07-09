# Server migration & production runbook

## Health checks

- Liveness: `GET /api/health` — returns `200` when API and database are OK (`driver: postgres` or `sqlite`)
- After deploy: `./deploy/deploy.sh` runs an automatic health curl

## Environment (production)

```env
NODE_ENV=production
HOST=0.0.0.0
API_PORT=5001
SESSION_SECRET=<long-random-secret>
DATABASE_URL=postgresql://bid_intelligence_app:PASSWORD@127.0.0.1:5432/bid_intelligence
# BIOS_UPLOADS_DIR=/var/lib/bid-intelligence-os/uploads

# Research Hub export-ready bridge (server-only)
# Same-server default can read:
# /home/ubuntu/projects/cca-research-hub/web/.env.local
# On another server set these explicitly:
RESEARCH_HUB_SUPABASE_URL=<supabase-url>
RESEARCH_HUB_SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

## Deploy

```bash
cd /home/ubuntu/projects/bid-intelligence-os
./deploy/deploy.sh
```

## Postgres (production)

When `DATABASE_URL` is set, the API uses Postgres with **org_id row-level security** on tenant tables. Application middleware sets `app.org_id` per authenticated request.

```bash
node scripts/setup-postgres.mjs          # schema + RLS
node scripts/migrate-sqlite-to-postgres.mjs   # one-time copy from data/bios.db
```

Without `DATABASE_URL`, dev falls back to SQLite at `data/bios.db`.

## Document uploads

- `POST /api/v1/bids/:id/documents` — multipart `files` (PDF, TXT, DOCX; 15MB each)
- **Local (default):** `data/uploads/{orgId}/{bidId}/`
- **S3:** `BIOS_S3_BUCKET` for multi-server deploys
- PDF/TXT/DOCX extracted for ROSEOS; **human review required** before client use

## Audit engine compliance pull

Bid scoring compliance points can pull from the CCA Audit API when configured:

```env
AUDIT_ENGINE_API_URL=https://your-audit-api-host
AUDIT_ENGINE_API_TOKEN=   # optional Bearer (Clerk session JWT or service token)
```

- Matches audits by bid **state** + **trade** (`bid.type`)
- Surfaces **critical triggers** and audit final status on compliance panel
- Scoring engine: `@workspace/cca-core` (`computeBidScore`) — server-only
- See `docs/CCA_INTEGRATION_MAP.md`

## Shared CCA auth (Clerk)

Optional — when unset, legacy email/password JWT cookies continue to work.

```env
AUTH_ENABLED=true
CLERK_SECRET_KEY=sk_live_...
CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...   # baked into web build
ADMIN_EMAILS=owner@example.com           # comma-separated → owner role
```

- API: `@clerk/express` middleware + sync to local `users` / `organizations`
- Web: `@clerk/clerk-react` Sign in/up at `/login` and `/register`
- Legacy `/api/v1/auth/login` returns 400 when Clerk is enabled

### Temporary smoke-test auth (before Clerk)

For team QA when Clerk redirect URLs or DNS are being fixed:

1. In `.env` (server only — do not commit):
   - `AUTH_ENABLED=false`
   - Comment out or remove `VITE_CLERK_PUBLISHABLE_KEY` so the web build uses the legacy `/login` form (Clerk keys stay in `.env` for later)
2. Seed QA users: `node scripts/seed-smoke-users.mjs`
   - Default accounts: `carmen@ccacontact.com`, `rose@ccacontact.com`
   - Password from `BIOS_SMOKE_PASSWORD` (default `teamwork`) — temporary only
3. Rebuild and restart: `./deploy/deploy.sh`
4. Sign in at `https://bidintelligence.cagteam.net/login` with email + password

**Restore Clerk when ready:**

1. Set `AUTH_ENABLED=true` and restore `VITE_CLERK_PUBLISHABLE_KEY`
2. In [Clerk Dashboard](https://dashboard.clerk.com) → your app → **Paths / Redirect URLs**, add:
   - `https://bidintelligence.cagteam.net`
   - `https://bidintelligence.cagteam.net/login`
   - `https://bidintelligence.cagteam.net/register`
   - Sign-in/sign-up fallback: `https://accounts.docs.cagteam.net/sign-in` and `/sign-up` if using the hosted account portal
3. Run `node scripts/sync-clerk-env.mjs` (optional) and `./deploy/deploy.sh`
4. Remove or rotate smoke-test passwords in Postgres when no longer needed

## Object storage (S3)

For multi-server or ephemeral disks, set `BIOS_S3_BUCKET`. Uses default AWS credential chain (env keys or EC2 instance role). Without it, uploads stay on local disk under `BIOS_UPLOADS_DIR` or `data/uploads/`.

## Backups

Postgres:

```bash
pg_dump "$DATABASE_URL" > "backups/bios-$(date +%F).sql"
```

SQLite (dev fallback):

```bash
cp data/bios.db "backups/bios-$(date +%F).db"
```

Retain 30 days minimum.

## Moving to another server

1. Copy repo + `data/bios.db` (or Postgres dump when migrated)
2. Set `.env` with same `SESSION_SECRET` if preserving sessions
3. Run `./deploy/deploy.sh`
4. Point nginx `proxy_pass` to `:5001`

## Optional API subdomain split

Set `VITE_API_BASE_URL=https://api.ccabidintelligence.com` at build time and enable `CORS_ORIGIN` on the API.

## Research Hub bridge

BidIntelligenceOS exposes a sanitized preview at:

```bash
curl "http://127.0.0.1:5001/api/v1/research/export-ready?state=FL&limit=8"
```

This calls Research Hub's `compliance_export_ready_preview` RPC server-side and returns only:

- `ccaRfCode`
- `stateCode`
- `riskFactorNumber`
- workflow / validation status
- `humanApproved`
- `updatedAt`

Raw research notes, statute text, credentials, service role keys, and Supabase URLs are never sent to the browser.

## Postgres migration

Dual-driver support: set `DATABASE_URL` for Postgres + RLS; omit for SQLite dev. Schema lives in `deploy/postgres/001_init.sql` and Drizzle `schema-pg.ts`.
