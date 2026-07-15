# Rose Trade-Conditional Confidence Formula v1

**Canonical formula IP + code:**  
[`Audit-Risk-Model/lib/cca-core/docs/ROSE_CONFIDENCE_FORMULA_V1.md`](../../Audit-Risk-Model/lib/cca-core/docs/ROSE_CONFIDENCE_FORMULA_V1.md)

**Gap-Fill Pack (G1–G12):** [`ROSE_CONFIDENCE_GAP_FILL_G1_G12.md`](./ROSE_CONFIDENCE_GAP_FILL_G1_G12.md) → full text in cca-core docs.

**Rollback:** [`ROLLBACK_ROSE_CONFIDENCE_V1.md`](./ROLLBACK_ROSE_CONFIDENCE_V1.md)

BidOS **consumes** `@workspace/cca-core` (`computeBidScore` → `computeConfidence`). It does not own weights.

## Engineer handoff (received 2026-07-14; G11 locked same day)

Rose sent the Confidence Engine handoff (API + ownership). **No code package was found** in the workspace/uploads — we aligned BidOS to her design on `feat/rose-confidence-formula-v1`. **G11 ALL APPROVED → READY_LOCKED = YES.**

BidOS owns (WOW / evidence):

- `apps/api/src/lib/retrieveEvidence.ts` — trade/region filtered RAG contract
- `apps/api/src/lib/explainScore.ts` — rules-first explainability + levers
- `apps/api/src/lib/pursuitRoi.ts` — Pursue / Bid-Light / No-Bid with cold-start honesty (&lt;0.6)

cca-core owns: `config.ts`, `computeConfidence.ts`, `evaluateKillGates.ts` (server-only).

**Still next (product):** RAG cards / UX manual fields / merge+deploy when Carmen asks; `recordAutopsy()` learning loop.

## Locked (2026-07-14) — G11 ALL APPROVED · READY_LOCKED = YES

- Weighted sum; compliance = **GATE only**
- Option A trade bands (Base/Roofing Go ≥ 72, Electrical ≥ 64)
- Startup: `past_perf` + `vendor_quality` weight 0, renormalize
- Weight tables: Base + Electrical + Roofing + GC/Mech/Plumbing/Concrete/Civil/Specialty **LOCKED** (Gap-Fill G1 / G11 #1)
- Mechanical band Go ≥ **68** LOCKED; others base ≥ **72** (Electrical locked ≥ 64)
- Evidence-quality cap Option A: LOW on any ≥10%-weight signal → score capped at **71**
- Soft/data holds demote Strong Go → Conditional; hard → No-Go
- Gates LOCKED: license-class, permit-utility, cert-AHJ (+ soft variants), GC sub-coverage
- `LEARNING_MODE_MIN_OUTCOMES = 40`; Learning Option A (`past_perf` 0.06) **LOCKED** documented stub — not auto-activated without outcomes
- Manual-heavy Strong Go: `manualHeavy` / `secondReviewerConfirmed` API flags (G11 #11)
- Honesty: startup index is **never** "win probability"
- Generic trade: honesty banner *"Trade not set — accuracy limited…"*
- **READY_FOR_ENGINEERING:** YES · **READY_LOCKED:** YES (merge/deploy only when Carmen asks)

## BidOS wiring (v1)

- `POST /api/v1/bids/:id/score` accepts optional `{ trade, mode, signals, roseGates }`
- Trade defaults from `bid.type`, else `"generic"`
- Missing/null signals → neutral **0.5** (never crash); adapter may still apply startup defaults
- Audit log event: `confidence_compute`
- Public serializer remains leak-safe (no weights)
