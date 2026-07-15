# Rose Confidence Gap-Fill Pack (G1–G12) — BidOS pointer

**Canonical full pack (save/edit here):**  
[`Audit-Risk-Model/lib/cca-core/docs/ROSE_CONFIDENCE_GAP_FILL_G1_G12.md`](../../Audit-Risk-Model/lib/cca-core/docs/ROSE_CONFIDENCE_GAP_FILL_G1_G12.md)

**G11 status (2026-07-14):** ALL 12 decisions APPROVED (every row Y / ✅).  
**READY_FOR_ENGINEERING:** YES · **READY_LOCKED:** YES

BidOS does **not** own weights. Gap-Fill locked trade tables, bands, `trade_required_days`, FL/SE labor uplift, and gates live in `cca-core` `config.ts` / `evaluateKillGates.ts`.

**BidOS consumers:**

- Optional trade strings: `apps/api/src/lib/trade-options.ts` (all trades `locked` except Generic `fallback`)
- Generic honesty banner from cca-core (`GENERIC_TRADE_HONESTY_BANNER`) on score disclaimer / honestyLabel
- Score API accepts Gap-Fill `roseGates` including `manualHeavy` / `secondReviewerConfirmed`
- WOW layer unchanged: `retrieveEvidence` / `explainScore` / `pursuitRoi`

**Not deploy/merge to main until Carmen asks** — lock-in only on `feat/rose-confidence-formula-v1`.
