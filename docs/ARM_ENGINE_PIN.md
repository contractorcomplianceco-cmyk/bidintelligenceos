# ARM engine pin (BidIntelligenceOS)

BidOS scores via path import to the **sibling** Audit-Risk-Model tree — not an npm publish.

| Field | Value |
|-------|--------|
| Sibling path | `/home/ubuntu/projects/Audit-Risk-Model` |
| Branch | `main` |
| Commit (pinned) | `3d70093330b9eef8b145272067f3b9b2cfee96f4` |
| Engine package | `lib/cca-core` (`computeBidScore` → `computeConfidence`) |
| Resolve map | `apps/api/tsconfig.json` → `@workspace/cca-core` → `../../../Audit-Risk-Model/lib/cca-core/src/index.ts` |

## Verify before deploy

```bash
cd /home/ubuntu/projects/Audit-Risk-Model
git checkout main && git pull --ff-only
git rev-parse HEAD   # expect 3d70093… or later fast-forward on main
pnpm test            # cca-core / workspace tests green

cd /home/ubuntu/projects/bid-intelligence-os
npm run typecheck -w apps/api
npm run test:confidence -w apps/api
```

## Rule

- One modular engine on **origin/main** only after feat→main reconcile (done: merge commit `453a701`).
- Do not point BidOS at a feat branch for production score math.
- Bump this pin when ARM `main` advances with scoring changes.
