# GitHub `main` alignment — Rose reference (2026-07)

## What happened

The GitHub repo had **two unrelated histories**:

| Branch | Tip (before alignment) | Contents |
|--------|------------------------|----------|
| `main` | `58352bc` | Promo-video / Rose Demo modal work (standalone repo era) |
| `feat/bidos-production-2026-07` | `6ff2c75` | BidIntelligenceOS monorepo — Tier 1 + Phase 4 production wiring |

`gh pr create --base main --head feat/bidos-production-2026-07` failed with **no common history** — a normal merge or PR was not possible without a history rewrite.

Production is live at **https://bidintelligence.cagteam.net** from the feature branch line, not from old `main`.

## What we did (2026-07-08)

1. **Preserved old `main`** on archive branch (nothing deleted):
   - Branch: `archive/main-promo-video-pre-bidos-2026-07`
   - URL: https://github.com/contractorcomplianceco-cmyk/bidintelligenceos/tree/archive/main-promo-video-pre-bidos-2026-07
   - Tip: `58352bc` — promo film + Rose Demo modal commits

2. **Aligned `main` with the production line** via force-with-lease (user-approved for unrelated histories):
   ```bash
   git push origin origin/feat/bidos-production-2026-07:main --force-with-lease
   ```
   - Production baseline from feature branch: **`6ff2c75`** — `feat: enrich closeout stats and package scope from bid summary`
   - Current `main` tip: **`a334dcb`** — alignment doc sync (VoiceConnect stub at `afe436e`; PDF export gate at `7dcfc57`; CI feat-branch gates at `2b1c3e2`)
   - No PR was opened (histories were unrelated); this doc serves as the merge record.

3. **Clerk cutover** remains **pending** — see `deploy/RUNBOOK.md` § Clerk cutover checklist. Production still uses legacy smoke-test auth until redirect URLs and deploy are completed.

   **Preflight (read-only, run before cutover):**
   ```bash
   node scripts/clerk-cutover-preflight.mjs --check-only
   ```

## Draft message for Rose (copy-paste)

> Hi Rose —
>
> We resolved the GitHub **unrelated histories** issue on **bidintelligenceos**.
>
> **Context:** Old `main` held the promo-video / Rose Demo work from before the monorepo. Production BidOS (Tier 1 + Phase 4) lived on `feat/bidos-production-2026-07`. GitHub could not open a PR between them because they share no common ancestor.
>
> **What we did:**
> - **Preserved** the old promo-video `main` on archive branch **`archive/main-promo-video-pre-bidos-2026-07`** (tip `58352bc`) — nothing was deleted:  
>   https://github.com/contractorcomplianceco-cmyk/bidintelligenceos/tree/archive/main-promo-video-pre-bidos-2026-07
> - **Updated `main`** to the BidOS production line (baseline `6ff2c75`; current tip **`a334dcb`**). **`main` is now the production branch.**
> - **Production app** remains at **https://bidintelligence.cagteam.net** (unchanged by this git operation).
>
> **Still pending (unchanged):** Clerk shared-auth cutover per `deploy/RUNBOOK.md` — do not enable `AUTH_ENABLED=true` until Clerk redirect URLs for `bidintelligence.cagteam.net` are configured and we run `./deploy/deploy.sh`. Preflight: `node scripts/clerk-cutover-preflight.mjs --check-only`.
>
> **Audit-Risk-Model PR #2** — [feat: safe scoring-engine alignment (phase 1)](https://github.com/contractorcomplianceco-cmyk/Audit-Risk-Model/pull/2) is **OPEN** on remote (CI green, mergeable). Awaiting your sign-off before merge to `main`.
>
> **For Carmen smoke test:** `BIOS_SMOKE_PASSWORD='…' node scripts/smoke-team-url.mjs` against https://bidintelligence.cagteam.net. Module checklist: `docs/PRODUCT_CONTRACT.md`. Setup: `docs/CARMEN_SETUP.md`. Phase 5 deferred work: `docs/PHASE_5_ROADMAP.md`.
>
> Full write-up in repo: `docs/ROSE_GITHUB_MAIN_ALIGNMENT.md`
>
> Let me know if you need the archive branch cherry-picked anywhere or want a tagged release on `main`.

## Carmen — condensed action checklist

| # | Action | Command / link |
|---|--------|----------------|
| 1 | Automated smoke (legacy auth) | `BIOS_SMOKE_PASSWORD='…' node scripts/smoke-team-url.mjs` — health, login, bids/jobs/ops/command-center; prints `SMOKE PASS` or `SMOKE FAIL` (no secrets logged) |
| 2 | **Post-deploy smoke** | With `BIOS_SMOKE_PASSWORD` in server `.env`, `./deploy/deploy.sh` runs `scripts/smoke-team-url.mjs` after health curl → expect `SMOKE PASS` (deploy fails on `SMOKE FAIL`). Manual rerun: `BIOS_SMOKE_PASSWORD='…' node scripts/smoke-team-url.mjs` |
| 3 | Health check | `GET https://bidintelligence.cagteam.net/api/health` → `200` |
| 4 | **Export gate (client-facing)** | On `/package-builder` or bid detail: DOCX/PDF export stays blocked (`clientExportBlocked`) until bid score is human-reviewed. Open bid → **Bid Intelligence** → **Approve for use** clears lock (API: `PATCH /api/v1/bids/:id/score/approve` or bid detail approve UX) |
| 5 | Human review approve UX | **Bid Intelligence** panel shows **Pending human review** until approved; verify export buttons enable only after approval |
| 6 | Phase 5 deferred work | `docs/PHASE_5_ROADMAP.md` — Clerk cutover, full PDF export, enterprise RBAC, VideoConnect live, Audit-Risk-Model PR #2 |
| 7 | PM2 fork fix (restart loop) | Confirm `pm2 describe bid-intelligence-os` shows **fork_mode** + `tsx` (not `cluster` + `npm`). If restarts spike, redeploy: `./deploy/deploy.sh` — see `deploy/RUNBOOK.md` § Troubleshooting (PM2 restarts) |
| 8 | What is live vs demo | `docs/PRODUCT_CONTRACT.md` (verified at **`afe436e`**+) |
| 9 | Click-by-click setup | `docs/CARMEN_SETUP.md` |
| 10 | Clerk cutover (not enabled) | `node scripts/clerk-cutover-preflight.mjs --check-only` then `deploy/RUNBOOK.md` § Clerk cutover |

Smoke users: `carmen@ccacontact.com`, `rose@ccacontact.com` (`node scripts/seed-smoke-users.mjs`).

## Branch map (after alignment)

```
archive/main-promo-video-pre-bidos-2026-07  → 58352bc  (promo video era — preserved)
main                                        → a334dcb  (BidOS production line)
feat/bidos-production-2026-07               → a334dcb  (aligned with main)
```

## Merge / PR record

- **Method:** Direct push (`force-with-lease`), not a GitHub PR — unrelated histories.
- **Record commit:** This file, committed to `main` after alignment.
- **GitHub compare (archive → main):** https://github.com/contractorcomplianceco-cmyk/bidintelligenceos/compare/archive/main-promo-video-pre-bidos-2026-07...main

---

## Appendix — Audit-Risk-Model integration & merge status (2026-07-08)

### BidOS ↔ Audit stack (live on this server)

| Component | Status |
|-----------|--------|
| BidOS `AUDIT_ENGINE_API_URL` | Configured → local audit API `:3002` |
| BidOS health `auditEngine` | `true` (local + production) |
| PM2 `cca-audit-api` | **online** on branch `feat/safe-alignment-phase1` |
| Acceptance audit `CCA-2026-BIOS-FL` | Seeded; compliance pull returns critical trigger as expected |
| Prod smoke | `GET …/compliance-eligibility?state=FL` → `auditCode: CCA-2026-BIOS-FL` |

Integration is **working end-to-end**. No BidOS code changes required for this check.

### GitHub PR — Audit-Risk-Model `feat/safe-alignment-phase1` → `main`

| Field | Value |
|-------|-------|
| PR | [#2 — feat: safe scoring-engine alignment (phase 1)](https://github.com/contractorcomplianceco-cmyk/Audit-Risk-Model/pull/2) |
| State | **OPEN** (not merged — awaiting Rose confirmation) |
| Mergeable | Yes |
| CI | All green (vitest, typecheck, portal trade-secret guard) |
| Commits ahead of `main` | 8 (on remote branch) |
| Remote branch tip | **`9e45521`** — `feat(deploy): add audit API PM2 stack for Rose 3.2` |

**Remote push (2026-07-08):**

- `08b9500` — feat(scoring): add shared BidOS score engine — **on `origin/feat/safe-alignment-phase1`**
- `9e45521` — feat(deploy): add audit API PM2 stack for Rose 3.2 — **on `origin/feat/safe-alignment-phase1`**
- PR #2 head updated to `9e45521`; **still OPEN — awaiting Rose merge confirmation** (do not merge without sign-off).

Additional **uncommitted WIP** on this server (jurisdiction rules / RF library seeds) — not part of PR #2.

### Blockers for Rose (action items)

1. **PR #2 not merged** — safe-alignment phase 1 (CI, auth flag, model versioning, additive DB tables, shared BidOS score engine, PM2 deploy stack) is ready on remote but needs explicit approval before merge to `main`. **Do not merge without Rose sign-off.**
2. **WIP jurisdiction/RF library work** — uncommitted on server; separate from PR #2; decide whether to include in phase 1 or a follow-up PR.
3. **Clerk cutover** — unchanged pending item; preflight: `node scripts/clerk-cutover-preflight.mjs --check-only`.
