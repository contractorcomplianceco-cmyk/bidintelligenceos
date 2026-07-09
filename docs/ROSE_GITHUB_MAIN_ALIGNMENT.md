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
   - Current `main` tip after this doc commit: **`ee1103f`** (includes `c4b8222` Research Hub wiring + this alignment doc)
   - No PR was opened (histories were unrelated); this doc serves as the merge record.

3. **Clerk cutover** remains **pending** — see `deploy/RUNBOOK.md` § Clerk cutover checklist. Production still uses legacy smoke-test auth until redirect URLs and deploy are completed.

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
> - **Updated `main`** to the BidOS production line (baseline `6ff2c75`; current tip **`ee1103f`** with Research Hub + alignment doc). **`main` is now the production branch.**
> - **Production app** remains at **https://bidintelligence.cagteam.net** (unchanged by this git operation).
>
> **Still pending (unchanged):** Clerk shared-auth cutover per `deploy/RUNBOOK.md` — do not enable `AUTH_ENABLED=true` until Clerk redirect URLs for `bidintelligence.cagteam.net` are configured and we run `./deploy/deploy.sh`.
>
> **For Carmen smoke test:** use the team URL above and the module checklist in `docs/PRODUCT_CONTRACT.md` (what is live vs demo vs planned). Setup steps: `docs/CARMEN_SETUP.md`.
>
> Full write-up in repo: `docs/ROSE_GITHUB_MAIN_ALIGNMENT.md`
>
> Let me know if you need the archive branch cherry-picked anywhere or want a tagged release on `main`.

## Carmen smoke-test pointers

| Item | Location |
|------|----------|
| Team URL | https://bidintelligence.cagteam.net |
| Health check | `GET https://bidintelligence.cagteam.net/api/health` → `200` |
| Module status (live vs demo) | `docs/PRODUCT_CONTRACT.md` |
| Click-by-click setup | `docs/CARMEN_SETUP.md` |
| Clerk cutover (not enabled yet) | `deploy/RUNBOOK.md` — § Clerk cutover checklist |

## Branch map (after alignment)

```
archive/main-promo-video-pre-bidos-2026-07  → 58352bc  (promo video era — preserved)
main                                        → ee1103f  (BidOS production line + alignment doc)
feat/bidos-production-2026-07               → c4b8222  (production; main is 1 doc commit ahead)
```

## Merge / PR record

- **Method:** Direct push (`force-with-lease`), not a GitHub PR — unrelated histories.
- **Record commit:** This file, committed to `main` after alignment.
- **GitHub compare (archive → main):** https://github.com/contractorcomplianceco-cmyk/bidintelligenceos/compare/archive/main-promo-video-pre-bidos-2026-07...main
