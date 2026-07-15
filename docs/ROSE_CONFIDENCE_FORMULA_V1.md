# Rose Trade-Conditional Confidence Formula v1

**Canonical formula IP + code:**  
[`Audit-Risk-Model/lib/cca-core/docs/ROSE_CONFIDENCE_FORMULA_V1.md`](../../Audit-Risk-Model/lib/cca-core/docs/ROSE_CONFIDENCE_FORMULA_V1.md)

**Rollback:** [`ROLLBACK_ROSE_CONFIDENCE_V1.md`](./ROLLBACK_ROSE_CONFIDENCE_V1.md)

BidOS **consumes** `@workspace/cca-core` (`computeBidScore` / `computePursuitConfidence`). It does not own weights.

## Locked (2026-07-14)

- Weighted sum; compliance = **GATE only**
- Option A trade bands (Base/Roofing Go ≥ 72, Electrical ≥ 64)
- Startup: `past_perf` + `vendor_quality` weight 0, renormalize
- Weight tables: Base + Electrical + Roofing; other trades → Base until Rose locks

## BidOS wiring (v1)

- `POST /api/v1/bids/:id/score` accepts optional `{ trade, mode, signals, roseGates }`
- Trade defaults from `bid.type`, else `"generic"`
- Missing signals → startup defaults + honesty copy in disclaimer/sources
- Full RAG evidence retrieval deferred
