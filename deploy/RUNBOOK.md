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

**Team URL:** `https://bidintelligence.cagteam.net` (DNS A → `3.129.68.79`). Do not use `bidintelligence.docs.cagteam.net` unless that subdomain is added in DNS — it currently does not resolve.

### Clerk cutover checklist — `bidintelligence.cagteam.net` (not enabled yet)

Production is on **legacy smoke-test auth** (`AUTH_ENABLED=false`) so the team can sign in while Clerk redirect URLs are finalized. **Do not flip Clerk on until every step below is done.**

#### 0. Preflight (read-only — run before cutover)

```bash
cd /home/ubuntu/projects/bid-intelligence-os
node scripts/clerk-cutover-preflight.mjs --check-only
```

Checks (never prints secret values):

- Required Clerk / app URL env var **names** are present
- `CLERK_PUBLISHABLE_KEY` / `VITE_CLERK_PUBLISHABLE_KEY` match `pk_live_*` or `pk_test_*`
- `CORS_ORIGIN`, `BIOS_PUBLIC_URL`, `VITE_APP_URL` match `https://bidintelligence.cagteam.net`
- Prints expected Clerk Dashboard redirect URL list for `bidintelligence.cagteam.net`
- `AUTH_ENABLED` is **not** `true` (production not flipped yet)
- `scripts/sync-clerk-env.mjs` and `scripts/seed-smoke-users.mjs` exist

Fix any `PREFLIGHT FAIL` items before step 1. A `WARN` on commented `VITE_CLERK_PUBLISHABLE_KEY` is expected while smoke-test auth is active.

#### 1. Server `.env` (never commit secrets)

```env
AUTH_ENABLED=true
CLERK_SECRET_KEY=sk_live_...
CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...   # required — baked into web build at deploy time
VITE_CLERK_SIGN_IN_URL=https://accounts.docs.cagteam.net/sign-in
VITE_CLERK_SIGN_UP_URL=https://accounts.docs.cagteam.net/sign-up
ADMIN_EMAILS=owner@example.com           # comma-separated → owner role in BidOS
```

- Copy keys from Command Center: `node scripts/sync-clerk-env.mjs` (sets the vars above from `cca-command-center-cloud` artifacts).
- Remove or comment the smoke-test block (`AUTH_ENABLED=false`, commented `VITE_CLERK_PUBLISHABLE_KEY`).

#### 2. Clerk Dashboard — allowed origins & redirect URLs

In [Clerk Dashboard](https://dashboard.clerk.com) → your CCA app → **Paths** / **Redirect URLs** / **Allowed origins**, add:

| Purpose | URL |
|--------|-----|
| App origin | `https://bidintelligence.cagteam.net` |
| Sign-in return | `https://bidintelligence.cagteam.net/login` |
| Sign-up return | `https://bidintelligence.cagteam.net/register` |
| Hosted account portal (if used) | `https://accounts.docs.cagteam.net/sign-in`, `https://accounts.docs.cagteam.net/sign-up` |

After sign-in, Clerk should return users to the BidOS app on `bidintelligence.cagteam.net`, not `bidintelligence.docs.cagteam.net`.

#### 3. Deploy (rebuild required)

`VITE_CLERK_*` values are compiled into the web bundle — a restart alone is not enough.

```bash
cd /home/ubuntu/projects/bid-intelligence-os
./deploy/deploy.sh
```

#### 4. Verify

- `GET https://bidintelligence.cagteam.net/api/health` → `200`
- `/login` shows Clerk (not email/password form)
- `POST /api/v1/auth/login` returns `400` when Clerk is enabled
- New Clerk user syncs to local `users` / `organizations` on first API call

#### 5. Decommission smoke-test auth

- Rotate or delete smoke-test users (`node scripts/seed-smoke-users.mjs` accounts) in Postgres
- Clear `BIOS_SMOKE_PASSWORD` from `.env` if set

#### Rollback (revert to smoke-test / legacy auth)

If Clerk cutover causes login issues, roll back **without** deleting Clerk keys from `.env`:

1. In server `.env` (never commit):
   - `AUTH_ENABLED=false`
   - Comment out or remove `VITE_CLERK_PUBLISHABLE_KEY` (forces legacy `/login` form in the web build)
   - Keep `CLERK_SECRET_KEY` / `CLERK_PUBLISHABLE_KEY` in place for a later retry
2. Reseed QA users if passwords were rotated: `node scripts/seed-smoke-users.mjs`
3. Rebuild and restart (required — `VITE_*` is baked at build time):

   ```bash
   ./deploy/deploy.sh
   ```

4. Verify: `GET https://bidintelligence.cagteam.net/api/health` → `200`; `/login` shows email/password; smoke users can sign in.
5. Re-run preflight before the next cutover attempt:

   ```bash
   node scripts/clerk-cutover-preflight.mjs --check-only
   ```

**Scripts reference**

| Script | Purpose |
|--------|---------|
| `node scripts/clerk-cutover-preflight.mjs --check-only` | Read-only cutover readiness (no deploy, no env writes) |
| `node scripts/sync-clerk-env.mjs` | Copy Clerk keys from `cca-command-center-cloud` into `.env` and set `AUTH_ENABLED=true` — **only run when ready to cut over** |
| `node scripts/seed-smoke-users.mjs` | Create/update legacy QA users (`carmen@ccacontact.com`, `rose@ccacontact.com`) for smoke-test auth |

### Temporary smoke-test auth (current production)

For team QA when Clerk redirect URLs or DNS are being fixed:

1. In `.env` (server only — do not commit):
   - `AUTH_ENABLED=false`
   - Comment out or remove `VITE_CLERK_PUBLISHABLE_KEY` so the web build uses the legacy `/login` form (Clerk keys stay in `.env` for later)
2. Seed QA users: `node scripts/seed-smoke-users.mjs`
   - Default accounts: `carmen@ccacontact.com`, `rose@ccacontact.com`
   - Password from `BIOS_SMOKE_PASSWORD` (default `teamwork`) — temporary only
3. Rebuild and restart: `./deploy/deploy.sh`
4. Sign in at `https://bidintelligence.cagteam.net/login` with email + password

Follow **Clerk cutover checklist** above when ready to enable Clerk.

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

## Troubleshooting (PM2 restarts)

### Symptom: high `↺` count on `bid-intelligence-os`

1. Check status and restart counts:

   ```bash
   pm2 list | grep bid-intelligence
   pm2 describe bid-intelligence-os
   ```

2. Inspect recent logs (look for port/env/OOM — do not paste secrets):

   ```bash
   pm2 logs bid-intelligence-os --lines 80 --nostream
   pm2 logs bid-intelligence-os --err --lines 80 --nostream
   curl -sf http://127.0.0.1:5001/api/health
   ```

3. **Known cause (fixed 2026-07-09):** PM2 `cluster_mode` with `script: npm` caused a restart loop — API logged “listening on :5001” then exited with code 1. Fix is `exec_mode: fork` and `exec tsx` directly (`deploy/ecosystem.config.cjs`). Redeploy:

   ```bash
   ./deploy/deploy.sh
   ```

4. After redeploy, confirm `exec mode` is `fork_mode` and restarts are stable for several minutes:

   ```bash
   pm2 describe bid-intelligence-os | grep -E 'exec mode|restarts|uptime'
   ```

### Health monitor (`bid-intelligence-health-monitor`)

- PM2 app runs `scripts/monitor-bid-intelligence-health.mjs` every **15 minutes** (`sleep 900`).
- Alerts email Carmen at `carmenaburoda@gmail.com` when local/public health or required PM2 apps fail (cooldown 1h).
- One-off check: `node scripts/monitor-bid-intelligence-health.mjs`
- Required PM2 apps: `bid-intelligence-os`, `bid-intelligence-health-monitor` (override with `BIOS_PM2_APPS`).
