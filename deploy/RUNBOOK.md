# Server migration & production runbook

## Health checks

- Liveness: `GET /api/health` — returns `200` when API and database are OK (`driver: postgres` or `sqlite`)
- After deploy: `./deploy/deploy.sh` runs an automatic health curl
- Optional post-deploy smoke: when `BIOS_SMOKE_PASSWORD` is set (shell env or server `.env`), deploy runs `node scripts/smoke-team-url.mjs` after the health curl and **fails the deploy** on `SMOKE FAIL`. When unset, deploy skips smoke with a message (non-blocking). Password is never printed.

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

**Post-deploy smoke (optional):** set `BIOS_SMOKE_PASSWORD` in server `.env` (or export before deploy). The deploy script runs `scripts/smoke-team-url.mjs` automatically after the local health curl. Omit the variable to skip smoke during deploy; run manually when needed:

```bash
BIOS_SMOKE_PASSWORD='…' node scripts/smoke-team-url.mjs
```

See `docs/CARMEN_SETUP.md` for smoke user accounts and env vars (`BIOS_SMOKE_URL`, `BIOS_SMOKE_EMAIL`).

### Cache busting (Vite content hashes)

The web app is built with **Vite**, which emits content-hashed filenames under `apps/web/dist/assets/` (for example `index-Cs2kPRGe.js`, `index-CXY24RMZ.css`). `index.html` references those hashed paths — **no manual `?v=` bump** is required.

- **After any front-end change:** run `./deploy/deploy.sh` (runs `npm run build` then PM2 reload). New hashes are written to disk and served immediately.
- **Verify live bundle after deploy:**

  ```bash
  curl -sS https://bidintelligence.cagteam.net/ | grep -oE '/assets/index-[A-Za-z0-9_-]+\.(js|css)'
  ls apps/web/dist/assets/index-*
  ```

  Hashes in the live HTML must match files on disk.
- **HTML entry:** served by the API with default Express static headers; browsers revalidate `index.html` on each load while hashed `/assets/*` files are safe for long cache (`immutable`) because the URL changes every build.
- **Do not** hand-edit asset filenames in `index.html` — always rebuild via deploy.

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

## VideoConnect add-on bridge

Live walkthrough status and capture UI when the external VideoConnect API is configured:

```env
VIDEO_CONNECT_API_URL=https://ccavideoconnect.com
VIDEO_CONNECT_API_TOKEN=   # optional Bearer for protected VideoConnect API
VIDEO_CONNECT_APP_URL=https://ccavideoconnect.com   # optional capture UI URL (defaults to VIDEO_CONNECT_API_URL)
```

**Production host:** `https://ccavideoconnect.com` (DNS A → `3.129.68.79`, PM2 `ccavideoconnect` on `127.0.0.1:8092`).

- `GET /api/v1/integrations/video-connect/status` — configured / connected / available states for authed team users
- `GET /api/v1/integrations/video-connect/walkthroughs` — proxies walkthrough list when connected (expects `/api/health` and `/api/walkthroughs` on the VideoConnect service)
- `GET /api/health` → `videoConnect: true` when `VIDEO_CONNECT_API_URL` is set
- Authed users without env see honest empty state on `/video-connect`; anonymous sessions keep demo fixtures

## VoiceConnect add-on bridge

Live field capture status when the external VoiceConnect API is configured:

```env
VOICE_CONNECT_API_URL=https://demo.ccavoiceconnect.com
VOICE_CONNECT_API_TOKEN=   # optional Bearer for protected VoiceConnect API
VOICE_CONNECT_APP_URL=https://demo.ccavoiceconnect.com   # optional capture UI URL (defaults to VOICE_CONNECT_API_URL)
```

- `GET /api/v1/integrations/voice-connect/status` — configured / connected / available for authed team users
- `GET /api/v1/integrations/voice-connect/captures` — proxies capture list when connected (probes `/api/summary` POST when no `/api/health`)
- `GET /api/health` → `voiceConnect: true` when `VOICE_CONNECT_API_URL` is set
- Authed users without env see honest empty state on `/voice-connect`; anonymous sessions keep demo fixtures

## Org invites & RBAC (Phase 5)

Postgres: apply `deploy/postgres/002_org_invites.sql` via `node scripts/setup-postgres.mjs` (runs all migrations in order).

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/v1/org/invites` | Owner/admin creates invite |
| `GET` | `/api/v1/org/invites` | List pending invites |
| `DELETE` | `/api/v1/org/invites/:id` | Revoke pending invite |
| `POST` | `/api/v1/org/invites/accept` | Accept token → `organization_members` row |
| `GET` | `/api/v1/org/members` | Real join on `organization_members` + `users` |

Invite accept links use `APP_PUBLIC_URL` (or `CORS_ORIGIN`) + `/settings?invite=TOKEN`.

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
- Legacy `/api/v1/auth/login` returns 400 when Clerk is enabled **unless** `BIOS_SMOKE_PASSWORD` is set and the email is allowlisted (`carmen@ccacontact.com`, `rose@ccacontact.com`) — dual overlay for team QA
- Password for smoke users: `BIOS_SMOKE_PASSWORD` on server (default documented as teamwork); never log or commit the value. Reseed with `node scripts/seed-smoke-users.mjs`, then `node scripts/seed-smoke-bids.mjs` for FL sample bids/jobs

### Team URL (production)

**Use:** `https://bidintelligence.cagteam.net` (DNS A → `3.129.68.79`).

**Do not use:** `bidintelligence.docs.cagteam.net`. An nginx vhost for that hostname exists on the server (`deploy/nginx/bidintelligence.docs.cagteam.net.conf` → `/etc/nginx/sites-enabled/`), but **there is no DNS record** — the subdomain does not resolve. Treat the vhost as orphaned; do not point users, Clerk redirects, smoke tests, or env vars at it.

#### Safe removal of orphaned `bidintelligence.docs.cagteam.net` vhost (doc only — do not run without Carmen approval)

1. Confirm team traffic uses `https://bidintelligence.cagteam.net` only (`curl -sS https://bidintelligence.cagteam.net/api/health`, `node scripts/smoke-team-url.mjs`, Clerk preflight).
2. Verify no env or Clerk Dashboard URLs reference `bidintelligence.docs.cagteam.net` (`node scripts/clerk-cutover-preflight.mjs --check-only`).
3. On the server, inspect active config (read-only): `ls -l /etc/nginx/sites-enabled/ | grep bidintelligence.docs` and `sudo nginx -t`.
4. **After Carmen approves:** disable the vhost symlink, test, reload:
   - `sudo rm /etc/nginx/sites-enabled/bidintelligence.docs.cagteam.net.conf`
   - `sudo nginx -t && sudo systemctl reload nginx`
5. Optionally revoke the unused Let's Encrypt cert: `sudo certbot delete --cert-name bidintelligence.docs.cagteam.net`
6. Remove `deploy/nginx/bidintelligence.docs.cagteam.net.conf` from the repo in a follow-up docs PR once the server config is gone.

Do **not** remove or edit live nginx config during routine deploys.

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

Dual-driver support: set `DATABASE_URL` for Postgres + RLS; omit for SQLite dev. Schema lives in `deploy/postgres/` (`001_init.sql`, `002_org_invites.sql`) and Drizzle `schema-pg.ts`. Apply with `node scripts/setup-postgres.mjs`.

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

### CCA uptime monitoring (`bid-intelligence-health-monitor`)

BidIntelligenceOS follows the CCA uptime rule: durable PM2 process manager, 15-minute health checks, and email alerts to Carmen on failure (no secrets or live customer data in alert body).

| Item | Value |
|------|-------|
| Monitor script | `scripts/monitor-bid-intelligence-health.mjs` |
| PM2 app | `bid-intelligence-health-monitor` (defined in `deploy/ecosystem.config.cjs`) |
| Interval | Every **15 minutes** (`sleep 900` loop) |
| Alert recipient | `carmenaburoda@gmail.com` (`BIOS_ALERT_EMAIL` or `CCA_UPTIME_EMAIL`) |
| Mail helper | `/home/ubuntu/scripts/cca-uptime-sendmail.py` (Zoho SMTP via `profitpulse/scripts/uptime-alert-settings`) |
| Alert cooldown | 1 hour (`BIOS_ALERT_COOLDOWN_MS`, default 3600000) |
| Retries before alert | 3 attempts, 15s apart |

**Checks on each run**

1. PM2 apps online: `bid-intelligence-os`, `bid-intelligence-health-monitor`, `bid-intelligence-ppi-refresh` (override with `BIOS_PM2_APPS`)
2. Local API health: `http://127.0.0.1:5001/api/health`
3. Public site: `https://ccabidintelligence.com/`
4. Public API health: `https://ccabidintelligence.com/api/health`

**Verify (no test email sent)**

```bash
pm2 list | grep bid-intelligence
node scripts/monitor-bid-intelligence-health.mjs   # exit 0 + "health OK" when healthy
pm2 logs bid-intelligence-health-monitor --lines 20 --nostream
```

A healthy run prints `BidIntelligenceOS health OK` and does **not** send email. Alerts fire only after all retries fail; subject is `[CCA] BidIntelligenceOS health alert`. Do not force a failure to test email delivery in production.

**Start / persist**

```bash
pm2 start deploy/ecosystem.config.cjs --only bid-intelligence-health-monitor
pm2 save
```

Keep `bid-intelligence-os`, `bid-intelligence-health-monitor`, and `bid-intelligence-ppi-refresh` online. `./deploy/deploy.sh` reloads the API and leaves the monitor/PPI refresh loops running.

## Custom domain cutover (enterprise white-label)

Organizations can save a `customDomain` hostname on their org profile (Settings → Enterprise). TLS automation is **not** implemented — Carmen provisions certificates manually after DNS is verified.

### DNS (customer side)

1. Customer adds a **CNAME** record: `{customDomain}` → `bidintelligence.cagteam.net`
2. Optional: verify propagation with `dig +short CNAME bids.customer.com`
3. Save the hostname in BidOS Settings before requesting TLS

### TLS (Carmen / ops — deferred automation)

1. Confirm CNAME resolves to the team URL origin
2. Issue or attach TLS cert for the custom hostname on nginx/Cloudflare (same origin as team URL)
3. Add nginx `server_name` block or Cloudflare custom hostname mapping
4. Smoke: `curl -sS -o /dev/null -w '%{http_code}' https://{customDomain}/api/health` → `200`

**Not automated in Phase 5:** cert issuance, nginx reload for new hostnames, or Clerk allowed-origin updates for custom domains. Track in Phase 6 if Clerk must accept the custom domain for auth redirects.
