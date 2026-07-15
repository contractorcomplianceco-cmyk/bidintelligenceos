# Rose Confidence Gap-Fill Pack (G1–G12) — BidOS pointer

**Canonical full pack (save/edit here):**  
[`Audit-Risk-Model/lib/cca-core/docs/ROSE_CONFIDENCE_GAP_FILL_G1_G12.md`](../../Audit-Risk-Model/lib/cca-core/docs/ROSE_CONFIDENCE_GAP_FILL_G1_G12.md)

BidOS does **not** own weights. Gap-Fill provisional trade tables, bands, `trade_required_days`, FL/SE labor uplift, and new gates live in `cca-core` `config.ts` / `evaluateKillGates.ts`.

**BidOS consumers:**

- Optional trade strings: `apps/api/src/lib/trade-options.ts` (GC, Mechanical, Plumbing, Concrete, Civil, Specialty + locked Electrical/Roofing + Generic fallback)
- Generic honesty banner comes from cca-core (`GENERIC_TRADE_HONESTY_BANNER`) and is included in score disclaimer / honestyLabel
- WOW layer unchanged: `retrieveEvidence` / `explainScore` / `pursuitRoi`

**Still waiting on Rose:** G11 Yes/No deck (12 items) before marking provisional trades LOCKED.
