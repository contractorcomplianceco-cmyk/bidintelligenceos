# Monorepo strategy — Option A (active)

BidIntelligenceOS stays in **`bid-intelligence-os`** as a deployable unit. It **consumes** shared platform packages on the same server via TypeScript path aliases — no file move required for production.

## What is wired today

| Package | Path | Used by |
|---------|------|---------|
| `@workspace/cca-core` | `../Audit-Risk-Model/lib/cca-core` | `apps/api` only (bid scoring) |
| `@workspace/cca-shared` | `../Audit-Risk-Model/lib/cca-shared` | via cca-core |

Configured in `apps/api/tsconfig.json` paths. **Never** import cca-core in `apps/web` (CI tripwire enforces).

## Option B (future)

Move `apps/web` → `Audit-Risk-Model/artifacts/bid-intelligence-web` and share `lib/db` when platform Phase 1 completes. Deferred until Audit-Risk-Model MR merges and single `pnpm` deploy is approved.

## Operator scripts

```bash
node scripts/sync-clerk-env.mjs    # shared Clerk keys from Command Center
node scripts/sync-openai-env.mjs   # Rose Brain OpenAI key
./deploy/deploy.sh                 # rebuild + PM2 reload
```
