# ARM engine pin (BidIntelligenceOS)

BidOS scores via path import to the **sibling** Audit-Risk-Model tree — not an npm publish.

| Field | Value |
|-------|--------|
| Sibling path | `/home/ubuntu/projects/Audit-Risk-Model` |
| Branch | `main` |
| Commit (pinned) | `4b36ef9130f2cfdbf57d46f8e5e5f47029ca1b07` |
| Engine package | `lib/cca-core` (`computeBidScore` → `computeConfidence`) |
| Resolve map | `apps/api/tsconfig.json` → `@workspace/cca-core` → `../../../Audit-Risk-Model/lib/cca-core/src/index.ts` |

## Verify before deploy

```bash
cd /home/ubuntu/projects/Audit-Risk-Model
git checkout main && git pull --ff-only
git rev-parse HEAD   # expect 4b36ef9… or later fast-forward on main
pnpm test            # cca-core / workspace tests green

cd /home/ubuntu/projects/bid-intelligence-os
npm run typecheck -w apps/api
npm run test:confidence -w apps/api
```

## Rule

- One modular engine on **origin/main** only after feat→main reconcile (done: merge commit `453a701`).
- Do not point BidOS at a feat branch for production score math.
- Bump this pin when ARM `main` advances with scoring changes.
