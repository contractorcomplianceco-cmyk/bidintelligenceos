# Rose Trade-Conditional Confidence Formula v1

**Canonical formula IP + code:**  
[`Audit-Risk-Model/lib/cca-core/docs/ROSE_CONFIDENCE_FORMULA_V1.md`](../../Audit-Risk-Model/lib/cca-core/docs/ROSE_CONFIDENCE_FORMULA_V1.md)

**Gap-Fill Pack (G1–G12):** [`ROSE_CONFIDENCE_GAP_FILL_G1_G12.md`](./ROSE_CONFIDENCE_GAP_FILL_G1_G12.md) → full text in cca-core docs.

**Rollback:** [`ROLLBACK_ROSE_CONFIDENCE_V1.md`](./ROLLBACK_ROSE_CONFIDENCE_V1.md)

BidOS **consumes** `@workspace/cca-core` (`computeBidScore` → `computeConfidence`). It does not own weights.

## Engineer handoff (received 2026-07-14)

Rose sent the Confidence Engine handoff (API + ownership). **No code package was found** in the workspace/uploads — we aligned BidOS to her design on `feat/rose-confidence-formula-v1`.

BidOS owns (WOW / evidence):

- `apps/api/src/lib/retrieveEvidence.ts` — trade/region filtered RAG contract
- `apps/api/src/lib/explainScore.ts` — rules-first explainability + levers
- `apps/api/src/lib/pursuitRoi.ts` — Pursue / Bid-Light / No-Bid with cold-start honesty (&lt;0.6)

cca-core owns: `config.ts`, `computeConfidence.ts`, `evaluateKillGates.ts` (server-only).

**Still next:** `recordAutopsy()` learning loop — not in this handoff.

## Locked (2026-07-14)

- Weighted sum; compliance = **GATE only**
- Option A trade bands (Base/Roofing Go ≥ 72, Electrical ≥ 64)
- Startup: `past_perf` + `vendor_quality` weight 0, renormalize
- Weight tables: Base + Electrical + Roofing **LOCKED**; GC/Mech/Plumbing/Concrete/Civil/Specialty **PROVISIONAL** (Gap-Fill G1)
- Mechanical band Go ≥ **68** PROVISIONAL; others base ≥ **72** (Electrical locked ≥ 64)
- Evidence-quality cap: LOW on any ≥10%-weight signal → score capped at **71**
- Soft/data holds demote Strong Go → Conditional; hard → No-Go
- `LEARNING_MODE_MIN_OUTCOMES = 40`; Learning Option A (`past_perf` 0.06) documented, not activated
- Generic trade: honesty banner *"Trade not set — accuracy limited…"*

## BidOS wiring (v1)

- `POST /api/v1/bids/:id/score` accepts optional `{ trade, mode, signals, roseGates }`
- Trade defaults from `bid.type`, else `"generic"`
- Missing/null signals → neutral **0.5** (never crash); adapter may still apply startup defaults
- Audit log event: `confidence_compute`
- Public serializer remains leak-safe (no weights)
