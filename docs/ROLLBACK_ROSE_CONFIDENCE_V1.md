# Rollback — Rose Confidence Formula v1

## Pre-implementation anchors (2026-07-14)

| Repo | Branch at start | SHA | Tag |
|------|-----------------|-----|-----|
| Audit-Risk-Model | feat/safe-alignment-phase1 | `76234693a3fed24abf7f312197019743f53d9975` | `pre-rose-confidence-v1` |
| bid-intelligence-os | main | `5c42ac3d1cd903d7b781e3368393859cf085bd72` | `pre-rose-confidence-v1` |

Feature branches: `feat/rose-confidence-formula-v1` (both repos). **Not merged to main.**

## Rollback to clean pre-formula state

### Option A — leave feature branch, switch away (safest)

```bash
# Audit-Risk-Model
cd /home/ubuntu/projects/Audit-Risk-Model
git checkout feat/safe-alignment-phase1
# or: git checkout pre-rose-confidence-v1

# BidOS
cd /home/ubuntu/projects/bid-intelligence-os
git checkout main
# or: git checkout pre-rose-confidence-v1
```

### Option B — reset feature branch tip to pre tag (destructive to unmerged formula commits only)

```bash
cd /home/ubuntu/projects/Audit-Risk-Model
git checkout feat/rose-confidence-formula-v1
git reset --hard pre-rose-confidence-v1

cd /home/ubuntu/projects/bid-intelligence-os
git checkout feat/rose-confidence-formula-v1
git reset --hard pre-rose-confidence-v1
```

Do **not** force-push `main`. Only delete/reset the feature branch if discarding v1 work.
