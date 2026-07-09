# Carmen setup guide — click by click

What **you** need to do outside the codebase to finish Rose plan Phase 3+. The app is deployed at **https://ccabidintelligence.com**; demo stays at **https://demo.ccabidintelligence.com**.

---

## Already done on the server (no action)

- Postgres `bid_intelligence` + RLS
- PM2 `bid-intelligence-os` on port 5001
- Health monitor emails on failure
- Legacy login works today (email/password at `/login`)

---

## Step 1 — Push git (5 min)

### BidIntelligenceOS

1. Open a terminal on the server (or your laptop if you develop locally).
2. `cd /home/ubuntu/projects/bid-intelligence-os`
3. `git log -1 --oneline` — you should see the big integration commit.
4. `git push origin main`  
   - If Git asks for credentials, use your GitLab token or SSH key.
   - If push is rejected (diverged history), **stop** and message Rose/dev — do not force-push without approval.

### Audit-Risk-Model (cca-core bid scoring)

1. `cd /home/ubuntu/projects/Audit-Risk-Model`
2. `git status` — branch `feat/safe-alignment-phase1` with commit `feat(scoring): add shared BidOS score engine`
3. Open GitLab → **Audit-Risk-Model** → create MR from `feat/safe-alignment-phase1` → merge when CI passes  
   (BidOS reads cca-core from this repo path on the same server.)

---

## Step 2 — Clerk shared auth (optional, ~20 min)

Use one Clerk application for the whole CCA suite.

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com) → sign in.
2. **Create application** (or open existing CCA app) → name e.g. `CCA Suite`.
3. Left sidebar → **API Keys**.
4. Copy **Publishable key** (`pk_live_…` or `pk_test_…`).
5. Copy **Secret key** (`sk_live_…` or `sk_test_…`).
6. SSH to the server:  
   `nano /home/ubuntu/projects/bid-intelligence-os/.env`
7. Add (paste keys, save `Ctrl+O`, exit `Ctrl+X`):

```env
AUTH_ENABLED=true
CLERK_SECRET_KEY=sk_...
CLERK_PUBLISHABLE_KEY=pk_...
VITE_CLERK_PUBLISHABLE_KEY=pk_...
ADMIN_EMAILS=your-email@contractorcomplianceco.com
```

8. Redeploy (rebuilds web so Vite bakes `VITE_CLERK_PUBLISHABLE_KEY`):

```bash
cd /home/ubuntu/projects/bid-intelligence-os
./deploy/deploy.sh
```

9. Browser test:
   - Open **https://ccabidintelligence.com/login**
   - You should see **Clerk** Sign in (not email/password form).
   - Sign up / sign in → Command Center loads your org data.

---

## Step 3 — Audit engine compliance pull (~15 min when audit API is live)

BidOS can pull contractor audit scorecards so compliance points change when audit data changes.

**Prerequisite:** Audit-Risk-Model `artifacts/api-server` running and reachable (not on this box yet).

1. Deploy or start audit API (separate runbook in Audit-Risk-Model).
2. Note the base URL, e.g. `https://audit-api.yourdomain.com` or `http://127.0.0.1:8080`.
3. Edit `.env` on BidOS server:

```env
AUDIT_ENGINE_API_URL=https://your-audit-api-host
AUDIT_ENGINE_API_TOKEN=    # only if audit API requires Bearer (Clerk JWT)
```

4. `pm2 reload bid-intelligence-os --update-env` or `./deploy/deploy.sh`
5. Verify health:

```bash
curl -s http://127.0.0.1:5001/api/health | jq .auditEngine
```

Should be `true`.

6. App test:
   - Sign in → **Bids** → open a bid with location `City, FL` and trade matching an audit.
   - **Compliance Eligibility** panel → badge **Audit CCA-20XX-XXXX**.
   - **Compute bid score** → compliance category reflects audit triggers.

---

## Step 4 — S3 uploads (optional, multi-server)

Only if you move off single-disk uploads.

1. AWS Console → **S3** → **Create bucket** → e.g. `cca-bid-intelligence-uploads` → region `us-east-1`.
2. IAM → user or role with `s3:PutObject`, `s3:GetObject` on that bucket.
3. Add to `.env`:

```env
BIOS_S3_BUCKET=cca-bid-intelligence-uploads
BIOS_S3_REGION=us-east-1
BIOS_S3_PREFIX=bios
```

4. `./deploy/deploy.sh` → health shows `"storage":"s3"`.

---

## Step 5 — Command Center visibility (optional)

BidOS exposes a sanitized projection:

```bash
curl -s -H "Cookie: bios_token=..." http://127.0.0.1:5001/api/v1/command-center/projection
```

**Your action:** In Command Center cloud, add a read proxy (like Docs Collect projection) pointing at this URL when you wire the CC ingestion job. No PII — counts, overdue follow-ups, verdict buckets only.

---

## Step 6 — Automated team URL smoke (2 min)

Scripted check against **https://bidintelligence.cagteam.net** (health, legacy login, core authed APIs). Password is read from `BIOS_SMOKE_PASSWORD` only — never printed.

```bash
cd /home/ubuntu/projects/bid-intelligence-os
# Password from .env or export; do not echo it
BIOS_SMOKE_PASSWORD='…' node scripts/smoke-team-url.mjs
```

Optional env:

| Variable | Default |
|----------|---------|
| `BIOS_SMOKE_URL` | `https://bidintelligence.cagteam.net` |
| `BIOS_SMOKE_EMAIL` | `carmen@ccacontact.com` (also `rose@ccacontact.com` via seed script) |
| `BIOS_SMOKE_TIMEOUT_MS` | `15000` |

Exit `0` = all checks passed; `1` = failure (no secrets in output). Smoke users: `node scripts/seed-smoke-users.mjs`.

---

## Step 7 — Manual smoke test checklist (10 min)

| # | Action | Expected |
|---|--------|----------|
| 1 | Visit https://ccabidintelligence.com/api/health | `"status":"ok"`, `"database":{"driver":"postgres"}` |
| 2 | `/login` → register or sign in | Lands on Command Center |
| 3 | **Bids** → **New bid** | Saves; appears in list |
| 4 | Upload PDF or DOCX on bid | Extraction status `ready` or `metadata_only` |
| 5 | **Compute bid score** | 12 categories + verdict |
| 6 | **Approve for client use** | `humanReviewed` badge |
| 7 | **Lock score** | Locked for submission |
| 8 | **Won / Lost / No-bid** | Bid status updates |
| 9 | https://demo.ccabidintelligence.com | Demo funnel still works (no login required) |

---

## What you do NOT need to do

- Re-seed 50-state jurisdiction data (Research Hub owns that).
- Rebuild Layer A/B audit math in BidOS (Audit product owns that).
- Change nginx for BidOS unless splitting API subdomain.

---

## If something breaks

1. `pm2 logs bid-intelligence-os --lines 50`
2. `curl http://127.0.0.1:5001/api/health`
3. Email alerts go to **carmenaburoda@gmail.com** from health monitor when PM2 or health fails.

---

## Rose plan — still on platform roadmap (not blocked on you today)

| Item | Owner | Your action |
|------|-------|-------------|
| Zoho bid opportunity sync | Phase 4 | Zoho OAuth + CRM module IDs |
| SAM.gov / BLS feeds | Phase 3.5 | API keys in platform vault |
| Full Command Center `cc_events` write path | CC cloud | Proxy + ingest job |
| Rose Brain LLM narratives | Phase 6 | `BIOS_OPENAI_API_KEY` optional |
| Migrate BidOS into Audit monorepo | Architecture | Decision later — Option A works now |
