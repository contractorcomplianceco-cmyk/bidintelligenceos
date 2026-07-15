import { eq } from "drizzle-orm";
import {
  computePursuitConfidence,
  serializePublicBidScore,
  type RoseGateFlags,
  type RoseSignalInputs,
  type EvidenceQuality,
  type SignalKey,
} from "@workspace/cca-core";
import { getDb } from "../db/client.js";
import { bidScores, bids } from "../db/schema.js";
import { computeComplianceEligibility } from "./compliance-eligibility.js";
import { nextId, nowIso } from "./ids.js";
import { parseStateFromLocation } from "./state-parse.js";
import { hashBidScoreInputs, logScoreAccess } from "./score-access-log.js";
import { citationFor, retrieveEvidence } from "./retrieveEvidence.js";
import { explainScore, type ScoreExplanation } from "./explainScore.js";
import { pursuitRoi, type PursuitRoiResult } from "./pursuitRoi.js";

type BidRow = typeof bids.$inferSelect;

export type ScoreRequestOptions = {
  /** Override bid.type; defaults to bid.type or "generic". */
  trade?: string;
  signals?: RoseSignalInputs;
  roseGates?: RoseGateFlags;
  mode?: "startup" | "learning";
  evidenceQuality?: Partial<Record<SignalKey, EvidenceQuality>>;
  pursuitHours?: number;
};

export type PersistedScoreResponse = ReturnType<typeof serializePublicBidScore> & {
  honestyLabel?: string;
  explanation?: ScoreExplanation;
  pursuitRoi?: Pick<
    PursuitRoiResult,
    "recommendation" | "roiRatio" | "winLikelihoodBasis" | "assumptions"
  > & { summary: string };
  evidenceCitations?: string[];
  /** G11 #11 — surface for UI badge (also reflected in gates). */
  manualHeavyVerify?: boolean;
};

/**
 * Persist Rose confidence score for a bid.
 * computeBidScore → computeConfidence (Rose handoff adapter).
 * Public score stays leak-safe; explainScore / pursuitRoi attach as siblings.
 */
export async function persistBidScoreForBid(
  bid: BidRow,
  orgId: string,
  opts: ScoreRequestOptions = {},
  meta?: { userId?: string },
): Promise<PersistedScoreResponse> {
  const trade = opts.trade?.trim() || bid.type?.trim() || "generic";
  const mode = opts.mode ?? "startup";
  const state = parseStateFromLocation(bid.location);
  const compliance = await computeComplianceEligibility(state, {
    trade,
    projectType: bid.publicPrivate,
  });

  // Full ConfidenceResult (keeps drivers / honestyLabel / _internal for explainScore).
  // Public response still goes through serializePublicBidScore (leak-safe).
  const result = computePursuitConfidence(
    {
      bidId: bid.id,
      amount: bid.amount,
      confidence: bid.confidence ?? undefined,
      fit: bid.fit ?? undefined,
      riskScore: bid.riskScore ?? undefined,
      daysRemaining: bid.daysRemaining ?? undefined,
      publicPrivate: bid.publicPrivate ?? undefined,
      trade,
      mode,
      signals: opts.signals,
      gates: opts.roseGates,
      evidenceQuality: opts.evidenceQuality,
    },
    compliance,
  );

  const signalIds = Object.keys(opts.signals ?? {}).length
    ? (Object.keys(opts.signals!) as string[])
    : ["price_pressure", "labor_pressure", "market_heat", "schedule_risk", "escalation_protection"];

  const region = state || "nationwide";
  const evidence = await retrieveEvidence({
    bidId: bid.id,
    trade,
    region,
    signalIds,
    mode,
    orgId,
  });

  const evidenceBySignal: Record<string, { citation?: string }[]> = {};
  for (const [sid, chunks] of Object.entries(evidence.bySignal)) {
    evidenceBySignal[sid] = chunks.map((c) => ({ citation: citationFor(c) }));
  }

  const explanation = await explainScore({
    result,
    inputs: opts.signals,
    evidenceBySignal,
  });

  const roi = pursuitRoi({
    result,
    amount: bid.amount ?? 0,
    pursuitHours: opts.pursuitHours,
    expectedMarginPct: bid.margin != null ? bid.margin / 100 : undefined,
  });

  const manualHeavyVerify = Boolean(
    opts.roseGates?.manualHeavy && !opts.roseGates?.secondReviewerConfirmed,
  );

  const ts = nowIso();
  const id = nextId("CCA-SCORE");
  const db = getDb();
  const inputHash = hashBidScoreInputs(bid);

  logScoreAccess({
    userId: meta?.userId ?? "system",
    orgId,
    bidId: bid.id,
    inputHash,
    event: "confidence_compute",
    trade,
    mode,
    totalScore: result.totalScore,
    verdict: result.verdict,
  });

  await db.insert(bidScores).values({
    id,
    bidId: bid.id,
    orgId,
    totalScore: result.totalScore,
    verdict: result.verdict,
    categoriesJson: JSON.stringify(result.categories),
    gatesJson: JSON.stringify(result.gates),
    complianceJson: JSON.stringify(result.compliance),
    aiGenerated: true,
    humanReviewed: false,
    lockedAt: ts,
    createdAt: ts,
  });

  await db
    .update(bids)
    .set({
      confidence: result.totalScore,
      type: trade,
      humanReviewed: false,
      aiGenerated: true,
      updatedAt: ts,
    })
    .where(eq(bids.id, bid.id));

  const publicScore = serializePublicBidScore(result, {
    id,
    bidId: bid.id,
    lockedAt: ts,
    createdAt: ts,
  });

  return {
    ...publicScore,
    honestyLabel: explanation.honestyLabel,
    explanation,
    pursuitRoi: {
      recommendation: roi.recommendation,
      roiRatio: roi.roiRatio,
      winLikelihoodBasis: roi.winLikelihoodBasis,
      assumptions: roi.assumptions,
      summary: `Pursuit ROI: ${roi.recommendation} (relative heuristic — not win probability).`,
    },
    evidenceCitations: evidence.citations.slice(0, 12),
    manualHeavyVerify,
  };
}
