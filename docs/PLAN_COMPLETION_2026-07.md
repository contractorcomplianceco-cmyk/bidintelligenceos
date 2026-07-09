# BidIntelligenceOS — Plan completion summary (July 2026)

Executive summary for **Carmen** and **Rose**. Production baseline: `main` at **`7566d3c`**.

---

## What shipped

### Tier 1 — core production wiring

Live on the team URL for authenticated users (see [`PRODUCT_CONTRACT.md`](./PRODUCT_CONTRACT.md)):

| Area | Modules |
|------|---------|
| Bid lifecycle | Bid Intelligence, New bid intake, Package Builder, Won Jobs |
| Job execution | Job Deployment, Scheduling, Labor & Subs, Job Closeout |
| Intelligence | ROSEOS executive brief + insight cards |
| Public | Marketing landing, Rose Demo modal, `/demo` hub |

**9 modules live** · **19 partial live** · **10 demo** (add-ons marketplace) · **0 planned** in contract table.

GitHub `main` is aligned with the production line (old promo-video `main` preserved on `archive/main-promo-video-pre-bidos-2026-07`). Record: [`ROSE_GITHUB_MAIN_ALIGNMENT.md`](./ROSE_GITHUB_MAIN_ALIGNMENT.md).

### Phase 4 — ops APIs & org profile

Authed team routes backed by persisted API data:

- `GET /api/v1/ops/scheduling`, `/permits`, `/labor`, `/weather`, `/closeout`, `/cost-roi`, `/risk`, `/package-builder`, `/alerts`
- `POST /api/v1/jobs/from-bid/:bidId` — won bid → job deployment
- Org profile enterprise fields via `GET/PATCH /api/v1/org/profile`
- Post-deploy smoke hook in `./deploy/deploy.sh` when `BIOS_SMOKE_PASSWORD` is set
- CI gates on feat branches + `npm run smoke:dry-run`

### Phase 5 — shipped slices (2026-07)

| Slice | Status | Notes |
|-------|--------|-------|
| Clerk cutover | **live** | `AUTH_ENABLED=true` on team URL |
| PDF/DOCX export | **live** | Server-side after human review |
| RBAC & invites | **partial live** | Create/list/revoke invites; member join |
| White label | **partial live** | `brandName`, `productName`, `logoUrl`, `brandColor` in sidebar |
| VoiceConnect | **partial live** | Status + captures via `VOICE_CONNECT_API_URL` |
| VideoConnect | **partial live** | Status + walkthrough list via `VIDEO_CONNECT_API_URL` |
| Briefing archive | **live** | Authed archive API |
| Multi-location | **in progress** | `locations[]` in org profile (Phase 5 continuation) |

Remaining Phase 5: [`PHASE_5_ROADMAP.md`](./PHASE_5_ROADMAP.md).

---

## Team URL & smoke test

| Item | Value |
|------|-------|
| **Team URL** | [https://bidintelligence.cagteam.net](https://bidintelligence.cagteam.net) |
| **Health** | `GET https://bidintelligence.cagteam.net/api/health` → `200` |
| **Auth** | Clerk (`AUTH_ENABLED=true`) |
| **Smoke command** | `BIOS_SMOKE_PASSWORD='…' node scripts/smoke-team-url.mjs` |
| **Expected output** | `SMOKE PASS` or `SMOKE FAIL` (password never logged) |
| **Post-deploy** | With `BIOS_SMOKE_PASSWORD` in server `.env`, `./deploy/deploy.sh` runs smoke after health curl and **fails deploy** on `SMOKE FAIL` |

Module-by-module checklist: [`PRODUCT_CONTRACT.md`](./PRODUCT_CONTRACT.md). Click-by-click setup: [`CARMEN_SETUP.md`](./CARMEN_SETUP.md).

---

## Human steps — Audit

### Clerk shared-auth cutover — **complete**

Production on the team URL uses **Clerk** (`AUTH_ENABLED=true`). Sign in/up at `/login`; legacy email/password login is disabled when Clerk is enabled.

Key rotation or new env: [`deploy/RUNBOOK.md`](../deploy/RUNBOOK.md) § **Clerk cutover checklist — `bidintelligence.cagteam.net`**.

### Audit-Risk-Model PR #2 — **OPEN, awaiting Rose sign-off**

| Field | Value |
|-------|-------|
| PR | [#2 — feat: safe scoring-engine alignment (phase 1)](https://github.com/contractorcomplianceco-cmyk/Audit-Risk-Model/pull/2) |
| State | **OPEN** — CI green, mergeable; **do not merge without Rose approval** |
| Live today | BidOS `AUDIT_ENGINE_API_URL` → local audit API; prod `compliance-eligibility?state=FL` → `auditCode: CCA-2026-BIOS-FL` |

Details: [`ROSE_GITHUB_MAIN_ALIGNMENT.md`](./ROSE_GITHUB_MAIN_ALIGNMENT.md) § Appendix.

### Carmen — quick verification checklist

| # | Action |
|---|--------|
| 1 | Run smoke: `BIOS_SMOKE_PASSWORD='…' node scripts/smoke-team-url.mjs` |
| 2 | Export: on `/package-builder`, confirm PDF/DOCX available after **Approve for use** on bid score |
| 3 | Clerk `/login` — Sign in/up on team URL |
| 4 | PM2: `pm2 describe bid-intelligence-os` — expect **fork_mode** + `tsx` |

Expanded table: [`ROSE_GITHUB_MAIN_ALIGNMENT.md`](./ROSE_GITHUB_MAIN_ALIGNMENT.md) § **Carmen — condensed action checklist**.

---

## Related docs

| Doc | Purpose |
|-----|---------|
| [`PHASE_5_ROADMAP.md`](./PHASE_5_ROADMAP.md) | Deferred Phase 5 work, sequencing, acceptance criteria |
| [`ROSE_GITHUB_MAIN_ALIGNMENT.md`](./ROSE_GITHUB_MAIN_ALIGNMENT.md) | GitHub `main` alignment, Audit PR status, Carmen checklist, **Rose copy-paste message** |
| [`PRODUCT_CONTRACT.md`](./PRODUCT_CONTRACT.md) | Live vs demo module map; Phase 4 API routes |
| [`deploy/RUNBOOK.md`](../deploy/RUNBOOK.md) | Deploy, post-deploy smoke, Clerk cutover, audit engine, troubleshooting |
| [`CARMEN_SETUP.md`](./CARMEN_SETUP.md) | Click-by-click human setup steps |

---

## Copy-paste message for Rose

**Full draft (copy from repo):** [`ROSE_GITHUB_MAIN_ALIGNMENT.md`](./ROSE_GITHUB_MAIN_ALIGNMENT.md) § **Draft message for Rose (copy-paste)**.

Summary pointer for Slack/email:

> GitHub unrelated histories resolved — production line is `main` (Tier 1 + Phase 4 + Phase 5 slices live at https://bidintelligence.cagteam.net; auth: Clerk). Pending: Audit-Risk-Model [PR #2](https://github.com/contractorcomplianceco-cmyk/Audit-Risk-Model/pull/2) awaiting your sign-off. Plan completion: `docs/PLAN_COMPLETION_2026-07.md`.

---

*Last updated: 2026-07-09 · Baseline `7566d3c`+.*
