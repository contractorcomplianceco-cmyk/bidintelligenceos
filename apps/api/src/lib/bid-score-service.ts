import { eq } from "drizzle-orm";
import {
  canUseLearningMode,
  computePursuitConfidence,
  LEARNING_MODE_MIN_OUTCOMES,
  serializePublicBidScore,
  type RoseGateFlags,
  type RoseSignalInputs,
  type EvidenceQuality,
  type SignalKey,
} from "@workspace/cca-core";
import { getDb } from "../db/client.js";
import { bidScores, bids, organizations } from "../db/schema.js";
import { countOutcomesForTrade } from "./autopsy.js";
import { computeComplianceEligibility } from "./compliance-eligibility.js";
import { nextId, nowIso } from "./ids.js";
import { resolveApprovedLearningTrades } from "./learning-approvals.js";
import { getPublicIntelRefreshHonesty } from "./publicIntelPack.js";
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
  > & {
    summary: string;
    /** Honest separation: economics vs award odds (never conflate). */
    roiLabel: string;
    awardOddsLabel: string;
  };
  evidenceCitations?: string[];
  /** G11 #11 — surface for UI badge (also reflected in gates). */
  manualHeavyVerify?: boolean;
  /** FRED/BLS pack honesty — "as of [date], manual" when not live. */
  marketAnchors?: {
    asOfDate: string;
    mode: "manual" | "live" | "partial";
    label: string;
  };
  learning?: {
    requested: boolean;
    applied: boolean;
    outcomeCount: number;
    minOutcomes: number;
    pastPerfWinrate: number | null;
    flipApproved: boolean;
    approvedLearningTrades: string[];
  };
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
  const requestedLearning = opts.mode === "learning";
  const tradeStats = await countOutcomesForTrade(orgId, trade);

  const db = getDb();
  const orgRows = await db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
  const approvedLearningTrades = resolveApprovedLearningTrades(orgRows[0]?.profileJson);
  // Rose #1: first flip per trade requires approval — never silent learning.
  const flipApproved = canUseLearningMode(trade, approvedLearningTrades);
  const learningApplied =
    requestedLearning && tradeStats.learningEligible && flipApproved;
  const mode: "startup" | "learning" = learningApplied ? "learning" : "startup";

  const signals: RoseSignalInputs = { ...(opts.signals ?? {}) };
  if (learningApplied && tradeStats.pastPerfWinrate != null) {
    signals.past_perf_winrate = tradeStats.pastPerfWinrate;
  } else {
    // Defensive: never pass a fabricated win rate in startup
    delete signals.past_perf_winrate;
  }

  const state = parseStateFromLocation(bid.location);
  const compliance = await computeComplianceEligibility(state, {
    trade,
    projectType: bid.publicPrivate,
  });

  // Full ConfidenceResult (keeps drivers / honestyLabel / _internal for explainScore).
  // Public response still goes through serializePublicBidScore (leak-safe).
  // Pass approvedLearningTrades so engine double-enforces the flip gate.
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
      signals,
      gates: opts.roseGates,
      evidenceQuality: opts.evidenceQuality,
      approvedLearningTrades,
    },
    compliance,
  );

  const signalIds = Object.keys(signals).length
    ? (Object.keys(signals) as string[])
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

  const marketAnchors = getPublicIntelRefreshHonesty();

  let honestyLabel = result.honestyLabel;
  if (learningApplied) {
    honestyLabel = `Personalized from ${tradeStats.outcomeCount} recorded outcomes for ${trade} (as of ${new Date().toISOString().slice(0, 10)}). Option A past_perf weight active — calibrated award odds basis only; not a guaranteed win.`;
  } else if (requestedLearning && tradeStats.learningEligible && !flipApproved) {
    honestyLabel = `Learning requested for ${trade} but first flip is not approved yet (Rose #1). Staying in startup — Pursuit Confidence Index remains relative, not calibrated award odds.`;
  }
  honestyLabel = `${honestyLabel} ${marketAnchors.label}.`;

  const explanation = await explainScore({
    result: { ...result, honestyLabel },
    inputs: signals,
    evidenceBySignal,
  });

  const roi = pursuitRoi({
    result,
    amount: bid.amount ?? 0,
    pursuitHours: opts.pursuitHours,
    expectedMarginPct: bid.margin != null ? bid.margin / 100 : undefined,
    calibratedWinRate: learningApplied ? tradeStats.pastPerfWinrate ?? undefined : undefined,
  });

  const roiLabel = learningApplied
    ? "Calibrated pursuit ROI (EV vs pursuit cost from recorded outcomes)"
    : "Pursuit ROI (relative heuristic — not calibrated award odds)";
  const awardOddsLabel = learningApplied
    ? `Calibrated award odds basis from ${tradeStats.outcomeCount} outcomes (decision-support, not a prediction)`
    : "Award odds not available in startup — index is relative pursuit quality only";

  const manualHeavyVerify = Boolean(
    opts.roseGates?.manualHeavy && !opts.roseGates?.secondReviewerConfirmed,
  );

  const ts = nowIso();
  const id = nextId("CCA-SCORE");
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
    honestyLabel: explanation.honestyLabel ?? honestyLabel,
    explanation,
    pursuitRoi: {
      recommendation: roi.recommendation,
      roiRatio: roi.roiRatio,
      winLikelihoodBasis: roi.winLikelihoodBasis,
      assumptions: roi.assumptions,
      summary: learningApplied
        ? `${roiLabel}: ${roi.recommendation}. ${awardOddsLabel}.`
        : `${roiLabel}: ${roi.recommendation}. ${awardOddsLabel}.`,
      roiLabel,
      awardOddsLabel,
    },
    evidenceCitations: evidence.citations.slice(0, 12),
    manualHeavyVerify,
    marketAnchors,
    learning: {
      requested: requestedLearning,
      applied: learningApplied,
      outcomeCount: tradeStats.outcomeCount,
      minOutcomes: LEARNING_MODE_MIN_OUTCOMES,
      pastPerfWinrate: tradeStats.pastPerfWinrate,
      flipApproved,
      approvedLearningTrades,
    },
  };
}
